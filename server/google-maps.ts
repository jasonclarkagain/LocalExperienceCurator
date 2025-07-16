interface GoogleMapsPlace {
  place_id: string;
  name: string;
  formatted_address: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
  rating?: number;
  price_level?: number;
  photos?: Array<{
    photo_reference: string;
    height: number;
    width: number;
  }>;
  types: string[];
  opening_hours?: {
    open_now: boolean;
  };
  user_ratings_total?: number;
}

interface GoogleMapsSearchResponse {
  results: GoogleMapsPlace[];
  status: string;
  next_page_token?: string;
}

export class GoogleMapsService {
  private apiKey: string;
  private baseUrl = 'https://maps.googleapis.com/maps/api/place';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async searchNearbyPlaces(
    latitude: number,
    longitude: number,
    radius: number = 5000,
    type?: string
  ): Promise<GoogleMapsPlace[]> {
    const params = new URLSearchParams({
      location: `${latitude},${longitude}`,
      radius: radius.toString(),
      key: this.apiKey,
    });

    if (type) {
      params.append('type', type);
    }

    try {
      const response = await fetch(`${this.baseUrl}/nearbysearch/json?${params}`);
      const data: GoogleMapsSearchResponse = await response.json();
      
      if (data.status !== 'OK') {
        console.error('Google Maps API error:', data.status);
        return [];
      }

      return data.results;
    } catch (error) {
      console.error('Error fetching places from Google Maps:', error);
      return [];
    }
  }

  async getPlaceDetails(placeId: string): Promise<GoogleMapsPlace | null> {
    const params = new URLSearchParams({
      place_id: placeId,
      fields: 'place_id,name,formatted_address,geometry,rating,price_level,photos,types,opening_hours,user_ratings_total',
      key: this.apiKey,
    });

    try {
      const response = await fetch(`${this.baseUrl}/details/json?${params}`);
      const data = await response.json();
      
      if (data.status !== 'OK') {
        console.error('Google Maps API error:', data.status);
        return null;
      }

      return data.result;
    } catch (error) {
      console.error('Error fetching place details:', error);
      return null;
    }
  }

  async searchPlacesByText(
    query: string,
    location?: { lat: number; lng: number },
    radius?: number
  ): Promise<GoogleMapsPlace[]> {
    const params = new URLSearchParams({
      query,
      key: this.apiKey,
    });

    if (location) {
      params.append('location', `${location.lat},${location.lng}`);
    }

    if (radius) {
      params.append('radius', radius.toString());
    }

    try {
      const response = await fetch(`${this.baseUrl}/textsearch/json?${params}`);
      const data: GoogleMapsSearchResponse = await response.json();
      
      if (data.status !== 'OK') {
        console.error('Google Maps API error:', data.status);
        return [];
      }

      return data.results;
    } catch (error) {
      console.error('Error searching places:', error);
      return [];
    }
  }

  getPhotoUrl(photoReference: string, maxWidth: number = 400): string {
    return `${this.baseUrl}/photo?maxwidth=${maxWidth}&photoreference=${photoReference}&key=${this.apiKey}`;
  }

  // Convert Google Maps place to our Experience format
  convertToExperience(place: GoogleMapsPlace, category: string): any {
    return {
      name: place.name,
      description: this.generateDescription(place, category),
      category,
      latitude: place.geometry.location.lat,
      longitude: place.geometry.location.lng,
      address: place.formatted_address,
      imageUrl: place.photos?.[0] 
        ? this.getPhotoUrl(place.photos[0].photo_reference)
        : this.getDefaultImageForCategory(category),
      rating: place.rating || 4.0,
      priceLevel: place.price_level || 2,
      isOpen: place.opening_hours?.open_now ?? true,
      availabilityStatus: place.opening_hours?.open_now ? "available" : "closed",
      currentVisitors: Math.floor(Math.random() * 30) + 1,
      tags: this.generateTags(place, category),
      trendingScore: this.calculateTrendingScore(place),
      aiScore: this.calculateAIScore(place)
    };
  }

  private generateDescription(place: GoogleMapsPlace, category: string): string {
    const descriptions = {
      cafe: `Experience authentic coffee culture at ${place.name}. A perfect spot for coffee lovers seeking quality and atmosphere.`,
      restaurant: `Discover culinary excellence at ${place.name}. Fresh ingredients and exceptional flavors await.`,
      art: `Explore creative expressions at ${place.name}. A cultural gem offering unique artistic experiences.`,
      events: `Join memorable experiences at ${place.name}. Where community and entertainment come together.`,
      entertainment: `Enjoy exciting activities at ${place.name}. Perfect for fun and relaxation.`,
      shopping: `Find unique treasures at ${place.name}. A curated selection of quality items and experiences.`
    };

    return descriptions[category as keyof typeof descriptions] || 
           `Discover something special at ${place.name}. A hidden gem worth exploring.`;
  }

  private generateTags(place: GoogleMapsPlace, category: string): string[] {
    const baseTags = [category];
    
    // Add tags based on place types
    if (place.types.includes('tourist_attraction')) baseTags.push('attraction');
    if (place.types.includes('establishment')) baseTags.push('established');
    if (place.types.includes('point_of_interest')) baseTags.push('landmark');
    if (place.types.includes('food')) baseTags.push('dining');
    if (place.types.includes('store')) baseTags.push('shopping');
    
    // Add rating-based tags
    if (place.rating && place.rating > 4.5) baseTags.push('highly-rated');
    if (place.user_ratings_total && place.user_ratings_total > 100) baseTags.push('popular');
    
    return baseTags.slice(0, 4); // Limit to 4 tags
  }

  private calculateTrendingScore(place: GoogleMapsPlace): number {
    let score = 5.0;
    
    if (place.rating) score += place.rating;
    if (place.user_ratings_total) score += Math.min(place.user_ratings_total / 100, 3);
    
    return Math.min(score, 10);
  }

  private calculateAIScore(place: GoogleMapsPlace): number {
    let score = 6.0;
    
    if (place.rating) score += place.rating * 0.8;
    if (place.user_ratings_total) score += Math.min(place.user_ratings_total / 200, 2);
    
    return Math.min(score, 10);
  }

  private getDefaultImageForCategory(category: string): string {
    const defaultImages = {
      cafe: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
      restaurant: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
      art: "https://images.unsplash.com/photo-1549490349-8643362247b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
      events: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
      entertainment: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
      shopping: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400"
    };

    return defaultImages[category as keyof typeof defaultImages] || defaultImages.cafe;
  }
}