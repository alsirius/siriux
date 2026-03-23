import { Request, Response, NextFunction } from 'express';
import { ApiResponse, ResponseBuilder, ApiErrorCode, HttpStatus } from '../types/api';

export interface ValidationRule {
  field: string;
  rule: 'required' | 'email' | 'minLength' | 'maxLength' | 'pattern' | 'custom';
  message?: string;
  value?: any;
}

export interface ValidationSchema {
  rules: ValidationRule[];
  strict?: boolean;
}

export class ValidationMiddleware {
  constructor(private schemas: Record<string, ValidationSchema>) {}

  validateBody(schema: ValidationSchema) {
    return (req: Request, res: Response, next: NextFunction) => {
      try {
        const errors = this.validate(req.body, schema);
        
        if (errors.length > 0) {
          const errorResponse = ResponseBuilder.validationError(errors);
          res.status(HttpStatus.UNPROCESSABLE_ENTITY).json(errorResponse);
          return;
        }
        
        next();
      } catch (error) {
        const errorResponse = ResponseBuilder.error(
          ApiErrorCode.INTERNAL_ERROR,
          `Validation middleware error: ${(error as Error).message}`
        );
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(errorResponse);
      }
    };
  }

  validateQuery(schema: ValidationSchema) {
    return (req: Request, res: Response, next: NextFunction) => {
      try {
        const errors = this.validate(req.query, schema);
        
        if (errors.length > 0) {
          const errorResponse = ResponseBuilder.validationError(errors);
          res.status(HttpStatus.UNPROCESSABLE_ENTITY).json(errorResponse);
          return;
        }
        
        next();
      } catch (error) {
        const errorResponse = ResponseBuilder.error(
          ApiErrorCode.INTERNAL_ERROR,
          `Query validation middleware error: ${(error as Error).message}`
        );
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(errorResponse);
      }
    };
  }

  validateParams(schema: ValidationSchema) {
    return (req: Request, res: Response, next: NextFunction) => {
      try {
        const errors = this.validate(req.params, schema);
        
        if (errors.length > 0) {
          const errorResponse = ResponseBuilder.validationError(errors);
          res.status(HttpStatus.UNPROCESSABLE_ENTITY).json(errorResponse);
          return;
        }
        
        next();
      } catch (error) {
        const errorResponse = ResponseBuilder.error(
          ApiErrorCode.INTERNAL_ERROR,
          `Params validation middleware error: ${(error as Error).message}`
        );
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(errorResponse);
      }
    };
  }

  private validate(data: any, schema: ValidationSchema): any[] {
    const errors: any[] = [];
    const strict = schema.strict || false;

    for (const rule of schema.rules) {
      const value = this.getValue(data, rule.field);
      
      if (!this.validateRule(value, rule, strict)) {
        errors.push({
          field: rule.field,
          message: rule.message || `Validation failed for ${rule.field}`,
          code: rule.rule,
          value: value,
        });
      }
    }

    return errors;
  }

  private getValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => {
      return current && current[key] ? current[key] : null;
    }, obj);
  }

  private validateRule(value: any, rule: ValidationRule, strict: boolean = false): boolean {
    // Skip validation if value is undefined and not required
    if (value === undefined && rule.rule !== 'required') {
      return true;
    }

    switch (rule.rule) {
      case 'required':
        return value !== undefined && value !== null && value !== '';
      
      case 'email':
        return typeof value === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      
      case 'minLength':
        return typeof value === 'string' && value.length >= (rule.value || 0);
      
      case 'maxLength':
        return typeof value === 'string' && value.length <= (rule.value || Infinity);
      
      case 'pattern':
        return typeof value === 'string' && new RegExp(rule.value || '').test(value);
      
      case 'custom':
        return rule.value && typeof rule.value === 'function' ? rule.value(value) : true;
      
      default:
        return true;
    }
  }
}

// Predefined validation schemas
export const CommonSchemas = {
  user: {
    create: {
      rules: [
        { field: 'email', rule: 'required', message: 'Email is required' },
        { field: 'email', rule: 'email', message: 'Invalid email format' },
        { field: 'firstName', rule: 'required', message: 'First name is required' },
        { field: 'firstName', rule: 'minLength', value: 2, message: 'First name must be at least 2 characters' },
        { field: 'lastName', rule: 'required', message: 'Last name is required' },
        { field: 'lastName', rule: 'minLength', value: 2, message: 'Last name must be at least 2 characters' },
        { field: 'password', rule: 'required', message: 'Password is required' },
        { field: 'password', rule: 'minLength', value: 8, message: 'Password must be at least 8 characters' },
      ]
    } as ValidationSchema,
    
    update: {
      rules: [
        { field: 'firstName', rule: 'minLength', value: 1, message: 'First name cannot be empty' },
        { field: 'lastName', rule: 'minLength', value: 1, message: 'Last name cannot be empty' },
      ]
    } as ValidationSchema,
  },

  pagination: {
    query: {
      rules: [
        { field: 'page', rule: 'custom', value: (val: any) => !val || parseInt(val) < 1, message: 'Page must be a positive integer' },
        { field: 'limit', rule: 'custom', value: (val: any) => !val || parseInt(val) < 1 || parseInt(val) > 100, message: 'Limit must be between 1 and 100' },
      ]
    } as ValidationSchema,
  }
};

export default ValidationMiddleware;
