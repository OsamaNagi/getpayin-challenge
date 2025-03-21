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

2. `UserSeeder`: Creates test users with different roles

    ```bash
    php artisan db:seed --class=UserSeeder
    ```

3. `PostSeeder`: Creates sample posts with various statuses
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

3. Set up social media API credentials:
    ```env
    FACEBOOK_CLIENT_ID=your_client_id
    FACEBOOK_CLIENT_SECRET=your_client_secret
    TWITTER_API_KEY=your_api_key
    TWITTER_API_SECRET=your_api_secret
    # ... other platform credentials
    ```

### Queue Worker

Start the queue worker for background job processing:

```bash
php artisan queue:work --queue=posts
```

### Run The Command Job

Start Process all posts that are due to be published:

```bash
php artisan posts:process-due
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

3. **Platform Integration**
    - Mock service for development and testing
    - Adapter pattern for different social media platforms
    - Easy to add new platforms

### Trade-offs and Considerations

1. **Database Design**

    - Used pivot tables for many-to-many relationships
    - Stored platform credentials as JSON for flexibility
    - Trade-off: Less structured but more adaptable to platform changes

2. **Error Handling**

    - Comprehensive error states for each platform
    - Automatic retries with exponential backoff
    - Trade-off: Increased complexity for better reliability

3. **UI/UX Decisions**

    - Single-page application using Inertia.js
    - Real-time updates for post status
    - Trade-off: More complex frontend but better user experience

4. **Testing Strategy**
    - Feature tests for critical paths
    - Unit tests for business logic
    - Mock external services
    - Trade-off: Test coverage vs. development speed

### Future Improvements

1. **Scalability**

    - Implement caching for frequently accessed data
    - Add queue prioritization
    - Horizontal scaling for job workers

2. **Features**

    - Analytics dashboard
    - Content approval workflow
    - AI-powered content suggestions

3. **Monitoring**
    - Add detailed logging
    - Implement error tracking
    - Performance monitoring
