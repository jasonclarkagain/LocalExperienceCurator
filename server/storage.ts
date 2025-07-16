import { 
  users, 
  experiences, 
  userPreferences, 
  socialTrends,
  type User, 
  type InsertUser,
  type Experience,
  type InsertExperience,
  type UserPreferences,
  type InsertUserPreferences,
  type SocialTrend
} from "@shared/schema";
import { db } from "./db";
import { eq, sql } from "drizzle-orm";
import { GoogleMapsService } from "./google-maps";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserPreferences(userId: number, preferences: string[]): Promise<void>;
  updateUserSavedExperiences(userId: number, savedExperiences: number[]): Promise<void>;

  // Experience operations
  getAllExperiences(): Promise<Experience[]>;
  getExperienceById(id: number): Promise<Experience | undefined>;
  getExperiencesByCategory(category: string): Promise<Experience[]>;
  getExperiencesNearLocation(lat: number, lng: number, radius: number): Promise<Experience[]>;
  updateExperienceStatus(id: number, status: string, visitors?: number): Promise<void>;
  
  // User preferences
  getUserPreferences(userId: number): Promise<UserPreferences | undefined>;
  createUserPreferences(preferences: InsertUserPreferences): Promise<UserPreferences>;
  
  // Social trends
  getAllTrends(): Promise<SocialTrend[]>;
  getTrendingExperiences(): Promise<Experience[]>;
  
  // Google Maps integration
  refreshExperiencesFromGoogleMaps?(location: { lat: number; lng: number }, radius?: number): Promise<Experience[]>;
}

export class DatabaseStorage implements IStorage {
  private googleMapsService: GoogleMapsService | null = null;

  constructor() {
    // Initialize Google Maps service if API key is available
    if (process.env.GOOGLE_MAPS_API_KEY) {
      this.googleMapsService = new GoogleMapsService(process.env.GOOGLE_MAPS_API_KEY);
    }
    this.initializeData();
  }

  private async initializeData() {
    // Check if we have any data, if not, seed it
    const existingUsers = await db.select().from(users).limit(1);
    if (existingUsers.length === 0) {
      await this.seedData();
    }
  }

