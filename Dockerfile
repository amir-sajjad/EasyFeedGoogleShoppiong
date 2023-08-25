FROM php:8.1-apache

# Install system dependencies
RUN apt-get update && apt-get install -y \
    libpng-dev \
    libjpeg-dev \
    libfreetype6-dev \
    zip \
    unzip \
    git \
    libgmp-dev \
    libzip-dev \
    libonig-dev \
    libmemcached-dev \
    libmemcached11 \
    libjpeg62-turbo-dev \
    libmagickwand-dev \
        nano \
        curl \
        wget \
        redis-tools


# Install PHP extensions
RUN docker-php-ext-configure gd --with-freetype --with-jpeg
RUN docker-php-ext-install gd pdo pdo_mysql gmp zip mbstring fileinfo mysqli
RUN pecl install redis && \
    docker-php-ext-enable redis
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer
# Enable Apache modules
RUN a2enmod rewrite
# Install NVM and Node.js
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
RUN export NVM_DIR="$HOME/.nvm" && \
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" && \
    [ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion" && \
    nvm install 18.15.0 && \
    nvm use 18.15.0
# Install supervisor
#RUN apt install supervisor -y
#RUN service supervisor start
COPY 000-default.conf /etc/apache2/sites-available/000-default.conf
# Set the working directory to /var/www/html
WORKDIR /var/www/html
COPY . /var/www/html
RUN composer install
# Expose port 80 to the host machine
EXPOSE 80

# Start Apache server when the container runs
CMD ["apache2-foreground"]
