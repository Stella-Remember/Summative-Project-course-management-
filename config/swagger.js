const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Course Management Platform API',
      version: '1.0.0',
      description: 'A comprehensive Course Management Platform backend system',
      contact: {
        name: 'API Support',
        email: 'support@coursemanagement.com'
      }
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 3000}`,
        description: 'Development server'
      },
      {
        url: 'http://localhost:3000/api',
        description: 'Development server with API prefix'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        // Authentication Schemas
        LoginRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              example: 'facilitator1@gmail.com'
            },
            password: {
              type: 'string',
              format: 'password',
              example: 'securepassword123'
            }
          }
        },
        RegisterRequest: {
          type: 'object',
          required: ['first_name', 'last_name', 'email', 'password', 'role'],
          properties: {
            first_name: {
              type: 'string',
              example: 'John'
            },
            last_name: {
              type: 'string',
              example: 'Doe'
            },
            email: {
              type: 'string',
              format: 'email',
              example: 'johndoe@email.com'
            },
            password: {
              type: 'string',
              format: 'password',
              example: 'securepassword123'
            },
            role: {
              type: 'string',
              enum: ['manager', 'facilitator', 'student'],
              example: 'facilitator'
            }
          }
        },
        AuthResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true
            },
            message: {
              type: 'string',
              example: 'Login successful'
            },
            token: {
              type: 'string',
              example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
            },
            user: {
              $ref: '#/components/schemas/User'
            }
          }
        },

        // User Management Schemas
        User: {
          type: 'object',
          required: ['first_name', 'last_name', 'email', 'role'],
          properties: {
            id: {
              type: 'string',
              example: '64bd...'
            },
            first_name: {
              type: 'string',
              example: 'John'
            },
            last_name: {
              type: 'string',
              example: 'Doe'
            },
            email: {
              type: 'string',
              format: 'email',
              example: 'johndoe@email.com'
            },
            role: {
              type: 'string',
              enum: ['manager', 'facilitator', 'student'],
              example: 'facilitator'
            },
            is_active: {
              type: 'boolean',
              example: true
            },
            created_at: {
              type: 'string',
              format: 'date-time',
              example: '2023-01-01T00:00:00Z'
            },
            updated_at: {
              type: 'string',
              format: 'date-time',
              example: '2023-01-01T00:00:00Z'
            }
          }
        },
        UserProfile: {
          type: 'object',
          properties: {
            user: {
              $ref: '#/components/schemas/User'
            },
            profile: {
              oneOf: [
                { $ref: '#/components/schemas/Manager' },
                { $ref: '#/components/schemas/Facilitator' },
                { $ref: '#/components/schemas/Student' }
              ]
            }
          }
        },

        // Role-specific Schemas
        Manager: {
          type: 'object',
          required: ['user_id', 'department'],
          properties: {
            id: {
              type: 'integer',
              example: 1
            },
            user_id: {
              type: 'string',
              format: 'uuid',
              example: '64bd...'
            },
            department: {
              type: 'string',
              example: 'Operations'
            },
            created_at: {
              type: 'string',
              format: 'date-time',
              example: '2023-01-01T00:00:00Z'
            }
          }
        },
        Facilitator: {
          type: 'object',
          required: ['user_id', 'qualification', 'location', 'department'],
          properties: {
            id: {
              type: 'integer',
              example: 1
            },
            user_id: {
              type: 'string',
              format: 'uuid',
              example: '64bd...'
            },
            qualification: {
              type: 'string',
              example: 'PhD in Computer Science'
            },
            location: {
              type: 'string',
              example: 'New York'
            },
            department: {
              type: 'string',
              example: 'Engineering'
            },
            created_at: {
              type: 'string',
              format: 'date-time',
              example: '2023-01-01T00:00:00Z'
            }
          }
        },
        Student: {
          type: 'object',
          required: ['user_id', 'cohort_id', 'class_id'],
          properties: {
            id: {
              type: 'integer',
              example: 1
            },
            user_id: {
              type: 'string',
              format: 'uuid',
              example: '64bd...'
            },
            cohort_id: {
              type: 'integer',
              example: 1
            },
            class_id: {
              type: 'integer',
              example: 1
            },
            created_at: {
              type: 'string',
              format: 'date-time',
              example: '2023-01-01T00:00:00Z'
            }
          }
        },

        // Course Management Schemas
        Class: {
          type: 'object',
          required: ['name', 'start_date', 'end_date'],
          properties: {
            id: {
              type: 'integer',
              example: 1
            },
            name: {
              type: 'string',
              example: 'Class A'
            },
            start_date: {
              type: 'string',
              format: 'date',
              example: '2023-01-01'
            },
            end_date: {
              type: 'string',
              format: 'date',
              example: '2023-06-01'
            },
            created_at: {
              type: 'string',
              format: 'date-time',
              example: '2023-01-01T00:00:00Z'
            }
          }
        },
        Cohort: {
          type: 'object',
          required: ['name'],
          properties: {
            id: {
              type: 'integer',
              example: 1
            },
            name: {
              type: 'string',
              example: 'Cohort A'
            },
            created_at: {
              type: 'string',
              format: 'date-time',
              example: '2023-01-01T00:00:00Z'
            }
          }
        },
        Module: {
          type: 'object',
          required: ['name', 'half'],
          properties: {
            id: {
              type: 'integer',
              example: 1
            },
            name: {
              type: 'string',
              example: 'Web Development Fundamentals'
            },
            half: {
              type: 'string',
              enum: ['HT1', 'HT2', 'FT'],
              example: 'FT'
            },
            created_at: {
              type: 'string',
              format: 'date-time',
              example: '2023-01-01T00:00:00Z'
            }
          }
        },
        Mode: {
          type: 'object',
          required: ['name'],
          properties: {
            id: {
              type: 'integer',
              example: 1
            },
            name: {
              type: 'string',
              enum: ['online', 'in-person', 'hybrid'],
              example: 'online'
            },
            created_at: {
              type: 'string',
              format: 'date-time',
              example: '2023-01-01T00:00:00Z'
            }
          }
        },
        CourseOffering: {
          type: 'object',
          required: ['module_id', 'class_id', 'cohort_id', 'facilitator_id', 'mode_id', 'trimester', 'year'],
          properties: {
            id: {
              type: 'integer',
              example: 1
            },
            module_id: {
              type: 'integer',
              example: 1
            },
            class_id: {
              type: 'integer',
              example: 1
            },
            cohort_id: {
              type: 'integer',
              example: 1
            },
            facilitator_id: {
              type: 'integer',
              example: 1
            },
            mode_id: {
              type: 'integer',
              example: 1
            },
            trimester: {
              type: 'integer',
              minimum: 1,
              maximum: 3,
              example: 1
            },
            year: {
              type: 'integer',
              example: 2023
            },
            created_at: {
              type: 'string',
              format: 'date-time',
              example: '2023-01-01T00:00:00Z'
            }
          }
        },
        CourseOfferingRequest: {
          type: 'object',
          required: ['module_id', 'class_id', 'cohort_id', 'facilitator_id', 'mode_id', 'trimester', 'year'],
          properties: {
            module_id: {
              type: 'integer',
              example: 1
            },
            class_id: {
              type: 'integer',
              example: 1
            },
            cohort_id: {
              type: 'integer',
              example: 1
            },
            facilitator_id: {
              type: 'integer',
              example: 1
            },
            mode_id: {
              type: 'integer',
              example: 1
            },
            trimester: {
              type: 'integer',
              minimum: 1,
              maximum: 3,
              example: 1
            },
            year: {
              type: 'integer',
              example: 2023
            }
          }
        },

        // Activity Tracking Schemas
        ActivityTracker: {
          type: 'object',
          required: ['facilitator_id', 'allocation_id', 'week_number', 'attendance', 'formative_one_grading', 'formative_two_grading', 'summative_grading', 'course_moderation', 'intranet_sync', 'grade_book_status', 'due_date'],
          properties: {
            id: {
              type: 'integer',
              example: 1
            },
            facilitator_id: {
              type: 'integer',
              example: 1
            },
            allocation_id: {
              type: 'integer',
              example: 6
            },
            week_number: {
              type: 'integer',
              minimum: 1,
              example: 1
            },
            attendance: {
              type: 'array',
              items: {
                type: 'boolean'
              },
              example: [true, false, true]
            },
            formative_one_grading: {
              type: 'string',
              enum: ['Done', 'Pending', 'Not Started'],
              example: 'Pending'
            },
            formative_two_grading: {
              type: 'string',
              enum: ['Done', 'Pending', 'Not Started'],
              example: 'Not Started'
            },
            summative_grading: {
              type: 'string',
              enum: ['Done', 'Pending', 'Not Started'],
              example: 'Done'
            },
            course_moderation: {
              type: 'string',
              enum: ['Done', 'Pending', 'Not Started'],
              example: 'Pending'
            },
            intranet_sync: {
              type: 'string',
              enum: ['Done', 'Pending', 'Not Started'],
              example: 'Not Started'
            },
            grade_book_status: {
              type: 'string',
              enum: ['Done', 'Pending', 'Not Started'],
              example: 'Pending'
            },
            submitted_at: {
              type: 'string',
              format: 'date-time',
              example: '2023-01-01T00:00:00Z'
            },
            due_date: {
              type: 'string',
              format: 'date-time',
              example: '2023-01-01T00:00:00Z'
            },
            notes: {
              type: 'string',
              example: 'Additional notes about the activity'
            },
            missed_deadline_notified: {
              type: 'boolean',
              example: false
            },
            created_at: {
              type: 'string',
              format: 'date-time',
              example: '2023-01-01T00:00:00Z'
            }
          }
        },
        ActivityLogRequest: {
          type: 'object',
          required: ['facilitator_id', 'allocation_id', 'week_number', 'attendance', 'formative_one_grading', 'formative_two_grading', 'summative_grading', 'course_moderation', 'intranet_sync', 'grade_book_status', 'due_date'],
          properties: {
            facilitator_id: {
              type: 'integer',
              example: 1
            },
            allocation_id: {
              type: 'integer',
              example: 6
            },
            week_number: {
              type: 'integer',
              minimum: 1,
              example: 1
            },
            attendance: {
              type: 'array',
              items: {
                type: 'boolean'
              },
              example: [true, false, true]
            },
            formative_one_grading: {
              type: 'string',
              enum: ['Done', 'Pending', 'Not Started'],
              example: 'Pending'
            },
            formative_two_grading: {
              type: 'string',
              enum: ['Done', 'Pending', 'Not Started'],
              example: 'Not Started'
            },
            summative_grading: {
              type: 'string',
              enum: ['Done', 'Pending', 'Not Started'],
              example: 'Done'
            },
            course_moderation: {
              type: 'string',
              enum: ['Done', 'Pending', 'Not Started'],
              example: 'Pending'
            },
            intranet_sync: {
              type: 'string',
              enum: ['Done', 'Pending', 'Not Started'],
              example: 'Not Started'
            },
            grade_book_status: {
              type: 'string',
              enum: ['Done', 'Pending', 'Not Started'],
              example: 'Pending'
            },
            due_date: {
              type: 'string',
              format: 'date-time',
              example: '2023-01-01T00:00:00Z'
            },
            notes: {
              type: 'string',
              example: 'Additional notes about the activity'
            }
          }
        },

        // Notification Schemas
        Notification: {
          type: 'object',
          required: ['recipient_type', 'type', 'title', 'message', 'log_id', 'status'],
          properties: {
            id: {
              type: 'integer',
              example: 1
            },
            manager_id: {
              type: 'integer',
              nullable: true,
              example: 1
            },
            facilitator_id: {
              type: 'integer',
              nullable: true,
              example: 1
            },
            recipient_type: {
              type: 'string',
              enum: ['manager', 'facilitator'],
              example: 'manager'
            },
            type: {
              type: 'string',
              enum: ['deadline_reminder', 'submission_alert', 'compliance_alert'],
              example: 'deadline_reminder'
            },
            title: {
              type: 'string',
              example: 'Deadline Missed'
            },
            message: {
              type: 'string',
              example: 'You have missed the deadline for your activity log.'
            },
            log_id: {
              type: 'integer',
              example: 1
            },
            status: {
              type: 'string',
              enum: ['pending', 'sent', 'failed'],
              default: 'pending',
              example: 'pending'
            },
            scheduled_for: {
              type: 'string',
              format: 'date-time',
              example: '2023-01-01T00:00:00Z'
            },
            sent_at: {
              type: 'string',
              format: 'date-time',
              nullable: true,
              example: '2023-01-01T00:00:00Z'
            },
            created_at: {
              type: 'string',
              format: 'date-time',
              example: '2023-01-01T00:00:00Z'
            }
          }
        },

        // Response Schemas
        SuccessResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true
            },
            message: {
              type: 'string',
              example: 'Operation completed successfully'
            },
            data: {
              type: 'object'
            }
          }
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false
            },
            message: {
              type: 'string',
              example: 'An error occurred'
            },
            error: {
              type: 'string',
              example: 'Detailed error message'
            }
          }
        },
        HealthCheck: {
          type: 'object',
          properties: {
            status: {
              type: 'string',
              example: 'OK'
            },
            timestamp: {
              type: 'string',
              format: 'date-time',
              example: '2023-01-01T00:00:00Z'
            },
            uptime: {
              type: 'string',
              example: '1h 30m 45s'
            },
            database: {
              type: 'string',
              example: 'Connected'
            }
          }
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: [
    './routes/*.js',
    './routes/**/*.js',
    './models/*.js',
    './controllers/*.js'
  ]
};

const specs = swaggerJsdoc(options);

const swaggerSetup = (app) => {
  // Serve API documentation
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
    explorer: true,
    customCss: `
      .swagger-ui .topbar { display: none }
      .swagger-ui .info { margin: 50px 0 }
      .swagger-ui .info .title { color: #3b82f6 }
    `,
    customSiteTitle: 'Course Management API Documentation',
    customfavIcon: '/favicon.ico',
    swaggerOptions: {
      docExpansion: 'list',
      filter: true,
      showRequestDuration: true
    }
  }));

  console.log(`📚 API Documentation: http://localhost:${process.env.PORT || 3000}/api-docs`);
};

module.exports = { swaggerSetup, specs };