"""Gunicorn configuration file for production deployment"""

import multiprocessing
import os

# Server socket
bind = os.getenv("GUNICORN_BIND", "0.0.0.0:5000")
backlog = 2048

# Worker processes
workers = int(os.getenv("GUNICORN_WORKERS", multiprocessing.cpu_count() * 2 + 1))
worker_class = "sync"
worker_connections = 1000
timeout = 30
keepalive = 2

# Logging
accesslog = os.getenv("GUNICORN_ACCESS_LOG", "-")  # "-" means stdout
errorlog = os.getenv("GUNICORN_ERROR_LOG", "-")    # "-" means stderr
loglevel = os.getenv("GUNICORN_LOG_LEVEL", "info")
access_log_format = '%(h)s %(l)s %(u)s %(t)s "%(r)s" %(s)s %(b)s "%(f)s" "%(a)s"'

# Process naming
proc_name = "reclaim-api"

# Server mechanics
daemon = False
pidfile = os.getenv("GUNICORN_PIDFILE", None)
umask = 0
user = os.getenv("GUNICORN_USER", None)
group = os.getenv("GUNICORN_GROUP", None)
tmp_upload_dir = None

# SSL (if using gunicorn for SSL termination - typically done by nginx)
# keyfile = None
# certfile = None

# Preload app for better performance
preload_app = True

# Graceful timeout
graceful_timeout = 30

# Maximum requests per worker (helps prevent memory leaks)
max_requests = 1000
max_requests_jitter = 50

# Worker timeout for hanging requests
worker_tmp_dir = "/dev/shm"  # Use shared memory for better performance on Linux
