import type { Experience } from "@shared/schema";

export interface RecommendationFactors {
  userPreferences: string[];
  location?: { latitude: number; longitude: number };
  timeOfDay?: "morning" | "afternoon" | "evening" | "night";
  weatherCondition?: "sunny" | "rainy" | "cloudy";
  groupSize?: number;
  budget?: "low" | "medium" | "high";
}

export function calculateAIScore(
  experience: Experience,
  factors: RecommendationFactors
): number {
  let score = experience.aiScore || 0;

  // Preference matching (highest weight)
  if (factors.userPreferences.includes(experience.category)) {
    score += 3.0;
  }

  // Rating boost
  score += experience.rating * 0.5;

  // Trending boost
  score += experience.trendingScore * 0.3;

  // Availability penalty/boost
  switch (experience.availabilityStatus) {
    case "available":
      score += 1.0;
      break;
    case "limited":
      score -= 0.5;
      break;
    case "unavailable":
      score -= 2.0;
      break;
  }

  // Time-based recommendations
  if (factors.timeOfDay) {
    switch (factors.timeOfDay) {
      case "morning":
        if (experience.category === "cafe") score += 1.5;
        break;
      case "afternoon":
        if (experience.category === "art" || experience.category === "food") score += 1.0;
        break;
      case "evening":
        if (experience.category === "events" || experience.category === "food") score += 1.5;
        break;
      case "night":
        if (experience.category === "events") score += 2.0;
        break;
    }
  }

  // Weather-based recommendations
  if (factors.weatherCondition) {
    switch (factors.weatherCondition) {
      case "rainy":
        if (experience.tags?.includes("indoor")) score += 1.0;
        if (experience.tags?.includes("outdoor")) score -= 1.0;
        break;
      case "sunny":
        if (experience.tags?.includes("outdoor") || experience.tags?.includes("rooftop")) score += 1.0;
        break;
    }
  }

  // Budget considerations
  if (factors.budget) {
    const budgetMap = { low: 1, medium: 2, high: 4 };
    const maxBudget = budgetMap[factors.budget];
    if (experience.priceLevel <= maxBudget) {
      score += 0.5;
    } else {
      score -= 1.0;
    }
  }

  // Popular places boost (but not too crowded)
  if (experience.currentVisitors > 0 && experience.currentVisitors <= 20) {
    score += 0.5;
  } else if (experience.currentVisitors > 30) {
    score -= 0.5; // Too crowded
  }

  return Math.max(0, score);
}

export function rankExperiences(
  experiences: Experience[],
  factors: RecommendationFactors
): Experience[] {
  const scoredExperiences = experiences.map(exp => ({
    ...exp,
    calculatedScore: calculateAIScore(exp, factors)
  }));

  return scoredExperiences
    .sort((a, b) => b.calculatedScore - a.calculatedScore)
    .slice(0, 20); // Return top 20 recommendations
}

export function getPersonalizedRecommendations(
  experiences: Experience[],
  userPreferences: string[],
  location?: { latitude: number; longitude: number }
): Experience[] {
  const currentHour = new Date().getHours();
  const timeOfDay = currentHour < 12 ? "morning" : 
                   currentHour < 17 ? "afternoon" : 
                   currentHour < 21 ? "evening" : "night";

  const factors: RecommendationFactors = {
    userPreferences,
    location,
    timeOfDay,
    // Could add weather API integration here
    // Could add user's budget preferences from profile
  };

  return rankExperiences(experiences, factors);
}
