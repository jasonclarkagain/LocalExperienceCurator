import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertExperienceSchema, insertUserSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all experiences
  app.get("/api/experiences", async (req, res) => {
    try {
      const experiences = await storage.getAllExperiences();
      res.json(experiences);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch experiences" });
    }
  });

  // Get experiences by category
  app.get("/api/experiences/category/:category", async (req, res) => {
    try {
      const { category } = req.params;
      const experiences = await storage.getExperiencesByCategory(category);
      res.json(experiences);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch experiences by category" });
    }
  });

  // Get nearby experiences
  app.get("/api/experiences/nearby", async (req, res) => {
    try {
      const lat = parseFloat(req.query.lat as string);
      const lng = parseFloat(req.query.lng as string);
      const radius = parseFloat(req.query.radius as string) || 5.0;

      if (isNaN(lat) || isNaN(lng)) {
        return res.status(400).json({ error: "Invalid coordinates" });
      }

      const experiences = await storage.getExperiencesNearLocation(lat, lng, radius);
      res.json(experiences);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch nearby experiences" });
    }
  });

  // Get AI recommendations
  app.get("/api/experiences/recommendations", async (req, res) => {
    try {
      const userId = parseInt(req.query.userId as string);
      const lat = parseFloat(req.query.lat as string);
      const lng = parseFloat(req.query.lng as string);
      const radius = parseFloat(req.query.radius as string) || 5.0;

      let experiences = await storage.getAllExperiences();

      // Filter by location if coordinates provided
      if (!isNaN(lat) && !isNaN(lng)) {
        experiences = await storage.getExperiencesNearLocation(lat, lng, radius);
      }

      // Get user preferences for AI scoring
      let userPreferences: string[] = [];
      if (!isNaN(userId)) {
        const user = await storage.getUser(userId);
        if (user) {
          userPreferences = user.preferences || [];
        }
      }

      // Apply AI scoring based on user preferences
      const scoredExperiences = experiences.map(exp => {
        let score = exp.aiScore || 0;
        
        // Boost score if category matches user preferences
        if (userPreferences.includes(exp.category)) {
          score += 2;
        }

        // Boost score based on rating and trending
        score += (exp.rating * 0.5) + (exp.trendingScore * 0.3);

        // Penalize if unavailable
        if (exp.availabilityStatus === "unavailable") {
          score -= 3;
        } else if (exp.availabilityStatus === "limited") {
          score -= 1;
        }

        return { ...exp, calculatedScore: score };
      });

      // Sort by calculated score and return top recommendations
      const recommendations = scoredExperiences
        .sort((a, b) => b.calculatedScore - a.calculatedScore)
        .slice(0, 20);

      res.json(recommendations);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch AI recommendations" });
    }
  });

  // Get trending experiences
  app.get("/api/experiences/trending", async (req, res) => {
    try {
      const experiences = await storage.getTrendingExperiences();
      res.json(experiences);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch trending experiences" });
    }
  });

  // Get social trends
  app.get("/api/trends", async (req, res) => {
    try {
      const trends = await storage.getAllTrends();
      res.json(trends);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch social trends" });
    }
  });

  // Get user profile
  app.get("/api/user/:id", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      res.json(user);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch user" });
    }
  });

  // Update user preferences
  app.put("/api/user/:id/preferences", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const { preferences } = req.body;

      if (!Array.isArray(preferences)) {
        return res.status(400).json({ error: "Preferences must be an array" });
      }

      await storage.updateUserPreferences(userId, preferences);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to update preferences" });
    }
  });

  // Save/unsave experience
  app.put("/api/user/:id/saved", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const { experienceId, action } = req.body;

      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      let savedExperiences = user.savedExperiences || [];

      if (action === "save" && !savedExperiences.includes(experienceId)) {
        savedExperiences.push(experienceId);
      } else if (action === "unsave") {
        savedExperiences = savedExperiences.filter(id => id !== experienceId);
      }

      await storage.updateUserSavedExperiences(userId, savedExperiences);
      res.json({ success: true, savedExperiences });
    } catch (error) {
      res.status(500).json({ error: "Failed to update saved experiences" });
    }
  });

  // Update experience real-time status
  app.put("/api/experiences/:id/status", async (req, res) => {
    try {
      const experienceId = parseInt(req.params.id);
      const { status, visitors } = req.body;

      await storage.updateExperienceStatus(experienceId, status, visitors);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to update experience status" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
