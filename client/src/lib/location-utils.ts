export function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 3959; // Earth's radius in miles
  const dLat = toRadians(lat2 - lat1);
  const dLng = toRadians(lng2 - lng1);
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

export function formatDistance(distance: number): string {
  if (distance < 0.1) {
    return "< 0.1 mi";
  } else if (distance < 1) {
    return `${distance.toFixed(1)} mi`;
  } else {
    return `${distance.toFixed(1)} mi`;
  }
}

export function isWithinRadius(
  userLat: number,
  userLng: number,
  targetLat: number,
  targetLng: number,
  radiusMiles: number
): boolean {
  const distance = calculateDistance(userLat, userLng, targetLat, targetLng);
  return distance <= radiusMiles;
}

export function getBoundsFromLocation(
  lat: number,
  lng: number,
  radiusMiles: number
) {
  const latRange = radiusMiles / 69; // Approximate miles per degree of latitude
  const lngRange = radiusMiles / (69 * Math.cos(toRadians(lat))); // Adjust for longitude

  return {
    north: lat + latRange,
    south: lat - latRange,
    east: lng + lngRange,
    west: lng - lngRange,
  };
}

export function getLocationPermission(): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported"));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => resolve(position),
      (error) => reject(error),
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // 5 minutes
      }
    );
  });
}

export function watchLocation(
  onLocationUpdate: (position: GeolocationPosition) => void,
  onError?: (error: GeolocationPositionError) => void
): number {
  if (!navigator.geolocation) {
    throw new Error("Geolocation is not supported");
  }

  return navigator.geolocation.watchPosition(
    onLocationUpdate,
    onError,
    {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 60000, // 1 minute
    }
  );
}

export function clearLocationWatch(watchId: number): void {
  navigator.geolocation.clearWatch(watchId);
}
