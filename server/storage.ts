import { 
  type User, type InsertUser, type StallType, type InsertStallType,
  type Vendor, type InsertVendor, type Supplier, type InsertSupplier,
  type Product, type InsertProduct, type Bundle, type InsertBundle,
  type Order, type InsertOrder, type Delivery, type InsertDelivery,
  type DeliveryPause, type InsertDeliveryPause, type Complaint, type InsertComplaint,
  type Subscription, type InsertSubscription, type Notification, type InsertNotification
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByPhone(phoneNumber: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, user: Partial<User>): Promise<User | undefined>;

  // Stall Types
  getStallTypes(): Promise<StallType[]>;
  getStallType(id: string): Promise<StallType | undefined>;
  createStallType(stallType: InsertStallType): Promise<StallType>;

  // Vendors
  getVendor(id: string): Promise<Vendor | undefined>;
  getVendorByUserId(userId: string): Promise<Vendor | undefined>;
  createVendor(vendor: InsertVendor): Promise<Vendor>;
  updateVendor(id: string, vendor: Partial<Vendor>): Promise<Vendor | undefined>;

  // Suppliers
  getSupplier(id: string): Promise<Supplier | undefined>;
  getSupplierByUserId(userId: string): Promise<Supplier | undefined>;
  createSupplier(supplier: InsertSupplier): Promise<Supplier>;
  updateSupplier(id: string, supplier: Partial<Supplier>): Promise<Supplier | undefined>;
  getSuppliers(): Promise<Supplier[]>;

  // Products
  getProduct(id: string): Promise<Product | undefined>;
  getProductsBySupplierId(supplierId: string): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: string, product: Partial<Product>): Promise<Product | undefined>;
  deleteProduct(id: string): Promise<boolean>;

  // Bundles
  getBundle(id: string): Promise<Bundle | undefined>;
  getBundlesByStallType(stallTypeId: string): Promise<Bundle[]>;
  createBundle(bundle: InsertBundle): Promise<Bundle>;

  // Orders
  getOrder(id: string): Promise<Order | undefined>;
  getOrdersByVendor(vendorId: string): Promise<Order[]>;
  getOrdersBySupplier(supplierId: string): Promise<Order[]>;
  createOrder(order: InsertOrder): Promise<Order>;
  updateOrder(id: string, order: Partial<Order>): Promise<Order | undefined>;

  // Deliveries
  getDelivery(id: string): Promise<Delivery | undefined>;
  getDeliveriesByOrder(orderId: string): Promise<Delivery[]>;
  createDelivery(delivery: InsertDelivery): Promise<Delivery>;
  updateDelivery(id: string, delivery: Partial<Delivery>): Promise<Delivery | undefined>;

  // Delivery Pauses
  getActiveDeliveryPause(vendorId: string): Promise<DeliveryPause | undefined>;
  createDeliveryPause(pause: InsertDeliveryPause): Promise<DeliveryPause>;
  updateDeliveryPause(id: string, pause: Partial<DeliveryPause>): Promise<DeliveryPause | undefined>;

  // Complaints
  getComplaint(id: string): Promise<Complaint | undefined>;
  getComplaintsByVendor(vendorId: string): Promise<Complaint[]>;
  createComplaint(complaint: InsertComplaint): Promise<Complaint>;
  updateComplaint(id: string, complaint: Partial<Complaint>): Promise<Complaint | undefined>;

  // Subscriptions
  getSubscription(id: string): Promise<Subscription | undefined>;
  getSubscriptionsByVendor(vendorId: string): Promise<Subscription[]>;
  createSubscription(subscription: InsertSubscription): Promise<Subscription>;
  updateSubscription(id: string, subscription: Partial<Subscription>): Promise<Subscription | undefined>;

  // Notifications
  getNotificationsByUser(userId: string): Promise<Notification[]>;
  createNotification(notification: InsertNotification): Promise<Notification>;
  markNotificationAsRead(id: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User> = new Map();
  private stallTypes: Map<string, StallType> = new Map();
  private vendors: Map<string, Vendor> = new Map();
  private suppliers: Map<string, Supplier> = new Map();
  private products: Map<string, Product> = new Map();
  private bundles: Map<string, Bundle> = new Map();
  private orders: Map<string, Order> = new Map();
  private deliveries: Map<string, Delivery> = new Map();
  private deliveryPauses: Map<string, DeliveryPause> = new Map();
  private complaints: Map<string, Complaint> = new Map();
  private subscriptions: Map<string, Subscription> = new Map();
  private notifications: Map<string, Notification> = new Map();

  constructor() {
    this.initializeTestData();
  }

  private initializeTestData() {
    // Create stall types
    const chaatStall: StallType = {
      id: randomUUID(),
      name: "Chaat Stall",
      nameHindi: "चाट स्टॉल",
      description: "Golgappa, Chaat, Papdi",
      descriptionHindi: "गोलगप्पे, चाट, पापड़ी",
      icon: "fas fa-cookie"
    };
    
    const juiceStall: StallType = {
      id: randomUUID(),
      name: "Juice Stall",
      nameHindi: "जूस स्टॉल",
      description: "Fresh fruit juices",
      descriptionHindi: "ताज़े फलों का जूस",
      icon: "fas fa-glass-water"
    };

    const southIndianStall: StallType = {
      id: randomUUID(),
      name: "South Indian",
      nameHindi: "साउथ इंडियन",
      description: "Dosa, Idli, Vada",
      descriptionHindi: "डोसा, इडली, वड़ा",
      icon: "fas fa-pepper-hot"
    };

    this.stallTypes.set(chaatStall.id, chaatStall);
    this.stallTypes.set(juiceStall.id, juiceStall);
    this.stallTypes.set(southIndianStall.id, southIndianStall);

    // Create sample bundles for chaat stall
    const chaatBundle: Bundle = {
      id: randomUUID(),
      stallTypeId: chaatStall.id,
      name: "Chaat Stall Monthly Bundle",
      nameHindi: "चाट स्टॉल मासिक बंडल",
      items: [
        { productId: "potato-1", quantity: 10, unit: "kg" },
        { productId: "onion-1", quantity: 5, unit: "kg" },
        { productId: "green-chili-1", quantity: 1, unit: "kg" },
        { productId: "semolina-1", quantity: 5, unit: "kg" },
        { productId: "chaat-masala-1", quantity: 500, unit: "g" },
        { productId: "oil-1", quantity: 2, unit: "L" }
      ],
      totalCost: "2450.00",
      isRecommended: true
    };

    this.bundles.set(chaatBundle.id, chaatBundle);
  }

  // Users
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByPhone(phoneNumber: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.phoneNumber === phoneNumber);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id, createdAt: new Date() };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: string, userData: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...userData };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Stall Types
  async getStallTypes(): Promise<StallType[]> {
    return Array.from(this.stallTypes.values());
  }

  async getStallType(id: string): Promise<StallType | undefined> {
    return this.stallTypes.get(id);
  }

  async createStallType(insertStallType: InsertStallType): Promise<StallType> {
    const id = randomUUID();
    const stallType: StallType = { ...insertStallType, id };
    this.stallTypes.set(id, stallType);
    return stallType;
  }

  // Vendors
  async getVendor(id: string): Promise<Vendor | undefined> {
    return this.vendors.get(id);
  }

  async getVendorByUserId(userId: string): Promise<Vendor | undefined> {
    return Array.from(this.vendors.values()).find(vendor => vendor.userId === userId);
  }

  async createVendor(insertVendor: InsertVendor): Promise<Vendor> {
    const id = randomUUID();
    const vendor: Vendor = { ...insertVendor, id };
    this.vendors.set(id, vendor);
    return vendor;
  }

  async updateVendor(id: string, vendorData: Partial<Vendor>): Promise<Vendor | undefined> {
    const vendor = this.vendors.get(id);
    if (!vendor) return undefined;
    
    const updatedVendor = { ...vendor, ...vendorData };
    this.vendors.set(id, updatedVendor);
    return updatedVendor;
  }

  // Suppliers
  async getSupplier(id: string): Promise<Supplier | undefined> {
    return this.suppliers.get(id);
  }

  async getSupplierByUserId(userId: string): Promise<Supplier | undefined> {
    return Array.from(this.suppliers.values()).find(supplier => supplier.userId === userId);
  }

  async createSupplier(insertSupplier: InsertSupplier): Promise<Supplier> {
    const id = randomUUID();
    const supplier: Supplier = { ...insertSupplier, id };
    this.suppliers.set(id, supplier);
    return supplier;
  }

  async updateSupplier(id: string, supplierData: Partial<Supplier>): Promise<Supplier | undefined> {
    const supplier = this.suppliers.get(id);
    if (!supplier) return undefined;
    
    const updatedSupplier = { ...supplier, ...supplierData };
    this.suppliers.set(id, updatedSupplier);
    return updatedSupplier;
  }

  async getSuppliers(): Promise<Supplier[]> {
    return Array.from(this.suppliers.values());
  }

  // Products
  async getProduct(id: string): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async getProductsBySupplierId(supplierId: string): Promise<Product[]> {
    return Array.from(this.products.values()).filter(product => product.supplierId === supplierId);
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const id = randomUUID();
    const product: Product = { ...insertProduct, id };
    this.products.set(id, product);
    return product;
  }

  async updateProduct(id: string, productData: Partial<Product>): Promise<Product | undefined> {
    const product = this.products.get(id);
    if (!product) return undefined;
    
    const updatedProduct = { ...product, ...productData };
    this.products.set(id, updatedProduct);
    return updatedProduct;
  }

  async deleteProduct(id: string): Promise<boolean> {
    return this.products.delete(id);
  }

  // Bundles
  async getBundle(id: string): Promise<Bundle | undefined> {
    return this.bundles.get(id);
  }

  async getBundlesByStallType(stallTypeId: string): Promise<Bundle[]> {
    return Array.from(this.bundles.values()).filter(bundle => bundle.stallTypeId === stallTypeId);
  }

  async createBundle(insertBundle: InsertBundle): Promise<Bundle> {
    const id = randomUUID();
    const bundle: Bundle = { ...insertBundle, id };
    this.bundles.set(id, bundle);
    return bundle;
  }

  // Orders
  async getOrder(id: string): Promise<Order | undefined> {
    return this.orders.get(id);
  }

  async getOrdersByVendor(vendorId: string): Promise<Order[]> {
    return Array.from(this.orders.values()).filter(order => order.vendorId === vendorId);
  }

  async getOrdersBySupplier(supplierId: string): Promise<Order[]> {
    return Array.from(this.orders.values()).filter(order => order.supplierId === supplierId);
  }

  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const id = randomUUID();
    const order: Order = { ...insertOrder, id, createdAt: new Date() };
    this.orders.set(id, order);
    return order;
  }

  async updateOrder(id: string, orderData: Partial<Order>): Promise<Order | undefined> {
    const order = this.orders.get(id);
    if (!order) return undefined;
    
    const updatedOrder = { ...order, ...orderData };
    this.orders.set(id, updatedOrder);
    return updatedOrder;
  }

  // Deliveries
  async getDelivery(id: string): Promise<Delivery | undefined> {
    return this.deliveries.get(id);
  }

  async getDeliveriesByOrder(orderId: string): Promise<Delivery[]> {
    return Array.from(this.deliveries.values()).filter(delivery => delivery.orderId === orderId);
  }

  async createDelivery(insertDelivery: InsertDelivery): Promise<Delivery> {
    const id = randomUUID();
    const delivery: Delivery = { ...insertDelivery, id };
    this.deliveries.set(id, delivery);
    return delivery;
  }

  async updateDelivery(id: string, deliveryData: Partial<Delivery>): Promise<Delivery | undefined> {
    const delivery = this.deliveries.get(id);
    if (!delivery) return undefined;
    
    const updatedDelivery = { ...delivery, ...deliveryData };
    this.deliveries.set(id, updatedDelivery);
    return updatedDelivery;
  }

  // Delivery Pauses
  async getActiveDeliveryPause(vendorId: string): Promise<DeliveryPause | undefined> {
    return Array.from(this.deliveryPauses.values()).find(
      pause => pause.vendorId === vendorId && pause.isActive
    );
  }

  async createDeliveryPause(insertDeliveryPause: InsertDeliveryPause): Promise<DeliveryPause> {
    const id = randomUUID();
    const pause: DeliveryPause = { ...insertDeliveryPause, id, createdAt: new Date() };
    this.deliveryPauses.set(id, pause);
    return pause;
  }

  async updateDeliveryPause(id: string, pauseData: Partial<DeliveryPause>): Promise<DeliveryPause | undefined> {
    const pause = this.deliveryPauses.get(id);
    if (!pause) return undefined;
    
    const updatedPause = { ...pause, ...pauseData };
    this.deliveryPauses.set(id, updatedPause);
    return updatedPause;
  }

  // Complaints
  async getComplaint(id: string): Promise<Complaint | undefined> {
    return this.complaints.get(id);
  }

  async getComplaintsByVendor(vendorId: string): Promise<Complaint[]> {
    return Array.from(this.complaints.values()).filter(complaint => complaint.vendorId === vendorId);
  }

  async createComplaint(insertComplaint: InsertComplaint): Promise<Complaint> {
    const id = randomUUID();
    const complaint: Complaint = { ...insertComplaint, id, createdAt: new Date() };
    this.complaints.set(id, complaint);
    return complaint;
  }

  async updateComplaint(id: string, complaintData: Partial<Complaint>): Promise<Complaint | undefined> {
    const complaint = this.complaints.get(id);
    if (!complaint) return undefined;
    
    const updatedComplaint = { ...complaint, ...complaintData };
    if (complaintData.status === 'resolved' && !complaint.resolvedAt) {
      updatedComplaint.resolvedAt = new Date();
    }
    this.complaints.set(id, updatedComplaint);
    return updatedComplaint;
  }

  // Subscriptions
  async getSubscription(id: string): Promise<Subscription | undefined> {
    return this.subscriptions.get(id);
  }

  async getSubscriptionsByVendor(vendorId: string): Promise<Subscription[]> {
    return Array.from(this.subscriptions.values()).filter(subscription => subscription.vendorId === vendorId);
  }

  async createSubscription(insertSubscription: InsertSubscription): Promise<Subscription> {
    const id = randomUUID();
    const subscription: Subscription = { ...insertSubscription, id, startDate: new Date() };
    this.subscriptions.set(id, subscription);
    return subscription;
  }

  async updateSubscription(id: string, subscriptionData: Partial<Subscription>): Promise<Subscription | undefined> {
    const subscription = this.subscriptions.get(id);
    if (!subscription) return undefined;
    
    const updatedSubscription = { ...subscription, ...subscriptionData };
    this.subscriptions.set(id, updatedSubscription);
    return updatedSubscription;
  }

  // Notifications
  async getNotificationsByUser(userId: string): Promise<Notification[]> {
    return Array.from(this.notifications.values()).filter(notification => notification.userId === userId);
  }

  async createNotification(insertNotification: InsertNotification): Promise<Notification> {
    const id = randomUUID();
    const notification: Notification = { ...insertNotification, id, createdAt: new Date() };
    this.notifications.set(id, notification);
    return notification;
  }

  async markNotificationAsRead(id: string): Promise<boolean> {
    const notification = this.notifications.get(id);
    if (!notification) return false;
    
    notification.isRead = true;
    this.notifications.set(id, notification);
    return true;
  }
}

export const storage = new MemStorage();
