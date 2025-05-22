import { motion } from "framer-motion";
import { useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { calculateDistance } from "@/lib/location-utils";
import { useLocation } from "@/hooks/use-location";
import { useToast } from "@/hooks/use-toast";
import type { Experience } from "@shared/schema";

interface FeaturedExperienceProps {
  experience: Experience;
}

export default function FeaturedExperience({ experience }: FeaturedExperienceProps) {
  const { location } = useLocation();
  const { toast } = useToast();

  const distance = location
    ? calculateDistance(
        location.latitude,
        location.longitude,
        experience.latitude,
        experience.longitude
      )
    : null;

  const saveMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("PUT", "/api/user/1/saved", {
        experienceId: experience.id,
        action: "save",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user/1"] });
      toast({
        title: "Experience saved",
        description: "Added to your saved list",
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
        return "Open Now";
      case "limited":
        return "Limited Time";
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
    <div className="px-4 mb-6">
      <motion.div
        className="relative rounded-2xl overflow-hidden bg-white shadow-lg"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <img
          src={experience.imageUrl}
          alt={experience.name}
          className="w-full h-48 object-cover"
        />
        <div className="absolute inset-0 gradient-overlay"></div>

        {/* Status Badge */}
        <div className="absolute top-4 right-4">
          <span
            className={`${getStatusColor(
              experience.availabilityStatus
            )} text-white px-3 py-1 rounded-full text-xs font-medium flex items-center`}
          >
            {experience.availabilityStatus === "available" && (
              <span className="inline-block w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></span>
            )}
            {getStatusLabel(experience.availabilityStatus)}
          </span>
        </div>

        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
          <div className="flex items-center mb-2">
            <div className="bg-white bg-opacity-20 rounded-full px-2 py-1 text-xs mr-2 flex items-center">
              <svg className="w-3 h-3 text-yellow-300 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              AI Pick
            </div>
            {distance && (
              <div className="bg-white bg-opacity-20 rounded-full px-2 py-1 text-xs">
                {distance.toFixed(1)} mi away
              </div>
            )}
          </div>

          <h3 className="font-bold text-xl mb-1 font-['Poppins']">
            {experience.name}
          </h3>
          <p className="text-sm opacity-90 mb-2">
            {experience.description}
          </p>

          <div className="flex items-center space-x-4 text-sm mb-4">
            <span className="flex items-center">
              <svg className="w-4 h-4 text-yellow-300 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              {experience.rating}
            </span>
            <span className="flex items-center">
              <span className="text-green-300">{getPriceLevel(experience.priceLevel)}</span>
            </span>
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
              </svg>
              {experience.currentVisitors} visiting now
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <button className="flex-1 bg-white bg-opacity-20 backdrop-blur-sm py-2 px-4 rounded-xl text-sm font-medium hover:bg-opacity-30 transition-colors">
              Get Directions
            </button>
            <button
              onClick={() => saveMutation.mutate()}
              disabled={saveMutation.isPending}
              className="bg-white bg-opacity-20 backdrop-blur-sm p-2 rounded-xl hover:bg-opacity-30 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
            </button>
            <button className="bg-white bg-opacity-20 backdrop-blur-sm p-2 rounded-xl hover:bg-opacity-30 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
              </svg>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
