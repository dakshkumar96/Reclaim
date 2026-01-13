# 🚀 Reclaim - Production Deployment Guide

This guide covers deploying Reclaim to a production environment.

## 📋 Prerequisites

- Python 3.8+ installed
- PostgreSQL 12+ installed and running
- Node.js 18+ and npm installed (for frontend build)
- Nginx or another reverse proxy (recommended)
- Domain name with SSL certificate (for HTTPS)

## 🗄️ Database Setup

### 1. Create PostgreSQL Database

```bash
# Connect to PostgreSQL as superuser
psql -U postgres

# Create database and user
CREATE DATABASE reclaim;
CREATE USER reclaim_app WITH PASSWORD 'your_secure_password';
CREATE USER reclaim_admin WITH PASSWORD 'your_secure_admin_password';

# Grant privileges
GRANT CONNECT ON DATABASE reclaim TO reclaim_app;
GRANT CONNECT ON DATABASE reclaim TO reclaim_admin;
```

### 2. Run Database Migrations

```bash
# Navigate to Database directory
cd Database

# Run migrations in order:
psql -U postgres -d reclaim -f schema.sql
psql -U postgres -d reclaim -f functions.sql
psql -U postgres -d reclaim -f views_and_indexes.sql
psql -U postgres -d reclaim -f roles_and_grants.sql
psql -U postgres -d reclaim -f migration_add_user_settings.sql  # If upgrading
psql -U postgres -d reclaim -f seed.sql  # Optional: Seed initial data
```

### 3. Set Database Permissions

Ensure the `reclaim_app` user has proper permissions (handled by `roles_and_grants.sql`).

## 🔧 Backend Setup

### 1. Install Dependencies

```bash
cd Backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 2. Configure Environment Variables

```bash
# Copy example file
cp .env.example database.env

# Edit database.env with your production values
nano database.env  # or use your preferred editor
```

**Required environment variables:**
- `DB_NAME`: Database name (e.g., `reclaim`)
- `DB_USER`: Database user (e.g., `reclaim_app`)
- `DB_PASSWORD`: Database password (strong password)
- `DB_HOST`: Database host (e.g., `localhost` or `db.example.com`)
- `JWT_SECRET`: Strong random secret (min 32 chars)
- `FLASK_SECRET_KEY`: Strong random secret (min 32 chars)
- `FLASK_ENV`: Set to `production`
- `FRONTEND_URLS`: Comma-separated allowed origins (e.g., `https://yourdomain.com,https://www.yourdomain.com`)

**Generate secure secrets:**
```python
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

### 3. Test Backend Configuration

```bash
# Test database connection
python -c "from config import Config; from app import get_db_connection; conn = get_db_connection(); print('Database connection successful!')"

# Test Flask app starts
python app.py
# Should see: "Starting Reclaim Habit Tracker API..."
# Press Ctrl+C to stop
```

### 4. Start Backend with Gunicorn

```bash
# Production start
gunicorn -c gunicorn.py app:app

# Or with custom configuration
gunicorn -c gunicorn.py --bind 0.0.0.0:5000 --workers 4 app:app
```

**Recommended: Use systemd service (Linux)**

Create `/etc/systemd/system/reclaim-api.service`:
```ini
[Unit]
Description=Reclaim API Server
After=network.target postgresql.service

[Service]
Type=notify
User=www-data
Group=www-data
WorkingDirectory=/path/to/Reclaim/Backend
Environment="PATH=/path/to/Reclaim/Backend/venv/bin"
ExecStart=/path/to/Reclaim/Backend/venv/bin/gunicorn -c gunicorn.py app:app
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

Enable and start:
```bash
sudo systemctl enable reclaim-api
sudo systemctl start reclaim-api
sudo systemctl status reclaim-api
```

## 🎨 Frontend Setup

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Configure Environment Variables

Create `frontend/.env.production`:
```bash
VITE_API_URL=https://api.yourdomain.com/api
```

### 3. Build for Production

```bash
npm run build
```

This creates an optimized production build in the `frontend/dist` directory.

### 4. Serve Frontend

