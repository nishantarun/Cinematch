# CineMatch

CineMatch is a real-time group movie discovery platform where users join rooms, swipe through movies together, and instantly discover films everyone wants to watch.

## Tech Stack

### Frontend

* React (Vite)
* Tailwind CSS
* Zustand
* Framer Motion

### Backend

* Node.js
* Express.js
* MongoDB
* Redis
* Socket.io

### External APIs

* TMDB API

## Project Goals

* Real-time room-based movie matching
* Horizontally scalable architecture
* Redis-powered swipe engine
* AI-powered recommendations (future phase)

## Current Progress

### Day 1

* Project initialized
* React frontend setup
* Express backend setup
* MongoDB Atlas connection
* Health check endpoint

## Architecture

Frontend → Express API → MongoDB

Future architecture:

Frontend → Socket.io → Redis Match Engine → MongoDB Persistence
