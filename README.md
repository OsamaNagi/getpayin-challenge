# Social Media Post Scheduler

A robust social media post scheduling and management system built with Laravel, React, and Inertia.js. This application allows users to schedule and manage posts across multiple social media platforms with a modern, user-friendly interface.

## Features

- **Multi-Platform Support**: Schedule posts for multiple social media platforms (Instagram, Facebook, Twitter, LinkedIn)
- **Post Management**:
    - Create and schedule posts with text and images
    - View post status across different platforms
    - Edit scheduled posts
    - Delete posts
- **Platform Integration**:
    - Activate/deactivate social media platforms
    - Real-time status updates for post publishing
    - Automatic retry mechanism for failed posts
- **Calendar View**: Visual calendar interface for post scheduling
- **Automated Publishing**: Scheduled posts are automatically published when due
- **Timezone Support**: Proper handling of timezones between frontend and backend
- **Error Handling**: Robust error handling for various scenarios:
    - Rate limiting
    - Validation errors
    - Server errors with automatic retries
- **Modern UI**: Clean and responsive interface built with Tailwind CSS

## Tech Stack

- **Backend**:
    - PHP 8.4
    - Laravel (Latest)
    - MySQL/PostgreSQL
    - PHPStan for static analysis
    - Pest PHP for testing
- **Frontend**:
    - React
    - TypeScript
    - Tailwind CSS
    - Inertia.js
    - Full Calendar for calendar view
    - date-fns for date manipulation

## Project Structure

```
app/
├── Actions/          # Business logic actions
├── Enums/           # Enumerations for statuses and types
├── Http/
│   ├── Controllers/ # Request handlers
│   └── Requests/    # Form request validation
├── Jobs/            # Background jobs
├── Models/          # Eloquent models
└── Services/        # External service integrations

tests/
├── Feature/         # Feature tests
│   ├── Http/       # Controller tests
│   └── Jobs/       # Job tests
└── Unit/           # Unit tests
    └── Actions/    # Action tests
```

## Setup Instructions

1. Clone the repository:

    ```bash
    git clone <repository-url>
    cd project-directory
    ```

2. Install PHP dependencies:

    ```bash
    composer install
    ```

3. Install JavaScript dependencies:

    ```bash
    npm install
    ```

4. Configure environment:

    ```bash
    cp .env.example .env
    php artisan key:generate
    ```

5. Set up the database:

    ```bash
    php artisan migrate
    ```

6. Build assets:

    ```bash
    npm run dev
    ```

7. Start the development server:
    ```bash
    php artisan serve
    ```

## Testing

Run the test suite:

```bash
composer test
```

Run code style checks:

```bash
composer lint
```

## Database Setup

### Migrations

The project uses Laravel's migration system for database schema management:

```bash
# Run all migrations
php artisan migrate

# Reset and re-run all migrations
php artisan migrate:fresh

# Run migrations with seed data
php artisan migrate --seed
```

### Database Seeders

The following seeders are available:

1. `PlatformSeeder`: Creates default social media platforms

    ```bash
    php artisan db:seed --class=PlatformSeeder
    ```

2. `PostSeeder`: Creates sample posts with various statuses
    ```bash
    php artisan db:seed --class=PostSeeder
    ```

Run all seeders:

```bash
php artisan db:seed
```

## Detailed Installation Guide

### Prerequisites

- PHP 8.4 or higher
- Composer
- Node.js 16+ and npm
- MySQL 8.0+ or PostgreSQL 13+
- Redis (for queue processing)

### Environment Configuration

1. Configure database connection in `.env`:

    ```env
    DB_CONNECTION=mysql
    DB_HOST=127.0.0.1
    DB_PORT=3306
    DB_DATABASE=your_database
    DB_USERNAME=your_username
    DB_PASSWORD=your_password
    ```

2. Configure queue connection:

    ```env
    QUEUE_CONNECTION=redis
    REDIS_HOST=127.0.0.1
    REDIS_PASSWORD=null
    REDIS_PORT=6379
    ```

3. Set up timezone (required for proper scheduling):
    ```env
    APP_TIMEZONE=Africa/Cairo
    ```

4. Set up social media API credentials:
    ```env
    FACEBOOK_CLIENT_ID=your_client_id
    FACEBOOK_CLIENT_SECRET=your_client_secret
    TWITTER_API_KEY=your_api_key
    TWITTER_API_SECRET=your_api_secret
    # ... other platform credentials
    ```

### Running Jobs and Scheduled Tasks

1. Process posts that are due to be published:

    ```bash
    php artisan posts:process-due
    ```

2. Run the queue worker to process pending jobs:

    ```bash
    # Process all queues
    php artisan queue:work
    
    # Process specific queues
    php artisan queue:work --queue=posts
    ```

3. Set up automatic scheduled tasks:
    ```bash
    # Add to server crontab
    * * * * * cd /path-to-project && php artisan schedule:run >> /dev/null 2>&1
    ```

### Development Environment

1. Start Vite development server:

    ```bash
    npm run dev
    ```

2. Watch for file changes:
    ```bash
    npm run watch
    ```

3. Build for production:
    ```bash
    npm run build
    ```

## Architecture and Design Decisions

### Approach

1. **Action Pattern**

    - Business logic is encapsulated in dedicated Action classes
    - Each action has a single responsibility
    - Makes the code more testable and maintainable

2. **Job Queue System**

    - Asynchronous processing for social media posts
    - Automatic retry mechanism for failed attempts
    - Rate limiting handling
    - Separate queues for different job types (default and posts)

3. **Platform Integration**
    - Mock service for development and testing
    - Adapter pattern for different social media platforms
    - Easy to add new platforms

### UI/UX Considerations

1. **Responsive Design**
    - Mobile-friendly layout
    - Proper text truncation for long titles and content
    - Hover tooltips for viewing full text

2. **Timezone Handling**
    - Proper conversion between frontend and backend timezones
    - Consistent date/time display across the application

3. **Status Indicators**
    - Color-coded badges for post and platform statuses
    - Clear visual feedback for users

### Trade-offs and Considerations

1. **Database Design**

    - Used pivot tables for many-to-many relationships
    - Stored platform credentials as JSON for flexibility
    - Trade-off: Less structured but more adaptable to platform changes

2. **Error Handling**

    - Comprehensive error states for each platform
    - Detailed error logging for troubleshooting
    - User-friendly error messages

## Production Deployment

For production environments, ensure you:

1. Set up a proper queue worker using Supervisor:
    ```
    [program:laravel-worker]
    process_name=%(program_name)s_%(process_num)02d
    command=php /path/to/your/project/artisan queue:work --queue=default,posts --tries=3
    autostart=true
    autorestart=true
    user=www-data
    numprocs=8
    redirect_stderr=true
    stdout_logfile=/path/to/your/project/storage/logs/worker.log
    ```

2. Configure the scheduler to run every minute:
    ```
    * * * * * cd /path/to/your/project && php artisan schedule:run >> /dev/null 2>&1
    ```

3. Optimize the application:
    ```bash
    php artisan optimize
    php artisan route:cache
    php artisan config:cache
    php artisan view:cache
    ```
