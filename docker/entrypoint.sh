#!/bin/bash

# Install dependencies if vendor doesn't exist
if [ ! -d "/var/www/html/vendor" ]; then
  echo "Installing Composer dependencies..."
  cd /var/www/html
  composer install --no-dev --optimize-autoloader
fi

# Wait a moment for MySQL to be ready
echo "Waiting for MySQL to initialize..."
sleep 5

# Try to run database setup (will retry if MySQL not ready)
echo "Attempting database setup..."
cd /var/www/html
php setup.php 2>&1 || echo "Database setup will retry on next request"

# Start Apache
echo "Starting Apache..."
apache2-foreground
