# First-Time Deployment Guide (Docker)

## Prerequisites

- VPS/server with Ubuntu 22.04+ (or similar)
- SSH access
- Domain name (optional, can add later)
- Resend account + API key (for email notifications)
- reCAPTCHA v3 site key + secret key (for spam protection)

## Step 1: Install Docker on Server

```bash
ssh user@your-server-ip

# Install Docker
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER

# Logout and login again for group changes
exit
ssh user@your-server-ip

# Verify
docker --version
```

## Step 2: Clone Repository

```bash
git clone <your-repo-url> ~/cvweb
cd ~/cvweb
```

## Step 3: Create Production Environment File

```bash
# Generate AUTH_SECRET
openssl rand -base64 32
# Copy the output for next step

# Create .env file
nano .env
```

Add all required variables:
```env
# Database (don't change this for Docker)
DATABASE_URL="file:/app/data/prod.db"

# NextAuth v5
AUTH_SECRET="<paste-generated-secret-here>"
AUTH_URL="https://yourdomain.com"

# App URL (used for CORS headers)
NEXT_PUBLIC_APP_URL="https://yourdomain.com"

# Admin credentials (used by seed script to create admin user)
ADMIN_EMAIL="admin@yourdomain.com"
ADMIN_PASSWORD="<strong-password-here>"

# Resend (email notifications)
RESEND_API_KEY="re_your_api_key"
NOTIFICATION_EMAIL="your@email.com"
SENDER_EMAIL="CV Contact Form <noreply@yourdomain.com>"

# reCAPTCHA v3 (register at https://www.google.com/recaptcha/admin)
NEXT_PUBLIC_RECAPTCHA_SITE_KEY="6Lxxx"
RECAPTCHA_SECRET_KEY="6Lxxx"

# Logging (debug | info | warn | error)
LOG_LEVEL="info"
```

Save: `Ctrl+O`, `Enter`, `Ctrl+X`

## Step 4: Build and Start

```bash
# Build and start (migrations + seed run automatically on container startup)
docker compose up -d --build
```

Verify running:
```bash
docker compose ps
curl http://localhost:3000/api/health
```

Expected health response:
```json
{"status":"healthy","checks":{"db":true,"resendKey":true,"senderEmail":true,"recaptcha":true}}
```

If any check is `false`, review the matching env var in `.env`.

> **Existing production DB?** Move your DB file into the Docker volume before starting, then resolve migrations:
> ```bash
> docker compose exec cvweb npx prisma migrate resolve --applied 20260206000000_init
> ```

## Step 5: Setup Nginx Reverse Proxy

```bash
sudo apt update
sudo apt install nginx -y

# Create config
sudo nano /etc/nginx/sites-available/cvweb
```

Paste:
```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
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

Enable site:
```bash
sudo ln -s /etc/nginx/sites-available/cvweb /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default  # Remove default
sudo nginx -t  # Test config
sudo systemctl restart nginx
```

## Step 6: SSL Certificate (HTTPS)

```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

Follow prompts. Certbot auto-renews.

## Step 7: Update URLs After Domain Setup

After domain + SSL are configured:
```bash
nano .env
# Set AUTH_URL and NEXT_PUBLIC_APP_URL to https://yourdomain.com
docker compose up -d --build
```

## Verify Deployment

1. Visit `https://yourdomain.com` — site loads
2. Test contact form — sends email notification
3. Login at `https://yourdomain.com/admin/login` with ADMIN_EMAIL/ADMIN_PASSWORD
4. Check admin dashboard — health widget should show all green
5. Visit `/admin/analytics` — analytics page loads
6. `curl https://yourdomain.com/api/health` — returns `{"status":"healthy",...}`

## Troubleshooting

```bash
# View logs
docker compose logs -f

# Restart
docker compose restart

# Check nginx
sudo nginx -t
sudo systemctl status nginx

# Check ports
sudo lsof -i :3000
sudo lsof -i :80

# Check health
curl http://localhost:3000/api/health

# Check migration status
docker compose exec cvweb npx prisma migrate status

# Re-seed admin user (if locked out)
docker compose exec cvweb npx tsx scripts/seed.ts
```

## Firewall (if enabled)

```bash
sudo ufw allow 80
sudo ufw allow 443
sudo ufw allow 22
```
