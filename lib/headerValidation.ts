import { NextResponse } from 'next/server';

interface HeaderValidationRules {
  [key: string]: {
    required?: boolean;
    pattern?: RegExp;
    allowedValues?: string[];
  };
}

const headerValidationRules: HeaderValidationRules = {
  'Content-Security-Policy': {
    required: true,
    pattern: /^[\w\s-;'"()/:.*]+$/
  },
  'X-Nonce': {
    required: true,
    pattern: /^[A-Za-z0-9+/=]+$/
  },
  'X-Content-Type-Options': {
    required: true,
    allowedValues: ['nosniff']
  },
  'X-Frame-Options': {
    required: true,
    allowedValues: ['DENY', 'SAMEORIGIN']
  },
  'Referrer-Policy': {
    required: true,
    allowedValues: [
      'no-referrer',
      'no-referrer-when-downgrade',
      'origin',
      'origin-when-cross-origin',
      'same-origin',
      'strict-origin',
      'strict-origin-when-cross-origin',
      'unsafe-url'
    ]
  }
};

export const validateHeaders = (response: NextResponse): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  const headers = response.headers;

  // Check for required headers and validate their values
  Object.entries(headerValidationRules).forEach(([headerName, rules]) => {
    const headerValue = headers.get(headerName);

    if (rules.required && !headerValue) {
      errors.push(`Missing required header: ${headerName}`);
      return;
    }

    if (headerValue) {
      if (rules.pattern && !rules.pattern.test(headerValue)) {
        errors.push(`Invalid format for header ${headerName}: ${headerValue}`);
      }

      if (rules.allowedValues && !rules.allowedValues.includes(headerValue)) {
        errors.push(`Invalid value for header ${headerName}: ${headerValue}. Allowed values: ${rules.allowedValues.join(', ')}`);
      }
    }
  });

  // Sanitize headers by removing any that don't match validation rules
  headers.forEach((value, name) => {
    if (!headerValidationRules[name] && name.toLowerCase().startsWith('x-')) {
      headers.delete(name);
    }
  });

  return {
    isValid: errors.length === 0,
    errors
  };
};