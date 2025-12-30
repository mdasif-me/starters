/* eslint-disable @typescript-eslint/no-explicit-any */
import { z } from 'zod';

export class Validator {
  static async validate<T>(
    schema: z.ZodSchema<T>,
    data: any
  ): Promise<{
    success: boolean;
    data?: T;
    errors?: Record<string, string[]>;
  }> {
    try {
      const validated = await schema.parseAsync(data);
      return { success: true, data: validated };
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors: Record<string, string[]> = {};

        error.issues.forEach((err) => {
          const path = err.path.join('.');
          if (!errors[path]) {
            errors[path] = [];
          }
          errors[path].push(err.message);
        });

        return { success: false, errors };
      }

      return {
        success: false,
        errors: { _general: ['Validation failed'] },
      };
    }
  }

  static validateSync<T>(
    schema: z.ZodSchema<T>,
    data: any
  ): {
    success: boolean;
    data?: T;
    errors?: Record<string, string[]>;
  } {
    try {
      const validated = schema.parse(data);
      return { success: true, data: validated };
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors: Record<string, string[]> = {};

        error.issues.forEach((err) => {
          const path = err.path.join('.');
          if (!errors[path]) {
            errors[path] = [];
          }
          errors[path].push(err.message);
        });

        return { success: false, errors };
      }

      return {
        success: false,
        errors: { _general: ['Validation failed'] },
      };
    }
  }

  static isEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  static isStrongPassword(password: string): boolean {
    const hasMinLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[^A-Za-z0-9]/.test(password);

    return (
      hasMinLength &&
      hasUpperCase &&
      hasLowerCase &&
      hasNumbers &&
      hasSpecialChar
    );
  }

  static isPhoneNumber(phone: string): boolean {
    const phoneRegex = /^\+?[\d\s\-\(\)]+$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  }

  static isUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  static sanitizeInput(input: string): string {
    return input
      .trim()
      .replace(/[<>]/g, '') // remove HTML tags
      .replace(/[&<>"'`=\/]/g, ''); // remove potentially dangerous characters
  }

  static sanitizeObject<T extends Record<string, any>>(obj: T): T {
    const sanitized = { ...obj } as Record<string, any>;

    Object.keys(sanitized).forEach((key) => {
      if (typeof sanitized[key] === 'string') {
        sanitized[key] = this.sanitizeInput(sanitized[key]);
      }
    });

    return sanitized as T;
  }
}
