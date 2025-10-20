# =====================================================
# Stage 1: Base PHP Image
# =====================================================
FROM php:8.4-fpm-alpine AS base

# Install system dependencies
RUN apk add --no-cache \
    git \
    curl \
    libpng-dev \
    libxml2-dev \
    zip \
    unzip \
    oniguruma-dev \
    libzip-dev \
    freetype-dev \
    libjpeg-turbo-dev \
    libwebp-dev \
    icu-dev \
    mysql-client \
    && apk add --no-cache --virtual .build-deps $PHPIZE_DEPS \
    && pecl install redis \
    && docker-php-ext-enable redis \
    && apk del .build-deps \
    && docker-php-ext-configure gd --with-freetype --with-jpeg --with-webp \
    && docker-php-ext-install -j$(nproc) \
        pdo_mysql \
        mbstring \
        exif \
        pcntl \
        bcmath \
        gd \
        zip \
        intl \
        opcache

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /var/www/html

# =====================================================
# Stage 2: Development
# =====================================================
FROM base AS development

# Install additional development tools
RUN apk add --no-cache \
    nodejs \
    npm \
    supervisor

# Copy PHP configuration for development
COPY docker/php/php.ini /usr/local/etc/php/php.ini

# Copy supervisor configuration
COPY docker/php/supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Copy application files
COPY backend/ .

# Install PHP dependencies
RUN composer install --no-interaction --prefer-dist --optimize-autoloader

# Set proper permissions
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 755 /var/www/html/storage \
    && chmod -R 755 /var/www/html/bootstrap/cache

# Expose port
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8000/api/health || exit 1

# Development command
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]

# =====================================================
# Stage 3: Production
# =====================================================
FROM base AS production

# Copy PHP configuration for production
COPY docker/php/php.ini /usr/local/etc/php/php.ini

# Copy application files
COPY backend/ .

# Install PHP dependencies (production only)
RUN composer install --no-interaction --prefer-dist --optimize-autoloader --no-dev

# Set proper permissions
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 755 /var/www/html/storage \
    && chmod -R 755 /var/www/html/bootstrap/cache

# Optimize Laravel for production
RUN php artisan config:cache \
    && php artisan route:cache \
    && php artisan view:cache

# Expose port
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8000/api/health || exit 1

# Production command
CMD ["php-fpm"]

# =====================================================
# BUILD INSTRUCTIONS
# =====================================================
#
# Development build:
#   docker build --target development -t task-manager-backend:dev .
#
# Production build:
#   docker build --target production -t task-manager-backend:prod .
#
# =====================================================
