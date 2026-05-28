#!/bin/bash
# Save PM2 process list
pm2 save

# Generate startup script
pm2 startup

echo "PM2 startup configured. Run the command above with sudo if prompted."
