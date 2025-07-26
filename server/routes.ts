import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { 
  insertUserSchema, insertVendorSchema, insertSupplierSchema, 
  insertProductSchema, insertOrderSchema, insertComplaintSchema,
  insertDeliveryPauseSchema, insertSubscriptionSchema
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Authentication routes
  app.post("/api/auth/login", async (req, res) => {
    const { phoneNumber } = req.body;
    
    if (!phoneNumber) {
      return res.status(400).json({ message: "Phone number is required" });
    }

    // Check if it's a test number (bypass OTP)
    const testNumbers = ["1122334455", "6677889900"];
    const isTestNumber = testNumbers.includes(phoneNumber);
    
    try {
      let user = await storage.getUserByPhone(phoneNumber);
      
      // Create user if doesn't exist
      if (!user) {
        user = await storage.createUser({
          phoneNumber,
          role: "vendor", // Default role, can be changed during onboarding
          isVerified: isTestNumber
        });
      }

      res.json({ 
        success: true, 
        user,
        isTestNumber,
        message: isTestNumber ? "Auto-login successful" : "OTP sent successfully"
      });
    } catch (error) {
      res.status(500).json({ message: "Login failed" });
    }
  });

  app.post("/api/auth/verify-otp", async (req, res) => {
    const { phoneNumber, otp } = req.body;
    
    try {
      const user = await storage.getUserByPhone(phoneNumber);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // For demo purposes, accept any OTP for non-test numbers
      // In production, this would verify against a real OTP service
      const updatedUser = await storage.updateUser(user.id, { isVerified: true });
      
      res.json({ success: true, user: updatedUser });
    } catch (error) {
      res.status(500).json({ message: "OTP verification failed" });
    }
  });

  // User routes
  app.get("/api/users/:id", async (req, res) => {
    try {
      const user = await storage.getUser(req.params.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  app.patch("/api/users/:id", async (req, res) => {
    try {
      const updates = insertUserSchema.partial().parse(req.body);
      const user = await storage.updateUser(req.params.id, updates);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(400).json({ message: "Invalid user data" });
    }
  });

  // Stall types
  app.get("/api/stall-types", async (req, res) => {
    try {
      const stallTypes = await storage.getStallTypes();
      res.json(stallTypes);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch stall types" });
    }
  });

  // Vendor routes
  app.post("/api/vendors", async (req, res) => {
    try {
      const vendorData = insertVendorSchema.parse(req.body);
      const vendor = await storage.createVendor(vendorData);
      res.status(201).json(vendor);
    } catch (error) {
      res.status(400).json({ message: "Invalid vendor data" });
    }
  });

  app.get("/api/vendors/user/:userId", async (req, res) => {
    try {
      const vendor = await storage.getVendorByUserId(req.params.userId);
      if (!vendor) {
        return res.status(404).json({ message: "Vendor not found" });
      }
      res.json(vendor);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch vendor" });
    }
  });

  app.patch("/api/vendors/:id", async (req, res) => {
    try {
      const updates = insertVendorSchema.partial().parse(req.body);
      const vendor = await storage.updateVendor(req.params.id, updates);
      if (!vendor) {
        return res.status(404).json({ message: "Vendor not found" });
      }
      res.json(vendor);
    } catch (error) {
      res.status(400).json({ message: "Invalid vendor data" });
    }
  });

  // Supplier routes
  app.post("/api/suppliers", async (req, res) => {
    try {
      const supplierData = insertSupplierSchema.parse(req.body);
      const supplier = await storage.createSupplier(supplierData);
      res.status(201).json(supplier);
    } catch (error) {
      res.status(400).json({ message: "Invalid supplier data" });
    }
  });

  app.get("/api/suppliers", async (req, res) => {
    try {
      const suppliers = await storage.getSuppliers();
      res.json(suppliers);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch suppliers" });
    }
  });

  app.get("/api/suppliers/user/:userId", async (req, res) => {
    try {
      const supplier = await storage.getSupplierByUserId(req.params.userId);
      if (!supplier) {
        return res.status(404).json({ message: "Supplier not found" });
      }
      res.json(supplier);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch supplier" });
    }
  });

  // Product routes
  app.post("/api/products", async (req, res) => {
    try {
      const productData = insertProductSchema.parse(req.body);
      const product = await storage.createProduct(productData);
      res.status(201).json(product);
    } catch (error) {
      res.status(400).json({ message: "Invalid product data" });
    }
  });

  app.get("/api/products/supplier/:supplierId", async (req, res) => {
    try {
      const products = await storage.getProductsBySupplierId(req.params.supplierId);
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });

  app.patch("/api/products/:id", async (req, res) => {
    try {
      const updates = insertProductSchema.partial().parse(req.body);
      const product = await storage.updateProduct(req.params.id, updates);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      res.status(400).json({ message: "Invalid product data" });
    }
  });

  app.delete("/api/products/:id", async (req, res) => {
    try {
      const success = await storage.deleteProduct(req.params.id);
      if (!success) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete product" });
    }
  });

  // Bundle routes
  app.get("/api/bundles/stall-type/:stallTypeId", async (req, res) => {
    try {
      const bundles = await storage.getBundlesByStallType(req.params.stallTypeId);
      res.json(bundles);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch bundles" });
    }
  });

  // Order routes
  app.post("/api/orders", async (req, res) => {
    try {
      const orderData = insertOrderSchema.parse(req.body);
      const order = await storage.createOrder(orderData);
      res.status(201).json(order);
    } catch (error) {
      res.status(400).json({ message: "Invalid order data" });
    }
  });

  app.get("/api/orders/vendor/:vendorId", async (req, res) => {
    try {
      const orders = await storage.getOrdersByVendor(req.params.vendorId);
      res.json(orders);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch orders" });
    }
  });

  app.get("/api/orders/supplier/:supplierId", async (req, res) => {
    try {
      const orders = await storage.getOrdersBySupplier(req.params.supplierId);
      res.json(orders);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch orders" });
    }
  });

  app.patch("/api/orders/:id", async (req, res) => {
    try {
      const updates = insertOrderSchema.partial().parse(req.body);
      const order = await storage.updateOrder(req.params.id, updates);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      res.json(order);
    } catch (error) {
      res.status(400).json({ message: "Invalid order data" });
    }
  });

  // Delivery pause routes
  app.post("/api/delivery-pauses", async (req, res) => {
    try {
      const pauseData = insertDeliveryPauseSchema.parse(req.body);
      const pause = await storage.createDeliveryPause(pauseData);
      res.status(201).json(pause);
    } catch (error) {
      res.status(400).json({ message: "Invalid delivery pause data" });
    }
  });

  app.get("/api/delivery-pauses/vendor/:vendorId/active", async (req, res) => {
    try {
      const pause = await storage.getActiveDeliveryPause(req.params.vendorId);
      res.json(pause);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch delivery pause" });
    }
  });

  app.patch("/api/delivery-pauses/:id", async (req, res) => {
    try {
      const updates = insertDeliveryPauseSchema.partial().parse(req.body);
      const pause = await storage.updateDeliveryPause(req.params.id, updates);
      if (!pause) {
        return res.status(404).json({ message: "Delivery pause not found" });
      }
      res.json(pause);
    } catch (error) {
      res.status(400).json({ message: "Invalid delivery pause data" });
    }
  });

  // Complaint routes
  app.post("/api/complaints", async (req, res) => {
    try {
      const complaintData = insertComplaintSchema.parse(req.body);
      const complaint = await storage.createComplaint(complaintData);
      res.status(201).json(complaint);
    } catch (error) {
      res.status(400).json({ message: "Invalid complaint data" });
    }
  });

  app.get("/api/complaints/vendor/:vendorId", async (req, res) => {
    try {
      const complaints = await storage.getComplaintsByVendor(req.params.vendorId);
      res.json(complaints);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch complaints" });
    }
  });

  app.patch("/api/complaints/:id", async (req, res) => {
    try {
      const updates = insertComplaintSchema.partial().parse(req.body);
      const complaint = await storage.updateComplaint(req.params.id, updates);
      if (!complaint) {
        return res.status(404).json({ message: "Complaint not found" });
      }
      res.json(complaint);
    } catch (error) {
      res.status(400).json({ message: "Invalid complaint data" });
    }
  });

  // Subscription routes
  app.post("/api/subscriptions", async (req, res) => {
    try {
      const subscriptionData = insertSubscriptionSchema.parse(req.body);
      const subscription = await storage.createSubscription(subscriptionData);
      res.status(201).json(subscription);
    } catch (error) {
      res.status(400).json({ message: "Invalid subscription data" });
    }
  });

  app.get("/api/subscriptions/vendor/:vendorId", async (req, res) => {
    try {
      const subscriptions = await storage.getSubscriptionsByVendor(req.params.vendorId);
      res.json(subscriptions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch subscriptions" });
    }
  });

  // Notification routes
  app.get("/api/notifications/user/:userId", async (req, res) => {
    try {
      const notifications = await storage.getNotificationsByUser(req.params.userId);
      res.json(notifications);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch notifications" });
    }
  });

  app.patch("/api/notifications/:id/read", async (req, res) => {
    try {
      const success = await storage.markNotificationAsRead(req.params.id);
      if (!success) {
        return res.status(404).json({ message: "Notification not found" });
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Failed to mark notification as read" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
