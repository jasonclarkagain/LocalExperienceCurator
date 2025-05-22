import { useQuery } from "@tanstack/react-query";

interface UseExperiencesOptions {
  category?: string;
  location?: { latitude: number; longitude: number } | null;
  type?: "all" | "nearby" | "recommendations" | "trending";
  userId?: number;
  radius?: number;
}

export function useExperiences(options: UseExperiencesOptions = {}) {
  const {
    category,
    location,
    type = "all",
    userId,
    radius = 5.0,
  } = options;

  const buildQueryKey = () => {
    switch (type) {
      case "nearby":
        return location
          ? ["/api/experiences/nearby", { lat: location.latitude, lng: location.longitude, radius }]
          : ["/api/experiences"];
      
      case "recommendations":
        const params: any = { radius };
        if (userId) params.userId = userId;
        if (location) {
          params.lat = location.latitude;
          params.lng = location.longitude;
        }
        return ["/api/experiences/recommendations", params];
      
      case "trending":
        return ["/api/experiences/trending"];
      
      default:
        return category
          ? [`/api/experiences/category/${category}`]
          : ["/api/experiences"];
    }
  };

  const buildQueryUrl = () => {
    const [baseUrl, params] = Array.isArray(buildQueryKey()[1]) 
      ? [buildQueryKey()[0] as string, buildQueryKey()[1] as Record<string, any>]
      : [buildQueryKey()[0] as string, buildQueryKey()[1] as Record<string, any> || {}];

    if (Object.keys(params || {}).length === 0) {
      return baseUrl;
    }

    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, value.toString());
      }
    });

    return `${baseUrl}?${searchParams.toString()}`;
  };

  return useQuery({
    queryKey: buildQueryKey(),
    queryFn: async () => {
      const url = buildQueryUrl();
      const response = await fetch(url, {
        credentials: "include",
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return response.json();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: type === "recommendations" ? 10 * 60 * 1000 : false, // Auto-refresh recommendations every 10 minutes
  });
}
