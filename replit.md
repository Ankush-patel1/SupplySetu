# SupplySetu - Smart Supply Chain Platform

## Overview

SupplySetu is a full-stack production-ready web application that connects street food vendors with suppliers through an AI-powered supply chain platform. The application serves two primary user types: vendors (street food sellers) and suppliers (who provide raw materials like vegetables, spices, grains, etc.).

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **State Management**: React Context for authentication and language state
- **Data Fetching**: TanStack React Query for server state management
- **UI Components**: Radix UI with custom design system based on shadcn/ui
- **Styling**: Tailwind CSS with custom color palette and design tokens
- **Build Tool**: Vite for development and production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js server
- **Language**: TypeScript with ES modules
- **API Design**: RESTful APIs with consistent error handling middleware
- **Request Processing**: JSON and URL-encoded body parsing
- **Development**: Hot reload with Vite integration in development mode

### Data Storage Solutions
- **Database**: PostgreSQL with Drizzle ORM
- **Schema**: Strongly typed database schema with Zod validation
- **Connection**: Neon Database serverless PostgreSQL
- **Migrations**: Drizzle Kit for schema migrations and management

## Key Components

### Authentication System
- Mobile number-based authentication with OTP verification
- Test number bypass for development (1122334455, 6677889900)
- Role-based access control (vendor/supplier)
- JWT-like session management with localStorage persistence

### Multilingual Support
- Hindi-first interface with English toggle
- React Context-based language management
- Comprehensive translation system covering all UI elements
- Culturally appropriate content presentation

### User Onboarding
- Role selection (vendor/supplier)
- Vendor-specific stall type selection (Chaat, Juice, South Indian)
- Business information collection
- Location and delivery zone setup

### AI-Powered Features
- Smart bundle recommendations based on stall type
- Automatic product categorization (perishables vs non-perishables)
- Delivery frequency optimization (weekly for perishables, monthly for non-perishables)

### Vendor Features
- Dashboard with supply management overview
- Bundle customization with quantity adjustments
- Supplier discovery with ratings and reviews
- Delivery calendar management
- Complaint center with image upload support
- Delivery pause functionality with configurable durations

### Supplier Features
- Product management with freshness tracking
- Order management and fulfillment
- Inventory tracking and stock level monitoring
- Delivery zone management

## Data Flow

### Authentication Flow
1. User enters mobile number
2. System checks for test numbers (bypass OTP)
3. OTP generation/verification (if not test number)
4. User creation or retrieval from database
5. Session establishment with role-based redirection

### Order Management Flow
1. Vendor selects/customizes bundles
2. System categorizes products by delivery frequency
3. Order creation with supplier assignment
4. Delivery scheduling based on product categories
5. Order fulfillment tracking
6. Complaint resolution system

### Product Discovery Flow
1. Vendor browses suppliers by location
2. Supplier filtering by ratings, freshness, and price
3. Product catalog with real-time stock levels
4. Bundle recommendation engine integration

## External Dependencies

### Core Technologies
- **Database**: Neon Database (PostgreSQL)
- **File Storage**: Firebase Storage for image uploads
- **UI Framework**: Radix UI primitives for accessibility
- **Styling**: Tailwind CSS with PostCSS processing

### Development Tools
- **Type Safety**: TypeScript with strict configuration
- **Code Quality**: ESLint integration through Vite
- **Package Management**: npm with lock file for reproducible builds

### Runtime Dependencies
- **HTTP Client**: Native fetch API with custom request wrapper
- **Date Handling**: date-fns for internationalized date formatting
- **Form Management**: React Hook Form with Zod resolvers
- **Icons**: Lucide React for consistent iconography

## Deployment Strategy

### Build Process
- **Frontend**: Vite production build with optimized assets
- **Backend**: esbuild compilation to ESM format
- **Type Checking**: TypeScript compilation verification
- **Asset Optimization**: Automatic code splitting and tree shaking

### Environment Configuration
- **Database**: Environment-based connection string configuration
- **Development**: Hot reload with Vite middleware integration
- **Production**: Optimized static asset serving with Express

### Scalability Considerations
- **Database**: Serverless PostgreSQL for automatic scaling
- **Frontend**: Static asset serving with potential CDN integration
- **Backend**: Stateless Express server for horizontal scaling
- **File Storage**: Firebase Storage for scalable image management

The application follows modern web development best practices with a focus on type safety, performance, and maintainability. The architecture supports both development efficiency and production scalability while maintaining a consistent user experience across different device types and languages.