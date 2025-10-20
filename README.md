# Cybersecurity Task Manager

A full-stack task management application built with Laravel (backend) and React (frontend), designed with security best practices.

## 🚀 Quick Start

### Prerequisites

- Docker and Docker Compose
- Git

### Setup

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd cybersecurity-task-manager
   ```

2. **Configure environment variables:**
   ```bash
   # Copy Docker environment template
   cp docker.env.example docker.env
   # Edit docker.env with your preferred credentials
   
   # Copy backend environment template
   cp backend/.env.example backend/.env
   # Edit backend/.env with your database and app settings
   
   # Copy frontend environment template (if needed)
   cp frontend/.env.example frontend/.env
   # Edit frontend/.env with your API URL and other settings
   ```

3. **Start the application:**
   ```bash
   docker-compose --env-file docker.env up -d
   ```

4. **Access the application:**
   - Frontend: http://localhost:8888
   - Backend API: http://localhost:8888/api
   - Direct Backend: http://localhost:8000
   - Docs: http://localhost:8000/api/documentation

## 🔒 Security Features

- **Environment-based configuration** - No hardcoded secrets
- **JWT authentication** with configurable TTL
- **CORS protection** with configurable origins
- **Input validation** using Laravel Form Requests
- **SQL injection protection** via Eloquent ORM
- **XSS protection** with proper output escaping
- **CSRF protection** for web routes
- **Rate limiting** on authentication endpoints

## 📁 Project Structure

```
├── backend/                 # Laravel API
│   ├── app/
│   │   ├── Http/Controllers/
│   │   ├── Models/
│   │   ├── Policies/
│   │   └── Resources/
│   ├── database/
│   └── routes/
├── frontend/               # React Application
│   ├── src/
│   │   ├── components/
│   │   ├── contexts/
│   │   ├── hooks/
│   │   └── types/
│   └── public/
├── docker/                 # Docker configurations
│   ├── nginx/
│   ├── php/
│   └── mysql/
├── docker-compose.yml      # Multi-service setup
├── docker.env.example      # Environment template
└── SECURITY.md            # Security documentation
```

## 🛠️ Development

### Backend (Laravel)

- **Framework:** Laravel 11
- **Database:** MySQL 8.0
- **Cache/Sessions:** Redis
- **Authentication:** JWT (tymon/jwt-auth)
- **API Documentation:** Swagger (L5-Swagger)

### Frontend (React)

- **Framework:** React 19 with TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **State Management:** React Context API
- **Form Handling:** React Hook Form + Zod
- **HTTP Client:** Axios

## 🔧 Configuration

### Environment Variables

The application uses three environment files:

1. **`docker.env`** - Docker Compose environment variables (copy from `docker.env.example`)
2. **`backend/.env`** - Laravel application configuration (copy from `backend/.env.example`)
3. **`frontend/.env`** - React application configuration (copy from `frontend/.env.example`)

**Critical security variables in `docker.env`:**
- `DB_PASSWORD` - Database password
- `MYSQL_ROOT_PASSWORD` - MySQL root password  
- `JWT_SECRET` - JWT signing secret

**Important variables in `backend/.env`:**
- `DB_*` - Database connection settings
- `APP_KEY` - Laravel application key (auto-generated)
- `JWT_SECRET` - JWT signing secret

**Important variables in `frontend/.env`:**
- `VITE_API_URL` - Backend API URL

### Database

The application uses MySQL with the following default configuration:
- **Database:** `task_manager`
- **User:** `task_user`
- **Port:** `3307` (mapped from container port 3306)

### Redis

Redis is used for caching and session storage:
- **Port:** `6379`
- **No authentication** (development only)

## 📚 API Documentation

API documentation is available at:
- **OpenAPI JSON:** http://localhost:8000/api-docs.json

## 🧪 Testing

### Backend Tests
```bash
docker-compose exec backend php artisan test
```

### Frontend Tests
```bash
docker-compose exec frontend npm test
```