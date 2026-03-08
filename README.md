# 🎯 Reclaim - Gamified Habit Tracking Platform

<div align="center">

**Transform your habits into achievements. Build consistency. Level up your life.**

[![Python](https://img.shields.io/badge/Python-3.8+-blue.svg)](https://www.python.org/)
[![React](https://img.shields.io/badge/React-19.1.1-61DAFB.svg)](https://reactjs.org/)
[![Flask](https://img.shields.io/badge/Flask-3.0.0-000000.svg)](https://flask.palletsprojects.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-12+-336791.svg)](https://www.postgresql.org/)
</div>

---

## 📖 Overview

**Reclaim** is a full-stack web application that gamifies habit formation through challenges, rewards, and social competition. Built with modern technologies, it combines the psychology of gamification with practical habit tracking to help users build lasting positive behaviors.

> 💼 **For LinkedIn / Portfolio:**
> 
> *A full-stack, gamified habit-tracking application built with React, Vite, and Flask. Reclaim utilizes a PostgreSQL database with Row-Level Security and materialized views to handle real-time XP tracking, daily check-ins, and a live leaderboard. The intuitive UI, styled with Tailwind CSS, leverages gamification psychology (streaks, leveling, badges) to help users build lasting consistency in their daily lives.*

---

## ✨ Features

### 🔐 Authentication & Security
- JWT token-based authentication
- Bcrypt password hashing
- Protected routes and API endpoints
- Row-Level Security (RLS) for data isolation
- Input validation and SQL injection prevention

### 🎯 Challenge System
- Browse challenges by difficulty (Easy, Medium, Hard) and category
- Start multiple challenges simultaneously
- Daily check-in system with duplicate prevention
- Progress tracking with visual progress bars
- Challenge completion with XP rewards

### 🎮 Gamification
- XP system: 5 XP per daily check-in, variable rewards for completions
- Automatic level calculation: `Level = (XP / 100) + 1` via database triggers
- Streak tracking: current and longest streak per challenge
- Badge system (database structure ready)
- Visual feedback: XP bars, level-up modals, progress indicators

### 📊 Leaderboard
- Real-time rankings based on XP
- Materialized views for optimal query performance
- User rank display with statistics (XP, level, completed challenges, badges)
- Top 3 highlighting

### 📱 User Dashboard
- Active challenges overview
- Quick check-in functionality
- Statistics summary (XP, active challenges, current streak)
- Public landing page for non-authenticated users

### 👤 Profile Management
- User statistics and achievements
- Challenge history
- XP and level visualization

### 🤖 AI Coach
- Chat interface (integration-ready)

---

## 🛠️ Tech Stack

### Backend
- **Framework**: Flask 3.0.0
- **Language**: Python 3.8+
- **Database**: PostgreSQL 12+
- **Authentication**: PyJWT 2.8.0
- **Security**: bcrypt 4.1.2
- **Database Driver**: psycopg2-binary
- **CORS**: flask-cors 4.0.0
- **Environment**: python-dotenv 1.0.0

### Frontend
- **Framework**: React 19.1.1
- **Build Tool**: Vite 5.0.0
- **Routing**: React Router DOM 7.8.2
- **Styling**: Tailwind CSS 3.4.18
- **HTTP Client**: Axios 1.11.0
- **Charts**: Recharts 3.2.0
- **Testing**: React Testing Library

### Database
- **RDBMS**: PostgreSQL 12+
- **Stored Procedures**: PL/pgSQL
- **Views**: Materialized views for leaderboard
- **Triggers**: Automatic level updates
- **Security**: Row-Level Security (RLS)
- **Optimization**: Strategic indexes and composite indexes

---

## 🚀 Getting Started

### Prerequisites

- Python 3.8 or higher
- Node.js 16+ and npm
- PostgreSQL 12 or higher
- Git

### Installation

#### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/reclaim.git
cd reclaim
```

#### 2. Backend Setup

```bash
# Navigate to backend directory
cd Backend

# Create virtual environment (recommended)
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file (or database.env)
# Add your database credentials:
# DB_NAME=reclaim
# DB_USER=reclaim_app
# DB_PASSWORD=your_password
# DB_HOST=localhost
# JWT_SECRET=your_secret_key
# FLASK_SECRET_KEY=your_flask_secret

# Set up database
# Run SQL files in order from Database/ directory:
# 1. schema.sql
# 2. functions.sql
# 3. views_and_indexes.sql
# 4. roles_and_grants.sql
# 5. seed.sql (optional, for sample data)

# Start Flask server
python app.py
```

The backend will run on `http://localhost:5000`

#### 3. Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will run on `http://localhost:5173`

#### 4. Build for Production

```bash
# Frontend production build
cd frontend
npm run build

# The built files will be in frontend/dist/
```

---

## 📁 Project Structure

```
Reclaim/
├── Backend/                    # Flask REST API
│   ├── app.py                  # Main application & API routes
│   ├── models.py               # Database models
│   ├── config.py               # Configuration
│   ├── requirements.txt        # Python dependencies
│   ├── AI/                     # AI coach integration
│   │   ├── ai_coach.py
│   │   └── client.py
│   ├── components/             # Backend components
│   ├── hooks/                  # Custom hooks
│   ├── pages/                  # Page handlers
│   └── styles/                 # Backend styles
│
├── Database/                    # PostgreSQL schema & functions
│   ├── schema.sql              # Table definitions & constraints
│   ├── functions.sql           # Stored procedures (PL/pgSQL)
│   ├── views_and_indexes.sql   # Views, indexes, optimizations
│   ├── roles_and_grants.sql    # Security & permissions
│   └── seed.sql                # Sample data (optional)
│
└── frontend/                    # React application
    ├── src/
    │   ├── Pages/              # Page components
    │   │   ├── Dashboard.jsx
    │   │   ├── Challenges.jsx
    │   │   ├── Leaderboard.jsx
    │   │   ├── Profile.jsx
    │   │   ├── ChatAI.jsx
    │   │   ├── Login.jsx
    │   │   └── Signup.jsx
    │   ├── Components/         # Reusable components
    │   │   ├── Button.jsx
    │   │   ├── ChallengeCard.jsx
    │   │   ├── XPBar.jsx
    │   │   ├── LevelUpModal.jsx
    │   │   └── ...
    │   ├── api/                 # API client functions
    │   │   ├── auth.js
    │   │   ├── challenges.js
    │   │   ├── leaderboard.js
    │   │   └── user.js
    │   ├── context/             # React Context
    │   │   └── UserContext.jsx
    │   ├── styles/              # Global styles
    │   ├── App.jsx              # Main app component
    │   └── main.jsx             # Entry point
    ├── public/                  # Static assets
    ├── package.json             # Node dependencies
    └── vite.config.js           # Vite configuration
```

---

## 🔌 API Endpoints

### Authentication
- `POST /api/signup` - Register new user
- `POST /api/login` - Authenticate user
- `POST /api/logout` - Clear session

### Challenges
- `GET /api/challenges` - Get all available challenges
- `GET /api/challenges/active` - Get user's active challenges (protected)
- `POST /api/challenges/start` - Start a new challenge (protected)
- `POST /api/challenges/checkin` - Daily check-in (protected)
- `POST /api/challenges/complete` - Mark challenge as completed (protected)

### User & Profile
- `GET /api/profile` - Get user profile and statistics (protected)

### Leaderboard
- `GET /api/leaderboard` - Get leaderboard rankings (public, optional auth)

### AI
- `POST /api/ai/chat` - AI coach chat interface (protected)

### Health
- `GET /api/health` - Health check endpoint

---

## 🗄️ Database Architecture

### Core Tables
- **users**: User accounts with XP, level, authentication
- **challenges**: Available habit challenges
- **user_challenges**: User participation tracking
- **daily_logs**: Daily check-in records
- **streaks**: Consecutive day tracking
- **badges**: Achievement system
- **user_badges**: User badge assignments

### Key Database Features
- **Stored Procedures**: `create_user()`, `complete_challenge()`, `get_user_stats()`
- **Triggers**: Automatic level calculation on XP updates
- **Materialized Views**: Optimized leaderboard view
- **Indexes**: Strategic indexing for query performance
- **Row-Level Security**: Data isolation per user
- **Constraints**: Data integrity and validation

---

## 🔒 Security Features

- **Password Hashing**: bcrypt with salt rounds
- **JWT Authentication**: Secure token-based sessions
- **Input Validation**: Username length, email format, password strength
- **SQL Injection Prevention**: Parameterized queries
- **Row-Level Security**: Database-level data isolation
- **CORS Configuration**: Controlled cross-origin requests
- **Protected Routes**: Frontend and backend route protection

---

## 🚧 Future Enhancements

- [ ] Social features (friends, challenges)
- [ ] Email notifications and reminders
- [ ] Custom challenge creation
- [ ] Habit analytics and insights
- [ ] Export data functionality
- [ ] Dark/light theme toggle

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request


---

## 👤 Author

**Daksh Kumar**
- **GitHub**: [@dakshkumar96](https://github.com/dakshkumar96)
- **LinkedIn**: [linkedin.com/in/dakshkumar96](https://linkedin.com/in/dakshkumar96)
- **Email**: dakshkumar2k2@gmail.com

---

## 🙏 Acknowledgments

- Built with [Flask](https://flask.palletsprojects.com/) and [React](https://reactjs.org/)
- UI inspired by modern gamification design principles
- Database optimization techniques from PostgreSQL best practices

---

<div align="center">

**⭐ If you found this project helpful, please give it a star! ⭐**

Made with ❤️ for building better habits

</div>