  private async seedData() {
    try {
      // Seed users
      const defaultUser = await db.insert(users).values({
        username: "demo_user",
        email: "demo@localcurate.com",
        location: "Downtown Seattle",
        preferences: ["cafe", "art"],
      }).returning();

      // Seed experiences with real Google Maps data
      let sampleExperiences: any[] = [];

      if (this.googleMapsService) {
        console.log("Fetching real location data from Google Maps...");
        
        // Seattle downtown coordinates
        const seattleCoords = { lat: 47.6062, lng: -122.3321 };
        
        // Fetch real places for different categories
        const [cafes, restaurants, artGalleries, museums] = await Promise.all([
          this.googleMapsService.searchNearbyPlaces(seattleCoords.lat, seattleCoords.lng, 5000, 'cafe'),
          this.googleMapsService.searchNearbyPlaces(seattleCoords.lat, seattleCoords.lng, 5000, 'restaurant'),
          this.googleMapsService.searchPlacesByText('art gallery Seattle', seattleCoords, 5000),
          this.googleMapsService.searchPlacesByText('museum Seattle', seattleCoords, 5000)
        ]);

        // Convert Google Maps places to experiences
        const cafeExperiences = cafes.slice(0, 3).map(place => 
          this.googleMapsService!.convertToExperience(place, 'cafe')
        );
        const restaurantExperiences = restaurants.slice(0, 2).map(place => 
          this.googleMapsService!.convertToExperience(place, 'food')
        );
        const artExperiences = artGalleries.slice(0, 2).map(place => 
          this.googleMapsService!.convertToExperience(place, 'art')
        );
        const museumExperiences = museums.slice(0, 1).map(place => 
          this.googleMapsService!.convertToExperience(place, 'art')
        );

        sampleExperiences = [
          ...cafeExperiences,
          ...restaurantExperiences,
          ...artExperiences,
          ...museumExperiences
        ];

        console.log(`Found ${sampleExperiences.length} real places from Google Maps`);
      }

      // Fallback to curated experiences if Google Maps fails
      if (sampleExperiences.length === 0) {
        console.log("Using curated Seattle experiences");
        sampleExperiences = [
          {
            name: "The Secret Garden Café",
            description: "Hidden rooftop garden café with locally-sourced pastries and artisan coffee",
            category: "cafe",
            latitude: 47.6089,
            longitude: -122.3355,
            address: "1234 Hidden Garden Way, Seattle, WA",
            imageUrl: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
            rating: 4.9,
            priceLevel: 2,
            isOpen: true,
            availabilityStatus: "available",
            currentVisitors: 23,
            tags: ["rooftop", "garden", "artisan", "coffee"],
            trendingScore: 8.5,
            aiScore: 9.2
          },
          {
            name: "Pike Place Market",
            description: "Iconic Seattle market with fresh seafood, flowers, and local vendors",
            category: "food",
            latitude: 47.6101,
            longitude: -122.3421,
            address: "85 Pike St, Seattle, WA 98101",
            imageUrl: "https://images.unsplash.com/photo-1488459716781-31db52582fe9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
            rating: 4.8,
            priceLevel: 2,
            isOpen: true,
            availabilityStatus: "available",
            currentVisitors: 45,
            tags: ["market", "seafood", "local", "historic"],
            trendingScore: 9.1,
            aiScore: 8.7
          },
          {
            name: "Seattle Art Museum",
            description: "Contemporary and traditional art in downtown Seattle",
            category: "art",
            latitude: 47.6071,
            longitude: -122.3387,
            address: "1300 1st Ave, Seattle, WA 98101",
            imageUrl: "https://images.unsplash.com/photo-1549490349-8643362247b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
            rating: 4.7,
            priceLevel: 3,
            isOpen: true,
            availabilityStatus: "available",
            currentVisitors: 28,
            tags: ["museum", "contemporary", "traditional", "downtown"],
            trendingScore: 7.8,
            aiScore: 8.1
          }
        ];
      }

      await db.insert(experiences).values(sampleExperiences);

      // Seed social trends
      const trends = [
        {
          hashtag: "#SeattleHiddenGems",
          mentions: 1247,
          growthRate: 147,
          relatedExperiences: [1, 2, 3]
        },
        {
          hashtag: "#LocalSeattle",
          mentions: 892,
          growthRate: 89,
          relatedExperiences: [3, 5]
        }
      ];

      await db.insert(socialTrends).values(trends);

      console.log("Database seeded successfully");
    } catch (error) {
      console.error("Error seeding database:", error);
    }
  }

  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values({
      ...insertUser,
      savedExperiences: []
    }).returning();
    return user;
  }

  async updateUserPreferences(userId: number, preferences: string[]): Promise<void> {
    await db.update(users)
      .set({ preferences })
      .where(eq(users.id, userId));
  }

  async updateUserSavedExperiences(userId: number, savedExperiences: number[]): Promise<void> {
    await db.update(users)
      .set({ savedExperiences })
      .where(eq(users.id, userId));
  }

  async getAllExperiences(): Promise<Experience[]> {
    return await db.select().from(experiences);
  }

  async getExperienceById(id: number): Promise<Experience | undefined> {
    const [experience] = await db.select().from(experiences).where(eq(experiences.id, id));
    return experience || undefined;
  }

  async getExperiencesByCategory(category: string): Promise<Experience[]> {
    return await db.select().from(experiences).where(eq(experiences.category, category));
  }

  async getExperiencesNearLocation(lat: number, lng: number, radius: number): Promise<Experience[]> {
    // Using PostgreSQL's built-in distance calculation
    const result = await db.select().from(experiences).where(
      sql`(
        3959 * acos(
          cos(radians(${lat})) * cos(radians(latitude)) * 
          cos(radians(longitude) - radians(${lng})) + 
          sin(radians(${lat})) * sin(radians(latitude))
        )
      ) <= ${radius}`
    );
    return result;
  }

  async updateExperienceStatus(id: number, status: string, visitors?: number): Promise<void> {
    const updateData: any = { availabilityStatus: status };
    if (visitors !== undefined) {
      updateData.currentVisitors = visitors;
    }
    await db.update(experiences)
      .set(updateData)
      .where(eq(experiences.id, id));
  }

  async getUserPreferences(userId: number): Promise<UserPreferences | undefined> {
    const [preferences] = await db.select().from(userPreferences).where(eq(userPreferences.userId, userId));
    return preferences || undefined;
  }

  async createUserPreferences(insertPreferences: InsertUserPreferences): Promise<UserPreferences> {
    const [preferences] = await db.insert(userPreferences).values(insertPreferences).returning();
    return preferences;
  }

  async getAllTrends(): Promise<SocialTrend[]> {
    return await db.select().from(socialTrends);
  }

  async getTrendingExperiences(): Promise<Experience[]> {
    return await db.select().from(experiences)
      .orderBy(sql`trending_score DESC`)
      .limit(10);
  }

  async refreshExperiencesFromGoogleMaps(location: { lat: number; lng: number }, radius: number = 5000): Promise<Experience[]> {
    if (!this.googleMapsService) {
      throw new Error('Google Maps service not available');
    }

    try {
      // Fetch fresh data from Google Maps
      const [cafes, restaurants, artGalleries, museums, events] = await Promise.all([
        this.googleMapsService.searchNearbyPlaces(location.lat, location.lng, radius, 'cafe'),
        this.googleMapsService.searchNearbyPlaces(location.lat, location.lng, radius, 'restaurant'),
        this.googleMapsService.searchPlacesByText('art gallery', location, radius),
        this.googleMapsService.searchPlacesByText('museum', location, radius),
        this.googleMapsService.searchPlacesByText('events entertainment', location, radius)
      ]);

      // Convert to experiences
      const newExperiences = [
        ...cafes.slice(0, 5).map(place => this.googleMapsService!.convertToExperience(place, 'cafe')),
        ...restaurants.slice(0, 5).map(place => this.googleMapsService!.convertToExperience(place, 'food')),
        ...artGalleries.slice(0, 3).map(place => this.googleMapsService!.convertToExperience(place, 'art')),
        ...museums.slice(0, 3).map(place => this.googleMapsService!.convertToExperience(place, 'art')),
        ...events.slice(0, 2).map(place => this.googleMapsService!.convertToExperience(place, 'events'))
      ];

      // Clear existing experiences and add new ones
      await db.delete(experiences);
      if (newExperiences.length > 0) {
        const insertedExperiences = await db.insert(experiences).values(newExperiences).returning();
        console.log(`Refreshed ${insertedExperiences.length} experiences from Google Maps`);
        return insertedExperiences;
      } else {
        console.log('No new experiences found, returning empty array');
        return [];
      }
    } catch (error) {
      console.error('Error refreshing experiences from Google Maps:', error);
      throw error;
    }
  }

}

export const storage = new DatabaseStorage();
