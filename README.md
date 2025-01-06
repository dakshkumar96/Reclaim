# Reclaim

A habit tracking application built with Flask backend and React frontend.

## Features

- User authentication and authorization
- Challenge-based habit tracking
- Gamification with XP and levels
- Leaderboard system
- AI coach for habit guidance

## Tech Stack

- **Backend**: Python Flask, PostgreSQL
- **Frontend**: React, Vite, Tailwind CSS
- **Database**: PostgreSQL with custom functions and triggers

## Setup Instructions

### Prerequisites
- Python 3.8+
- Node.js 16+
- PostgreSQL 12+

### Backend Setup
1. Navigate to Backend directory
2. Install dependencies: `pip install -r requirements.txt`
3. Set up environment variables in `.env`
4. Run database migrations from Database/ directory
5. Start server: `python app.py`

### Frontend Setup
1. Navigate to frontend directory
2. Install dependencies: `npm install`
3. Start development server: `npm run dev`

## Project Structure

```
Reclaim/
├── Backend/          # Flask API
├── Database/         # SQL schema and migrations
└── frontend/         # React application
```
