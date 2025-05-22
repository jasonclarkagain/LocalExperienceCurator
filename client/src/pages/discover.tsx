import { useState } from "react";
import { motion } from "framer-motion";
import AppHeader from "@/components/app-header";
import BottomNavigation from "@/components/bottom-navigation";
import QuickFilters from "@/components/quick-filters";
import FeaturedExperience from "@/components/featured-experience";
import ExperienceCard from "@/components/experience-card";
import TrendingSection from "@/components/trending-section";
import FloatingARButton from "@/components/floating-ar-button";
import { useExperiences } from "@/hooks/use-experiences";
import { useLocation } from "@/hooks/use-location";

export default function Discover() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const { location } = useLocation();
  
  const { 
    data: experiences = [], 
    isLoading: experiencesLoading 
  } = useExperiences({
    category: selectedCategory === "all" ? undefined : selectedCategory,
    location: location
  });

  const { 
    data: recommendations = [], 
    isLoading: recommendationsLoading 
  } = useExperiences({
    type: "recommendations",
    location: location,
    userId: 1 // Default user for demo
  });

  const featuredExperience = recommendations[0] || experiences[0];
  const nearbyExperiences = experiences.slice(0, 4);

  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader />
      
      <main className="pt-20 pb-20 max-w-md mx-auto">
        {/* Location Prompt */}
        <motion.div 
          className="mx-4 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="bg-gradient-to-r from-coral to-sky p-4 rounded-2xl text-white">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-semibold text-lg font-['Poppins']">Discover Hidden Gems</h2>
                <p className="text-sm opacity-90">AI-curated local experiences just for you</p>
              </div>
              <button className="bg-white bg-opacity-20 p-3 rounded-full hover:bg-opacity-30 transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </motion.div>

        <QuickFilters 
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />

        {featuredExperience && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <FeaturedExperience experience={featuredExperience} />
          </motion.div>
        )}

        {/* Nearby Experiences */}
        <div className="px-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-xl text-slate font-['Poppins']">Nearby Discoveries</h2>
            <button className="text-coral font-medium text-sm hover:text-coral/80">
              View All
            </button>
          </div>

          {experiencesLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl p-4 border border-gray-100 animate-pulse">
                  <div className="flex space-x-3">
                    <div className="w-20 h-20 bg-gray-200 rounded-xl"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-200 rounded w-full"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <motion.div 
              className="space-y-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              {nearbyExperiences.map((experience, index) => (
                <motion.div
                  key={experience.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <ExperienceCard experience={experience} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>

        <TrendingSection />
      </main>

      <BottomNavigation activeTab="discover" />
      <FloatingARButton />
    </div>
  );
}
