# Sử dụng PHP 8.2 FPM làm base image
FROM php:8.2-fpm

# Cài đặt các dependencies hệ thống
RUN apt-get update && apt-get install -y \
    libpng-dev \
    libjpeg-dev \
    libfreetype6-dev \
    libzip-dev \
    zip \
    unzip \
    git \
    curl

# Cài đặt các PHP extensions cần thiết
# Thêm mysqli để tương thích với mã nguồn hiện tại
RUN docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install pdo_mysql mysqli gd zip

# Cài đặt Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Thiết lập thư mục làm việc
WORKDIR /var/www/html
