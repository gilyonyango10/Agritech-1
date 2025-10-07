# 🌾 AgriTech Kenya - Agricultural Marketplace Management System

A comprehensive, production-ready agricultural marketplace that connects farmers directly with buyers across Kenya. Built with modern technologies and designed for scalability, security, and user experience.

## 🚀 Project Overview

**AgriTech Kenya** is a full-stack web application that empowers farmers and facilitates direct trade relationships between agricultural producers and buyers. The platform features role-based access control, location-based matching, real-time messaging, and comprehensive order management.

### ✨ Key Features

- **🔐 Authentication & Role Management**: JWT-based authentication with farmer, buyer, and admin roles
- **🌾 Product Management**: Comprehensive catalog with categories, images, and detailed product information
- **📍 Location-Based Matching**: Haversine algorithm for proximity-based product recommendations
- **🛒 Order Management**: Complete order lifecycle from cart to delivery tracking
- **💬 Messaging System**: In-app communication between buyers and sellers
- **⭐ Reviews & Ratings**: Product review system with rating aggregation
- **📊 Admin Dashboard**: Analytics and platform management tools
- **📱 Mobile-Responsive**: Modern, clean UI optimized for all devices

## 🏗️ Architecture

### Backend (Django REST Framework)
- **Framework**: Django 4.2+ with Django REST Framework
- **Authentication**: JWT with djoser integration
- **Database**: SQLite (development) / PostgreSQL (production)
- **API Documentation**: Swagger/OpenAPI with drf-yasg
- **Location**: `/home/maytor/Downloads/work/agritech/backend/agritech/`

### Frontend (React TypeScript)
- **Framework**: React 19.2.0 with TypeScript
- **Styling**: TailwindCSS with custom design system
- **State Management**: Zustand for global state
- **HTTP Client**: Axios with interceptors
- **Location**: `/home/maytor/Downloads/work/agritech/frontend/agritech-frontend/`

## 🛠️ Technology Stack

### Backend
- Django 4.2+
- Django REST Framework 3.14+
- JWT Authentication (djoser + simplejwt)
- PostgreSQL / SQLite
- Pillow (image handling)
- drf-yasg (API documentation)

### Frontend
- React 19.2.0
- TypeScript 4.9+
- TailwindCSS 3.3+
- Zustand (state management)
- React Router 6.20+
- Axios 1.6+
- React Hook Form 7.48+
- React Toastify 9.1+

### DevOps & Deployment
- Docker & Docker Compose
- Nginx (reverse proxy)
- Gunicorn (WSGI server)

## 🚀 Quick Start

### Prerequisites
- Python 3.11+
- Node.js 18+
- PostgreSQL (for production)

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd /home/maytor/Downloads/work/agritech/backend/agritech
   ```

2. **Create virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Environment setup**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

5. **Database setup**
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   python manage.py createsuperuser
   ```

6. **Run development server**
   ```bash
   python manage.py runserver
   ```

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd /home/maytor/Downloads/work/agritech/frontend/agritech-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm start
   ```

### Docker Deployment

1. **Build and run with Docker Compose**
   ```bash
   cd /home/maytor/Downloads/work/Agritech/agritech
   docker-compose up --build
   ```

## 📚 API Documentation

Once the backend is running, access the interactive API documentation:

- **Swagger UI**: http://localhost:8000/
- **ReDoc**: http://localhost:8000/redoc/
- **JSON Schema**: http://localhost:8000/api/schema/

### Key API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/auth/users/` | POST | User registration |
| `/auth/jwt/create/` | POST | Login (JWT) |
| `/api/market/products/` | GET/POST | Products CRUD |
| `/api/market/products/nearby/` | GET | Location-based products |
| `/api/market/orders/` | GET/POST | Order management |
| `/api/market/messages/` | GET/POST | Messaging system |
| `/api/market/reviews/` | GET/POST | Product reviews |
| `/api/market/analytics/` | GET | Admin analytics |

## 🎨 UI/UX Design

### Design System
- **Colors**: Green primary (#1B5E20), Yellow accents (#FDD835)
- **Typography**: Inter/Poppins font family
- **Components**: Modern card layouts, hover effects, smooth transitions
- **Mobile-First**: Responsive design for all screen sizes

### User Flows
1. **Registration**: Role selection (Farmer/Buyer) → Profile setup → Location
2. **Product Discovery**: Browse/Search → Filter by location/category → View details
3. **Order Process**: Add to cart → Checkout → Payment → Tracking
4. **Communication**: In-app messaging → Order coordination

## 🔧 Development

### Project Structure
```
agritech/
├── backend/agritech/          # Django backend
│   ├── agritech/             # Main Django project
│   ├── users/                # User management app
│   ├── market/               # Core marketplace app
│   ├── blogs/                # Blog functionality
│   └── requirements.txt      # Python dependencies
├── frontend/agritech-frontend/ # React frontend
│   ├── src/
│   │   ├── components/       # React components
│   │   ├── services/         # API services
│   │   ├── store/           # Zustand stores
│   │   └── App.tsx          # Main app component
│   └── package.json         # Node dependencies
└── docker-compose.yml       # Docker configuration
```

### Database Models
- **User**: Extended user model with roles and profiles
- **Product**: Agricultural products with categories and images
- **Order**: Order management with status tracking
- **Message**: In-app messaging system
- **Review**: Product rating and review system
- **Location**: Geographical data for proximity matching

## 🧪 Testing

### Backend Tests
```bash
cd backend/agritech
python manage.py test
```

### Frontend Tests
```bash
cd frontend/agritech-frontend
npm test
```

## 🚀 Deployment

### Production Environment Variables

```

### Docker Production
```bash
docker-compose -f docker-compose.prod.yml up -d
```

## 📊 Features Implemented

### ✅ Core Features
- [x] User authentication & role-based access control
- [x] Product catalog with categories and search
- [x] Location-based product matching (Haversine algorithm)
- [x] Shopping cart and order management
- [x] In-app messaging system
- [x] Product reviews and ratings
- [x] Admin dashboard with analytics
- [x] Responsive mobile-first design

### ✅ Technical Features
- [x] JWT authentication with auto-refresh
- [x] RESTful API with comprehensive documentation
- [x] Type-safe frontend with TypeScript
- [x] Modern UI with TailwindCSS
- [x] Docker containerization
- [x] Production-ready deployment configuration

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

## 📞 Support

For support, email contact@agritech.co.ke or create an issue in the repository.

---

**Made with ❤️ for Kenyan farmers and the agricultural community**

