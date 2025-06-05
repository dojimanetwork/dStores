# Web3 Stores - Complete E-commerce Builder

A powerful Next.js application for building modern e-commerce stores with multiple templates, advanced features, and seamless integrations.

![Web3 Stores](https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&h=600&fit=crop)

## ⚡ Quick Start (One-Liner)

```bash
git clone https://github.com/yourusername/web3-stores.git && cd web3-stores && chmod +x install.sh && ./install.sh
```

**Requirements**: Node.js 18+, PostgreSQL

## 🚀 Features

### 🎨 **12+ Professional Templates**
- **Nexus Futuristic** - Cyberpunk-inspired design with neon effects
- **Lumina Glow** - Luxury minimalist template with elegant animations
- **Velocity Interactive** - Dynamic template with Flash-era nostalgia
- **Aurora AI Art** - AI-powered digital art gallery theme
- **Zenith Minimal** - Clean, sophisticated minimalist design
- **Prisma 3D Surreal** - Geometric shapes and surreal aesthetics
- **Avenda Skincare** - Beauty and wellness focused template
- **Bella Fashion** - Modern fashion and apparel store
- **Pro Store Marketplace** - Professional marketplace template
- **Tech Gadgets** - Technology and electronics focused
- **Modern Dropshipping** - Versatile e-commerce template
- **Minimal Zen** - Ultra-clean minimalist design

### 🛠️ **Core Features**
- ✅ **Complete E-commerce Solution** - Products, cart, checkout, orders
- ✅ **Template Preview System** - Live preview before selection
- ✅ **Product Management** - Full CRUD operations with image support
- ✅ **Shopping Cart & Checkout** - Dynamic cart with real-time calculations
- ✅ **Order Management** - Complete order lifecycle tracking
- ✅ **Payment Processing** - Integrated payment system (ready for Stripe)
- ✅ **Responsive Design** - Mobile-first responsive templates
- ✅ **Store Analytics** - Product statistics and performance metrics
- ✅ **Admin Dashboard** - Comprehensive store management interface

