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
nano .env
```

Add all required variables:
```env
# App URL (used for CORS headers)
NEXT_PUBLIC_APP_URL="https://yourdomain.com"

# Resend (email notifications)
RESEND_API_KEY="re_your_api_key"
NOTIFICATION_EMAIL="your@email.com"
SENDER_EMAIL="CV Contact Form <noreply@yourdomain.com>"

# reCAPTCHA v3 (register at https://www.google.com/recaptcha/admin)
NEXT_PUBLIC_RECAPTCHA_SITE_KEY="6Lxxx"
RECAPTCHA_SECRET_KEY="6Lxxx"

# Logging (debug | info | warn | error)
LOG_LEVEL="info"

# Feature toggles
SHOW_CV_DOWNLOAD=true
SHOW_CONTACT_FORM=true
SHOW_MAIL_TO_SIDEBAR=true
SHOW_PORTFOLIO=false
SHOW_SCHEDULE_MEETING=false
SHOW_GIT_HUB=true
SHOW_LINKED_IN=true
```

Save: `Ctrl+O`, `Enter`, `Ctrl+X`

## Step 4: Build and Start

```bash
docker compose up -d --build
```

Verify running:
```bash
docker compose ps
curl http://localhost:3000
```

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
# Set NEXT_PUBLIC_APP_URL to https://yourdomain.com
docker compose up -d --build
```

## Verify Deployment

1. Visit `https://yourdomain.com` — site loads
2. Test contact form — sends email notification

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
```

## Firewall (if enabled)

```bash
sudo ufw allow 80
sudo ufw allow 443
sudo ufw allow 22
```
