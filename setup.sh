#!/bin/bash
set -e

echo "========================================="
echo "  Blog Deployment Setup Script"
echo "========================================="
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# 1. Copy Nginx config
echo -e "${GREEN}[1/4] Configuring Nginx...${NC}"
sudo cp /home/oesp/Desktop/hermes/blog/nginx-blog.conf /etc/nginx/sites-available/blog
sudo ln -sf /etc/nginx/sites-available/blog /etc/nginx/sites-enabled/blog
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t && sudo systemctl reload nginx
echo "  ✓ Nginx configured"

# 2. Save PM2 process list
echo -e "${GREEN}[2/4] Saving PM2 process list...${NC}"
pm2 save
echo "  ✓ PM2 process saved"

# 3. Setup PM2 startup
echo -e "${GREEN}[3/4] Setting up PM2 startup...${NC}"
pm2 startup systemd -u oesp --hp /home/oesp 2>/dev/null || true
echo "  ✓ PM2 startup configured"

# 4. Show status
echo ""
echo -e "${GREEN}[4/4] Deployment Status:${NC}"
echo "========================================="
pm2 status
echo ""
echo -e "${GREEN}Blog URL: http://$(hostname -I | awk '{print $1}')${NC}"
echo -e "${GREEN}Admin:    http://$(hostname -I | awk '{print $1}')/admin${NC}"
echo -e "${YELLOW}Admin Login: admin@blog.com / admin123${NC}"
echo ""
echo "========================================="
echo "  Setup complete!"
echo "========================================="
