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
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private experiences: Map<number, Experience>;
  private userPreferencesMap: Map<number, UserPreferences>;
  private socialTrendsMap: Map<number, SocialTrend>;
  private currentUserId: number;
  private currentExperienceId: number;
  private currentPreferencesId: number;
  private currentTrendId: number;

  constructor() {
    this.users = new Map();
    this.experiences = new Map();
    this.userPreferencesMap = new Map();
    this.socialTrendsMap = new Map();
    this.currentUserId = 1;
    this.currentExperienceId = 1;
    this.currentPreferencesId = 1;
    this.currentTrendId = 1;
    
    this.seedData();
  }

  private seedData() {
    // Seed users
    const defaultUser: User = {
      id: this.currentUserId++,
      username: "demo_user",
      email: "demo@localcurate.com",
      location: "Downtown Seattle",
      preferences: ["cafe", "art"],
      savedExperiences: []
    };
    this.users.set(defaultUser.id, defaultUser);

    // Seed experiences
    const sampleExperiences: Omit<Experience, 'id'>[] = [
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
        name: "Underground Art Walk",
        description: "Self-guided tour through hidden murals and installations",
        category: "art",
        latitude: 47.6050,
        longitude: -122.3344,
        address: "Pioneer Square Underground, Seattle, WA",
        imageUrl: "https://images.unsplash.com/photo-1549490349-8643362247b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
        rating: 4.7,
        priceLevel: 1,
        isOpen: true,
        availabilityStatus: "limited",
        currentVisitors: 12,
        tags: ["underground", "murals", "street art", "self-guided"],
        trendingScore: 7.8,
        aiScore: 8.1
      },
      {
        name: "Pike Place Underground",
        description: "Secret vendors and hidden food stalls locals love",
        category: "food",
        latitude: 47.6101,
        longitude: -122.3421,
        address: "Pike Place Market Lower Level, Seattle, WA",
        imageUrl: "https://images.unsplash.com/photo-1488459716781-31db52582fe9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
        rating: 4.8,
        priceLevel: 2,
        isOpen: true,
        availabilityStatus: "available",
        currentVisitors: 8,
        tags: ["market", "vendors", "local", "hidden"],
        trendingScore: 9.1,
        aiScore: 8.7
      },
      {
        name: "Midnight Jazz Sessions",
        description: "Intimate performances in a hidden speakeasy",
        category: "events",
        latitude: 47.6205,
        longitude: -122.3493,
        address: "1920 Jazz Alley, Seattle, WA",
        imageUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
        rating: 4.6,
        priceLevel: 3,
        isOpen: false,
        availabilityStatus: "limited",
        currentVisitors: 3,
        tags: ["jazz", "speakeasy", "intimate", "live music"],
        trendingScore: 6.5,
        aiScore: 7.9
      },
      {
        name: "Artisan's Hidden Studio",
        description: "Watch local ceramics being made, buy unique pieces",
        category: "art",
        latitude: 47.6142,
        longitude: -122.3077,
        address: "Capitol Hill Artist District, Seattle, WA",
        imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
        rating: 4.5,
        priceLevel: 2,
        isOpen: true,
        availabilityStatus: "available",
        currentVisitors: 5,
        tags: ["ceramics", "artisan", "studio", "handmade"],
        trendingScore: 5.8,
        aiScore: 7.2
      },
      {
        name: "Moonlight Coffee Roasters",
        description: "Third-wave coffee in a converted bookstore",
        category: "cafe",
        latitude: 47.6175,
        longitude: -122.3251,
        address: "Broadway District, Seattle, WA",
        imageUrl: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
        rating: 4.4,
        priceLevel: 2,
        isOpen: true,
        availabilityStatus: "available",
        currentVisitors: 15,
        tags: ["third-wave", "bookstore", "roastery", "specialty"],
        trendingScore: 7.2,
        aiScore: 6.8
      }
    ];

    sampleExperiences.forEach(exp => {
      const experience: Experience = { ...exp, id: this.currentExperienceId++ };
      this.experiences.set(experience.id, experience);
    });

    // Seed social trends
    const trends: Omit<SocialTrend, 'id'>[] = [
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

    trends.forEach(trend => {
      const socialTrend: SocialTrend = { ...trend, id: this.currentTrendId++ };
      this.socialTrendsMap.set(socialTrend.id, socialTrend);
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id, savedExperiences: [] };
    this.users.set(id, user);
    return user;
  }

  async updateUserPreferences(userId: number, preferences: string[]): Promise<void> {
    const user = this.users.get(userId);
    if (user) {
      user.preferences = preferences;
      this.users.set(userId, user);
    }
  }

  async updateUserSavedExperiences(userId: number, savedExperiences: number[]): Promise<void> {
    const user = this.users.get(userId);
    if (user) {
      user.savedExperiences = savedExperiences;
      this.users.set(userId, user);
    }
  }

  async getAllExperiences(): Promise<Experience[]> {
    return Array.from(this.experiences.values());
  }

  async getExperienceById(id: number): Promise<Experience | undefined> {
    return this.experiences.get(id);
  }

  async getExperiencesByCategory(category: string): Promise<Experience[]> {
    return Array.from(this.experiences.values()).filter(exp => exp.category === category);
  }

  async getExperiencesNearLocation(lat: number, lng: number, radius: number): Promise<Experience[]> {
    const experiences = Array.from(this.experiences.values());
    return experiences.filter(exp => {
      const distance = this.calculateDistance(lat, lng, exp.latitude, exp.longitude);
      return distance <= radius;
    });
  }

  async updateExperienceStatus(id: number, status: string, visitors?: number): Promise<void> {
    const experience = this.experiences.get(id);
    if (experience) {
      experience.availabilityStatus = status;
      if (visitors !== undefined) {
        experience.currentVisitors = visitors;
      }
      this.experiences.set(id, experience);
    }
  }

  async getUserPreferences(userId: number): Promise<UserPreferences | undefined> {
    return Array.from(this.userPreferencesMap.values()).find(pref => pref.userId === userId);
  }

  async createUserPreferences(insertPreferences: InsertUserPreferences): Promise<UserPreferences> {
    const id = this.currentPreferencesId++;
    const preferences: UserPreferences = { ...insertPreferences, id };
    this.userPreferencesMap.set(id, preferences);
    return preferences;
  }

  async getAllTrends(): Promise<SocialTrend[]> {
    return Array.from(this.socialTrendsMap.values());
  }

  async getTrendingExperiences(): Promise<Experience[]> {
    const experiences = Array.from(this.experiences.values());
    return experiences
      .sort((a, b) => b.trendingScore - a.trendingScore)
      .slice(0, 10);
  }

  private calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 3959; // Earth's radius in miles
    const dLat = this.toRadians(lat2 - lat1);
    const dLng = this.toRadians(lng2 - lng1);
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(lat1)) * Math.cos(this.toRadians(lat2)) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }
}

export const storage = new MemStorage();
