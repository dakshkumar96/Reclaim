# Reclaim Habit App - Database Setup

This directory contains the complete PostgreSQL database schema and setup files for the Reclaim habit tracking application.

## Files Overview

- **`schema.sql`** - Main database schema with tables, constraints, and enums
- **`functions.sql`** - PL/pgSQL functions for safe database operations
- **`views_and_indexes.sql`** - Views, materialized views, and performance indexes
- **`seed.sql`** - Sample data for development and testing
- **`roles_and_grants.sql`** - Database roles and security permissions
- **`README.md`** - This documentation file

## Quick Start

### Prerequisites

- PostgreSQL 12+ installed and running
- `psql` command-line tool available
- Database user with CREATE privileges

### Setup Commands

```bash
# 1. Create the database
createdb reclaim_db

# 2. Connect to the database
psql reclaim_db

# 3. Run the SQL files in order
\i schema.sql
\i functions.sql
\i views_and_indexes.sql
\i seed.sql
\i roles_and_grants.sql

# 4. Verify setup
\dt  -- List all tables
\df  -- List all functions
\dv  -- List all views
```

### Alternative: One-Command Setup

```bash
# Create database and run all files
createdb reclaim_db && \
psql reclaim_db -f schema.sql && \
psql reclaim_db -f functions.sql && \
psql reclaim_db -f views_and_indexes.sql && \
psql reclaim_db -f seed.sql && \
psql reclaim_db -f roles_and_grants.sql
```

## Database Schema

### Core Tables

- **`users`** - User accounts and gamification stats
- **`challenges`** - Available habit challenges
- **`user_challenges`** - User participation in challenges
- **`daily_logs`** - Daily habit completion records
- **`streaks`** - Consecutive day tracking
- **`badges`** - Achievement badges
- **`user_badges`** - User's earned badges

### Key Features

- **Gamification**: XP system, levels, streaks, badges
- **Security**: Row-level security, role-based access
- **Performance**: Optimized indexes, materialized views
- **Data Integrity**: Constraints, triggers, enums

## API Integration

### Flask Database Connection

```python
import psycopg2

# Application connection
DATABASE_URL = "postgresql://reclaim_app:password@localhost/reclaim_db"

def get_db_connection():
    return psycopg2.connect(DATABASE_URL)
```

### Key API Endpoints

| Endpoint | SQL Function | Description |
|----------|--------------|-------------|
| `/api/signup` | `create_user()` | Register new user |
| `/api/login` | `SELECT` on users | Authenticate user |
| `/api/challenges` | `SELECT` on challenges | Get available challenges |
| `/api/complete_challenge` | `complete_challenge()` | Complete a challenge |
| `/api/leaderboard` | `SELECT` on leaderboard_view | Get top users |
| `/api/daily_log` | `INSERT` into daily_logs | Log daily activity |

### Example API Usage

```python
# Complete a challenge
def complete_challenge(user_id, challenge_id):
    with get_db_connection() as conn:
        with conn.cursor() as cur:
            cur.execute("SELECT complete_challenge(%s, %s)", [user_id, challenge_id])
            result = cur.fetchone()[0]  # Returns JSON
            return result

# Get leaderboard
def get_leaderboard(limit=50):
    with get_db_connection() as conn:
        with conn.cursor() as cur:
            cur.execute("SELECT * FROM leaderboard_view ORDER BY rank LIMIT %s", [limit])
            return cur.fetchall()
```

## Sample Data

The seed data includes:

- **3 Users**: Alex (1250 XP), Sarah (680 XP), Mike (150 XP)
- **4 Challenges**: Hydration, Morning Routine, Digital Detox, Study Marathon
- **15 Badges**: XP-based, streak-based, and category-specific achievements
- **Activity Data**: Recent logs, streaks, and badge awards

### Test Accounts

All test users have password: `password123`

- Username: `alex_habit_master` (Level 13, experienced)
- Username: `sarah_wellness` (Level 7, intermediate)
- Username: `mike_beginner` (Level 2, beginner)

## Security Features

### Row Level Security (RLS)

- Users can only access their own data
- Automatic context setting via `set_user_context()`
- Secure by default

### Role-Based Access

- **`reclaim_app`**: Limited privileges for application
- **`reclaim_admin`**: Full privileges for maintenance
- Connection limits and audit logging

### Security Checklist

- [ ] Change default passwords
- [ ] Enable SSL/TLS connections
- [ ] Set up connection pooling
- [ ] Configure monitoring and alerts
- [ ] Implement backup procedures
- [ ] Keep PostgreSQL updated

## Performance Optimization

### Indexes

- Primary lookup indexes on all key columns
- Composite indexes for common query patterns
- Partial indexes for specific use cases

### Materialized Views

- **`leaderboard_view`**: Fast leaderboard queries
- Refresh with: `REFRESH MATERIALIZED VIEW leaderboard_view;`
- Automatic refresh function: `refresh_leaderboard()`

### Query Optimization

- Use `EXPLAIN ANALYZE` to check query performance
- Monitor index usage with `pg_stat_user_indexes`
- Regular `VACUUM` and `ANALYZE` maintenance

## Maintenance

### Regular Tasks

```sql
-- Refresh leaderboard (every 5-10 minutes)
SELECT refresh_leaderboard();

-- Update table statistics
ANALYZE;

-- Clean up old data (if needed)
VACUUM;
```

### Monitoring Queries

```sql
-- Check index usage
SELECT schemaname, tablename, indexname, idx_scan, idx_tup_read
FROM pg_stat_user_indexes
ORDER BY idx_scan DESC;

-- Check table sizes
SELECT schemaname, tablename, pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

## Troubleshooting

### Common Issues

1. **Permission Denied**: Check role grants and RLS policies
2. **Slow Queries**: Verify indexes are being used
3. **Connection Limits**: Check role connection limits
4. **RLS Issues**: Ensure `set_user_context()` is called

### Debug Commands

```sql
-- Check current user context
SELECT current_setting('app.current_user_id');

-- View active connections
SELECT * FROM pg_stat_activity WHERE datname = 'reclaim_db';

-- Check table permissions
SELECT * FROM information_schema.table_privileges 
WHERE table_name IN ('users', 'challenges', 'user_challenges');
```

## Production Deployment

### Environment Variables

```bash
# Database configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=reclaim_db
DB_USER=reclaim_app
DB_PASSWORD=your_secure_password
DB_SSL_MODE=require
```

### Connection Pooling

Consider using pgBouncer for production:

```ini
[databases]
reclaim_db = host=localhost port=5432 dbname=reclaim_db

[pgbouncer]
pool_mode = transaction
max_client_conn = 100
default_pool_size = 20
```

## Support

For questions or issues:

1. Check the troubleshooting section above
2. Review PostgreSQL documentation
3. Check application logs for specific error messages
4. Verify database permissions and RLS policies

## License

This database schema is part of the Reclaim habit tracking application.
