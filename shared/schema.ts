import { pgTable, text, serial, real, integer, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  location: text("location"),
  preferences: jsonb("preferences").$type<string[]>().default([]),
  savedExperiences: jsonb("saved_experiences").$type<number[]>().default([]),
});

export const experiences = pgTable("experiences", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(), // 'cafe', 'art', 'events', 'food'
  latitude: real("latitude").notNull(),
  longitude: real("longitude").notNull(),
  address: text("address").notNull(),
  imageUrl: text("image_url").notNull(),
  rating: real("rating").default(0),
  priceLevel: integer("price_level").default(1), // 1-4 scale
  isOpen: boolean("is_open").default(true),
  availabilityStatus: text("availability_status").notNull().default("available"), // 'available', 'limited', 'unavailable'
  currentVisitors: integer("current_visitors").default(0),
  tags: jsonb("tags").$type<string[]>().default([]),
  trendingScore: real("trending_score").default(0),
  aiScore: real("ai_score").default(0),
});

export const userPreferences = pgTable("user_preferences", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  categories: jsonb("categories").$type<string[]>().default([]),
  priceRange: jsonb("price_range").$type<[number, number]>().default([1, 4]),
  maxDistance: real("max_distance").default(5.0),
  preferredTimes: jsonb("preferred_times").$type<string[]>().default([]),
});

export const socialTrends = pgTable("social_trends", {
  id: serial("id").primaryKey(),
  hashtag: text("hashtag").notNull(),
  mentions: integer("mentions").default(0),
  growthRate: real("growth_rate").default(0),
  relatedExperiences: jsonb("related_experiences").$type<number[]>().default([]),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  email: true,
  location: true,
  preferences: true,
});

export const insertExperienceSchema = createInsertSchema(experiences).pick({
  name: true,
  description: true,
  category: true,
  latitude: true,
  longitude: true,
  address: true,
  imageUrl: true,
  rating: true,
  priceLevel: true,
  isOpen: true,
  availabilityStatus: true,
  currentVisitors: true,
  tags: true,
});

export const insertUserPreferencesSchema = createInsertSchema(userPreferences).pick({
  userId: true,
  categories: true,
  priceRange: true,
  maxDistance: true,
  preferredTimes: true,
});

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Experience = typeof experiences.$inferSelect;
export type InsertExperience = z.infer<typeof insertExperienceSchema>;
export type UserPreferences = typeof userPreferences.$inferSelect;
export type InsertUserPreferences = z.infer<typeof insertUserPreferencesSchema>;
export type SocialTrend = typeof socialTrends.$inferSelect;