**Option A: Nginx (Recommended)**

Install Nginx and configure:

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;

    ssl_certificate /path/to/ssl/cert.pem;
    ssl_certificate_key /path/to/ssl/key.pem;

    root /path/to/Reclaim/frontend/dist;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;

    # Serve frontend
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Proxy API requests to backend
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

**Option B: CDN/Static Hosting**

Upload `frontend/dist` contents to:
- Netlify
- Vercel
- AWS S3 + CloudFront
- Cloudflare Pages

Configure the API URL to point to your backend.

## 🔒 Security Checklist

- [ ] Change all default passwords
- [ ] Generate strong random secrets for `JWT_SECRET` and `FLASK_SECRET_KEY`
- [ ] Configure CORS with specific production URLs
- [ ] Enable SSL/HTTPS (use Let's Encrypt for free certificates)
- [ ] Set up firewall rules (only allow 80, 443, and SSH)
- [ ] Configure database to only accept local connections or use SSL
- [ ] Set `FLASK_ENV=production` to enable production validation
- [ ] Review and restrict database user permissions
- [ ] Set up regular database backups
- [ ] Configure log rotation
- [ ] Set up monitoring and alerts

## 📊 Monitoring & Maintenance

### Health Check

The backend provides a health check endpoint:
```bash
curl http://localhost:5000/api/health
```

Should return:
```json
{"status": "healthy", "database": "connected"}
```

### Logs

**Gunicorn logs:**
```bash
# If using systemd
sudo journalctl -u reclaim-api -f

# Or check log files configured in gunicorn.py
tail -f /path/to/logs/access.log
tail -f /path/to/logs/error.log
```

**Database logs:**
Check PostgreSQL logs (location depends on installation).

### Database Backups

```bash
# Create backup
pg_dump -U postgres reclaim > backup_$(date +%Y%m%d_%H%M%S).sql

# Restore backup
psql -U postgres reclaim < backup_file.sql
```

**Automated backups with cron:**
```bash
# Add to crontab (crontab -e)
0 2 * * * pg_dump -U postgres reclaim > /backups/reclaim_$(date +\%Y\%m\%d).sql
```

## 🔄 Updates & Deployment

1. **Pull latest code:**
   ```bash
   git pull origin main
   ```

2. **Update backend dependencies:**
   ```bash
   cd Backend
   source venv/bin/activate
   pip install -r requirements.txt
   ```

3. **Run database migrations (if any):**
   ```bash
   psql -U postgres -d reclaim -f Database/migration_*.sql
   ```

4. **Rebuild frontend:**
   ```bash
   cd frontend
   npm install
   npm run build
   ```

5. **Restart services:**
   ```bash
   sudo systemctl restart reclaim-api
   sudo systemctl restart nginx
   ```

## 🐛 Troubleshooting

### Backend won't start
- Check environment variables are set correctly
- Verify database connection
- Check logs: `sudo journalctl -u reclaim-api -n 50`

### Database connection errors
- Verify database is running: `sudo systemctl status postgresql`
- Check credentials in `database.env`
- Verify database user permissions
- Check firewall rules

### Frontend can't reach backend
- Verify CORS configuration includes frontend URL
- Check API URL in frontend `.env.production`
- Verify nginx proxy configuration
- Check backend is running: `curl http://localhost:5000/api/health`

### 502 Bad Gateway
- Backend not running or crashed
- Check Gunicorn logs
- Verify nginx proxy_pass URL is correct

## 📞 Support

For issues or questions, check:
- Project README.md
- Database schema in Database/schema.sql
- API endpoints in Backend/app.py

## ✅ Pre-Launch Checklist

- [ ] All environment variables configured
- [ ] Database migrations completed
- [ ] SSL certificate installed
- [ ] CORS configured with production URLs
- [ ] Frontend built and deployed
- [ ] Backend running with Gunicorn
- [ ] Health check endpoint responding
- [ ] Test user registration/login
- [ ] Test all major features
- [ ] Database backups configured
- [ ] Monitoring/logging set up
- [ ] Security checklist completed

---

**Your application should now be running in production! 🎉**
