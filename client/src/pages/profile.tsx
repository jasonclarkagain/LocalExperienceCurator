import { useState } from "react";
import { motion } from "framer-motion";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import AppHeader from "@/components/app-header";
import BottomNavigation from "@/components/bottom-navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

const categories = [
  { id: "cafe", label: "Cafés", icon: "☕" },
  { id: "art", label: "Art", icon: "🎨" },
  { id: "events", label: "Events", icon: "🎵" },
  { id: "food", label: "Food", icon: "🍽️" },
];

export default function Profile() {
  const { toast } = useToast();
  const [selectedPreferences, setSelectedPreferences] = useState<string[]>([]);

  // Get user profile
  const { data: user, isLoading } = useQuery({
    queryKey: ["/api/user/1"], // Default user for demo
  });

  // Update preferences mutation
  const updatePreferencesMutation = useMutation({
    mutationFn: async (preferences: string[]) => {
      return apiRequest("PUT", "/api/user/1/preferences", { preferences });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user/1"] });
      toast({
        title: "Preferences updated",
        description: "Your AI recommendations will be updated accordingly.",
      });
    },
    onError: () => {
      toast({
        title: "Error updating preferences",
        description: "Please try again later.",
        variant: "destructive",
      });
    },
  });

  // Initialize selected preferences when user data loads
  useState(() => {
    if (user?.preferences) {
      setSelectedPreferences(user.preferences);
    }
  }, [user]);

  const togglePreference = (categoryId: string) => {
    setSelectedPreferences(prev => 
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleSavePreferences = () => {
    updatePreferencesMutation.mutate(selectedPreferences);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AppHeader />
        <div className="pt-20 pb-20 max-w-md mx-auto px-4">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="h-24 bg-gray-200 rounded"></div>
          </div>
        </div>
        <BottomNavigation activeTab="profile" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader />
      
      <main className="pt-20 pb-20 max-w-md mx-auto">
        {/* Profile Header */}
        <motion.div
          className="px-4 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="text-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-r from-coral to-sky rounded-full mx-auto mb-4 flex items-center justify-center">
              <span className="text-2xl text-white">👤</span>
            </div>
            <h1 className="text-xl font-bold text-slate font-['Poppins']">{user?.username}</h1>
            <p className="text-gray-600">{user?.email}</p>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          className="px-4 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="grid grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-coral">{user?.savedExperiences?.length || 0}</div>
                <div className="text-xs text-gray-600">Saved</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-teal">12</div>
                <div className="text-xs text-gray-600">Visited</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-sky">8.5</div>
                <div className="text-xs text-gray-600">AI Score</div>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {/* Preferences */}
        <motion.div
          className="px-4 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span>🎯</span>
                <span>Your Preferences</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Help us curate better experiences for you
              </p>
              
              <div className="grid grid-cols-2 gap-3 mb-4">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => togglePreference(category.id)}
                    className={`p-3 rounded-xl border text-left transition-colors ${
                      selectedPreferences.includes(category.id)
                        ? "border-coral bg-coral/10 text-coral"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{category.icon}</span>
                      <span className="text-sm font-medium">{category.label}</span>
                    </div>
                  </button>
                ))}
              </div>

              <Button 
                onClick={handleSavePreferences}
                disabled={updatePreferencesMutation.isPending}
                className="w-full bg-coral hover:bg-coral/90"
              >
                {updatePreferencesMutation.isPending ? "Saving..." : "Save Preferences"}
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Current Preferences */}
        <motion.div
          className="px-4 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span>📍</span>
                <span>Location & Settings</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Current Location</span>
                <span className="text-sm font-medium">{user?.location || "Not set"}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Discovery Radius</span>
                <span className="text-sm font-medium">5 miles</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">AI Recommendations</span>
                <Badge variant="outline" className="text-available border-available">Enabled</Badge>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Actions */}
        <motion.div
          className="px-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardContent className="p-4">
              <div className="space-y-3">
                <button className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors text-left">
                  <span>🔔</span>
                  <span className="text-sm">Notification Settings</span>
                </button>
                <button className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors text-left">
                  <span>📤</span>
                  <span className="text-sm">Share Profile</span>
                </button>
                <button className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors text-left">
                  <span>❓</span>
                  <span className="text-sm">Help & Support</span>
                </button>
                <button className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors text-left">
                  <span>⚙️</span>
                  <span className="text-sm">Settings</span>
                </button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </main>

      <BottomNavigation activeTab="profile" />
    </div>
  );
}
