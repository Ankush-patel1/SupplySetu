import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, boolean, timestamp, decimal, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  phoneNumber: text("phone_number").notNull().unique(),
  role: text("role", { enum: ["vendor", "supplier"] }).notNull(),
  name: text("name"),
  businessName: text("business_name"),
  isVerified: boolean("is_verified").default(false),
  createdAt: timestamp("created_at").default(sql`now()`),
});

export const stallTypes = pgTable("stall_types", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  nameHindi: text("name_hindi").notNull(),
  description: text("description"),
  descriptionHindi: text("description_hindi"),
  icon: text("icon").notNull(),
});

export const vendors = pgTable("vendors", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  stallTypeId: varchar("stall_type_id").references(() => stallTypes.id),
  location: text("location"),
  isOnboarded: boolean("is_onboarded").default(false),
});

export const suppliers = pgTable("suppliers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  deliveryZones: text("delivery_zones").array(),
  isVerified: boolean("is_verified").default(false),
});

export const products = pgTable("products", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  supplierId: varchar("supplier_id").references(() => suppliers.id).notNull(),
  name: text("name").notNull(),
  nameHindi: text("name_hindi").notNull(),
  category: text("category", { enum: ["perishable", "non_perishable"] }).notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  unit: text("unit").notNull(),
  stockLevel: integer("stock_level").default(0),
  imageUrl: text("image_url"),
  freshnessStatus: text("freshness_status", { enum: ["fresh", "blurred", "low_quality"] }).default("fresh"),
  description: text("description"),
  descriptionHindi: text("description_hindi"),
});

export const bundles = pgTable("bundles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  stallTypeId: varchar("stall_type_id").references(() => stallTypes.id).notNull(),
  name: text("name").notNull(),
  nameHindi: text("name_hindi").notNull(),
  items: jsonb("items").notNull(), // Array of { productId, quantity, unit }
  totalCost: decimal("total_cost", { precision: 10, scale: 2 }),
  isRecommended: boolean("is_recommended").default(false),
});

export const orders = pgTable("orders", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  vendorId: varchar("vendor_id").references(() => vendors.id).notNull(),
  supplierId: varchar("supplier_id").references(() => suppliers.id).notNull(),
  items: jsonb("items").notNull(), // Array of { productId, quantity, unit, price }
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),
  status: text("status", { enum: ["pending", "accepted", "rejected", "delivered", "cancelled"] }).default("pending"),
  deliveryDate: timestamp("delivery_date"),
  deliveryType: text("delivery_type", { enum: ["weekly", "monthly"] }).notNull(),
  createdAt: timestamp("created_at").default(sql`now()`),
});

export const deliveries = pgTable("deliveries", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  orderId: varchar("order_id").references(() => orders.id).notNull(),
  scheduledDate: timestamp("scheduled_date").notNull(),
  actualDate: timestamp("actual_date"),
  status: text("status", { enum: ["scheduled", "in_transit", "delivered", "failed"] }).default("scheduled"),
  notes: text("notes"),
});

export const deliveryPauses = pgTable("delivery_pauses", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  vendorId: varchar("vendor_id").references(() => vendors.id).notNull(),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  reason: text("reason"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").default(sql`now()`),
});

export const complaints = pgTable("complaints", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  vendorId: varchar("vendor_id").references(() => vendors.id).notNull(),
  orderId: varchar("order_id").references(() => orders.id),
  title: text("title").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url"),
  status: text("status", { enum: ["open", "in_progress", "resolved", "closed"] }).default("open"),
  response: text("response"),
  createdAt: timestamp("created_at").default(sql`now()`),
  resolvedAt: timestamp("resolved_at"),
});

export const subscriptions = pgTable("subscriptions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  vendorId: varchar("vendor_id").references(() => vendors.id).notNull(),
  supplierId: varchar("supplier_id").references(() => suppliers.id).notNull(),
  bundleId: varchar("bundle_id").references(() => bundles.id),
  customItems: jsonb("custom_items"), // Array of { productId, quantity, unit }
  deliveryFrequency: text("delivery_frequency", { enum: ["weekly", "monthly"] }).notNull(),
  isActive: boolean("is_active").default(true),
  startDate: timestamp("start_date").default(sql`now()`),
  nextDelivery: timestamp("next_delivery"),
});

export const notifications = pgTable("notifications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  title: text("title").notNull(),
  titleHindi: text("title_hindi"),
  message: text("message").notNull(),
  messageHindi: text("message_hindi"),
  type: text("type", { enum: ["delivery", "order", "complaint", "general"] }).notNull(),
  isRead: boolean("is_read").default(false),
  createdAt: timestamp("created_at").default(sql`now()`),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true });
export const insertStallTypeSchema = createInsertSchema(stallTypes).omit({ id: true });
export const insertVendorSchema = createInsertSchema(vendors).omit({ id: true });
export const insertSupplierSchema = createInsertSchema(suppliers).omit({ id: true });
export const insertProductSchema = createInsertSchema(products).omit({ id: true });
export const insertBundleSchema = createInsertSchema(bundles).omit({ id: true });
export const insertOrderSchema = createInsertSchema(orders).omit({ id: true, createdAt: true });
export const insertDeliverySchema = createInsertSchema(deliveries).omit({ id: true });
export const insertDeliveryPauseSchema = createInsertSchema(deliveryPauses).omit({ id: true, createdAt: true });
export const insertComplaintSchema = createInsertSchema(complaints).omit({ id: true, createdAt: true, resolvedAt: true });
export const insertSubscriptionSchema = createInsertSchema(subscriptions).omit({ id: true, startDate: true });
export const insertNotificationSchema = createInsertSchema(notifications).omit({ id: true, createdAt: true });

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertStallType = z.infer<typeof insertStallTypeSchema>;
export type StallType = typeof stallTypes.$inferSelect;
export type InsertVendor = z.infer<typeof insertVendorSchema>;
export type Vendor = typeof vendors.$inferSelect;
export type InsertSupplier = z.infer<typeof insertSupplierSchema>;
export type Supplier = typeof suppliers.$inferSelect;
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = typeof products.$inferSelect;
export type InsertBundle = z.infer<typeof insertBundleSchema>;
export type Bundle = typeof bundles.$inferSelect;
export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type Order = typeof orders.$inferSelect;
export type InsertDelivery = z.infer<typeof insertDeliverySchema>;
export type Delivery = typeof deliveries.$inferSelect;
export type InsertDeliveryPause = z.infer<typeof insertDeliveryPauseSchema>;
export type DeliveryPause = typeof deliveryPauses.$inferSelect;
export type InsertComplaint = z.infer<typeof insertComplaintSchema>;
export type Complaint = typeof complaints.$inferSelect;
export type InsertSubscription = z.infer<typeof insertSubscriptionSchema>;
export type Subscription = typeof subscriptions.$inferSelect;
export type InsertNotification = z.infer<typeof insertNotificationSchema>;
export type Notification = typeof notifications.$inferSelect;
