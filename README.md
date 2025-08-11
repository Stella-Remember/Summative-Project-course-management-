# Course Management Platform Backend System

A comprehensive Course Management Platform backend system built with Node.js, Express, MySQL, and Redis. This system provides role-based access control, course allocation management, facilitator activity tracking, and automated notification systems for academic institutions.

## i18n & l10n Implementation 
Hosted Url:https://coursemanagmentv3.netlify.app/

## Video
Video Walkthrough:https://drive.google.com/file/d/1aSctmObLacTf-eYASRCJyuZiooChBp7I/view?usp=sharing

## 🚀 Features

### Core Functionality
- **Multi-role Authentication System** - JWT-based authentication with role-based access control
- **Course Allocation Management** - Full CRUD operations for managing course assignments
- **Facilitator Activity Tracking** - Weekly activity logging with automated reminders
- **Real-time Notifications** - Redis-backed notification system with background workers
- **Comprehensive API Documentation** - Swagger/OpenAPI documentation
- **Internationalization Support** - Multilingual reflection page with i18n/l10n

### Technical Highlights
- **Security First** - bcrypt password hashing, input validation, rate limiting
- **Scalable Architecture** - Modular design with proper separation of concerns
- **Database Management** - Normalized MySQL schema with Sequelize ORM
- **Background Processing** - Bull queues for automated task handling
- **Comprehensive Testing** - Unit tests for models, routes, and utilities
- **Production Ready** - Error handling, logging, and performance monitoring

## 📋 Table of Contents

