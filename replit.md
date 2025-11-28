# Project Skyline – Cleveland

## Overview

Project Skyline – Cleveland is an interactive web application that creates a digital representation of the Cleveland skyline where users can "illuminate" buildings by submitting their personal goals and ambitions. Each illuminated building represents someone's aspiration, creating a collective visualization of community dreams and individual identity.

The application features a cinematic, dark-themed interface with purple neon accents that provides an immersive experience. Users can view the skyline, see who has illuminated buildings (via tooltips), and submit their own name and goal to light up an unlit building with a glowing purple effect.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build System**
- **React 18** with TypeScript for type-safe component development
- **Vite** as the build tool and development server, providing fast HMR (Hot Module Replacement)
- **Wouter** for lightweight client-side routing
- Single-page application (SPA) architecture with route-based code organization

**UI Component System**
- **shadcn/ui** component library (New York style variant) providing pre-built, accessible components
- **Radix UI** primitives for accessible, unstyled component foundations
- **Tailwind CSS** for utility-first styling with custom design tokens
- **class-variance-authority** and **clsx** for dynamic className composition
- Custom CSS variables for theming (dark mode focused with purple accent colors)

**State Management**
- **TanStack Query v5** (React Query) for server state management, caching, and data synchronization
- **React Hook Form** with **Zod** validation for form state and validation
- Local component state using React hooks

**Design System**
- Dark theme (#070b14 background) with purple accents (#a970ff)
- Typography: DM Sans / Inter fonts with defined size hierarchy
- Spacing system based on Tailwind's 4px increment units
- Cinematic, immersive aesthetic inspired by interactive storytelling websites

### Backend Architecture

**Server Framework**
- **Express.js** HTTP server running on Node.js
- TypeScript for type safety across the stack
- Custom middleware for request logging and JSON parsing
- Static file serving for production builds

**Data Layer**
- **Drizzle ORM** for type-safe database interactions
- **PostgreSQL** database (configured for Neon serverless)
- Schema definitions shared between client and server via `/shared` directory
- In-memory fallback storage implementation for development (`MemStorage` class)

**API Design**
- RESTful API endpoints under `/api` prefix
- Endpoints:
  - `GET /api/buildings` - Retrieve all buildings with illumination status
  - `POST /api/illuminate` - Illuminate a random unlit building with user data
- **Zod** schemas for request validation with detailed error messages
- JSON-based request/response format

**Database Schema**
- `buildings` table: Stores building metadata (name, dimensions, style, z-index) and illumination state (isLit, ownerName, goal)
- `users` table: Basic user authentication structure (currently unused in main flow)
- 15 pre-defined buildings initialized on server start representing Cleveland landmarks (Key Tower, Terminal Tower, 200 Public Square, etc.)

### Key Architectural Decisions

**Shared Schema Pattern**
- Database schemas and validation rules defined once in `/shared/schema.ts`
- Type definitions derived from Drizzle schemas using `$inferSelect`
- Validation schemas generated with `drizzle-zod` for runtime validation
- Ensures type safety and consistency between client, server, and database

**Monorepo Structure**
- `/client` - React frontend application
- `/server` - Express backend application  
- `/shared` - Shared TypeScript types and schemas
- Unified TypeScript configuration with path aliases (`@/`, `@shared/`, `@assets/`)
- Single build process that bundles both client and server

**Development vs Production**
- Development: Vite dev server with HMR for instant updates
- Production: Pre-built static assets served by Express with client-side routing fallback
- Server bundled with esbuild, selectively bundling allowlisted dependencies for faster cold starts

**Component Architecture**
- Atomic component design with examples for each component
- Shared UI components in `/components/ui` (shadcn/ui library)
- Feature components: `Building`, `Skyline`, `HeroSection`, `LightForm`
- Each building supports different architectural styles (modern, classic, tower, spire) with unique visual treatments

**Animation & Interaction**
- CSS-based animations for building illumination (fade-in with glow effect)
- Smooth transitions using Tailwind and custom CSS
- Tooltips on illuminated buildings show owner name and goal
- Scroll-based navigation from hero to form section

## External Dependencies

### Core Infrastructure
- **Neon Database** (@neondatabase/serverless) - Serverless PostgreSQL hosting
- **Drizzle Kit** - Database migrations and schema management

### UI & Styling
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Component library built on Radix UI
- **Radix UI** - Complete suite of accessible component primitives (accordion, dialog, tooltip, etc.)
- **Lucide React** - Icon library for UI elements
- **Embla Carousel** - Carousel/slider functionality

### Form Management
- **React Hook Form** - Performant form state management
- **Zod** - Schema validation for forms and API requests
- **@hookform/resolvers** - Validation resolver integration

### Development Tools
- **Vite** - Frontend build tool and dev server
- **esbuild** - Fast JavaScript bundler for production builds
- **TypeScript** - Static type checking
- **@replit/vite-plugin-runtime-error-modal** - Development error overlay
- **@replit/vite-plugin-cartographer** - Replit-specific development tooling

### Utilities
- **date-fns** - Date manipulation library
- **nanoid** - Unique ID generation
- **wouter** - Lightweight routing library