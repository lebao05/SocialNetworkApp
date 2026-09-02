# 🌐 Social Network Application

A full-stack social networking platform built with **ASP.NET Core 10.0** backend and **React 19** frontend. The application features real-time messaging, posts, stories, reels, friend management, groups, and video calling capabilities.

## Demo Account
- You can use account lgbaowork05@gmail.com with password 00000000@a for both user and admin account for data-diversified demo.


## 📋 Table of Contents

- [Features](#-features)
- [Architecture](#-architecture)
- [Technology Stack](#-technology-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Configuration](#-configuration)
- [Deployment](#-deployment)
- [API Documentation](#-api-documentation)
- [Contributing](#-contributing)

---

## ✨ Features

### Core Features
- 🔐 **Authentication & Authorization** - JWT-based authentication with role management
- 👤 **User Profiles** - Customizable profiles with avatars and cover photos
- 📝 **Posts & Feed** - Create, like, comment, and share posts
- 💬 **Real-time Messaging** - One-on-one and group conversations using SignalR
- 📱 **Stories** - Temporary content sharing (24-hour expiration)
- 🎥 **Reels** - Short-form video content
- 📞 **Video Calling** - WebRTC-based video and audio calls
- 👥 **Friend Management** - Send/accept friend requests, manage friendships
- 🏢 **Groups** - Create and join communities
- 🔔 **Notifications** - Real-time push notifications
- 🔍 **Search** - Search users, posts, and groups
- 📊 **Admin Dashboard** - Content moderation and user management
- 🎂 **Birthdays** - Birthday reminders and notifications
- 💾 **Saved Posts** - Bookmark posts for later viewing
- 🚨 **Reporting System** - Report inappropriate content

### Technical Features
- Real-time communication via SignalR WebSocket hubs
- Graph database (Neo4j) for friend relationships and recommendations
- PostgreSQL for relational data storage
- Cloudinary integration for media uploads
- Email notifications via SMTP
- Clean Architecture with CQRS pattern

---

## 🏗️ Architecture

This project follows **Clean Architecture** principles with **CQRS (Command Query Responsibility Segregation)** pattern using MediatR.

### Architecture Layers

```
┌─────────────────────────────────────────────────────────┐
│                    Presentation Layer                    │
│              (Web API + MVC Admin Panel)                 │
│                  Controllers, SignalR                    │
└────────────────────┬────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────┐
│                  Application Layer                       │
│         Commands, Queries, Handlers, DTOs                │
│              MediatR, FluentValidation                   │
└────────────────────┬────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────┐
│                Infrastructure Layer                      │
│    Repositories, EF Core, Neo4j, Cloudinary, JWT        │
└────────────────────┬────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────┐
│                    Domain Layer                          │
│              Entities, Value Objects, Events             │
└─────────────────────────────────────────────────────────┘
```

### Key Patterns

- **CQRS**: Separate read and write operations using Commands and Queries
- **Mediator Pattern**: Decoupled request/response handling via MediatR
- **Repository Pattern**: Data access abstraction
- **Unit of Work**: Transaction management
- **Dependency Injection**: ASP.NET Core built-in DI container
- **Domain Events**: Event-driven architecture for cross-cutting concerns

---

## 🛠️ Technology Stack

### Backend
| Technology | Purpose |
|------------|---------|
| **ASP.NET Core 10.0** | Web API framework |
| **Entity Framework Core 10** | ORM for PostgreSQL |
| **MediatR 14** | CQRS implementation |
| **SignalR** | Real-time WebSocket communication |
| **Neo4j 6.1** | Graph database for social connections |
| **PostgreSQL** | Relational database (via Supabase) |
| **JWT Bearer** | Token-based authentication |
| **FluentValidation 12** | Request validation |
| **Serilog 4** | Structured logging |
| **Cloudinary** | Media storage and processing |
| **MailKit 4** | Email service |
| **Swashbuckle** | OpenAPI/Swagger documentation |

### Frontend
| Technology | Purpose |
|------------|---------|
| **React 19** | UI framework |
| **Vite 7** | Build tool and dev server |
| **React Router DOM 7** | Client-side routing |
| **Axios 1.14** | HTTP client |
| **SignalR Client** | WebSocket client |
| **Zustand 5** | State management |
| **Tailwind CSS 4** | Utility-first CSS |
| **Lucide React** | Icon library |
| **Emoji Picker React** | Emoji support |

### DevOps & Deployment
- **Docker** - Containerization
- **Render** - Backend hosting
- **Vercel** - Frontend hosting
- **Supabase** - PostgreSQL hosting
- **Neo4j Aura** - Managed Neo4j hosting

---

## 📁 Project Structure

```
SocialNetworkApp/
├── src/
│   ├── Domain/                    # Core business entities
│   │   ├── Entities/             # Domain models (User, Post, Message, etc.)
│   │   ├── Events/               # Domain events
│   │   └── Enums/                # Enumerations
│   │
│   ├── Application/              # Business logic layer
│   │   ├── Abstractions/         # Interfaces
│   │   │   ├── Messaging/       # CQRS interfaces
│   │   │   └── Repositories/    # Repository contracts
│   │   ├── Users/               # User-related CQRS handlers
│   │   ├── Posts/               # Post-related CQRS handlers
│   │   ├── Messages/            # Messaging CQRS handlers
│   │   ├── Conversations/       # Conversation handlers
│   │   ├── Friends/             # Friendship logic
│   │   ├── Groups/              # Group management
│   │   ├── Notifications/       # Notification handlers
│   │   └── Behaviors/           # MediatR pipeline behaviors
│   │
│   ├── Infrastructure/           # External dependencies
│   │   ├── Persistence/         # Database contexts and repositories
│   │   │   ├── Contexts/       # EF Core DbContext
│   │   │   └── Repositories/   # Repository implementations
│   │   ├── Services/            # External service integrations
│   │   │   ├── CloudinaryService  # Media upload
│   │   │   ├── SmtpEmailService   # Email
│   │   │   ├── JwtTokenService    # JWT generation
│   │   │   └── Neo4jService       # Graph database
│   │   ├── SignalR/             # SignalR hubs
│   │   │   ├── ChatHub
│   │   │   ├── CallHub
│   │   │   └── NotificationHub
│   │   └── Migrations/          # EF Core migrations
│   │
│   ├── Presentation/             # API controllers layer
│   │   ├── Controllers/         # REST API endpoints
│   │   │   ├── AuthController
│   │   │   ├── PostController
│   │   │   ├── MessageController
│   │   │   ├── FriendController
│   │   │   ├── GroupController
│   │   │   ├── NotificationController
│   │   │   ├── ReelController
│   │   │   ├── StoryController
│   │   │   └── AdminController
│   │   └── Middleware/          # Custom middleware
│   │
│   ├── Web/                      # ASP.NET Core host
│   │   ├── Program.cs           # Application entry point
│   │   ├── appsettings.json     # Configuration
│   │   └── Views/               # MVC views for admin panel
│   │       └── Admin/           # Admin dashboard
│   │
│   └── ReactWeb/                 # React frontend
│       ├── src/
│       │   ├── components/      # Reusable UI components
│       │   ├── pages/           # Page components
│       │   ├── contexts/        # React context providers
│       │   ├── stores/          # Zustand stores
│       │   ├── apis/            # API client configuration
│       │   ├── hubs/            # SignalR hub connections
│       │   └── App.jsx          # Main app component
│       ├── public/              # Static assets
│       └── index.html           # HTML entry point
│
├── Dockerfile                    # Docker configuration
├── render.yaml                   # Render deployment config
└── .env.render                   # Environment variables template
```

---

## 🚀 Getting Started

### Prerequisites

- **.NET 10.0 SDK** - [Download](https://dotnet.microsoft.com/download/dotnet/10.0)
- **Node.js 20+** - [Download](https://nodejs.org/)
- **PostgreSQL** (or Supabase account)
- **Neo4j** (or Neo4j Aura account)
- **Cloudinary account** (for media uploads)

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/social-network-app.git
   cd social-network-app
   ```

2. **Configure appsettings.json**
   ```bash
   cd src/Web
   # Edit appsettings.json with your credentials
   ```

3. **Run database migrations**
   ```bash
   dotnet ef database update --project src/Infrastructure --startup-project src/Web
   ```

4. **Run the backend**
   ```bash
   cd src/Web
   dotnet run
   ```
   Backend will be available at `https://localhost:7065`

### Frontend Setup

1. **Navigate to React project**
   ```bash
   cd src/ReactWeb
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   # Edit .env file with your backend URL
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```
   Frontend will be available at `http://localhost:5173`

---

## ⚙️ Configuration

### Backend Configuration (appsettings.json)

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Database=socialnet;Username=postgres;Password=yourpassword"
  },
  "Jwt": {
    "Key": "your-secure-jwt-key-minimum-32-characters",
    "Issuer": "SocialNet",
    "Audience": "socialnet_users",
    "ExpirationDurationInHour": "168"
  },
  "Neo4j": {
    "Uri": "neo4j+s://your-instance.databases.neo4j.io",
    "Username": "neo4j",
    "Password": "your-password",
    "Database": "neo4j"
  },
  "Cloudinary": {
    "CloudName": "your_cloud_name",
    "ApiKey": "your_api_key",
    "ApiSecret": "your_api_secret"
  },
  "ClientUrl": "http://localhost:5173",
  "Email": {
    "Smtp": {
      "Host": "smtp.gmail.com",
      "Port": 587,
      "Username": "your-email@gmail.com",
      "Password": "your-app-password",
      "FromName": "SocialNet",
      "FromAddress": "your-email@gmail.com",
      "UseSsl": true
    }
  }
}
```

### Frontend Configuration (.env)

```env
VITE_API_BASE_URL=https://localhost:7065/api
VITE_API_HUB_BASE_URL=https://localhost:7065
VITE_DEFAULT_AVATAR=https://your-cdn.com/default-avatar.jpg
VITE_DEFAULT_COVER_PHOTO=https://your-cdn.com/default-cover.jpg
```

### Environment Variables

For detailed environment variable setup, see:
- **`RENDER_ENV_VARS.md`** - Copy-paste format for Render
- **`.env.render`** - Complete list with descriptions

---

## 🐳 Deployment

### Deploy Backend to Render

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Create Render Web Service**
   - Go to [Render Dashboard](https://dashboard.render.com/)
   - Click **New +** → **Web Service**
   - Connect your GitHub repository
   - Select **Docker** runtime
   - Add environment variables (see `RENDER_ENV_VARS.md`)

3. **Deploy**
   - Click **Create Web Service**
   - Wait 5-10 minutes for first deployment

For detailed instructions, see **`RENDER_DEPLOYMENT.md`** and **`DEPLOYMENT_CHECKLIST.md`**

### Deploy Frontend to Vercel

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Deploy**
   ```bash
   cd src/ReactWeb
   vercel
   ```

3. **Update environment variables** in Vercel dashboard

---

## 📚 API Documentation

Once the backend is running, access the Swagger UI documentation:

**Local**: `https://localhost:7065/swagger`  
**Production**: `https://your-app.onrender.com/swagger`

### Key API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/register` | POST | Register new user |
| `/api/auth/login` | POST | User login |
| `/api/posts` | GET | Get feed posts |
| `/api/posts` | POST | Create new post |
| `/api/friends/requests` | GET | Get friend requests |
| `/api/messages` | GET | Get messages |
| `/api/groups` | GET | Get user groups |
| `/api/notifications` | GET | Get notifications |
| `/api/reels` | GET | Get reels feed |
| `/api/stories` | GET | Get active stories |

### SignalR Hubs

| Hub | Endpoint | Purpose |
|-----|----------|---------|
| **ChatHub** | `/hubs/chat` | Real-time messaging |
| **CallHub** | `/hubs/call` | Video/audio calling |
| **NotificationHub** | `/hubs/notifications` | Push notifications |

---

## 🔒 Security

- JWT Bearer token authentication
- Password hashing with ASP.NET Core Identity
- CORS configuration for cross-origin requests
- HTTPS enforcement in production
- SQL injection protection via EF Core parameterized queries
- XSS protection via React's built-in escaping
- Input validation using FluentValidation

---
