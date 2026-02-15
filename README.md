# SlotMe - AI-Powered Salon Booking Platform

SlotMe is a multitenant AI-powered virtual administrator platform for beauty salons, replacing the need for a dedicated receptionist by automating appointment booking, calendar management, client communication, and slot optimization.

## Technology Stack

### Backend
- **Framework**: Spring Boot 3.4.2 + Java 21
- **Database**: PostgreSQL with Flyway migrations
- **Cache**: Redis
- **AI**: Spring AI + OpenAI (GPT-4)
- **Authentication**: JWT (RS256)
- **Architecture**: Multi-tenant with Row-Level Security

### Frontend
- **Framework**: React 19 + TypeScript
- **Build Tool**: Vite
- **Routing**: TanStack Router
- **State Management**: Zustand + TanStack Query
- **UI**: shadcn/ui + Tailwind CSS 4
- **Testing**: Playwright

## Features

- ✅ Multi-tenant salon management
- ✅ AI-powered conversational booking (WhatsApp integration)
- ✅ Master/Staff scheduling with conflict detection
- ✅ Service catalog management
- ✅ Client management with visit history
- ✅ Real-time availability calculation
- ✅ Automated notifications & reminders
- ✅ Calendar views (day/week/month)
- ✅ Mobile-responsive admin & master dashboards
- ✅ Analytics & reporting

## Local Development

### Prerequisites
- Java 21
- Node.js 18+ with pnpm
- PostgreSQL 15+
- Redis 7+
- Docker & Docker Compose (optional)

### Backend Setup

```bash
cd backend

# Using Docker Compose (recommended)
docker-compose up -d

# Or manually start PostgreSQL and Redis, then:
./gradlew bootRun
```

Backend runs on: http://localhost:8080

### Frontend Setup

```bash
cd frontend
pnpm install
pnpm dev
```

Frontend runs on: http://localhost:3033

### Environment Variables

**Backend** (`backend/src/main/resources/application.yml`):
- `OPENAI_API_KEY` - OpenAI API key for AI features
- `JWT_SECRET_KEY` - JWT signing secret (256+ bits)
- `WHATSAPP_ACCESS_TOKEN` - WhatsApp Business API token
- `WHATSAPP_PHONE_NUMBER_ID` - WhatsApp phone number ID
- `WHATSAPP_APP_SECRET` - WhatsApp app secret
- `DATABASE_URL` - PostgreSQL connection URL
- `REDIS_HOST` - Redis host

**Frontend** (`frontend/.env`):
- `VITE_API_BASE_URL` - Backend API URL (default: http://localhost:8080)

## Deployment

### Heroku Deployment

#### Backend

```bash
# Login to Heroku
heroku login

# Create Heroku app
heroku create slotme-api

# Add PostgreSQL and Redis
heroku addons:create heroku-postgresql:mini
heroku addons:create heroku-redis:mini

# Set environment variables
heroku config:set SPRING_PROFILES_ACTIVE=prod
heroku config:set OPENAI_API_KEY=your_openai_key
heroku config:set JWT_SECRET_KEY=$(openssl rand -base64 64)
heroku config:set CORS_ALLOWED_ORIGINS=https://your-frontend.herokuapp.com

# Deploy
git push heroku main
```

#### Frontend

```bash
cd frontend

# Create frontend app
heroku create slotme-frontend

# Set buildpack
heroku buildpacks:set heroku/nodejs

# Set environment variable
heroku config:set VITE_API_BASE_URL=https://slotme-api.herokuapp.com

# Deploy frontend separately or use static site hosting
```

## API Documentation

Once running, API documentation is available at:
- Swagger UI: http://localhost:8080/swagger-ui.html
- OpenAPI Spec: http://localhost:8080/api-docs

## Database Migrations

Migrations are managed with Flyway and run automatically on startup.

Located in: `backend/src/main/resources/db/migration/`

## Testing

### Backend Tests
```bash
cd backend
./gradlew test
```

### Frontend E2E Tests
```bash
cd frontend
pnpm test:e2e
```

## Project Structure

```
slotme-app/
├── backend/               # Spring Boot backend
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/slotme/
│   │   │   │   ├── auth/         # Authentication & JWT
│   │   │   │   ├── tenant/       # Multi-tenancy
│   │   │   │   ├── salon/        # Salon management
│   │   │   │   ├── master/       # Staff/Master management
│   │   │   │   ├── service/      # Service catalog
│   │   │   │   ├── client/       # Client management
│   │   │   │   ├── appointment/  # Booking engine
│   │   │   │   ├── calendar/     # Availability & calendar
│   │   │   │   ├── messaging/    # WhatsApp integration
│   │   │   │   ├── conversation/ # AI conversation engine
│   │   │   │   ├── notification/ # Notifications & reminders
│   │   │   │   └── analytics/    # Analytics
│   │   │   └── resources/
│   │   │       └── db/migration/ # Flyway migrations
│   │   └── test/
│   ├── build.gradle.kts
│   └── docker-compose.yml
├── frontend/              # React frontend
│   ├── src/
│   │   ├── app/routes/   # TanStack Router routes
│   │   ├── components/   # React components
│   │   ├── stores/       # Zustand stores
│   │   ├── lib/api/      # API client
│   │   └── types/        # TypeScript types
│   ├── e2e/              # Playwright E2E tests
│   ├── package.json
│   └── vite.config.ts
└── docs/                 # Project documentation
    ├── PRD.md
    ├── ARCHITECTURE.md
    ├── BACKEND_SPEC.md
    ├── FRONTEND_SPEC.md
    └── STORIES.md
```

## Contributing

1. Create a feature branch
2. Make your changes
3. Write tests
4. Submit a pull request

## License

Proprietary - All rights reserved

## Support

For issues and questions, please open an issue on GitHub.