- [Setup and Installation](#setup-and-installation)
- [Configuration](#configuration)
- [Database Setup](#database-setup)
- [API Documentation](#api-documentation)
- [Authentication](#authentication)
- [System Architecture](#system-architecture)
- [Testing](#testing)
- [Assumptions and Limitations](#assumptions-and-limitations)
- [Contributing](#contributing)

## 🛠 Setup and Installation

### Prerequisites
- **Node.js** 16+ 
- **MySQL** 8.0+
- **Redis** 6.0+
- **npm** or **yarn**

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd course-management-platform
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your configurations:
   ```env
   # Database Configuration
   DB_HOST=localhost
   DB_PORT=3306
   DB_NAME=course_management
   DB_USER=root
   DB_PASSWORD=your_password

   # JWT Configuration
   JWT_SECRET=your-super-secret-jwt-key
   JWT_EXPIRES_IN=24h

   # Redis Configuration
   REDIS_HOST=localhost
   REDIS_PORT=6379
   REDIS_PASSWORD=

   # Server Configuration
   PORT=3000
   NODE_ENV=development
   ```

4. **Database Setup**
   ```bash
   # Create MySQL database
   mysql -u root -p -e "CREATE DATABASE course_management;"
   
   # Run database migrations and seeders
   npm run seed
   ```

5. **Start the application**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

6. **Verify Installation**
   - Server: http://localhost:3000
   - API Docs: http://localhost:3000/api-docs
   - Reflection Page: http://localhost:3000/index.html
   - Health Check: http://localhost:3000/health

## ⚙️ Configuration

### Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `DB_HOST` | MySQL host | localhost | Yes |
| `DB_PORT` | MySQL port | 3306 | Yes |
| `DB_NAME` | Database name | course_management | Yes |
| `DB_USER` | Database user | root | Yes |
| `DB_PASSWORD` | Database password | - | Yes |
| `JWT_SECRET` | JWT signing secret | - | Yes |
| `JWT_EXPIRES_IN` | Token expiration | 24h | No |
| `REDIS_HOST` | Redis host | localhost | Yes |
| `REDIS_PORT` | Redis port | 6379 | Yes |
| `REDIS_PASSWORD` | Redis password | - | No |
| `PORT` | Server port | 3000 | No |
| `NODE_ENV` | Environment | development | No |

### Database Schema

The system uses a normalized MySQL schema with the following entities:

- **Users** - Base authentication and profile information
- **Managers** - Academic managers with administrative privileges
- **Facilitators** - Course instructors with teaching responsibilities
- **Students** - Learners enrolled in courses
- **Modules** - Course curriculum definitions
- **Cohorts** - Student groups and enrollment periods
- **Classes** - Academic terms (e.g., '2024S', '2025J')
- **Modes** - Delivery methods (online, in-person, hybrid)
- **Course Offerings** - Specific course instances with scheduling
- **Activity Trackers** - Weekly facilitator activity logs
- **Notifications** - System-generated alerts and reminders

## 📚 API Documentation

### Base URL
```
http://localhost:3000/api
```

### Interactive Documentation
Access comprehensive API documentation at: **http://localhost:3000/api-docs**

### Authentication Header
All protected endpoints require JWT authentication:
```
Authorization: Bearer <your-jwt-token>
```

---

## 🔐 Authentication Endpoints

### Register User
**POST** `/api/auth/register`

Creates a new user account with role-specific data.

**Request Body:**
```json
{
  "email": "manager@example.com",
  "password": "securePassword123",
  "first_name": "John",
  "last_name": "Manager",
  "role": "manager",
  "department": "Computer Science"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": 1,
      "email": "manager@example.com",
      "first_name": "John",
      "last_name": "Manager",
      "role": "manager",
      "is_active": true,
      "created_at": "2024-01-15T10:30:00.000Z",
      "updated_at": "2024-01-15T10:30:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Responses:**
- **400** - Validation errors
- **409** - User already exists

### Login User
**POST** `/api/auth/login`

Authenticates user and returns JWT token.

**Request Body:**
```json
{
  "email": "manager@example.com",
  "password": "securePassword123"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": 1,
      "email": "manager@example.com",
      "first_name": "John",
      "last_name": "Manager",
      "role": "manager",
      "is_active": true
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Responses:**
- **401** - Invalid credentials or inactive account

### Get User Profile
**GET** `/api/auth/profile`

Retrieves authenticated user's profile information.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "email": "manager@example.com",
      "first_name": "John",
      "last_name": "Manager",
      "role": "manager",
      "is_active": true,
      "Manager": {
        "id": 1,
        "department": "Computer Science",
        "permissions": {
          "course_allocation": true,
          "view_all_activities": true,
          "manage_users": true
        }
      }
    }
  }
}
```

---

## 📚 Course Management Endpoints

### Create Course Offering
**POST** `/api/courses/offerings` *(Manager Only)*

Creates a new course offering assignment.

**Request Body:**
```json
{
  "module_id": 1,
  "class_id": 1,
  "cohort_id": 1,
  "facilitator_id": 1,
  "mode_id": 1,
  "trimester": "1",
  "intake_period": "HT1",
  "start_date": "2024-01-15",
  "end_date": "2024-04-15",
  "max_enrollment": 30
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Course offering created successfully",
  "data": {
    "offering": {
      "id": 1,
      "module_id": 1,
      "class_id": 1,
      "cohort_id": 1,
      "facilitator_id": 1,
      "mode_id": 1,
      "trimester": "1",
      "intake_period": "HT1",
      "start_date": "2024-01-15",
      "end_date": "2024-04-15",
      "max_enrollment": 30,
      "is_active": true,
      "module": {
        "id": 1,
        "code": "CS101",
        "name": "Introduction to Programming",
        "credits": 3
      },
      "facilitator": {
        "id": 1,
        "User": {
          "first_name": "Bob",
          "last_name": "Smith"
        }
      }
    }
  }
}
```

### Get Course Offerings
**GET** `/api/courses/offerings`

Retrieves course offerings with optional filtering.

**Query Parameters:**
- `trimester` - Filter by trimester (1, 2, 3)
- `cohort_id` - Filter by cohort ID
- `intake_period` - Filter by intake (HT1, HT2, FT)
- `facilitator_id` - Filter by facilitator (Manager only)
- `mode_id` - Filter by delivery mode
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)

**Example Request:**
```
GET /api/courses/offerings?trimester=1&cohort_id=1&page=1&limit=5
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "offerings": [
      {
        "id": 1,
        "trimester": "1",
        "intake_period": "HT1",
        "start_date": "2024-01-15",
        "end_date": "2024-04-15",
        "module": {
          "code": "CS101",
          "name": "Introduction to Programming"
        },
        "facilitator": {
          "User": {
            "first_name": "Bob",
            "last_name": "Smith"
          }
        },
        "cohort": {
          "name": "Software Engineering 2024"
        },
        "mode": {
          "name": "online"
        }
      }
    ],
    "pagination": {
      "total": 15,
      "page": 1,
      "limit": 5,
      "pages": 3
    }
  }
}
```

### Update Course Offering
**PUT** `/api/courses/offerings/:id` *(Manager Only)*

Updates an existing course offering.

**Request Body:**
```json
{
  "facilitator_id": 2,
  "mode_id": 2,
  "max_enrollment": 25,
  "is_active": true
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Course offering updated successfully",
  "data": {
    "offering": {
      "id": 1,
      "facilitator_id": 2,
      "mode_id": 2,
      "max_enrollment": 25,
      "is_active": true
    }
  }
}
```

### Delete Course Offering
**DELETE** `/api/courses/offerings/:id` *(Manager Only)*

Deletes a course offering.

**Response (200):**
```json
{
  "success": true,
  "message": "Course offering deleted successfully"
}
```

---

## 📊 Activity Tracking Endpoints

### Create/Update Activity Log
**POST** `/api/activities` *(Facilitator Only)*

Creates or updates a weekly activity log entry.

**Request Body:**
```json
{
  "allocation_id": 1,
  "week_number": 5,
  "attendance": [true, false, true, true, false],
  "formative_one_grading": "Done",
  "formative_two_grading": "Pending",
  "summative_grading": "Not Started",
  "course_moderation": "Done",
  "intranet_sync": "Pending",
  "grade_book_status": "Not Started",
  "notes": "Good progress this week. Two students absent due to illness."
}
```

**Response (201/200):**
```json
{
  "success": true,
  "message": "Activity tracker entry created successfully",
  "data": {
    "activity": {
      "id": 1,
      "allocation_id": 1,
      "week_number": 5,
      "attendance": [true, false, true, true, false],
      "formative_one_grading": "Done",
      "formative_two_grading": "Pending",
      "summative_grading": "Not Started",
      "course_moderation": "Done",
      "intranet_sync": "Pending",
      "grade_book_status": "Not Started",
      "notes": "Good progress this week. Two students absent due to illness.",
      "submitted_at": "2024-01-15T14:30:00.000Z",
      "courseOffering": {
        "id": 1,
        "module": {
          "code": "CS101",
          "name": "Introduction to Programming"
        }
      }
    }
  }
}
```

### Get Activity Logs
**GET** `/api/activities`

Retrieves activity logs with filtering options.

**Query Parameters:**
- `allocation_id` - Filter by course offering
- `week_number` - Filter by week
- `facilitator_id` - Filter by facilitator (Manager only)
- `page` - Page number
- `limit` - Items per page

**Response (200):**
```json
{
  "success": true,
  "data": {
    "activities": [
      {
        "id": 1,
        "week_number": 5,
        "attendance": [true, false, true, true, false],
        "formative_one_grading": "Done",
        "submitted_at": "2024-01-15T14:30:00.000Z",
        "courseOffering": {
          "module": {
            "code": "CS101",
            "name": "Introduction to Programming"
          },
          "facilitator": {
            "User": {
              "first_name": "Bob",
              "last_name": "Smith"
            }
          }
        }
      }
    ],
    "pagination": {
      "total": 8,
      "page": 1,
      "limit": 10,
      "pages": 1
    }
  }
}
```

---

## 👥 User Management Endpoints

### Get All Users
**GET** `/api/users` *(Manager Only)*

Retrieves all users with role filtering and pagination.

**Query Parameters:**
- `role` - Filter by role (manager, facilitator, student)
- `is_active` - Filter by active status
- `page` - Page number
- `limit` - Items per page

**Response (200):**
```json
{
  "success": true,
  "data": {
    "users": [
      {
        "id": 1,
        "email": "facilitator1@example.com",
        "first_name": "Bob",
        "last_name": "Smith",
        "role": "facilitator",
        "is_active": true,
        "Facilitator": {
          "employee_id": "EMP001",
          "specialization": "Programming and Software Development"
        }
      }
    ],
    "pagination": {
      "total": 5,
      "page": 1,
      "limit": 10,
      "pages": 1
    }
  }
}
```

### Get Facilitators
**GET** `/api/users/facilitators`

Retrieves all active facilitators.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "facilitators": [
      {
        "id": 1,
        "employee_id": "EMP001",
        "specialization": "Programming and Software Development",
        "User": {
          "id": 2,
          "first_name": "Bob",
          "last_name": "Smith",
          "email": "facilitator1@example.com"
        }
      }
    ]
  }
}
```

---

## 🔔 Notification Endpoints

### Get Notifications
**GET** `/api/notifications`

Retrieves user notifications with filtering.

**Query Parameters:**
- `is_read` - Filter by read status (true/false)
- `type` - Filter by type (reminder, alert, info, warning)
- `page` - Page number
- `limit` - Items per page

**Response (200):**
```json
{
  "success": true,
  "data": {
    "notifications": [
      {
        "id": 1,
        "type": "reminder",
        "title": "Activity Log Reminder",
        "message": "Please submit your activity log for week 5. Deadline is approaching.",
        "is_read": false,
        "sent_at": "2024-01-15T09:00:00.000Z",
        "metadata": {
          "week": 5,
          "courseOfferingId": 1,
          "deadline": "2024-01-21T23:59:59.000Z"
        }
      }
    ],
    "pagination": {
      "total": 3,
      "page": 1,
      "limit": 10,
      "pages": 1
    }
  }
}
```

### Mark Notification as Read
**PUT** `/api/notifications/:id/read`

Marks a specific notification as read.

**Response (200):**
```json
{
  "success": true,
  "message": "Notification marked as read",
  "data": {
    "notification": {
      "id": 1,
      "is_read": true,
      "updated_at": "2024-01-15T15:30:00.000Z"
    }
  }
}
```

---

## 🏥 System Endpoints

### Health Check
**GET** `/health`

Returns system health status and uptime.

**Response (200):**
```json
{
  "status": "OK",
  "timestamp": "2024-01-15T15:30:00.000Z",
  "uptime": 3600.5
}
```

---

## 📱 HTTP Status Codes

| Code | Description | Usage |
|------|-------------|-------|
| 200 | OK | Successful GET, PUT requests |
| 201 | Created | Successful POST requests |
| 400 | Bad Request | Validation errors, malformed requests |
| 401 | Unauthorized | Missing or invalid authentication |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource not found |
| 409 | Conflict | Duplicate resource creation |
| 500 | Internal Server Error | Server-side errors |

---

## 🔐 Authentication

### JWT Token Authentication

The system uses JSON Web Tokens for stateless authentication:

1. **Registration/Login** - Receive JWT token upon successful authentication
2. **Token Storage** - Store token securely on client side
3. **Request Authorization** - Include token in Authorization header
4. **Token Expiration** - Tokens expire after 24 hours (configurable)

### Role-Based Access Control

- **Managers** - Full system access, course allocation management, user management
- **Facilitators** - Access to assigned courses and activity logging
- **Students** - Limited access to their enrollment information

### Security Features

- **Password Hashing** - bcrypt with salt rounds
- **Input Validation** - express-validator for all endpoints
- **Rate Limiting** - 100 requests per 15 minutes per IP
- **CORS Protection** - Configurable cross-origin policies
- **Helmet Security** - Security headers and protection

---

## 🏗 System Architecture

### Project Structure
```
src/
├── config/          # Database and Redis configuration
├── middleware/      # Authentication and validation middleware
├── models/          # Sequelize database models
├── routes/          # Express route handlers
├── services/        # Business logic and external services
├── tests/           # Unit and integration tests
├── seeders/         # Database seeding scripts
└── server.js        # Application entry point

public/              # Static files for reflection page
├── index.html       # Multilingual reflection page
├── styles.css       # Responsive CSS styling
├── index.js         # Client-side JavaScript
└── translations.js  # i18n translation data
```

### Database Relationships

- **One-to-One**: User ↔ Manager/Facilitator/Student
- **One-to-Many**: Facilitator → Course Offerings
- **One-to-Many**: Course Offering → Activity Trackers
- **Many-to-One**: Students → Cohorts
- **Many-to-One**: Course Offerings → Modules/Classes/Cohorts/Modes

### Redis Integration

Redis is used for:
- **Notification Queues** - Background job processing with Bull
- **Session Management** - Token blacklisting and session storage
- **Caching** - Frequently accessed data caching
- **Rate Limiting** - API request throttling

---

## 🧪 Testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

### Test Coverage

The test suite includes:
- **Model Tests** - Database model validation and methods
- **Route Tests** - API endpoint functionality and authorization
- **Service Tests** - Business logic and external integrations
- **Utility Tests** - Helper functions and middleware

### Test Accounts

After running the seeder, use these test accounts:

```
Manager:      manager@coursemanagement.com / manager123
Facilitator:  facilitator1@coursemanagement.com / facilitator123
Student:      student1@coursemanagement.com / student123
```

---

## 🌐 Internationalization (i18n)

### Reflection Page Features

The student reflection page demonstrates:
- **Language Switching** - English ↔ French toggle
- **Dynamic Content** - Real-time language switching
- **Browser Detection** - Automatic language detection
- **Persistent Preferences** - LocalStorage language saving
- **Accessibility** - Keyboard navigation and ARIA labels

### Accessing the Reflection Page

The multilingual reflection page is available at:
```
http://localhost:3000/index.html
```

Features:
- Responsive design for all devices
- Smooth animations and transitions
- Technical implementation highlights
- Personal learning reflections

---

## 🔧 Assumptions and Limitations

### Assumptions Made

1. **Database Assumptions**
   - MySQL 8.0+ is available and properly configured
   - Database user has full privileges for the specified database
   - Redis server is running and accessible
   - Single database instance (no sharding or clustering)

2. **Authentication Assumptions**
   - JWT tokens are stored securely on the client side
   - Token expiration is handled gracefully by client applications
   - Users have unique email addresses across the system
   - Password complexity is enforced at the application level

3. **Business Logic Assumptions**
   - Academic years follow standard calendar patterns
   - Week numbers are calculated based on calendar weeks (1-52)
   - Course offerings are unique per module/class/cohort/trimester/intake combination
   - Facilitators can be assigned to multiple courses simultaneously
   - Activity logs are submitted weekly and can be updated retroactively

4. **Notification System Assumptions**
   - Redis server maintains persistence for critical notifications
   - Background workers process notifications within reasonable time frames
   - Email integration is not implemented (notifications are in-system only)
   - Notification delivery failures are logged but don't block operations

### Current Limitations

1. **Scalability Limitations**
   - Single Redis instance (no clustering implemented)
   - No database connection pooling optimization
   - File uploads not implemented for course materials
   - No caching layer for frequently accessed data

2. **Feature Limitations**
   - No real-time WebSocket notifications
   - No email notification integration
   - No file attachment support for activity logs
   - No audit logging for data changes
   - No data export/import functionality

3. **Security Limitations**
   - No OAuth2 or SSO integration
   - No API rate limiting per user (only per IP)
   - No password reset functionality via email
   - No account lockout after failed login attempts
   - No two-factor authentication support

4. **Integration Limitations**
   - No external calendar system integration
   - No LMS (Learning Management System) integration
   - No student information system integration
   - No reporting and analytics dashboard

5. **Operational Limitations**
   - No automated backup system
   - No health monitoring and alerting
   - No log aggregation and analysis
   - No performance monitoring and metrics
   - No deployment automation (CI/CD)

### Recommended Improvements

1. **Short-term Improvements**
   - Implement password reset functionality
   - Add comprehensive audit logging
   - Create admin dashboard for system monitoring
   - Add data validation at database level
   - Implement API versioning

2. **Medium-term Improvements**
   - Add real-time notifications with WebSocket
   - Implement file upload capabilities
   - Create reporting and analytics features
   - Add email notification integration
   - Implement caching strategies

3. **Long-term Improvements**
   - Microservices architecture migration
   - Implement OAuth2 and SSO
   - Add comprehensive monitoring and alerting
   - Create mobile API endpoints
   - Implement advanced security features

### Performance Considerations

- **Database Queries**: Some complex joins may require optimization for large datasets
- **Redis Memory**: Notification queues may consume significant memory with high activity
- **Concurrent Users**: System tested with moderate concurrent load only
- **File Storage**: No cloud storage integration for scalable file handling

### Data Integrity Considerations

- **Foreign Key Constraints**: Properly implemented to maintain referential integrity
- **Transaction Handling**: Critical operations use database transactions
- **Data Validation**: Input validation at both application and database levels
- **Backup Strategy**: Manual backup procedures (automated backup not implemented)

---

## 🤝 Contributing

### Development Guidelines

1. **Code Style** - Follow ESLint configuration
2. **Testing** - Write tests for new features
3. **Documentation** - Update API documentation
4. **Security** - Follow security best practices

### Commit Message Format
```
type(scope): description

feat(auth): add password reset functionality
fix(api): resolve course allocation validation
docs(readme): update installation instructions
```

---

## 📞 Support and Contact

For questions, issues, or contributions:

- **Documentation**: Check the comprehensive API docs at `/api-docs`
- **Issues**: Report bugs and feature requests
- **Testing**: Use the provided test accounts for development

---

## 📄 License

This project is licensed under the MIT License. See the LICENSE file for details.

---
