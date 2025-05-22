import { useState } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import AppHeader from "@/components/app-header";
import BottomNavigation from "@/components/bottom-navigation";
import ExperienceCard from "@/components/experience-card";
import type { Experience } from "@shared/schema";

export default function Saved() {
  const [activeTab, setActiveTab] = useState<"saved" | "visited">("saved");

  // Get user's saved experiences
  const { data: user } = useQuery({
    queryKey: ["/api/user/1"], // Default user for demo
  });

  const { data: allExperiences = [] } = useQuery({
    queryKey: ["/api/experiences"],
  });

  const savedExperiences = user?.savedExperiences 
    ? allExperiences.filter((exp: Experience) => user.savedExperiences.includes(exp.id))
    : [];

  const visitedExperiences = allExperiences.slice(0, 2); // Mock visited experiences

  const currentExperiences = activeTab === "saved" ? savedExperiences : visitedExperiences;

  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader />
      
      <main className="pt-20 pb-20 max-w-md mx-auto">
        {/* Header */}
        <div className="px-4 mb-6">
          <h1 className="text-2xl font-bold text-slate font-['Poppins'] mb-2">Your Collection</h1>
          <p className="text-gray-600">Places you've saved and visited</p>
        </div>

        {/* Tabs */}
        <div className="px-4 mb-6">
          <div className="flex bg-gray-100 rounded-xl p-1">
            <button
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                activeTab === "saved"
                  ? "bg-white text-coral shadow-sm"
                  : "text-gray-600"
              }`}
              onClick={() => setActiveTab("saved")}
            >
              Saved ({savedExperiences.length})
            </button>
            <button
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                activeTab === "visited"
                  ? "bg-white text-coral shadow-sm"
                  : "text-gray-600"
              }`}
              onClick={() => setActiveTab("visited")}
            >
              Visited ({visitedExperiences.length})
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="px-4">
          {currentExperiences.length === 0 ? (
            <motion.div
              className="text-center py-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="w-20 h-20 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                {activeTab === "saved" ? (
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                  </svg>
                ) : (
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                )}
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {activeTab === "saved" ? "No saved places yet" : "No visited places yet"}
              </h3>
              <p className="text-gray-500 text-sm">
                {activeTab === "saved" 
                  ? "Start exploring and save places you want to visit"
                  : "Check in at places as you visit them"
                }
              </p>
            </motion.div>
          ) : (
            <motion.div
              className="space-y-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {currentExperiences.map((experience: Experience, index: number) => (
                <motion.div
                  key={experience.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <div className="relative">
                    <ExperienceCard experience={experience} />
                    {activeTab === "visited" && (
                      <div className="absolute top-2 right-2">
                        <div className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                          ✓ Visited
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>

        {/* Quick Actions */}
        {currentExperiences.length > 0 && (
          <div className="px-4 mt-8">
            <div className="bg-white rounded-xl p-4 border border-gray-100">
              <h3 className="font-semibold text-slate mb-3">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-3">
                <button className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <span>📤</span>
                  <span className="text-sm">Share List</span>
                </button>
                <button className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <span>🗺️</span>
                  <span className="text-sm">View on Map</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      <BottomNavigation activeTab="saved" />
    </div>
  );
}
