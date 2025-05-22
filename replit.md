# LocalCurate - Local Experience Discovery Platform

## Overview

LocalCurate is a mobile-first web application that helps users discover and explore local experiences such as cafés, art galleries, events, and restaurants. The platform uses AI-powered recommendations, real-time availability tracking, and social trend analysis to provide personalized suggestions for users based on their location and preferences.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query (React Query) for server state management
- **UI Framework**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design tokens
- **Animations**: Framer Motion for smooth transitions and interactions
- **Build Tool**: Vite for fast development and optimized builds

### Backend Architecture
- **Runtime**: Node.js with Express.js server
- **Language**: TypeScript with ESM modules
- **API Pattern**: RESTful API endpoints under `/api/*`
- **Storage**: In-memory storage implementation with interface for future database integration
- **Development**: Hot module replacement via Vite middleware integration

### Database Design
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Schema**: Centralized schema definitions in `/shared/schema.ts`
- **Tables**: Users, experiences, user preferences, and social trends
- **Migrations**: Drizzle Kit for schema management and migrations

## Key Components

### Core Entities
1. **Users**: Profile management with preferences and saved experiences
2. **Experiences**: Local venues with location data, ratings, and real-time availability
3. **User Preferences**: Category preferences, price ranges, and distance settings
4. **Social Trends**: Hashtag tracking and growth metrics for trending discovery

### Mobile-First UI Components
- **App Header**: Location-aware header with user profile
- **Bottom Navigation**: Tab-based navigation for main app sections
- **Experience Cards**: Interactive cards showing venue details and save functionality
- **Quick Filters**: Category-based filtering system
- **AR Integration**: Floating AR button for camera-based discovery (mock implementation)

### AI Recommendation System
- **Scoring Algorithm**: Multi-factor scoring based on user preferences, ratings, and trends
- **Location Awareness**: Distance-based filtering and recommendations
- **Time Context**: Time-of-day aware suggestions
- **Social Integration**: Trending score calculation from social media activity

## Data Flow

### Client-Side Data Management
1. **Location Services**: Geolocation API with fallback to default location (Seattle)
2. **Query Management**: TanStack Query handles API calls, caching, and state synchronization
3. **Real-time Updates**: Automatic refetching for dynamic content like availability status
4. **Optimistic Updates**: Immediate UI feedback for user actions like saving experiences

### API Endpoints
- `GET /api/experiences` - Retrieve all experiences
- `GET /api/experiences/category/:category` - Filter by category
- `GET /api/experiences/nearby` - Location-based discovery
- `GET /api/experiences/recommendations` - AI-powered suggestions
- `PUT /api/user/:id/preferences` - Update user preferences
- `PUT /api/user/:id/saved` - Manage saved experiences

### Storage Layer
- **Interface Pattern**: IStorage interface allows for easy database backend swapping
- **Current Implementation**: MemStorage for development and testing
- **Future Integration**: Ready for PostgreSQL with Drizzle ORM
- **Data Persistence**: Designed for real-time availability updates and social trend tracking

## External Dependencies

### Development Tools
- **TypeScript**: Type safety across frontend and backend
- **ESBuild**: Production server bundling
- **PostCSS**: CSS processing with Tailwind
- **Replit Integration**: Development environment optimizations

### UI Dependencies
- **Radix UI**: Accessible component primitives
- **Lucide Icons**: Icon system
- **Class Variance Authority**: Component variant management
- **Date-fns**: Date manipulation utilities

### Future Integrations
- **Neon Database**: PostgreSQL hosting (configured in drizzle.config.ts)
- **Maps API**: Real map integration (currently mock implementation)
- **Camera API**: AR functionality for mobile devices
- **Social Media APIs**: Real-time trend data collection

## Deployment Strategy

### Development Environment
- **Replit Configuration**: Optimized for Replit development with hot reloading
- **Port Configuration**: Frontend on 5000, API endpoints served from same port
- **Module System**: ESM throughout the codebase
- **Environment Variables**: DATABASE_URL for PostgreSQL connection

### Production Build
- **Frontend**: Vite builds to `dist/public` directory
- **Backend**: ESBuild bundles server to `dist/index.js`
- **Static Serving**: Express serves built frontend assets
- **Process Management**: Single Node.js process handles both API and static serving

### Scalability Considerations
- **Database Ready**: Drizzle ORM configured for PostgreSQL migration
- **API Structure**: RESTful design supports horizontal scaling
- **Caching Strategy**: Query-based caching with TanStack Query
- **Mobile Optimization**: Progressive Web App ready architecture

The application prioritizes user experience with smooth animations, real-time updates, and intelligent recommendations while maintaining a clean, maintainable codebase that can scale from development to production.