# Social Network Application — Project Description

## Overview

A full-stack real-time social networking platform modeled after Facebook, built with a modern .NET backend and a React frontend. The application enables users to create profiles, connect with friends, share posts and stories, watch short-form video reels, and communicate instantly via real-time messaging and voice calls.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19, Vite 7, Tailwind CSS 4, Zustand 5 |
| **Backend** | ASP.NET Core 10, MediatR (CQRS + DDD) |
| **Real-time** | SignalR (WebSocket), WebRTC (peer-to-peer voice) |
| **Databases** | PostgreSQL (EF Core), Neo4j (graph queries) |
| **Authentication** | JWT Bearer Tokens, ASP.NET Core Identity |
| **Background Jobs** | Quartz (.NET) for outbox pattern |
| **Media Storage** | Cloudinary |
| **Logging** | Serilog |
| **API Docs** | Swagger / OpenAPI |

## Features

### Authentication & Profiles
- User registration and login with JWT authentication
- Profile management with avatar and cover photo uploads
- Personal info management (schools, bio, etc.)

### Social Connections
- Friend request system (send, accept, reject, cancel, remove)
- Follow/Unfollow functionality
- Friend recommendations with mutual friends
- Online presence tracking (real-time "Active now" indicators via SignalR)
- Neo4j-powered graph queries for mutual friends and friend recommendations

### Posts & Feed
- Create, edit, and delete posts with text and image content
- Post reactions (Like, Love, Haha, Wow, Sad, Angry)
- Post comments with reactions
- Paginated news feed with scoring algorithm
- Saved posts and post sharing

### Stories
- Create ephemeral stories (auto-expire after 24h)
- Story timeline sorted by recency
- View friends' stories with gradient story ring indicators
- Story reactions and seen tracking

### Short-Form Video (Reels)
- Browse and watch reels in a TikTok-style vertical scroll interface
- Like reels with real-time counts
- Auto-play on scroll with mute/unmute
- Create reels with video upload
- Reel comments

### Real-Time Messaging
- One-to-one and group conversations
- Real-time message delivery via SignalR WebSocket
- "Seen" status indicators
- Typing indicators with debouncing
- Message reactions (6 emoji types)
- Group chat management (create, edit name, add/remove members, assign admins)
- Pinned messages and shared media browser
- Search messages within conversations
- Message forwarding

### Voice Calls
- WebRTC peer-to-peer audio calls
- Incoming call modal with ringing sound (Web Audio API)
- Full-screen active call UI with avatar, duration timer
- Mute/unmute toggle
- Call states: idle, ringing, calling, active, ended
- Animated waveform visualization during active call

### Groups
- Create groups with privacy settings (public/private)
- Group membership with roles (admin, moderator, member)
- Group join requests and approval workflow
- Group posts with visibility controls
- Group rules management
- Admin insights (growth, engagement analytics)
- Report content within groups

### Additional Features
- Notifications system (various event types)
- Search across users, posts, groups, and conversations
- Birthdays page showing friends' upcoming birthdays
- Saved posts page

## Architecture

```
src/
├── Domain/
│   ├── Entities/        # Core models (User, Post, Story, Conversation, Message, Group, etc.)
│   ├── Enums/          # MessageType, ReactionType, PostVisibility, etc.
│   ├── Events/         # Domain events (FriendshipCreated, Unfriended)
│   └── Common/         # BaseEntity, AggregateRoot
│
├── Application/        # Business logic (CQRS handlers via MediatR)
│   ├── Abstractions/
│   │   ├── Repositories/  # Repository interfaces
│   │   └── SignalR/        # IChatHubNotifier, IPresenceTracker
│   ├── DTOs/           # Data transfer objects
│   └── Friend/         # Friend request handlers
│       Conversations/  # Conversation/message handlers
│       Posts/          # Post/feed handlers
│       Reels/          # Reel handlers
│
├── Infrastructure/
│   ├── Persistence/
│   │   ├── Contexts/  # EF Core AppDbContext
│   │   ├── Repositories/
│   │   └── Configurations/  # Entity configurations
│   ├── SignalR/
│   │   └── ChatHub.cs  # WebSocket hub (messaging + call signaling)
│   ├── Services/
│   │   ├── FriendGraphService.cs  # Neo4j graph queries
│   │   ├── FeedGenerator.cs      # Feed scoring algorithm
│   │   └── CloudinaryUploadService.cs
│   └── BackgroundJobs/  # OutboxProcessingBackgroundService (Quartz)
│
├── Presentation/       # API controllers
│   └── Controllers/    # 10+ API controllers
│
└── Web/                # ASP.NET Core entry point
```

## Key Technical Highlights

### Real-Time WebSocket Communication
- `ChatHub.cs` handles all SignalR operations: message delivery, typing indicators, presence, and call signaling
- `PresenceTracker` singleton tracks online users across multiple devices
- Users registered to conversation groups on connect for targeted broadcasts

### WebRTC Voice Calls
- Peer-to-peer audio via `RTCPeerConnection` with ICE/STUN (`stun.l.google.com:19302`)
- Signaling flows through SignalR: `StartCall` → `AcceptCall` → `SendSignal` (offer/answer/ICE) → `EndCall`
- Complete call state machine: idle → calling → ringing → active → ended
- Ringtone generated via Web Audio API (no audio file needed)

### CQRS + Clean Architecture
- All backend operations go through MediatR handlers
- Separate query and command handlers (e.g., `GetConversationsQueryHandler`, `SendMessageCommandHandler`)
- Domain events captured via `IHasDomainEvents` and processed via outbox pattern
- `OutboxProcessingBackgroundService` (Quartz) ensures reliable event delivery

### Friend Graph (Neo4j)
- `FriendGraphService` queries Neo4j for graph operations
- Friend recommendations based on mutual connections
- Shortest path calculation between users

### State Management (Frontend)
- React Context API for domain concerns (Auth, Chat, Friend, Stories, Reels, Call)
- Zustand for chat state management (high-frequency updates)
- Custom hooks (`useFeed`, `useStoriesTimeline`, `useGroup`) for data fetching

## Development

```bash
# Backend
cd src/Web
dotnet run

# Frontend
cd src/ReactWeb
npm install
npm run dev
```

### Prerequisites
- .NET 10 SDK
- Node.js 18+
- PostgreSQL database
- Neo4j database (optional, for friend graph features)