### 🔧 **Technical Stack**
- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **Backend**: Next.js API routes, PostgreSQL
- **Database**: PostgreSQL with comprehensive schema
- **Styling**: Tailwind CSS with custom animations
- **State Management**: React hooks and localStorage
- **Authentication**: JWT-based authentication system

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js 18+** - [Download here](https://nodejs.org/)
- **PostgreSQL** - [Download here](https://www.postgresql.org/download/)
- **Git** - [Download here](https://git-scm.com/)

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/web3-stores.git
cd web3-stores
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Create a `.env.local` file in the root directory:

```env
# Database Configuration
DATABASE_URL=postgresql://username:password@localhost:5432/web3_stores

# Authentication (Generate secure random strings)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

# Application URLs
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:3000/api

# Development Settings
NODE_ENV=development
```

### 4. Database Setup

#### Option A: Automatic Setup (Recommended)
```bash
# Create PostgreSQL database
createdb web3_stores

# Initialize database with sample data
npm run db:init
```

#### Option B: Manual Setup
1. Create a PostgreSQL database named `web3_stores`
2. Update the `DATABASE_URL` in your `.env.local` file
3. The database tables will be created automatically when you first run the app

### 5. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🎯 Usage Guide

### 1. **Dashboard Overview**
- Navigate to the main dashboard at `http://localhost:3000/dashboard`
- View store statistics and quick actions
- Access template builder and management tools

### 2. **Template Selection**
- Go to **Template Builder** from the dashboard
- Browse through 12+ professional templates
- Use **Preview Template** to see live demos
- Click **Select Template** to start customizing

### 3. **Template Preview**
- Each template includes:
  - **Home page** with hero section and featured products
  - **Products page** with search, filtering, and pagination
  - **Cart & Checkout** with dynamic calculations
  - **Responsive design** for all devices

### 4. **Quick Template Access**
You can directly access any template:
- **Nexus**: `http://localhost:3000/dashboard/templates/nexus-futuristic`
- **Lumina**: `http://localhost:3000/dashboard/templates/lumina-glow`
- **Velocity**: `http://localhost:3000/dashboard/templates/velocity-interactive`
- **Aurora**: `http://localhost:3000/dashboard/templates/aurora-ai-art`
- **Zenith**: `http://localhost:3000/dashboard/templates/zenith-minimal`
- **Prisma**: `http://localhost:3000/dashboard/templates/prisma-3d-surreal`

### 5. **E-commerce Features**
- **Product Catalog**: Browse products with search and filtering
- **Shopping Cart**: Add/remove items with quantity management
- **Checkout Process**: 4-step checkout with shipping and payment
- **Order Management**: Track orders with status updates

## 📁 Project Structure

```
web3-stores/
├── components/          # Reusable React components
│   ├── DynamicTemplate.tsx    # Main template renderer
│   ├── TemplateSelection.tsx  # Template selection interface
│   └── templatesData.ts       # Template configurations
├── pages/               # Next.js pages
│   ├── api/            # API routes
│   ├── dashboard/      # Dashboard pages
│   └── templates/      # Template preview pages
├── lib/                # Utility functions
│   ├── database.ts     # Database operations
│   └── utils.ts        # Helper functions
├── styles/             # Global styles
├── public/             # Static assets
└── scripts/            # Database setup scripts
```

## 🎨 Available Templates

| Template | Style | Use Case |
|----------|--------|----------|
| **Nexus** | Futuristic/Cyberpunk | Tech, Gaming, Digital Products |
| **Lumina** | Luxury Minimal | Premium Brands, Jewelry, Beauty |
| **Velocity** | Interactive/Dynamic | Fashion, Sports, Lifestyle |
| **Aurora** | AI Art Gallery | Digital Art, NFTs, Creative |
| **Zenith** | Clean Minimal | Professional, B2B, Services |
| **Prisma** | 3D Surreal | Art, Design, Creative Agencies |
| **Avenda** | Skincare Focus | Beauty, Wellness, Health |
| **Bella** | Fashion Forward | Clothing, Accessories, Lifestyle |
| **Pro Store** | Marketplace | Multi-vendor, Professional |
| **Tech Gadgets** | Technology | Electronics, Gadgets, Tech |

## 📊 API Endpoints

### Products
- `GET /api/products` - Get all products
- `GET /api/templates/[templateId]/products` - Get template products

### Templates
- `GET /api/templates/[templateId]` - Get template data

### Store Configuration
- `GET /api/stores/config` - Get store settings

## 🛠️ Development

### Available Scripts

```bash
# Development
npm run dev          # Start development server with Turbopack
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

# Database
npm run db:init      # Initialize database with schema and sample data
npm run db:migrate   # Run database migrations
```

### Database Schema

The application uses PostgreSQL with the following main tables:

- **users** - User accounts and authentication
- **stores** - Individual stores/websites  
- **products** - Product catalog with variants
- **orders** - Order management and tracking
- **api_keys** - External service integrations
- **deployments** - Deployment tracking

## 🔒 Authentication & Security

- JWT-based authentication system
- Password hashing with bcryptjs
- Protected API routes
- Role-based permissions
- Secure environment variable handling

## 🎨 Customization

### Adding New Templates

1. Create template function in `components/DynamicTemplate.tsx`
2. Add template configuration in `components/templatesData.ts`
3. Create template page in `pages/dashboard/templates/`

### Styling

- Uses Tailwind CSS for styling
- Custom animations and effects
- Responsive design patterns
- Dark/light mode support (where applicable)

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy automatically

### Manual Deployment

```bash
# Build the application
npm run build

# Start production server
npm run start
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues:

1. Check the [Issues](https://github.com/yourusername/web3-stores/issues) page
2. Search for existing solutions
3. Create a new issue with detailed information

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Tailwind CSS for the utility-first CSS framework
- Unsplash for providing high-quality images
- All contributors who helped build this project

---

**Built with ❤️ using Next.js, TypeScript, and Tailwind CSS**
