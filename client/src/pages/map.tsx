import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import AppHeader from "@/components/app-header";
import BottomNavigation from "@/components/bottom-navigation";
import { useExperiences } from "@/hooks/use-experiences";
import { useLocation } from "@/hooks/use-location";
import type { Experience } from "@shared/schema";

export default function Map() {
  const [selectedExperience, setSelectedExperience] = useState<Experience | null>(null);
  const { location } = useLocation();
  const { data: experiences = [] } = useExperiences({ location });

  // Mock map implementation - in a real app this would use React Leaflet
  const mapCenter = location 
    ? { lat: location.latitude, lng: location.longitude }
    : { lat: 47.6062, lng: -122.3321 }; // Seattle default

  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader />
      
      <main className="pt-20 pb-20 relative">
        {/* Map Container */}
        <div className="h-[calc(100vh-160px)] bg-gray-200 relative overflow-hidden">
          {/* Mock Map Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-teal/20 to-sky/20">
            {/* Grid pattern to simulate map */}
            <div className="absolute inset-0 opacity-20">
              <div className="grid grid-cols-8 grid-rows-12 h-full">
                {[...Array(96)].map((_, i) => (
                  <div key={i} className="border border-gray-300"></div>
                ))}
              </div>
            </div>
          </div>

          {/* Experience Markers */}
          {experiences.map((experience, index) => (
            <motion.div
              key={experience.id}
              className="absolute cursor-pointer"
              style={{
                left: `${20 + (index % 4) * 20}%`,
                top: `${20 + Math.floor(index / 4) * 15}%`,
              }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => setSelectedExperience(experience)}
            >
              <div className="relative">
                <div className={`w-8 h-8 rounded-full shadow-lg flex items-center justify-center text-white text-sm ${
                  experience.category === 'cafe' ? 'bg-amber-500' :
                  experience.category === 'art' ? 'bg-purple-500' :
                  experience.category === 'events' ? 'bg-red-500' :
                  'bg-green-500'
                }`}>
                  {experience.category === 'cafe' ? '☕' :
                   experience.category === 'art' ? '🎨' :
                   experience.category === 'events' ? '🎵' : '🍽️'}
                </div>
                {experience.availabilityStatus === 'available' && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-available rounded-full border-2 border-white animate-pulse"></div>
                )}
              </div>
            </motion.div>
          ))}

          {/* User Location */}
          <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg">
              <div className="w-8 h-8 bg-blue-500/20 rounded-full absolute -inset-2 animate-ping"></div>
            </div>
          </div>
        </div>

        {/* Map Controls */}
        <div className="absolute top-24 right-4 space-y-2">
          <button className="w-10 h-10 bg-white rounded-lg shadow-lg flex items-center justify-center">
            <span className="text-xl">+</span>
          </button>
          <button className="w-10 h-10 bg-white rounded-lg shadow-lg flex items-center justify-center">
            <span className="text-xl">−</span>
          </button>
        </div>

        {/* Category Filter */}
        <div className="absolute top-24 left-4">
          <div className="bg-white rounded-lg shadow-lg p-2 space-y-1">
            <button className="flex items-center space-x-2 px-3 py-2 rounded text-sm hover:bg-gray-100">
              <span>☕</span><span>Cafés</span>
            </button>
            <button className="flex items-center space-x-2 px-3 py-2 rounded text-sm hover:bg-gray-100">
              <span>🎨</span><span>Art</span>
            </button>
            <button className="flex items-center space-x-2 px-3 py-2 rounded text-sm hover:bg-gray-100">
              <span>🎵</span><span>Events</span>
            </button>
            <button className="flex items-center space-x-2 px-3 py-2 rounded text-sm hover:bg-gray-100">
              <span>🍽️</span><span>Food</span>
            </button>
          </div>
        </div>

        {/* Experience Details Modal */}
        {selectedExperience && (
          <motion.div
            className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-2xl z-50"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
          >
            <div className="p-4">
              <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-4"></div>
              
              <div className="flex space-x-4">
                <img
                  src={selectedExperience.imageUrl}
                  alt={selectedExperience.name}
                  className="w-20 h-20 rounded-xl object-cover"
                />
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-lg font-['Poppins']">{selectedExperience.name}</h3>
                    <button
                      onClick={() => setSelectedExperience(null)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      ✕
                    </button>
                  </div>
                  <p className="text-gray-600 text-sm mb-2">{selectedExperience.description}</p>
                  <div className="flex items-center space-x-3 text-xs text-gray-500">
                    <span className="flex items-center">
                      ⭐ {selectedExperience.rating}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-white text-xs ${
                      selectedExperience.availabilityStatus === 'available' ? 'bg-available' :
                      selectedExperience.availabilityStatus === 'limited' ? 'bg-limited' :
                      'bg-unavailable'
                    }`}>
                      {selectedExperience.availabilityStatus === 'available' ? 'Open' :
                       selectedExperience.availabilityStatus === 'limited' ? 'Limited' :
                       'Closed'}
                    </span>
                    <span>{selectedExperience.currentVisitors} visiting</span>
                  </div>
                </div>
              </div>

              <div className="flex space-x-3 mt-4">
                <button className="flex-1 bg-coral text-white py-3 rounded-xl font-medium">
                  Get Directions
                </button>
                <button className="px-4 py-3 border border-gray-200 rounded-xl">
                  💾
                </button>
                <button className="px-4 py-3 border border-gray-200 rounded-xl">
                  📤
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </main>

      <BottomNavigation activeTab="map" />
    </div>
  );
}
