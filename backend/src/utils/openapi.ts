import { Request, Response } from 'express';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

export interface OpenAPIOptions {
  title: string;
  version: string;
  description: string;
  servers: Array<{
    url: string;
    description: string;
  }>;
  tags: Array<{
    name: string;
    description: string;
  }>;
}

export class OpenAPIGenerator {
  private static instance: OpenAPIGenerator;

  private constructor() {}

  public static getInstance(): OpenAPIGenerator {
    if (!OpenAPIGenerator.instance) {
      OpenAPIGenerator.instance = new OpenAPIGenerator();
    }
    return OpenAPIGenerator.instance;
  }

  public generateDocs(options: OpenAPIOptions) {
    const swaggerOptions = {
      definition: {
        openapi: '3.0.0',
        info: {
          title: options.title,
          version: options.version,
          description: options.description,
        },
        servers: options.servers,
        tags: options.tags,
        components: {
          securitySchemes: {
            bearerAuth: {
              type: 'http',
              scheme: 'bearer',
              bearerFormat: 'JWT',
            },
          },
          schemas: {
            ApiResponse: {
              type: 'object',
              properties: {
                success: {
                  type: 'boolean',
                  example: true,
                },
                data: {
                  type: 'object',
                  description: 'Response data payload',
                },
                message: {
                  type: 'string',
                  description: 'Success message',
                  example: 'Operation completed successfully',
                },
                error: {
                  type: 'string',
                  description: 'Error message (only when success is false)',
                  example: 'Resource not found',
                },
                metadata: {
                  type: 'object',
                  description: 'Additional metadata (pagination, error codes, etc.)',
                  properties: {
                    code: {
                      type: 'string',
                      example: 'NOT_FOUND',
                    },
                    timestamp: {
                      type: 'string',
                      format: 'date-time',
                      example: '2024-01-01T00:00:00.000Z',
                    },
                  },
                },
              },
            },
            PaginationInfo: {
              type: 'object',
              properties: {
                page: {
                  type: 'integer',
                  example: 1,
                },
                limit: {
                  type: 'integer',
                  example: 20,
                },
                total: {
                  type: 'integer',
                  example: 100,
                },
                totalPages: {
                  type: 'integer',
                  example: 5,
                },
                hasNext: {
                  type: 'boolean',
                  example: true,
                },
                hasPrev: {
                  type: 'boolean',
                  example: false,
                },
              },
            },
            ListResponse: {
              type: 'object',
              properties: {
                items: {
                  type: 'array',
                  items: {
                    type: 'object',
                  },
                },
                pagination: {
                  $ref: '#/components/schemas/PaginationInfo',
                },
              },
            },
            ErrorResponse: {
              type: 'object',
              properties: {
                success: {
                  type: 'boolean',
                  example: false,
                },
                error: {
                  type: 'string',
                  example: 'Validation failed',
                },
                metadata: {
                  type: 'object',
                  properties: {
                    code: {
                      type: 'string',
                      example: 'VALIDATION_FAILED',
                    },
                    errors: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          field: {
                            type: 'string',
                            example: 'email',
                          },
                          message: {
                            type: 'string',
                            example: 'Invalid email format',
                          },
                          code: {
                            type: 'string',
                            example: 'INVALID_EMAIL',
                          },
                        },
                      },
                    },
                    timestamp: {
                      type: 'string',
                      format: 'date-time',
                    },
                  },
                },
              },
            },
          },
        },
        apis: [],
      },
    };

    return swaggerJsdoc(swaggerOptions);
  }

  public setupSwaggerUI(app: any, options: OpenAPIOptions) {
    const specs = this.generateDocs(options);
    
    app.use('/api-docs', swaggerUi.serve);
    app.get('/api-docs.json', swaggerUi.setup(specs));

    // Add Swagger UI route
    app.get('/api-docs', swaggerUi.serveFiles(specs));
  }

  // Helper method to add route documentation
  public addRouteDocumentation(
    route: string,
    method: 'get' | 'post' | 'put' | 'delete' | 'patch',
    summary: string,
    description: string,
    tags: string[],
    parameters?: any[],
    requestBody?: any,
    responses?: any,
    security?: any[]
  ) {
    // This would be used to dynamically build API documentation
    // For now, documentation is generated from JSDoc comments
  }
}

// JSDoc templates for automatic documentation generation
export const swaggerJsdocOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'WebApp Starter API',
      version: '1.0.0',
      description: 'A comprehensive, production-ready web application API',
      contact: {
        name: 'API Support',
        email: 'api-support@example.com',
      },
    },
    servers: [
      {
        url: 'http://localhost:3002',
        description: 'Development server',
      },
      {
        url: 'https://api.example.com',
        description: 'Production server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: [
    './src/controllers/*.ts',
    './src/services/*.ts',
    './src/dao/*.ts',
  ],
};

// Example JSDoc comments for API documentation
/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Authenticate user
 *     description: Authenticate user with email and password
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 minLength: 8
 *                 example: password123
 *     responses:
 *       '200':
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       '401':
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

export default OpenAPIGenerator;
