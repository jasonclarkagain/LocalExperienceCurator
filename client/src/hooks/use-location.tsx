import { useState, useEffect } from "react";

interface Location {
  latitude: number;
  longitude: number;
  accuracy?: number;
}

export function useLocation() {
  const [location, setLocation] = useState<Location | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by this browser");
      setLoading(false);
      return;
    }

    const options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0,
    };

    const onSuccess = (position: GeolocationPosition) => {
      setLocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy,
      });
      setError(null);
      setLoading(false);
    };

    const onError = (error: GeolocationPositionError) => {
      console.log("Location error:", error.message);
      // Use default Seattle location as fallback
      setLocation({
        latitude: 47.6062,
        longitude: -122.3321,
      });
      setError(null); // Don't show error since we have fallback
      setLoading(false);
    };

    navigator.geolocation.getCurrentPosition(onSuccess, onError, options);

    // Watch position changes
    const watchId = navigator.geolocation.watchPosition(onSuccess, onError, options);

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, []);

  return { location, error, loading };
}
