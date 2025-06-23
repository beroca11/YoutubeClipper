# AI Video Clipper - Replit Documentation

## Overview

This is a full-stack web application that allows users to create video clips from YouTube videos using AI-powered analysis. The application analyzes YouTube videos to suggest optimal clip segments and provides manual editing capabilities for precise control over clip creation.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query (React Query) for server state management
- **UI Components**: Shadcn/ui with Radix UI primitives
- **Styling**: Tailwind CSS with custom YouTube-inspired color schemes
- **Form Handling**: React Hook Form with Zod validation

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ESM modules
- **Development**: TSX for TypeScript execution
- **API Design**: RESTful API with JSON responses
- **Error Handling**: Centralized error middleware
- **Request Logging**: Custom middleware for API request logging

### Database Layer
- **ORM**: Drizzle ORM for type-safe database operations
- **Database**: PostgreSQL (configured via Neon serverless)
- **Schema**: Strongly typed schema definitions with Zod validation
- **Migrations**: Drizzle Kit for schema management

## Key Components

### Data Models
1. **Videos Table**: Stores YouTube video metadata
   - YouTube ID, title, description, duration
   - Thumbnail URL, channel info, view count
   - Publish date and creation timestamp

2. **Clips Table**: Manages created video clips
   - References parent video, timing information
   - Quality settings, file metadata
   - Processing status tracking

3. **AI Suggestions Table**: Stores AI-generated clip recommendations
   - Time ranges with confidence scores
   - Categorization (highlight, action, scenic)
   - Associated video references

### Core Features
1. **YouTube URL Analysis**: Extracts video metadata using ytdl-core
2. **AI Clip Generation**: Generates intelligent clip suggestions based on video content
3. **Manual Clip Editor**: Provides precise control over clip timing and settings
4. **Processing Pipeline**: Handles clip creation with status tracking
5. **Download System**: Manages file generation and download links

### UI Components
- **Header/Footer**: Navigation and branding
- **URL Input**: YouTube URL validation and submission
- **Video Analysis**: Displays video metadata and thumbnails
- **AI Suggestions**: Interactive clip recommendation interface
- **Manual Editor**: Time-based clip creation controls
- **Processing Status**: Real-time progress tracking
- **Download Section**: File management and download interface

## Data Flow

1. **URL Input**: User submits YouTube URL
2. **Video Analysis**: Server extracts metadata using ytdl-core
3. **AI Processing**: System generates clip suggestions with confidence scores
4. **User Selection**: User chooses AI suggestion or creates manual clip
5. **Clip Processing**: Server processes video segment with status updates
6. **File Generation**: Creates downloadable clip file
7. **Download Delivery**: Provides secure download link to user

## External Dependencies

### Core Libraries
- **ytdl-core**: YouTube video information extraction
- **@neondatabase/serverless**: Database connectivity
- **@tanstack/react-query**: Client-side data fetching
- **drizzle-orm**: Type-safe database operations
- **wouter**: Lightweight routing
- **class-variance-authority**: Component variant management

### UI Libraries
- **@radix-ui/***: Accessible UI primitives
- **tailwindcss**: Utility-first CSS framework
- **lucide-react**: Icon library
- **react-hook-form**: Form management
- **zod**: Schema validation

### Development Tools
- **vite**: Build tool and dev server
- **typescript**: Type checking
- **tsx**: TypeScript execution
- **eslint**: Code linting
- **prettier**: Code formatting

## Deployment Strategy

### Development Environment
- **Platform**: Replit with Node.js 20
- **Database**: PostgreSQL 16 module
- **Dev Server**: Vite development server on port 5000
- **Hot Reload**: Enabled for both client and server

### Production Build
- **Client**: Vite build outputs to `dist/public`
- **Server**: esbuild bundles server code to `dist/index.js`
- **Deployment**: Autoscale deployment target
- **Port Configuration**: Internal port 5000, external port 80

### Build Process
1. Client assets built with Vite
2. Server code bundled with esbuild
3. Static assets served from dist/public
4. Express server handles API routes and SPA fallback

## User Preferences

Preferred communication style: Simple, everyday language.

## Changelog

Changelog:
- June 23, 2025. Initial setup