#!/bin/bash

# Web3 Stores - Installation Script
# This script helps set up the Web3 Stores project automatically

echo "🚀 Web3 Stores - Installation Script"
echo "======================================"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    echo "   Download from: https://nodejs.org/"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ $NODE_VERSION -lt 18 ]; then
    echo "❌ Node.js version $NODE_VERSION is too old. Please install Node.js 18+."
    exit 1
fi

echo "✅ Node.js $(node -v) found"

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo "❌ PostgreSQL is not installed. Please install PostgreSQL first."
    echo "   Download from: https://www.postgresql.org/download/"
    exit 1
fi

echo "✅ PostgreSQL found"

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed"

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo ""
    echo "⚙️  Creating environment configuration..."
    
    # Create .env.local file
    cat > .env.local << EOF
# Database Configuration
DATABASE_URL=postgresql://postgres:password@localhost:5432/web3_stores

# Authentication (Generate secure random strings)
JWT_SECRET=$(openssl rand -base64 32)
JWT_EXPIRES_IN=7d

# Application URLs
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:3000/api

# Development Settings
NODE_ENV=development
EOF

    echo "✅ Environment configuration created (.env.local)"
    echo "⚠️  Please update the DATABASE_URL with your PostgreSQL credentials"
else
    echo "✅ Environment configuration already exists"
fi

# Database setup
echo ""
echo "🗄️  Setting up database..."

# Ask user for database setup
read -p "Do you want to create the database automatically? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "Creating database 'web3_stores'..."
    createdb web3_stores 2>/dev/null
    
    if [ $? -eq 0 ]; then
        echo "✅ Database created successfully"
    else
        echo "⚠️  Database might already exist or check your PostgreSQL connection"
    fi
    
    # Initialize database
    echo "Initializing database with sample data..."
    npm run db:init
    
    if [ $? -eq 0 ]; then
        echo "✅ Database initialized successfully"
    else
        echo "❌ Failed to initialize database. Please check your DATABASE_URL in .env.local"
        exit 1
    fi
else
    echo "⚠️  Please create the database manually and run 'npm run db:init'"
fi

echo ""
echo "🎉 Installation completed successfully!"
echo ""
echo "🚀 To start the development server:"
echo "   npm run dev"
echo ""
echo "📖 Then visit: http://localhost:3000"
echo ""
echo "🎨 Available templates:"
echo "   • Dashboard: http://localhost:3000/dashboard"
echo "   • Template Builder: http://localhost:3000/dashboard/build/templates"
echo "   • Nexus Template: http://localhost:3000/dashboard/templates/nexus-futuristic"
echo ""
echo "📚 For more information, check README.md or SETUP.md" 