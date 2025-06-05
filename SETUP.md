# Web3 Stores - Technical Setup Guide

## Overview

Web3 Stores is a complete e-commerce builder with 12+ professional templates, built using Next.js 15, React 19, and PostgreSQL.

## Prerequisites

### Required Software
- **Node.js 18+** - [Download](https://nodejs.org/)
- **PostgreSQL 12+** - [Download](https://www.postgresql.org/download/)
- **Git** - [Download](https://git-scm.com/)

### Recommended Tools
- **pgAdmin** or **DBeaver** for database management
- **VSCode** with TypeScript extensions
- **Postman** for API testing

## Environment Configuration

Create a `.env.local` file in the root directory:

```env
# Database Configuration
DATABASE_URL=postgresql://username:password@localhost:5432/web3_stores

# Authentication
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

# Application URLs
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:3000/api

# Development Settings
NODE_ENV=development

# Optional: Payment Integration (for future use)
STRIPE_PUBLIC_KEY=pk_test_your_stripe_public_key
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key

# Optional: AI Features (for future use)
OPENAI_API_KEY=sk-your-openai-api-key
```

## Installation Steps

### 1. Clone and Install
```bash
git clone https://github.com/yourusername/web3-stores.git
cd web3-stores
npm install
```

### 2. Database Setup

#### Option A: Using PostgreSQL CLI
```bash
# Create database
createdb web3_stores

# Initialize with sample data
npm run db:init
```

#### Option B: Using pgAdmin or GUI
1. Create a new database named `web3_stores`
2. Update the `DATABASE_URL` in `.env.local`
3. Run `npm run db:init`

#### Option C: Manual SQL Setup
```sql
-- Connect to PostgreSQL and run:
CREATE DATABASE web3_stores;
```

### 3. Start Development
```bash
npm run dev
```

Access the application at `http://localhost:3000`

## Database Schema

The application automatically creates the following tables:

### Core Tables
```sql
-- Users table
users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)

-- Stores table
stores (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  name VARCHAR(255) NOT NULL,
  domain VARCHAR(255) UNIQUE,
  subdomain VARCHAR(255) UNIQUE,
  template_id VARCHAR(255),
  settings JSONB DEFAULT '{}',
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)

-- Products table
products (
  id SERIAL PRIMARY KEY,
  store_id INTEGER REFERENCES stores(id),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  images JSONB DEFAULT '[]',
  sku VARCHAR(255),
  stock_quantity INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)

-- Orders table
orders (
  id SERIAL PRIMARY KEY,
  store_id INTEGER REFERENCES stores(id),
  customer_email VARCHAR(255) NOT NULL,
  customer_name VARCHAR(255),
  customer_address JSONB,
  total_amount DECIMAL(10,2) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  payment_method VARCHAR(50),
  payment_status VARCHAR(50) DEFAULT 'pending',
  items JSONB NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
```

## Application Architecture

### Frontend Structure
```
pages/
├── dashboard/              # Admin dashboard
│   ├── index.tsx          # Dashboard home
│   ├── build/templates.tsx # Template selection
│   └── templates/         # Template previews
├── api/                   # API routes
│   ├── products/          # Product management
│   ├── templates/         # Template data
│   └── stores/           # Store configuration
└── index.tsx             # Landing page
```

### Component Architecture
```
components/
├── DynamicTemplate.tsx    # Main template renderer
├── TemplateSelection.tsx  # Template chooser
├── templatesData.ts       # Template definitions
└── DashboardLayout.tsx    # Admin layout
```

## Available Templates

### Production Ready Templates
1. **Nexus Futuristic** - `/dashboard/templates/nexus-futuristic`
2. **Lumina Glow** - `/dashboard/templates/lumina-glow`
3. **Velocity Interactive** - `/dashboard/templates/velocity-interactive`
4. **Aurora AI Art** - `/dashboard/templates/aurora-ai-art`
5. **Zenith Minimal** - `/dashboard/templates/zenith-minimal`
6. **Prisma 3D Surreal** - `/dashboard/templates/prisma-3d-surreal`
7. **Avenda Skincare** - Template with complete e-commerce flow
8. **Bella Fashion** - Fashion-focused template
9. **Pro Store Marketplace** - Professional marketplace design
10. **Tech Gadgets** - Technology products template
11. **Modern Dropshipping** - Versatile e-commerce template
12. **Minimal Zen** - Ultra-clean design

### Template Features
- ✅ Complete product catalog
- ✅ Shopping cart functionality
- ✅ Checkout process (4 steps)
- ✅ Order management
- ✅ Responsive design
- ✅ Search and filtering
- ✅ Real-time cart updates
- ✅ Mobile-optimized

## API Endpoints

### Product Management
```bash
GET    /api/products?storeId=1                    # Get all products
GET    /api/templates/[templateId]/products       # Get template products
POST   /api/products                              # Create product
PUT    /api/products/[id]                         # Update product
DELETE /api/products/[id]                         # Delete product
```

### Template System
```bash
GET    /api/templates/[templateId]                # Get template data
GET    /api/stores/config?storeId=1               # Get store configuration
```

### Store Management
```bash
GET    /api/stores                                # Get user stores
POST   /api/stores                                # Create store
PUT    /api/stores/[id]                           # Update store
```

## Development Workflow

### Local Development
```bash
npm run dev          # Start with Turbopack
npm run build        # Production build
npm run start        # Production server
npm run lint         # Code linting
```

### Database Management
```bash
npm run db:init      # Initialize with sample data
npm run db:migrate   # Run migrations (if available)
```

### Sample Data
The system automatically creates:
- Demo user account (ID: 1)
- Demo store (ID: 1) 
- 12+ sample products with images
- All necessary relationships

## Features Implemented

### ✅ Core E-commerce
- Product catalog with images
- Shopping cart with localStorage
- Multi-step checkout process
- Order placement and tracking
- Inventory management
- Search and filtering

### ✅ Template System
- 12+ professional templates
- Live preview system
- Template selection interface
- Responsive design across all templates
- Dynamic navigation between pages

### ✅ Admin Dashboard
- Store statistics and analytics
- Product management interface
- Template builder access
- Quick actions and navigation

### ✅ Technical Features
- TypeScript for type safety
- Tailwind CSS for styling
- PostgreSQL for data persistence
- Next.js API routes
- React 19 with hooks
- Mobile-responsive design

## Troubleshooting

### Common Issues

1. **Database Connection Errors**
   ```bash
   # Check PostgreSQL service is running
   sudo service postgresql start
   
   # Verify database exists
   psql -l | grep web3_stores
   ```

2. **Port 3000 Already in Use**
   ```bash
   # Kill process on port 3000
   kill -9 $(lsof -ti:3000)
   
   # Or use different port
   npm run dev -- -p 3001
   ```

3. **Environment Variables**
   - Ensure `.env.local` exists in root directory
   - Check database URL format
   - Restart development server after changes

### Database Reset
```bash
# Drop and recreate database
dropdb web3_stores
createdb web3_stores
npm run db:init
```

## Deployment Ready

The application is ready for deployment with:
- Production build optimization
- Environment variable configuration
- Database schema management
- Static file optimization
- API route protection

## Next Steps

1. **Set up authentication** - Implement user registration/login
2. **Add payment processing** - Integrate Stripe or similar
3. **Deploy to production** - Use Vercel, Netlify, or custom server
4. **Add custom domains** - Configure DNS and SSL
5. **Implement analytics** - Track user behavior and sales

---

For additional help, check the main [README.md](./README.md) or create an issue in the repository. 