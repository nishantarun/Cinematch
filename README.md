# CineMatch

> Real-time collaborative movie matching for groups.

CineMatch lets multiple users create or join a shared room, independently like or dislike movies, and discover movies that everyone in the room liked.

**Live Demo:** _Add after deployment_  
**Repository:** _Add repository URL_

## Features

- User registration and JWT-based login
- Create and join rooms using unique room codes
- Real-time room member updates with Socket.io
- Host-controlled session start and restart
- Shared movie deck with independent voting
- Like/dislike voting with duplicate-vote prevention
- Automatic detection of movies liked by every current member
- Session completion and match results
- Host transfer when the current host leaves
- Light/dark theme with persisted preference
- Backend-authoritative room and session state

## How It Works

```text
Register / Login
       ↓
Create or Join Room
       ↓
Real-time Member Synchronization
       ↓
Host Starts Session
       ↓
Backend Generates Movie Deck
       ↓
Users Like / Dislike Independently
       ↓
Backend Detects Common Likes
       ↓
Session Completes
       ↓
Display Matches
       ↓
Host Can Restart
```

The backend is the source of truth. REST is used for application operations and persistent state, while Socket.io announces relevant state changes to connected clients. Clients can then fetch the latest authoritative state through REST.

## Architecture

```text
                         ┌───────────────────┐
                         │   React Client    │
                         │                   │
                         │ Pages / Components│
                         │ Zustand           │
                         │ Axios             │
                         │ Socket.io Client  │
                         └─────────┬─────────┘
                                   │
                    ┌──────────────┴──────────────┐
                    │                             │
                  HTTP                         Socket.io
                    │                             │
                    ▼                             ▼
              ┌────────────────────────────────────────┐
              │          Node.js + Express             │
              │                                        │
              │ Auth Middleware · Routes · Controllers │
              │ Socket Handlers · Socket Emitters      │
              └────────────────────┬───────────────────┘
                                   │
                         ┌─────────┴─────────┐
                         ▼                   ▼
                    ┌─────────┐          ┌───────┐
                    │ MongoDB │          │ TMDB  │
                    └─────────┘          └───────┘
```

See [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) for the detailed architecture, data model, workflows, synchronization design, and scalability discussion.

## Technology Stack

### Frontend

- React
- Vite
- React Router
- Zustand
- Axios
- Socket.io Client
- Tailwind CSS v4

### Backend

- Node.js
- Express
- MongoDB
- Mongoose
- JWT
- Socket.io
- TMDB API
- bcrypt

## Project Structure

```text
CineMatch/
├── client/
│   └── src/
│       ├── api/
│       ├── components/
│       ├── features/
│       ├── hooks/
│       ├── pages/
│       ├── routes/
│       ├── socket/
│       └── store/
│
└── server/
    └── src/
        ├── controllers/
        ├── middlewares/
        ├── models/
        ├── routes/
        ├── sockets/
        ├── utils/
        └── validators/
```

The exact repository structure should be kept synchronized with the source tree as the project evolves.

## API Overview

The application exposes authentication, room, and session endpoints.

### Authentication

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register a user |
| POST | `/api/auth/login` | Authenticate and receive a JWT |

Registration and login are public. Room/session endpoints are protected by JWT authentication.

### Rooms

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/rooms` | Create a room |
| POST | `/api/rooms/join` | Join a room |
| GET | `/api/rooms/:roomCode` | Get room details |
| POST | `/api/rooms/:roomCode/leave` | Leave a room |

### Sessions

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/rooms/:roomCode/start` | Host starts a session |
| GET | `/api/rooms/:roomCode/session` | Get current session |
| POST | `/api/rooms/:roomCode/swipe` | Submit a like/dislike |
| POST | `/api/rooms/:roomCode/restart` | Host restarts a session |

See [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) for the application flows and socket event reference.

## Socket Events

### Client → Server

| Event | Purpose |
|---|---|
| `join-room` | Add the connected socket to a Socket.io room |
| `leave-room` | Remove the connected socket from a Socket.io room |

### Server → Clients

| Event | Purpose |
|---|---|
| `member-joined` | A member joined the application room |
| `member-left` | A member left the application room |
| `session-started` | A session was started |
| `session-restarted` | A session was restarted |
| `match-found` | A movie became a match |
| `session-completed` | Voting completed |

Socket.io room membership and MongoDB application membership are separate concepts.

## Database

CineMatch currently uses two main MongoDB models:

- `User`
- `Room`

`Room.currentSession` is embedded in the Room document for the current session. There is no separate Session collection in the current version.

```text
User
 └── referenced by Room.host
 └── referenced by Room.members[]
 └── referenced by currentSession.swipes[].userId

Room
 ├── roomCode
 ├── host
 ├── members[]
 └── currentSession
      ├── status
      ├── movieDeck[]
      ├── swipes[]
      ├── matches[]
      └── startedAt
```

## Security

Current security mechanisms include:

- JWT authentication for protected API routes
- Password hashing before persistence
- Room membership authorization
- Host authorization for session start/restart
- Request validation
- Duplicate swipe prevention
- Mongoose schema validation

The current Socket.io server configuration uses permissive CORS for development. Production deployment should restrict the allowed origin to the deployed frontend.

## Local Development

### Prerequisites

- Node.js
- MongoDB
- TMDB API credentials

### Backend

```bash
cd server
npm install
npm run dev
```

Configure the backend environment variables required by the current server configuration, including the MongoDB connection string, JWT secret, and TMDB credentials.

### Frontend

```bash
cd client
npm install
npm run dev
```

The frontend development server is provided by Vite.

> Exact environment-variable names and production URLs should be taken from the current source/configuration rather than hardcoded in this README.

## Development

The MVP was developed incrementally, with REST functionality established before adding real-time synchronization. Real-time behavior was tested using multiple browser clients.

The application intentionally keeps Socket.io handlers thin: persistent business operations remain in the backend controllers, while sockets communicate state changes.

## Current Scope

CineMatch is a first finished version/MVP. It is designed to demonstrate a complete full-stack real-time workflow rather than production-scale distributed infrastructure.

Current limitations include:

- No persistent session history
- No separate Session collection
- No distributed Socket.io adapter
- No multi-instance backend architecture
- No dedicated caching layer
- No advanced recommendation/personalization system

These are potential future improvements, not requirements for the current version.
