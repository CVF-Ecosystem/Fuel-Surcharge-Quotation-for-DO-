#!/bin/bash
# ============================================================
# QD209 — Initial Server Setup Script
# Run this ONCE on the production server: bash setup-server.sh
# ============================================================
set -e

APP_DIR="/var/www/QD209"
APP_USER="root"
NODE_VERSION="20"

echo "=========================================="
echo "  QD209 Server Setup"
echo "=========================================="

# 1. System update
echo "[1/7] Updating system packages..."
apt-get update -y && apt-get upgrade -y

# 2. Install Node.js (via NodeSource)
echo "[2/7] Installing Node.js ${NODE_VERSION}.x..."
if ! command -v node &> /dev/null; then
    curl -fsSL https://deb.nodesource.com/setup_${NODE_VERSION}.x | bash -
    apt-get install -y nodejs
fi
echo "Node version: $(node -v)"
echo "npm version:  $(npm -v)"

# 3. Install PostgreSQL
echo "[3/7] Installing PostgreSQL..."
if ! command -v psql &> /dev/null; then
    apt-get install -y postgresql postgresql-contrib
    systemctl enable postgresql
    systemctl start postgresql
fi

# 4. Install Nginx
echo "[4/7] Installing Nginx..."
if ! command -v nginx &> /dev/null; then
    apt-get install -y nginx
    systemctl enable nginx
fi

# 5. Install PM2 globally
echo "[5/7] Installing PM2..."
if ! command -v pm2 &> /dev/null; then
    npm install -g pm2
    pm2 startup systemd -u ${APP_USER} --hp /root
fi

# 6. Create app directory
echo "[6/7] Setting up app directory..."
mkdir -p ${APP_DIR}

# 7. Setup Nginx config
echo "[7/7] Configuring Nginx..."
if [ -f "${APP_DIR}/deploy/nginx.conf" ]; then
    cp ${APP_DIR}/deploy/nginx.conf /etc/nginx/sites-available/qd209
    ln -sf /etc/nginx/sites-available/qd209 /etc/nginx/sites-enabled/qd209
    nginx -t && systemctl reload nginx
    echo "Nginx configured successfully."
else
    echo "Warning: nginx.conf not found yet. Run deploy first, then re-run this step."
fi

# 8. Setup PostgreSQL database
echo "[8] Setting up PostgreSQL database..."
sudo -u postgres psql -tc "SELECT 1 FROM pg_roles WHERE rolname='postgres'" | grep -q 1 || true
sudo -u postgres psql -tc "SELECT 1 FROM pg_database WHERE datname='logipro'" | grep -q 1 || \
    sudo -u postgres createdb logipro
echo "Database 'logipro' ready."

echo ""
echo "=========================================="
echo "  Setup complete!"
echo "  App directory: ${APP_DIR}"
echo "  Next: Push code to GitHub to trigger deploy"
echo "=========================================="
