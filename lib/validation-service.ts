import { z } from 'zod';
import { userSchema } from './validationSchemas';

export class ValidationService {
  static validatePassword(password: string): { valid: boolean; message?: string } {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (password.length < minLength) {
      return { valid: false, message: 'Password must be at least 8 characters long' };
    }

    if (!hasUpperCase) {
      return { valid: false, message: 'Password must contain at least one uppercase letter' };
    }

    if (!hasLowerCase) {
      return { valid: false, message: 'Password must contain at least one lowercase letter' };
    }

    if (!hasNumbers) {
      return { valid: false, message: 'Password must contain at least one number' };
    }

    if (!hasSpecialChar) {
      return { valid: false, message: 'Password must contain at least one special character' };
    }

    return { valid: true };
  }

  static validateRegistrationData(data: {
    email: string;
    password: string;
    name: string;
  }): { valid: boolean; errors?: Record<string, string> } {
    try {
      userSchema.parse(data);
      const passwordValidation = this.validatePassword(data.password);
      
      if (!passwordValidation.valid) {
        return { valid: false, errors: { password: passwordValidation.message || 'Invalid password' } };
      }

      return { valid: true };
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path) {
            errors[err.path[0]] = err.message;
          }
        });
        return { valid: false, errors };
      }
      return { valid: false, errors: { _form: 'Invalid form data' } };
    }
  }
}