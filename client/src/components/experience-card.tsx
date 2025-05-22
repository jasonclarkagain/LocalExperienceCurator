import { useState } from "react";
import { motion } from "framer-motion";
import { useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { calculateDistance } from "@/lib/location-utils";
import { useLocation } from "@/hooks/use-location";
import { useToast } from "@/hooks/use-toast";
import type { Experience } from "@shared/schema";

interface ExperienceCardProps {
  experience: Experience;
}

export default function ExperienceCard({ experience }: ExperienceCardProps) {
  const { location } = useLocation();
  const { toast } = useToast();
  const [isSaved, setIsSaved] = useState(false);

  // Calculate distance
  const distance = location
    ? calculateDistance(
        location.latitude,
        location.longitude,
        experience.latitude,
        experience.longitude
      )
    : null;

  // Save/unsave mutation
  const saveMutation = useMutation({
    mutationFn: async (action: "save" | "unsave") => {
      return apiRequest("PUT", "/api/user/1/saved", {
        experienceId: experience.id,
        action,
      });
    },
    onSuccess: (_, action) => {
      setIsSaved(action === "save");
      queryClient.invalidateQueries({ queryKey: ["/api/user/1"] });
      toast({
        title: action === "save" ? "Experience saved" : "Experience removed",
        description: action === "save" 
          ? "Added to your saved list" 
          : "Removed from your saved list",
      });
    },
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-available";
      case "limited":
        return "bg-limited";
      case "unavailable":
        return "bg-unavailable";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "available":
        return "Open";
      case "limited":
        return "Limited";
      case "unavailable":
        return "Closed";
      default:
        return status;
    }
  };

  const getPriceLevel = (level: number) => {
    return "$".repeat(level);
  };

  return (
    <motion.div
      className="bg-white rounded-xl shadow-sm p-4 border border-gray-100 hover:shadow-md transition-shadow"
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex space-x-3">
        <div className="relative">
          <img
            src={experience.imageUrl}
            alt={experience.name}
            className="w-20 h-20 rounded-xl object-cover"
          />
          <button
            onClick={() => saveMutation.mutate(isSaved ? "unsave" : "save")}
            className="absolute -top-1 -right-1 w-6 h-6 bg-white rounded-full shadow-lg flex items-center justify-center"
          >
            <svg
              className={`w-4 h-4 ${isSaved ? "text-coral fill-current" : "text-gray-400"}`}
              fill={isSaved ? "currentColor" : "none"}
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
              />
            </svg>
          </button>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-1">
            <h3 className="font-semibold text-slate font-['Poppins'] truncate">
              {experience.name}
            </h3>
            <span
              className={`${getStatusColor(
                experience.availabilityStatus
              )} text-white px-2 py-1 rounded-full text-xs font-medium ml-2 flex-shrink-0`}
            >
              {experience.availabilityStatus === "available" && (
                <span className="inline-block w-1 h-1 bg-white rounded-full mr-1 animate-pulse"></span>
              )}
              {getStatusLabel(experience.availabilityStatus)}
            </span>
          </div>

          <p className="text-gray-600 text-sm mb-2 line-clamp-2">
            {experience.description}
          </p>

          <div className="flex items-center space-x-3 text-xs text-gray-500">
            {distance && (
              <span className="flex items-center">
                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                    clipRule="evenodd"
                  />
                </svg>
                {distance.toFixed(1)} mi
              </span>
            )}

            {experience.rating > 0 && (
              <span className="flex items-center">
                <svg className="w-3 h-3 mr-1 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                {experience.rating}
              </span>
            )}

            <span className="flex items-center">
              <span className="text-green-600">{getPriceLevel(experience.priceLevel)}</span>
            </span>

            {experience.currentVisitors > 0 && (
              <span className="flex items-center">
                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                </svg>
                {experience.currentVisitors} here now
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
