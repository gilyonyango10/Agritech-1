#!/bin/bash

# AgriTech Kenya Setup Script
echo "🌾 Setting up AgriTech Kenya Agricultural Marketplace..."

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    print_error "Python 3 is not installed. Please install Python 3.11+ first."
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

print_status "Setting up Backend..."

# Navigate to backend directory
cd backend/agritech

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    print_status "Creating Python virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
print_status "Activating virtual environment..."
source venv/bin/activate

# Install Python dependencies
print_status "Installing Python dependencies..."
pip install -r requirements.txt

# Create .env file if it doesn't exist
if [ ! -f ".env" ]; then
    print_status "Creating environment file..."
    cp .env.example .env
    print_status "Please edit .env file with your configuration"
fi

# Run migrations
print_status "Running database migrations..."
python manage.py makemigrations users
python manage.py makemigrations market
python manage.py migrate

# Create superuser (optional)
read -p "Do you want to create a superuser? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    python manage.py createsuperuser
fi

# Collect static files
print_status "Collecting static files..."
python manage.py collectstatic --noinput

print_success "Backend setup completed!"

# Navigate to frontend directory
cd ../../frontend/agritech-frontend

print_status "Setting up Frontend..."

# Install Node.js dependencies
print_status "Installing Node.js dependencies..."
npm install

print_success "Frontend setup completed!"

# Go back to root directory
cd ../../

print_success "🎉 AgriTech Kenya setup completed successfully!"
echo ""
echo "To start the development servers:"
echo ""
echo "Backend (Django):"
echo "  cd backend/agritech"
echo "  source venv/bin/activate"
echo "  python manage.py runserver"
echo ""
echo "Frontend (React):"
echo "  cd frontend/agritech-frontend"
echo "  npm start"
echo ""
echo "Or use Docker:"
echo "  docker-compose up --build"
echo ""
echo "Access the application:"
echo "  Frontend: http://localhost:3000"
echo "  Backend API: http://localhost:8000"
echo "  API Documentation: http://localhost:8000/"
echo ""
print_success "Happy farming! 🌾"
