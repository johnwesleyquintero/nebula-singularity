/* global global */
/* global beforeEach */
import { describe, it, expect, jest } from '@jest/globals';
import { 
  signUp, 
  signIn, 
  signOut,
  requestPasswordReset,
  resetPassword,
  verifyMFA,
  generateMFARecoveryCodes,
  AuthenticationError,
  PasswordTooWeakError,
  InvalidResetTokenError,
  InvalidMFACodeError,
  MFARequiredError
} from './auth';
import supabase from './supabase';

// Mock console
global.console = {
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  info: jest.fn(),
  debug: jest.fn()
};

// Enhanced Supabase mock
jest.mock('./supabase', () => ({
  auth: {
    signUp: jest.fn(),
    signInWithPassword: jest.fn(),
    signOut: jest.fn(),
    resetPasswordForEmail: jest.fn(),
    updateUser: jest.fn(),
    mfa: {
      verify: jest.fn(),
      generateRecoveryCodes: jest.fn()
    }
  }
}));

const mockUser = { id: '123', email: 'test@example.com' };
const mockToken = 'valid-reset-token';

beforeEach(() => {
  jest.clearAllMocks();
});

describe('Session Management', () => {
  beforeEach(() => {
    redis.flushall();
    jest.clearAllMocks();
  });

  describe('getSession()', () => {
    it('should return cached session when available', async () => {
      const mockSession = { id: '1', userId: '123' };
      await redis.setex('session:test123', 300, JSON.stringify(mockSession));

      const result = await getSession('test123');
      expect(result).toEqual(mockSession);
      expect(redis.get).toHaveBeenCalledTimes(1);
    });

    it('should fetch from database when cache miss', async () => {
      const mockSession = { 
        id: '2', 
        userId: '456',
        expires: new Date(Date.now() + 3600000).toISOString()
      };
      
      jest.spyOn(redis, 'get').mockResolvedValue(null);
      jest.spyOn(redis, 'setex').mockImplementation(() => {});
      jest.spyOn(db, 'session').mockResolvedValue(mockSession);

      const result = await getSession('valid-id');
      expect(result).toEqual(mockSession);
      expect(redis.setex).toHaveBeenCalledWith(
        'session:valid-id',
        300,
        JSON.stringify(mockSession)
      );
    });

    it('should handle database query errors', async () => {
      jest.spyOn(db, 'session').mockRejectedValue(new Error('Database timeout'));
      
      await expect(getSession('error-id'))
        .rejects
        .toThrow('Failed to retrieve session');
    });

    describe('validateSession()', () => {
      it('should detect expired sessions', () => {
        const expiredSession = {
          id: '2',
          userId: '456',
          expires: new Date(Date.now() - 1000).toISOString()
        };

        const validation = validateSession(expiredSession);
        expect(validation.valid).toBe(false);
        expect(validation.error).toBe('SESSION_EXPIRED');
      });

      it('should reject sessions missing required fields', () => {
        const invalidSession = {
          id: '3',
          expires: new Date().toISOString()
        };

        const validation = validateSession(invalidSession);
        expect(validation.valid).toBe(false);
        expect(validation.error).toBe('INVALID_SESSION');
      });

      it('should handle invalid session structure', () => {
        const malformedSession = {
          id: '4',
          userId: '789',
          expires: 'invalid-date'
        };

        const validation = validateSession(malformedSession);
        expect(validation.valid).toBe(false);
        expect(validation.error).toBe('INVALID_SESSION');
      });
    });

    describe('Error Handling', () => {
      it('should log errors during session retrieval', async () => {
        jest.spyOn(redis, 'get').mockRejectedValue(new Error('Redis connection failed'));
        
        await expect(getSession('error-id'))
          .rejects
          .toThrow('Failed to retrieve session');
        expect(console.error).toHaveBeenCalled();
      });
    });
  });

describe('Auth functions', () => {
  describe('Successful operations', () => {
    it('should sign up a user with valid credentials', async () => {
      supabase.auth.signUp.mockResolvedValueOnce({ 
        data: { user: mockUser }, 
        error: null 
      });

describe('Session Management', () => {
  beforeEach(() => {
    redis.flushall();
    jest.clearAllMocks();
  });

  describe('getSession()', () => {
    it('should return cached session when available', async () => {
      const mockSession = { id: '1', userId: '123' };
      await redis.setex('session:test123', 300, JSON.stringify(mockSession));

      const result = await getSession('test123');
      expect(result).toEqual(mockSession);
      expect(redis.get).toHaveBeenCalledTimes(1);
    });

    it('should fetch from database when cache miss', async () => {
      const mockSession = { 
        id: '2', 
        userId: '456',
        expires: new Date(Date.now() + 3600000).toISOString()
      };
      
      jest.spyOn(redis, 'get').mockResolvedValue(null);
      jest.spyOn(redis, 'setex').mockImplementation(() => {});
      jest.spyOn(db, 'session').mockResolvedValue(mockSession);

      const result = await getSession('valid-id');
      expect(result).toEqual(mockSession);
      expect(redis.setex).toHaveBeenCalledWith(
        'session:valid-id',
        300,
        JSON.stringify(mockSession)
      );
    });

    it('should handle database query errors', async () => {
      jest.spyOn(db, 'session').mockRejectedValue(new Error('Database timeout'));
      
      await expect(getSession('error-id'))
        .rejects
        .toThrow('Failed to retrieve session');
    });

    describe('validateSession()', () => {
      it('should detect expired sessions', () => {
        const expiredSession = {
          id: '2',
          userId: '456',
          expires: new Date(Date.now() - 1000).toISOString()
        };

        const validation = validateSession(expiredSession);
        expect(validation.valid).toBe(false);
        expect(validation.error).toBe('SESSION_EXPIRED');
      });

      it('should reject sessions missing required fields', () => {
        const invalidSession = {
          id: '3',
          expires: new Date().toISOString()
        };

        const validation = validateSession(invalidSession);
        expect(validation.valid).toBe(false);
        expect(validation.error).toBe('INVALID_SESSION');
      });

      it('should handle invalid session structure', () => {
        const malformedSession = {
          id: '4',
          userId: '789',
          expires: 'invalid-date'
        };

        const validation = validateSession(malformedSession);
        expect(validation.valid).toBe(false);
        expect(validation.error).toBe('INVALID_SESSION');
      });
    });

    describe('Error Handling', () => {
      it('should log errors during session retrieval', async () => {
        jest.spyOn(redis, 'get').mockRejectedValue(new Error('Redis connection failed'));
        
        await expect(getSession('error-id'))
          .rejects
          .toThrow('Failed to retrieve session');
        expect(console.error).toHaveBeenCalled();
      });
    });
  });
      
      const user = await signUp('test@example.com', 'password');
      expect(user).toEqual(mockUser);
      expect(supabase.auth.signUp).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password',
      });

describe('Session Management', () => {
  beforeEach(() => {
    redis.flushall();
    jest.clearAllMocks();
  });

  describe('getSession()', () => {
    it('should return cached session when available', async () => {
      const mockSession = { id: '1', userId: '123' };
      await redis.setex('session:test123', 300, JSON.stringify(mockSession));

      const result = await getSession('test123');
      expect(result).toEqual(mockSession);
      expect(redis.get).toHaveBeenCalledTimes(1);
    });

    it('should fetch from database when cache miss', async () => {
      const mockSession = { 
        id: '2', 
        userId: '456',
        expires: new Date(Date.now() + 3600000).toISOString()
      };
      
      jest.spyOn(redis, 'get').mockResolvedValue(null);
      jest.spyOn(redis, 'setex').mockImplementation(() => {});
      jest.spyOn(db, 'session').mockResolvedValue(mockSession);

      const result = await getSession('valid-id');
      expect(result).toEqual(mockSession);
      expect(redis.setex).toHaveBeenCalledWith(
        'session:valid-id',
        300,
        JSON.stringify(mockSession)
      );
    });

    it('should handle database query errors', async () => {
      jest.spyOn(db, 'session').mockRejectedValue(new Error('Database timeout'));
      
      await expect(getSession('error-id'))
        .rejects
        .toThrow('Failed to retrieve session');
    });

    describe('validateSession()', () => {
      it('should detect expired sessions', () => {
        const expiredSession = {
          id: '2',
          userId: '456',
          expires: new Date(Date.now() - 1000).toISOString()
        };

        const validation = validateSession(expiredSession);
        expect(validation.valid).toBe(false);
        expect(validation.error).toBe('SESSION_EXPIRED');
      });

      it('should reject sessions missing required fields', () => {
        const invalidSession = {
          id: '3',
          expires: new Date().toISOString()
        };

        const validation = validateSession(invalidSession);
        expect(validation.valid).toBe(false);
        expect(validation.error).toBe('INVALID_SESSION');
      });

      it('should handle invalid session structure', () => {
        const malformedSession = {
          id: '4',
          userId: '789',
          expires: 'invalid-date'
        };

        const validation = validateSession(malformedSession);
        expect(validation.valid).toBe(false);
        expect(validation.error).toBe('INVALID_SESSION');
      });
    });

    describe('Error Handling', () => {
      it('should log errors during session retrieval', async () => {
        jest.spyOn(redis, 'get').mockRejectedValue(new Error('Redis connection failed'));
        
        await expect(getSession('error-id'))
          .rejects
          .toThrow('Failed to retrieve session');
        expect(console.error).toHaveBeenCalled();
      });
    });
  });
    });

describe('Session Management', () => {
  beforeEach(() => {
    redis.flushall();
    jest.clearAllMocks();
  });

  describe('getSession()', () => {
    it('should return cached session when available', async () => {
      const mockSession = { id: '1', userId: '123' };
      await redis.setex('session:test123', 300, JSON.stringify(mockSession));

      const result = await getSession('test123');
      expect(result).toEqual(mockSession);
      expect(redis.get).toHaveBeenCalledTimes(1);
    });

    it('should fetch from database when cache miss', async () => {
      const mockSession = { 
        id: '2', 
        userId: '456',
        expires: new Date(Date.now() + 3600000).toISOString()
      };
      
      jest.spyOn(redis, 'get').mockResolvedValue(null);
      jest.spyOn(redis, 'setex').mockImplementation(() => {});
      jest.spyOn(db, 'session').mockResolvedValue(mockSession);

      const result = await getSession('valid-id');
      expect(result).toEqual(mockSession);
      expect(redis.setex).toHaveBeenCalledWith(
        'session:valid-id',
        300,
        JSON.stringify(mockSession)
      );
    });

    it('should handle database query errors', async () => {
      jest.spyOn(db, 'session').mockRejectedValue(new Error('Database timeout'));
      
      await expect(getSession('error-id'))
        .rejects
        .toThrow('Failed to retrieve session');
    });

    describe('validateSession()', () => {
      it('should detect expired sessions', () => {
        const expiredSession = {
          id: '2',
          userId: '456',
          expires: new Date(Date.now() - 1000).toISOString()
        };

        const validation = validateSession(expiredSession);
        expect(validation.valid).toBe(false);
        expect(validation.error).toBe('SESSION_EXPIRED');
      });

      it('should reject sessions missing required fields', () => {
        const invalidSession = {
          id: '3',
          expires: new Date().toISOString()
        };

        const validation = validateSession(invalidSession);
        expect(validation.valid).toBe(false);
        expect(validation.error).toBe('INVALID_SESSION');
      });

      it('should handle invalid session structure', () => {
        const malformedSession = {
          id: '4',
          userId: '789',
          expires: 'invalid-date'
        };

        const validation = validateSession(malformedSession);
        expect(validation.valid).toBe(false);
        expect(validation.error).toBe('INVALID_SESSION');
      });
    });

    describe('Error Handling', () => {
      it('should log errors during session retrieval', async () => {
        jest.spyOn(redis, 'get').mockRejectedValue(new Error('Redis connection failed'));
        
        await expect(getSession('error-id'))
          .rejects
          .toThrow('Failed to retrieve session');
        expect(console.error).toHaveBeenCalled();
      });
    });
  });

    it('should sign in a user with valid credentials', async () => {
      supabase.auth.signInWithPassword.mockResolvedValueOnce({ 
        data: { user: mockUser }, 
        error: null 
      });

describe('Session Management', () => {
  beforeEach(() => {
    redis.flushall();
    jest.clearAllMocks();
  });

  describe('getSession()', () => {
    it('should return cached session when available', async () => {
      const mockSession = { id: '1', userId: '123' };
      await redis.setex('session:test123', 300, JSON.stringify(mockSession));

      const result = await getSession('test123');
      expect(result).toEqual(mockSession);
      expect(redis.get).toHaveBeenCalledTimes(1);
    });

    it('should fetch from database when cache miss', async () => {
      const mockSession = { 
        id: '2', 
        userId: '456',
        expires: new Date(Date.now() + 3600000).toISOString()
      };
      
      jest.spyOn(redis, 'get').mockResolvedValue(null);
      jest.spyOn(redis, 'setex').mockImplementation(() => {});
      jest.spyOn(db, 'session').mockResolvedValue(mockSession);

      const result = await getSession('valid-id');
      expect(result).toEqual(mockSession);
      expect(redis.setex).toHaveBeenCalledWith(
        'session:valid-id',
        300,
        JSON.stringify(mockSession)
      );
    });

    it('should handle database query errors', async () => {
      jest.spyOn(db, 'session').mockRejectedValue(new Error('Database timeout'));
      
      await expect(getSession('error-id'))
        .rejects
        .toThrow('Failed to retrieve session');
    });

    describe('validateSession()', () => {
      it('should detect expired sessions', () => {
        const expiredSession = {
          id: '2',
          userId: '456',
          expires: new Date(Date.now() - 1000).toISOString()
        };

        const validation = validateSession(expiredSession);
        expect(validation.valid).toBe(false);
        expect(validation.error).toBe('SESSION_EXPIRED');
      });

      it('should reject sessions missing required fields', () => {
        const invalidSession = {
          id: '3',
          expires: new Date().toISOString()
        };

        const validation = validateSession(invalidSession);
        expect(validation.valid).toBe(false);
        expect(validation.error).toBe('INVALID_SESSION');
      });

      it('should handle invalid session structure', () => {
        const malformedSession = {
          id: '4',
          userId: '789',
          expires: 'invalid-date'
        };

        const validation = validateSession(malformedSession);
        expect(validation.valid).toBe(false);
        expect(validation.error).toBe('INVALID_SESSION');
      });
    });

    describe('Error Handling', () => {
      it('should log errors during session retrieval', async () => {
        jest.spyOn(redis, 'get').mockRejectedValue(new Error('Redis connection failed'));
        
        await expect(getSession('error-id'))
          .rejects
          .toThrow('Failed to retrieve session');
        expect(console.error).toHaveBeenCalled();
      });
    });
  });
      
      const user = await signIn('test@example.com', 'password');
      expect(user).toEqual(mockUser);
      expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password',
      });

describe('Session Management', () => {
  beforeEach(() => {
    redis.flushall();
    jest.clearAllMocks();
  });

  describe('getSession()', () => {
    it('should return cached session when available', async () => {
      const mockSession = { id: '1', userId: '123' };
      await redis.setex('session:test123', 300, JSON.stringify(mockSession));

      const result = await getSession('test123');
      expect(result).toEqual(mockSession);
      expect(redis.get).toHaveBeenCalledTimes(1);
    });

    it('should fetch from database when cache miss', async () => {
      const mockSession = { 
        id: '2', 
        userId: '456',
        expires: new Date(Date.now() + 3600000).toISOString()
      };
      
      jest.spyOn(redis, 'get').mockResolvedValue(null);
      jest.spyOn(redis, 'setex').mockImplementation(() => {});
      jest.spyOn(db, 'session').mockResolvedValue(mockSession);

      const result = await getSession('valid-id');
      expect(result).toEqual(mockSession);
      expect(redis.setex).toHaveBeenCalledWith(
        'session:valid-id',
        300,
        JSON.stringify(mockSession)
      );
    });

    it('should handle database query errors', async () => {
      jest.spyOn(db, 'session').mockRejectedValue(new Error('Database timeout'));
      
      await expect(getSession('error-id'))
        .rejects
        .toThrow('Failed to retrieve session');
    });

    describe('validateSession()', () => {
      it('should detect expired sessions', () => {
        const expiredSession = {
          id: '2',
          userId: '456',
          expires: new Date(Date.now() - 1000).toISOString()
        };

        const validation = validateSession(expiredSession);
        expect(validation.valid).toBe(false);
        expect(validation.error).toBe('SESSION_EXPIRED');
      });

      it('should reject sessions missing required fields', () => {
        const invalidSession = {
          id: '3',
          expires: new Date().toISOString()
        };

        const validation = validateSession(invalidSession);
        expect(validation.valid).toBe(false);
        expect(validation.error).toBe('INVALID_SESSION');
      });

      it('should handle invalid session structure', () => {
        const malformedSession = {
          id: '4',
          userId: '789',
          expires: 'invalid-date'
        };

        const validation = validateSession(malformedSession);
        expect(validation.valid).toBe(false);
        expect(validation.error).toBe('INVALID_SESSION');
      });
    });

    describe('Error Handling', () => {
      it('should log errors during session retrieval', async () => {
        jest.spyOn(redis, 'get').mockRejectedValue(new Error('Redis connection failed'));
        
        await expect(getSession('error-id'))
          .rejects
          .toThrow('Failed to retrieve session');
        expect(console.error).toHaveBeenCalled();
      });
    });
  });
    });

describe('Session Management', () => {
  beforeEach(() => {
    redis.flushall();
    jest.clearAllMocks();
  });

  describe('getSession()', () => {
    it('should return cached session when available', async () => {
      const mockSession = { id: '1', userId: '123' };
      await redis.setex('session:test123', 300, JSON.stringify(mockSession));

      const result = await getSession('test123');
      expect(result).toEqual(mockSession);
      expect(redis.get).toHaveBeenCalledTimes(1);
    });

    it('should fetch from database when cache miss', async () => {
      const mockSession = { 
        id: '2', 
        userId: '456',
        expires: new Date(Date.now() + 3600000).toISOString()
      };
      
      jest.spyOn(redis, 'get').mockResolvedValue(null);
      jest.spyOn(redis, 'setex').mockImplementation(() => {});
      jest.spyOn(db, 'session').mockResolvedValue(mockSession);

      const result = await getSession('valid-id');
      expect(result).toEqual(mockSession);
      expect(redis.setex).toHaveBeenCalledWith(
        'session:valid-id',
        300,
        JSON.stringify(mockSession)
      );
    });

    it('should handle database query errors', async () => {
      jest.spyOn(db, 'session').mockRejectedValue(new Error('Database timeout'));
      
      await expect(getSession('error-id'))
        .rejects
        .toThrow('Failed to retrieve session');
    });

    describe('validateSession()', () => {
      it('should detect expired sessions', () => {
        const expiredSession = {
          id: '2',
          userId: '456',
          expires: new Date(Date.now() - 1000).toISOString()
        };

        const validation = validateSession(expiredSession);
        expect(validation.valid).toBe(false);
        expect(validation.error).toBe('SESSION_EXPIRED');
      });

      it('should reject sessions missing required fields', () => {
        const invalidSession = {
          id: '3',
          expires: new Date().toISOString()
        };

        const validation = validateSession(invalidSession);
        expect(validation.valid).toBe(false);
        expect(validation.error).toBe('INVALID_SESSION');
      });

      it('should handle invalid session structure', () => {
        const malformedSession = {
          id: '4',
          userId: '789',
          expires: 'invalid-date'
        };

        const validation = validateSession(malformedSession);
        expect(validation.valid).toBe(false);
        expect(validation.error).toBe('INVALID_SESSION');
      });
    });

    describe('Error Handling', () => {
      it('should log errors during session retrieval', async () => {
        jest.spyOn(redis, 'get').mockRejectedValue(new Error('Redis connection failed'));
        
        await expect(getSession('error-id'))
          .rejects
          .toThrow('Failed to retrieve session');
        expect(console.error).toHaveBeenCalled();
      });
    });
  });

    it('should successfully sign out a user', async () => {
      supabase.auth.signOut.mockResolvedValueOnce({ error: null });

describe('Session Management', () => {
  beforeEach(() => {
    redis.flushall();
    jest.clearAllMocks();
  });

  describe('getSession()', () => {
    it('should return cached session when available', async () => {
      const mockSession = { id: '1', userId: '123' };
      await redis.setex('session:test123', 300, JSON.stringify(mockSession));

      const result = await getSession('test123');
      expect(result).toEqual(mockSession);
      expect(redis.get).toHaveBeenCalledTimes(1);
    });

    it('should fetch from database when cache miss', async () => {
      const mockSession = { 
        id: '2', 
        userId: '456',
        expires: new Date(Date.now() + 3600000).toISOString()
      };
      
      jest.spyOn(redis, 'get').mockResolvedValue(null);
      jest.spyOn(redis, 'setex').mockImplementation(() => {});
      jest.spyOn(db, 'session').mockResolvedValue(mockSession);

      const result = await getSession('valid-id');
      expect(result).toEqual(mockSession);
      expect(redis.setex).toHaveBeenCalledWith(
        'session:valid-id',
        300,
        JSON.stringify(mockSession)
      );
    });

    it('should handle database query errors', async () => {
      jest.spyOn(db, 'session').mockRejectedValue(new Error('Database timeout'));
      
      await expect(getSession('error-id'))
        .rejects
        .toThrow('Failed to retrieve session');
    });

    describe('validateSession()', () => {
      it('should detect expired sessions', () => {
        const expiredSession = {
          id: '2',
          userId: '456',
          expires: new Date(Date.now() - 1000).toISOString()
        };

        const validation = validateSession(expiredSession);
        expect(validation.valid).toBe(false);
        expect(validation.error).toBe('SESSION_EXPIRED');
      });

      it('should reject sessions missing required fields', () => {
        const invalidSession = {
          id: '3',
          expires: new Date().toISOString()
        };

        const validation = validateSession(invalidSession);
        expect(validation.valid).toBe(false);
        expect(validation.error).toBe('INVALID_SESSION');
      });

      it('should handle invalid session structure', () => {
        const malformedSession = {
          id: '4',
          userId: '789',
          expires: 'invalid-date'
        };

        const validation = validateSession(malformedSession);
        expect(validation.valid).toBe(false);
        expect(validation.error).toBe('INVALID_SESSION');
      });
    });

    describe('Error Handling', () => {
      it('should log errors during session retrieval', async () => {
        jest.spyOn(redis, 'get').mockRejectedValue(new Error('Redis connection failed'));
        
        await expect(getSession('error-id'))
          .rejects
          .toThrow('Failed to retrieve session');
        expect(console.error).toHaveBeenCalled();
      });
    });
  });
      await signOut();
      expect(supabase.auth.signOut).toHaveBeenCalled();
    });

describe('Session Management', () => {
  beforeEach(() => {
    redis.flushall();
    jest.clearAllMocks();
  });

  describe('getSession()', () => {
    it('should return cached session when available', async () => {
      const mockSession = { id: '1', userId: '123' };
      await redis.setex('session:test123', 300, JSON.stringify(mockSession));

      const result = await getSession('test123');
      expect(result).toEqual(mockSession);
      expect(redis.get).toHaveBeenCalledTimes(1);
    });

    it('should fetch from database when cache miss', async () => {
      const mockSession = { 
        id: '2', 
        userId: '456',
        expires: new Date(Date.now() + 3600000).toISOString()
      };
      
      jest.spyOn(redis, 'get').mockResolvedValue(null);
      jest.spyOn(redis, 'setex').mockImplementation(() => {});
      jest.spyOn(db, 'session').mockResolvedValue(mockSession);

      const result = await getSession('valid-id');
      expect(result).toEqual(mockSession);
      expect(redis.setex).toHaveBeenCalledWith(
        'session:valid-id',
        300,
        JSON.stringify(mockSession)
      );
    });

    it('should handle database query errors', async () => {
      jest.spyOn(db, 'session').mockRejectedValue(new Error('Database timeout'));
      
      await expect(getSession('error-id'))
        .rejects
        .toThrow('Failed to retrieve session');
    });

    describe('validateSession()', () => {
      it('should detect expired sessions', () => {
        const expiredSession = {
          id: '2',
          userId: '456',
          expires: new Date(Date.now() - 1000).toISOString()
        };

        const validation = validateSession(expiredSession);
        expect(validation.valid).toBe(false);
        expect(validation.error).toBe('SESSION_EXPIRED');
      });

      it('should reject sessions missing required fields', () => {
        const invalidSession = {
          id: '3',
          expires: new Date().toISOString()
        };

        const validation = validateSession(invalidSession);
        expect(validation.valid).toBe(false);
        expect(validation.error).toBe('INVALID_SESSION');
      });

      it('should handle invalid session structure', () => {
        const malformedSession = {
          id: '4',
          userId: '789',
          expires: 'invalid-date'
        };

        const validation = validateSession(malformedSession);
        expect(validation.valid).toBe(false);
        expect(validation.error).toBe('INVALID_SESSION');
      });
    });

    describe('Error Handling', () => {
      it('should log errors during session retrieval', async () => {
        jest.spyOn(redis, 'get').mockRejectedValue(new Error('Redis connection failed'));
        
        await expect(getSession('error-id'))
          .rejects
          .toThrow('Failed to retrieve session');
        expect(console.error).toHaveBeenCalled();
      });
    });
  });
  });

describe('Session Management', () => {
  beforeEach(() => {
    redis.flushall();
    jest.clearAllMocks();
  });

  describe('getSession()', () => {
    it('should return cached session when available', async () => {
      const mockSession = { id: '1', userId: '123' };
      await redis.setex('session:test123', 300, JSON.stringify(mockSession));

      const result = await getSession('test123');
      expect(result).toEqual(mockSession);
      expect(redis.get).toHaveBeenCalledTimes(1);
    });

    it('should fetch from database when cache miss', async () => {
      const mockSession = { 
        id: '2', 
        userId: '456',
        expires: new Date(Date.now() + 3600000).toISOString()
      };
      
      jest.spyOn(redis, 'get').mockResolvedValue(null);
      jest.spyOn(redis, 'setex').mockImplementation(() => {});
      jest.spyOn(db, 'session').mockResolvedValue(mockSession);

      const result = await getSession('valid-id');
      expect(result).toEqual(mockSession);
      expect(redis.setex).toHaveBeenCalledWith(
        'session:valid-id',
        300,
        JSON.stringify(mockSession)
      );
    });

    it('should handle database query errors', async () => {
      jest.spyOn(db, 'session').mockRejectedValue(new Error('Database timeout'));
      
      await expect(getSession('error-id'))
        .rejects
        .toThrow('Failed to retrieve session');
    });

    describe('validateSession()', () => {
      it('should detect expired sessions', () => {
        const expiredSession = {
          id: '2',
          userId: '456',
          expires: new Date(Date.now() - 1000).toISOString()
        };

        const validation = validateSession(expiredSession);
        expect(validation.valid).toBe(false);
        expect(validation.error).toBe('SESSION_EXPIRED');
      });

      it('should reject sessions missing required fields', () => {
        const invalidSession = {
          id: '3',
          expires: new Date().toISOString()
        };

        const validation = validateSession(invalidSession);
        expect(validation.valid).toBe(false);
        expect(validation.error).toBe('INVALID_SESSION');
      });

      it('should handle invalid session structure', () => {
        const malformedSession = {
          id: '4',
          userId: '789',
          expires: 'invalid-date'
        };

        const validation = validateSession(malformedSession);
        expect(validation.valid).toBe(false);
        expect(validation.error).toBe('INVALID_SESSION');
      });
    });

    describe('Error Handling', () => {
      it('should log errors during session retrieval', async () => {
        jest.spyOn(redis, 'get').mockRejectedValue(new Error('Redis connection failed'));
        
        await expect(getSession('error-id'))
          .rejects
          .toThrow('Failed to retrieve session');
        expect(console.error).toHaveBeenCalled();
      });
    });
  });

  describe('Error handling', () => {
    it('should handle sign up error with specific message', async () => {
      const errorMessage = 'Email already in use';
      supabase.auth.signUp.mockRejectedValueOnce(new Error(errorMessage));
      
      await expect(signUp('test@example.com', 'password'))
        .rejects
        .toThrow(errorMessage);
    });

describe('Session Management', () => {
  beforeEach(() => {
    redis.flushall();
    jest.clearAllMocks();
  });

  describe('getSession()', () => {
    it('should return cached session when available', async () => {
      const mockSession = { id: '1', userId: '123' };
      await redis.setex('session:test123', 300, JSON.stringify(mockSession));

      const result = await getSession('test123');
      expect(result).toEqual(mockSession);
      expect(redis.get).toHaveBeenCalledTimes(1);
    });

    it('should fetch from database when cache miss', async () => {
      const mockSession = { 
        id: '2', 
        userId: '456',
        expires: new Date(Date.now() + 3600000).toISOString()
      };
      
      jest.spyOn(redis, 'get').mockResolvedValue(null);
      jest.spyOn(redis, 'setex').mockImplementation(() => {});
      jest.spyOn(db, 'session').mockResolvedValue(mockSession);

      const result = await getSession('valid-id');
      expect(result).toEqual(mockSession);
      expect(redis.setex).toHaveBeenCalledWith(
        'session:valid-id',
        300,
        JSON.stringify(mockSession)
      );
    });

    it('should handle database query errors', async () => {
      jest.spyOn(db, 'session').mockRejectedValue(new Error('Database timeout'));
      
      await expect(getSession('error-id'))
        .rejects
        .toThrow('Failed to retrieve session');
    });

    describe('validateSession()', () => {
      it('should detect expired sessions', () => {
        const expiredSession = {
          id: '2',
          userId: '456',
          expires: new Date(Date.now() - 1000).toISOString()
        };

        const validation = validateSession(expiredSession);
        expect(validation.valid).toBe(false);
        expect(validation.error).toBe('SESSION_EXPIRED');
      });

      it('should reject sessions missing required fields', () => {
        const invalidSession = {
          id: '3',
          expires: new Date().toISOString()
        };

        const validation = validateSession(invalidSession);
        expect(validation.valid).toBe(false);
        expect(validation.error).toBe('INVALID_SESSION');
      });

      it('should handle invalid session structure', () => {
        const malformedSession = {
          id: '4',
          userId: '789',
          expires: 'invalid-date'
        };

        const validation = validateSession(malformedSession);
        expect(validation.valid).toBe(false);
        expect(validation.error).toBe('INVALID_SESSION');
      });
    });

    describe('Error Handling', () => {
      it('should log errors during session retrieval', async () => {
        jest.spyOn(redis, 'get').mockRejectedValue(new Error('Redis connection failed'));
        
        await expect(getSession('error-id'))
          .rejects
          .toThrow('Failed to retrieve session');
        expect(console.error).toHaveBeenCalled();
      });
    });
  });

    it('should handle sign in error with specific message', async () => {
      const errorMessage = 'Invalid login credentials';
      supabase.auth.signInWithPassword.mockRejectedValueOnce(new Error(errorMessage));
      
      await expect(signIn('test@example.com', 'password'))
        .rejects
        .toThrow(errorMessage);
    });

describe('Session Management', () => {
  beforeEach(() => {
    redis.flushall();
    jest.clearAllMocks();
  });

  describe('getSession()', () => {
    it('should return cached session when available', async () => {
      const mockSession = { id: '1', userId: '123' };
      await redis.setex('session:test123', 300, JSON.stringify(mockSession));

      const result = await getSession('test123');
      expect(result).toEqual(mockSession);
      expect(redis.get).toHaveBeenCalledTimes(1);
    });

    it('should fetch from database when cache miss', async () => {
      const mockSession = { 
        id: '2', 
        userId: '456',
        expires: new Date(Date.now() + 3600000).toISOString()
      };
      
      jest.spyOn(redis, 'get').mockResolvedValue(null);
      jest.spyOn(redis, 'setex').mockImplementation(() => {});
      jest.spyOn(db, 'session').mockResolvedValue(mockSession);

      const result = await getSession('valid-id');
      expect(result).toEqual(mockSession);
      expect(redis.setex).toHaveBeenCalledWith(
        'session:valid-id',
        300,
        JSON.stringify(mockSession)
      );
    });

    it('should handle database query errors', async () => {
      jest.spyOn(db, 'session').mockRejectedValue(new Error('Database timeout'));
      
      await expect(getSession('error-id'))
        .rejects
        .toThrow('Failed to retrieve session');
    });

    describe('validateSession()', () => {
      it('should detect expired sessions', () => {
        const expiredSession = {
          id: '2',
          userId: '456',
          expires: new Date(Date.now() - 1000).toISOString()
        };

        const validation = validateSession(expiredSession);
        expect(validation.valid).toBe(false);
        expect(validation.error).toBe('SESSION_EXPIRED');
      });

      it('should reject sessions missing required fields', () => {
        const invalidSession = {
          id: '3',
          expires: new Date().toISOString()
        };

        const validation = validateSession(invalidSession);
        expect(validation.valid).toBe(false);
        expect(validation.error).toBe('INVALID_SESSION');
      });

      it('should handle invalid session structure', () => {
        const malformedSession = {
          id: '4',
          userId: '789',
          expires: 'invalid-date'
        };

        const validation = validateSession(malformedSession);
        expect(validation.valid).toBe(false);
        expect(validation.error).toBe('INVALID_SESSION');
      });
    });

    describe('Error Handling', () => {
      it('should log errors during session retrieval', async () => {
        jest.spyOn(redis, 'get').mockRejectedValue(new Error('Redis connection failed'));
        
        await expect(getSession('error-id'))
          .rejects
          .toThrow('Failed to retrieve session');
        expect(console.error).toHaveBeenCalled();
      });
    });
  });

    it('should handle sign out error with specific message', async () => {
      const errorMessage = 'Network error during sign out';
      supabase.auth.signOut.mockRejectedValueOnce(new Error(errorMessage));
      
      await expect(signOut())
        .rejects
        .toThrow(errorMessage);
    });

describe('Session Management', () => {
  beforeEach(() => {
    redis.flushall();
    jest.clearAllMocks();
  });

  describe('getSession()', () => {
    it('should return cached session when available', async () => {
      const mockSession = { id: '1', userId: '123' };
      await redis.setex('session:test123', 300, JSON.stringify(mockSession));

      const result = await getSession('test123');
      expect(result).toEqual(mockSession);
      expect(redis.get).toHaveBeenCalledTimes(1);
    });

    it('should fetch from database when cache miss', async () => {
      const mockSession = { 
        id: '2', 
        userId: '456',
        expires: new Date(Date.now() + 3600000).toISOString()
      };
      
      jest.spyOn(redis, 'get').mockResolvedValue(null);
      jest.spyOn(redis, 'setex').mockImplementation(() => {});
      jest.spyOn(db, 'session').mockResolvedValue(mockSession);

      const result = await getSession('valid-id');
      expect(result).toEqual(mockSession);
      expect(redis.setex).toHaveBeenCalledWith(
        'session:valid-id',
        300,
        JSON.stringify(mockSession)
      );
    });

    it('should handle database query errors', async () => {
      jest.spyOn(db, 'session').mockRejectedValue(new Error('Database timeout'));
      
      await expect(getSession('error-id'))
        .rejects
        .toThrow('Failed to retrieve session');
    });

    describe('validateSession()', () => {
      it('should detect expired sessions', () => {
        const expiredSession = {
          id: '2',
          userId: '456',
          expires: new Date(Date.now() - 1000).toISOString()
        };

        const validation = validateSession(expiredSession);
        expect(validation.valid).toBe(false);
        expect(validation.error).toBe('SESSION_EXPIRED');
      });

      it('should reject sessions missing required fields', () => {
        const invalidSession = {
          id: '3',
          expires: new Date().toISOString()
        };

        const validation = validateSession(invalidSession);
        expect(validation.valid).toBe(false);
        expect(validation.error).toBe('INVALID_SESSION');
      });

      it('should handle invalid session structure', () => {
        const malformedSession = {
          id: '4',
          userId: '789',
          expires: 'invalid-date'
        };

        const validation = validateSession(malformedSession);
        expect(validation.valid).toBe(false);
        expect(validation.error).toBe('INVALID_SESSION');
      });
    });

    describe('Error Handling', () => {
      it('should log errors during session retrieval', async () => {
        jest.spyOn(redis, 'get').mockRejectedValue(new Error('Redis connection failed'));
        
        await expect(getSession('error-id'))
          .rejects
          .toThrow('Failed to retrieve session');
        expect(console.error).toHaveBeenCalled();
      });
    });
  });
  });

describe('Session Management', () => {
  beforeEach(() => {
    redis.flushall();
    jest.clearAllMocks();
  });

  describe('getSession()', () => {
    it('should return cached session when available', async () => {
      const mockSession = { id: '1', userId: '123' };
      await redis.setex('session:test123', 300, JSON.stringify(mockSession));

      const result = await getSession('test123');
      expect(result).toEqual(mockSession);
      expect(redis.get).toHaveBeenCalledTimes(1);
    });

    it('should fetch from database when cache miss', async () => {
      const mockSession = { 
        id: '2', 
        userId: '456',
        expires: new Date(Date.now() + 3600000).toISOString()
      };
      
      jest.spyOn(redis, 'get').mockResolvedValue(null);
      jest.spyOn(redis, 'setex').mockImplementation(() => {});
      jest.spyOn(db, 'session').mockResolvedValue(mockSession);

      const result = await getSession('valid-id');
      expect(result).toEqual(mockSession);
      expect(redis.setex).toHaveBeenCalledWith(
        'session:valid-id',
        300,
        JSON.stringify(mockSession)
      );
    });

    it('should handle database query errors', async () => {
      jest.spyOn(db, 'session').mockRejectedValue(new Error('Database timeout'));
      
      await expect(getSession('error-id'))
        .rejects
        .toThrow('Failed to retrieve session');
    });

    describe('validateSession()', () => {
      it('should detect expired sessions', () => {
        const expiredSession = {
          id: '2',
          userId: '456',
          expires: new Date(Date.now() - 1000).toISOString()
        };

        const validation = validateSession(expiredSession);
        expect(validation.valid).toBe(false);
        expect(validation.error).toBe('SESSION_EXPIRED');
      });

      it('should reject sessions missing required fields', () => {
        const invalidSession = {
          id: '3',
          expires: new Date().toISOString()
        };

        const validation = validateSession(invalidSession);
        expect(validation.valid).toBe(false);
        expect(validation.error).toBe('INVALID_SESSION');
      });

      it('should handle invalid session structure', () => {
        const malformedSession = {
          id: '4',
          userId: '789',
          expires: 'invalid-date'
        };

        const validation = validateSession(malformedSession);
        expect(validation.valid).toBe(false);
        expect(validation.error).toBe('INVALID_SESSION');
      });
    });

    describe('Error Handling', () => {
      it('should log errors during session retrieval', async () => {
        jest.spyOn(redis, 'get').mockRejectedValue(new Error('Redis connection failed'));
        
        await expect(getSession('error-id'))
          .rejects
          .toThrow('Failed to retrieve session');
        expect(console.error).toHaveBeenCalled();
      });
    });
  });

  describe('Input validation', () => {
    it('should reject sign up with empty email', async () => {
      await expect(signUp('', 'password'))
        .rejects
        .toThrow('Email and password are required');
    });

describe('Session Management', () => {
  beforeEach(() => {
    redis.flushall();
    jest.clearAllMocks();
  });

  describe('getSession()', () => {
    it('should return cached session when available', async () => {
      const mockSession = { id: '1', userId: '123' };
      await redis.setex('session:test123', 300, JSON.stringify(mockSession));

      const result = await getSession('test123');
      expect(result).toEqual(mockSession);
      expect(redis.get).toHaveBeenCalledTimes(1);
    });

    it('should fetch from database when cache miss', async () => {
      const mockSession = { 
        id: '2', 
        userId: '456',
        expires: new Date(Date.now() + 3600000).toISOString()
      };
      
      jest.spyOn(redis, 'get').mockResolvedValue(null);
      jest.spyOn(redis, 'setex').mockImplementation(() => {});
      jest.spyOn(db, 'session').mockResolvedValue(mockSession);

      const result = await getSession('valid-id');
      expect(result).toEqual(mockSession);
      expect(redis.setex).toHaveBeenCalledWith(
        'session:valid-id',
        300,
        JSON.stringify(mockSession)
      );
    });

    it('should handle database query errors', async () => {
      jest.spyOn(db, 'session').mockRejectedValue(new Error('Database timeout'));
      
      await expect(getSession('error-id'))
        .rejects
        .toThrow('Failed to retrieve session');
    });

    describe('validateSession()', () => {
      it('should detect expired sessions', () => {
        const expiredSession = {
          id: '2',
          userId: '456',
          expires: new Date(Date.now() - 1000).toISOString()
        };

        const validation = validateSession(expiredSession);
        expect(validation.valid).toBe(false);
        expect(validation.error).toBe('SESSION_EXPIRED');
      });

      it('should reject sessions missing required fields', () => {
        const invalidSession = {
          id: '3',
          expires: new Date().toISOString()
        };

        const validation = validateSession(invalidSession);
        expect(validation.valid).toBe(false);
        expect(validation.error).toBe('INVALID_SESSION');
      });

      it('should handle invalid session structure', () => {
        const malformedSession = {
          id: '4',
          userId: '789',
          expires: 'invalid-date'
        };

        const validation = validateSession(malformedSession);
        expect(validation.valid).toBe(false);
        expect(validation.error).toBe('INVALID_SESSION');
      });
    });

    describe('Error Handling', () => {
      it('should log errors during session retrieval', async () => {
        jest.spyOn(redis, 'get').mockRejectedValue(new Error('Redis connection failed'));
        
        await expect(getSession('error-id'))
          .rejects
          .toThrow('Failed to retrieve session');
        expect(console.error).toHaveBeenCalled();
      });
    });
  });

    it('should reject sign up with empty password', async () => {
      await expect(signUp('test@example.com', ''))
        .rejects
        .toThrow('Email and password are required');
    });

describe('Session Management', () => {
  beforeEach(() => {
    redis.flushall();
    jest.clearAllMocks();
  });

  describe('getSession()', () => {
    it('should return cached session when available', async () => {
      const mockSession = { id: '1', userId: '123' };
      await redis.setex('session:test123', 300, JSON.stringify(mockSession));

      const result = await getSession('test123');
      expect(result).toEqual(mockSession);
      expect(redis.get).toHaveBeenCalledTimes(1);
    });

    it('should fetch from database when cache miss', async () => {
      const mockSession = { 
        id: '2', 
        userId: '456',
        expires: new Date(Date.now() + 3600000).toISOString()
      };
      
      jest.spyOn(redis, 'get').mockResolvedValue(null);
      jest.spyOn(redis, 'setex').mockImplementation(() => {});
      jest.spyOn(db, 'session').mockResolvedValue(mockSession);

      const result = await getSession('valid-id');
      expect(result).toEqual(mockSession);
      expect(redis.setex).toHaveBeenCalledWith(
        'session:valid-id',
        300,
        JSON.stringify(mockSession)
      );
    });

    it('should handle database query errors', async () => {
      jest.spyOn(db, 'session').mockRejectedValue(new Error('Database timeout'));
      
      await expect(getSession('error-id'))
        .rejects
        .toThrow('Failed to retrieve session');
    });

    describe('validateSession()', () => {
      it('should detect expired sessions', () => {
        const expiredSession = {
          id: '2',
          userId: '456',
          expires: new Date(Date.now() - 1000).toISOString()
        };

        const validation = validateSession(expiredSession);
        expect(validation.valid).toBe(false);
        expect(validation.error).toBe('SESSION_EXPIRED');
      });

      it('should reject sessions missing required fields', () => {
        const invalidSession = {
          id: '3',
          expires: new Date().toISOString()
        };

        const validation = validateSession(invalidSession);
        expect(validation.valid).toBe(false);
        expect(validation.error).toBe('INVALID_SESSION');
      });

      it('should handle invalid session structure', () => {
        const malformedSession = {
          id: '4',
          userId: '789',
          expires: 'invalid-date'
        };

        const validation = validateSession(malformedSession);
        expect(validation.valid).toBe(false);
        expect(validation.error).toBe('INVALID_SESSION');
      });
    });

    describe('Error Handling', () => {
      it('should log errors during session retrieval', async () => {
        jest.spyOn(redis, 'get').mockRejectedValue(new Error('Redis connection failed'));
        
        await expect(getSession('error-id'))
          .rejects
          .toThrow('Failed to retrieve session');
        expect(console.error).toHaveBeenCalled();
      });
    });
  });

    it('should reject sign in with invalid email format', async () => {
      await expect(signIn('invalid-email', 'password'))
        .rejects
        .toThrow('Invalid email format');
    });

describe('Session Management', () => {
  beforeEach(() => {
    redis.flushall();
    jest.clearAllMocks();
  });

  describe('getSession()', () => {
    it('should return cached session when available', async () => {
      const mockSession = { id: '1', userId: '123' };
      await redis.setex('session:test123', 300, JSON.stringify(mockSession));

      const result = await getSession('test123');
      expect(result).toEqual(mockSession);
      expect(redis.get).toHaveBeenCalledTimes(1);
    });

    it('should fetch from database when cache miss', async () => {
      const mockSession = { 
        id: '2', 
        userId: '456',
        expires: new Date(Date.now() + 3600000).toISOString()
      };
      
      jest.spyOn(redis, 'get').mockResolvedValue(null);
      jest.spyOn(redis, 'setex').mockImplementation(() => {});
      jest.spyOn(db, 'session').mockResolvedValue(mockSession);

      const result = await getSession('valid-id');
      expect(result).toEqual(mockSession);
      expect(redis.setex).toHaveBeenCalledWith(
        'session:valid-id',
        300,
        JSON.stringify(mockSession)
      );
    });

    it('should handle database query errors', async () => {
      jest.spyOn(db, 'session').mockRejectedValue(new Error('Database timeout'));
      
      await expect(getSession('error-id'))
        .rejects
        .toThrow('Failed to retrieve session');
    });

    describe('validateSession()', () => {
      it('should detect expired sessions', () => {
        const expiredSession = {
          id: '2',
          userId: '456',
          expires: new Date(Date.now() - 1000).toISOString()
        };

        const validation = validateSession(expiredSession);
        expect(validation.valid).toBe(false);
        expect(validation.error).toBe('SESSION_EXPIRED');
      });

      it('should reject sessions missing required fields', () => {
        const invalidSession = {
          id: '3',
          expires: new Date().toISOString()
        };

        const validation = validateSession(invalidSession);
        expect(validation.valid).toBe(false);
        expect(validation.error).toBe('INVALID_SESSION');
      });

      it('should handle invalid session structure', () => {
        const malformedSession = {
          id: '4',
          userId: '789',
          expires: 'invalid-date'
        };

        const validation = validateSession(malformedSession);
        expect(validation.valid).toBe(false);
        expect(validation.error).toBe('INVALID_SESSION');
      });
    });

    describe('Error Handling', () => {
      it('should log errors during session retrieval', async () => {
        jest.spyOn(redis, 'get').mockRejectedValue(new Error('Redis connection failed'));
        
        await expect(getSession('error-id'))
          .rejects
          .toThrow('Failed to retrieve session');
        expect(console.error).toHaveBeenCalled();
      });
    });
  });
  });

describe('Session Management', () => {
  beforeEach(() => {
    redis.flushall();
    jest.clearAllMocks();
  });

  describe('getSession()', () => {
    it('should return cached session when available', async () => {
      const mockSession = { id: '1', userId: '123' };
      await redis.setex('session:test123', 300, JSON.stringify(mockSession));

      const result = await getSession('test123');
      expect(result).toEqual(mockSession);
      expect(redis.get).toHaveBeenCalledTimes(1);
    });

    it('should fetch from database when cache miss', async () => {
      const mockSession = { 
        id: '2', 
        userId: '456',
        expires: new Date(Date.now() + 3600000).toISOString()
      };
      
      jest.spyOn(redis, 'get').mockResolvedValue(null);
      jest.spyOn(redis, 'setex').mockImplementation(() => {});
      jest.spyOn(db, 'session').mockResolvedValue(mockSession);

      const result = await getSession('valid-id');
      expect(result).toEqual(mockSession);
      expect(redis.setex).toHaveBeenCalledWith(
        'session:valid-id',
        300,
        JSON.stringify(mockSession)
      );
    });

    it('should handle database query errors', async () => {
      jest.spyOn(db, 'session').mockRejectedValue(new Error('Database timeout'));
      
      await expect(getSession('error-id'))
        .rejects
        .toThrow('Failed to retrieve session');
    });

    describe('validateSession()', () => {
      it('should detect expired sessions', () => {
        const expiredSession = {
          id: '2',
          userId: '456',
          expires: new Date(Date.now() - 1000).toISOString()
        };

        const validation = validateSession(expiredSession);
        expect(validation.valid).toBe(false);
        expect(validation.error).toBe('SESSION_EXPIRED');
      });

      it('should reject sessions missing required fields', () => {
        const invalidSession = {
          id: '3',
          expires: new Date().toISOString()
        };

        const validation = validateSession(invalidSession);
        expect(validation.valid).toBe(false);
        expect(validation.error).toBe('INVALID_SESSION');
      });

      it('should handle invalid session structure', () => {
        const malformedSession = {
          id: '4',
          userId: '789',
          expires: 'invalid-date'
        };

        const validation = validateSession(malformedSession);
        expect(validation.valid).toBe(false);
        expect(validation.error).toBe('INVALID_SESSION');
      });
    });

    describe('Error Handling', () => {
      it('should log errors during session retrieval', async () => {
        jest.spyOn(redis, 'get').mockRejectedValue(new Error('Redis connection failed'));
        
        await expect(getSession('error-id'))
          .rejects
          .toThrow('Failed to retrieve session');
        expect(console.error).toHaveBeenCalled();
      });
    });
  });
});

describe('Session Management', () => {
  beforeEach(() => {
    redis.flushall();
    jest.clearAllMocks();
  });

  describe('getSession()', () => {
    it('should return cached session when available', async () => {
      const mockSession = { id: '1', userId: '123' };
      await redis.setex('session:test123', 300, JSON.stringify(mockSession));

      const result = await getSession('test123');
      expect(result).toEqual(mockSession);
      expect(redis.get).toHaveBeenCalledTimes(1);
    });

    it('should fetch from database when cache miss', async () => {
      const mockSession = { 
        id: '2', 
        userId: '456',
        expires: new Date(Date.now() + 3600000).toISOString()
      };
      
      jest.spyOn(redis, 'get').mockResolvedValue(null);
      jest.spyOn(redis, 'setex').mockImplementation(() => {});
      jest.spyOn(db, 'session').mockResolvedValue(mockSession);

      const result = await getSession('valid-id');
      expect(result).toEqual(mockSession);
      expect(redis.setex).toHaveBeenCalledWith(
        'session:valid-id',
        300,
        JSON.stringify(mockSession)
      );
    });

    it('should handle database query errors', async () => {
      jest.spyOn(db, 'session').mockRejectedValue(new Error('Database timeout'));
      
      await expect(getSession('error-id'))
        .rejects
        .toThrow('Failed to retrieve session');
    });

    describe('validateSession()', () => {
      it('should detect expired sessions', () => {
        const expiredSession = {
          id: '2',
          userId: '456',
          expires: new Date(Date.now() - 1000).toISOString()
        };

        const validation = validateSession(expiredSession);
        expect(validation.valid).toBe(false);
        expect(validation.error).toBe('SESSION_EXPIRED');
      });

      it('should reject sessions missing required fields', () => {
        const invalidSession = {
          id: '3',
          expires: new Date().toISOString()
        };

        const validation = validateSession(invalidSession);
        expect(validation.valid).toBe(false);
        expect(validation.error).toBe('INVALID_SESSION');
      });

      it('should handle invalid session structure', () => {
        const malformedSession = {
          id: '4',
          userId: '789',
          expires: 'invalid-date'
        };

        const validation = validateSession(malformedSession);
        expect(validation.valid).toBe(false);
        expect(validation.error).toBe('INVALID_SESSION');
      });
    });

    describe('Error Handling', () => {
      it('should log errors during session retrieval', async () => {
        jest.spyOn(redis, 'get').mockRejectedValue(new Error('Redis connection failed'));
        
        await expect(getSession('error-id'))
          .rejects
          .toThrow('Failed to retrieve session');
        expect(console.error).toHaveBeenCalled();
      });
    });
  });

describe('Password Reset', () => {
  describe('requestPasswordReset', () => {
    it('should successfully request password reset', async () => {
      supabase.auth.resetPasswordForEmail.mockResolvedValueOnce({ 
        data: { success: true }, 
        error: null 
      });

describe('Session Management', () => {
  beforeEach(() => {
    redis.flushall();
    jest.clearAllMocks();
  });

  describe('getSession()', () => {
    it('should return cached session when available', async () => {
      const mockSession = { id: '1', userId: '123' };
      await redis.setex('session:test123', 300, JSON.stringify(mockSession));

      const result = await getSession('test123');
      expect(result).toEqual(mockSession);
      expect(redis.get).toHaveBeenCalledTimes(1);
    });

    it('should fetch from database when cache miss', async () => {
      const mockSession = { 
        id: '2', 
        userId: '456',
        expires: new Date(Date.now() + 3600000).toISOString()
      };
      
      jest.spyOn(redis, 'get').mockResolvedValue(null);
      jest.spyOn(redis, 'setex').mockImplementation(() => {});
      jest.spyOn(db, 'session').mockResolvedValue(mockSession);

      const result = await getSession('valid-id');
      expect(result).toEqual(mockSession);
      expect(redis.setex).toHaveBeenCalledWith(
        'session:valid-id',
        300,
        JSON.stringify(mockSession)
      );
    });

    it('should handle database query errors', async () => {
      jest.spyOn(db, 'session').mockRejectedValue(new Error('Database timeout'));
      
      await expect(getSession('error-id'))
        .rejects
        .toThrow('Failed to retrieve session');
    });

    describe('validateSession()', () => {
      it('should detect expired sessions', () => {
        const expiredSession = {
          id: '2',
          userId: '456',
          expires: new Date(Date.now() - 1000).toISOString()
        };

        const validation = validateSession(expiredSession);
        expect(validation.valid).toBe(false);
        expect(validation.error).toBe('SESSION_EXPIRED');
      });

      it('should reject sessions missing required fields', () => {
        const invalidSession = {
          id: '3',
          expires: new Date().toISOString()
        };

        const validation = validateSession(invalidSession);
        expect(validation.valid).toBe(false);
        expect(validation.error).toBe('INVALID_SESSION');
      });

      it('should handle invalid session structure', () => {
        const malformedSession = {
          id: '4',
          userId: '789',
          expires: 'invalid-date'
        };

        const validation = validateSession(malformedSession);
        expect(validation.valid).toBe(false);
        expect(validation.error).toBe('INVALID_SESSION');
      });
    });

    describe('Error Handling', () => {
      it('should log errors during session retrieval', async () => {
        jest.spyOn(redis, 'get').mockRejectedValue(new Error('Redis connection failed'));
        
        await expect(getSession('error-id'))
          .rejects
          .toThrow('Failed to retrieve session');
        expect(console.error).toHaveBeenCalled();
      });
    });
  });

      const result = await requestPasswordReset('test@example.com');
      expect(result.success).toBe(true);
      expect(supabase.auth.resetPasswordForEmail).toHaveBeenCalledWith('test@example.com');
    });

describe('Session Management', () => {
  beforeEach(() => {
    redis.flushall();
    jest.clearAllMocks();
  });

  describe('getSession()', () => {
    it('should return cached session when available', async () => {
      const mockSession = { id: '1', userId: '123' };
      await redis.setex('session:test123', 300, JSON.stringify(mockSession));

      const result = await getSession('test123');
      expect(result).toEqual(mockSession);
      expect(redis.get).toHaveBeenCalledTimes(1);
    });

    it('should fetch from database when cache miss', async () => {
      const mockSession = { 
        id: '2', 
        userId: '456',
        expires: new Date(Date.now() + 3600000).toISOString()
      };
      
      jest.spyOn(redis, 'get').mockResolvedValue(null);
      jest.spyOn(redis, 'setex').mockImplementation(() => {});
      jest.spyOn(db, 'session').mockResolvedValue(mockSession);

      const result = await getSession('valid-id');
      expect(result).toEqual(mockSession);
      expect(redis.setex).toHaveBeenCalledWith(
        'session:valid-id',
        300,
        JSON.stringify(mockSession)
      );
    });

    it('should handle database query errors', async () => {
      jest.spyOn(db, 'session').mockRejectedValue(new Error('Database timeout'));
      
      await expect(getSession('error-id'))
        .rejects
        .toThrow('Failed to retrieve session');
    });

    describe('validateSession()', () => {
      it('should detect expired sessions', () => {
        const expiredSession = {
          id: '2',
          userId: '456',
          expires: new Date(Date.now() - 1000).toISOString()
        };

        const validation = validateSession(expiredSession);
        expect(validation.valid).toBe(false);
        expect(validation.error).toBe('SESSION_EXPIRED');
      });

      it('should reject sessions missing required fields', () => {
        const invalidSession = {
          id: '3',
          expires: new Date().toISOString()
        };

        const validation = validateSession(invalidSession);
        expect(validation.valid).toBe(false);
        expect(validation.error).toBe('INVALID_SESSION');
      });

      it('should handle invalid session structure', () => {
        const malformedSession = {
          id: '4',
          userId: '789',
          expires: 'invalid-date'
        };

        const validation = validateSession(malformedSession);
        expect(validation.valid).toBe(false);
        expect(validation.error).toBe('INVALID_SESSION');
      });
    });

    describe('Error Handling', () => {
      it('should log errors during session retrieval', async () => {
        jest.spyOn(redis, 'get').mockRejectedValue(new Error('Redis connection failed'));
        
        await expect(getSession('error-id'))
          .rejects
          .toThrow('Failed to retrieve session');
        expect(console.error).toHaveBeenCalled();
      });
    });
  });

    it('should throw AuthenticationError for invalid email', async () => {
      await expect(requestPasswordReset('invalid-email'))
        .rejects
        .toThrow(AuthenticationError);
    });

describe('Session Management', () => {
  beforeEach(() => {
    redis.flushall();
    jest.clearAllMocks();
  });

  describe('getSession()', () => {
    it('should return cached session when available', async () => {
      const mockSession = { id: '1', userId: '123' };
      await redis.setex('session:test123', 300, JSON.stringify(mockSession));

      const result = await getSession('test123');
      expect(result).toEqual(mockSession);
      expect(redis.get).toHaveBeenCalledTimes(1);
    });

    it('should fetch from database when cache miss', async () => {
      const mockSession = { 
        id: '2', 
        userId: '456',
        expires: new Date(Date.now() + 3600000).toISOString()
      };
      
      jest.spyOn(redis, 'get').mockResolvedValue(null);
      jest.spyOn(redis, 'setex').mockImplementation(() => {});
      jest.spyOn(db, 'session').mockResolvedValue(mockSession);

      const result = await getSession('valid-id');
      expect(result).toEqual(mockSession);
      expect(redis.setex).toHaveBeenCalledWith(
        'session:valid-id',
        300,
        JSON.stringify(mockSession)
      );
    });

    it('should handle database query errors', async () => {
      jest.spyOn(db, 'session').mockRejectedValue(new Error('Database timeout'));
      
      await expect(getSession('error-id'))
        .rejects
        .toThrow('Failed to retrieve session');
    });

    describe('validateSession()', () => {
      it('should detect expired sessions', () => {
        const expiredSession = {
          id: '2',
          userId: '456',
          expires: new Date(Date.now() - 1000).toISOString()
        };

        const validation = validateSession(expiredSession);
        expect(validation.valid).toBe(false);
        expect(validation.error).toBe('SESSION_EXPIRED');
      });

      it('should reject sessions missing required fields', () => {
        const invalidSession = {
          id: '3',
          expires: new Date().toISOString()
        };

        const validation = validateSession(invalidSession);
        expect(validation.valid).toBe(false);
        expect(validation.error).toBe('INVALID_SESSION');
      });

      it('should handle invalid session structure', () => {
        const malformedSession = {
          id: '4',
          userId: '789',
          expires: 'invalid-date'
        };

        const validation = validateSession(malformedSession);
        expect(validation.valid).toBe(false);
        expect(validation.error).toBe('INVALID_SESSION');
      });
    });

    describe('Error Handling', () => {
      it('should log errors during session retrieval', async () => {
        jest.spyOn(redis, 'get').mockRejectedValue(new Error('Redis connection failed'));
        
        await expect(getSession('error-id'))
          .rejects
          .toThrow('Failed to retrieve session');
        expect(console.error).toHaveBeenCalled();
      });
    });
  });

    it('should throw AuthenticationError for Supabase errors', async () => {
      supabase.auth.resetPasswordForEmail.mockRejectedValueOnce(new Error('Reset failed'));
      await expect(requestPasswordReset('test@example.com'))
        .rejects
        .toThrow(AuthenticationError);
    });

describe('Session Management', () => {
  beforeEach(() => {
    redis.flushall();
    jest.clearAllMocks();
  });

  describe('getSession()', () => {
    it('should return cached session when available', async () => {
      const mockSession = { id: '1', userId: '123' };
      await redis.setex('session:test123', 300, JSON.stringify(mockSession));

      const result = await getSession('test123');
      expect(result).toEqual(mockSession);
      expect(redis.get).toHaveBeenCalledTimes(1);
    });

    it('should fetch from database when cache miss', async () => {
      const mockSession = { 
        id: '2', 
        userId: '456',
        expires: new Date(Date.now() + 3600000).toISOString()
      };
      
      jest.spyOn(redis, 'get').mockResolvedValue(null);
      jest.spyOn(redis, 'setex').mockImplementation(() => {});
      jest.spyOn(db, 'session').mockResolvedValue(mockSession);

      const result = await getSession('valid-id');
      expect(result).toEqual(mockSession);
      expect(redis.setex).toHaveBeenCalledWith(
        'session:valid-id',
        300,
        JSON.stringify(mockSession)
      );
    });

    it('should handle database query errors', async () => {
      jest.spyOn(db, 'session').mockRejectedValue(new Error('Database timeout'));
      
      await expect(getSession('error-id'))
        .rejects
        .toThrow('Failed to retrieve session');
    });

    describe('validateSession()', () => {
      it('should detect expired sessions', () => {
        const expiredSession = {
          id: '2',
          userId: '456',
          expires: new Date(Date.now() - 1000).toISOString()
        };

        const validation = validateSession(expiredSession);
        expect(validation.valid).toBe(false);
        expect(validation.error).toBe('SESSION_EXPIRED');
      });

      it('should reject sessions missing required fields', () => {
        const invalidSession = {
          id: '3',
          expires: new Date().toISOString()
        };

        const validation = validateSession(invalidSession);
        expect(validation.valid).toBe(false);
        expect(validation.error).toBe('INVALID_SESSION');
      });

      it('should handle invalid session structure', () => {
        const malformedSession = {
          id: '4',
          userId: '789',
          expires: 'invalid-date'
        };

        const validation = validateSession(malformedSession);
        expect(validation.valid).toBe(false);
        expect(validation.error).toBe('INVALID_SESSION');
      });
    });

    describe('Error Handling', () => {
      it('should log errors during session retrieval', async () => {
        jest.spyOn(redis, 'get').mockRejectedValue(new Error('Redis connection failed'));
        
        await expect(getSession('error-id'))
          .rejects
          .toThrow('Failed to retrieve session');
        expect(console.error).toHaveBeenCalled();
      });
    });
  });
  });

describe('Session Management', () => {
  beforeEach(() => {
    redis.flushall();
    jest.clearAllMocks();
  });

  describe('getSession()', () => {
    it('should return cached session when available', async () => {
      const mockSession = { id: '1', userId: '123' };
      await redis.setex('session:test123', 300, JSON.stringify(mockSession));

      const result = await getSession('test123');
      expect(result).toEqual(mockSession);
      expect(redis.get).toHaveBeenCalledTimes(1);
    });

    it('should fetch from database when cache miss', async () => {
      const mockSession = { 
        id: '2', 
        userId: '456',
        expires: new Date(Date.now() + 3600000).toISOString()
      };
      
      jest.spyOn(redis, 'get').mockResolvedValue(null);
      jest.spyOn(redis, 'setex').mockImplementation(() => {});
      jest.spyOn(db, 'session').mockResolvedValue(mockSession);

      const result = await getSession('valid-id');
      expect(result).toEqual(mockSession);
      expect(redis.setex).toHaveBeenCalledWith(
        'session:valid-id',
        300,
        JSON.stringify(mockSession)
      );
    });

    it('should handle database query errors', async () => {
      jest.spyOn(db, 'session').mockRejectedValue(new Error('Database timeout'));
      
      await expect(getSession('error-id'))
        .rejects
        .toThrow('Failed to retrieve session');
    });

    describe('validateSession()', () => {
      it('should detect expired sessions', () => {
        const expiredSession = {
          id: '2',
          userId: '456',
          expires: new Date(Date.now() - 1000).toISOString()
        };

        const validation = validateSession(expiredSession);
        expect(validation.valid).toBe(false);
        expect(validation.error).toBe('SESSION_EXPIRED');
      });

      it('should reject sessions missing required fields', () => {
        const invalidSession = {
          id: '3',
          expires: new Date().toISOString()
        };

        const validation = validateSession(invalidSession);
        expect(validation.valid).toBe(false);
        expect(validation.error).toBe('INVALID_SESSION');
      });

      it('should handle invalid session structure', () => {
        const malformedSession = {
          id: '4',
          userId: '789',
          expires: 'invalid-date'
        };

        const validation = validateSession(malformedSession);
        expect(validation.valid).toBe(false);
        expect(validation.error).toBe('INVALID_SESSION');
      });
    });

    describe('Error Handling', () => {
      it('should log errors during session retrieval', async () => {
        jest.spyOn(redis, 'get').mockRejectedValue(new Error('Redis connection failed'));
        
        await expect(getSession('error-id'))
          .rejects
          .toThrow('Failed to retrieve session');
        expect(console.error).toHaveBeenCalled();
      });
    });
  });

  describe('resetPassword', () => {
    it('should successfully reset password', async () => {
      supabase.auth.updateUser.mockResolvedValueOnce({ 
        data: { user: mockUser }, 
        error: null 
      });

describe('Session Management', () => {
  beforeEach(() => {
    redis.flushall();
    jest.clearAllMocks();
  });

  describe('getSession()', () => {
    it('should return cached session when available', async () => {
      const mockSession = { id: '1', userId: '123' };
      await redis.setex('session:test123', 300, JSON.stringify(mockSession));

      const result = await getSession('test123');
      expect(result).toEqual(mockSession);
      expect(redis.get).toHaveBeenCalledTimes(1);
    });

    it('should fetch from database when cache miss', async () => {
      const mockSession = { 
        id: '2', 
        userId: '456',
        expires: new Date(Date.now() + 3600000).toISOString()
      };
      
      jest.spyOn(redis, 'get').mockResolvedValue(null);
      jest.spyOn(redis, 'setex').mockImplementation(() => {});
      jest.spyOn(db, 'session').mockResolvedValue(mockSession);

      const result = await getSession('valid-id');
      expect(result).toEqual(mockSession);
      expect(redis.setex).toHaveBeenCalledWith(
        'session:valid-id',
        300,
        JSON.stringify(mockSession)
      );
    });

    it('should handle database query errors', async () => {
      jest.spyOn(db, 'session').mockRejectedValue(new Error('Database timeout'));
      
      await expect(getSession('error-id'))
        .rejects
        .toThrow('Failed to retrieve session');
    });

    describe('validateSession()', () => {
      it('should detect expired sessions', () => {
        const expiredSession = {
          id: '2',
          userId: '456',
          expires: new Date(Date.now() - 1000).toISOString()
        };

        const validation = validateSession(expiredSession);
        expect(validation.valid).toBe(false);
        expect(validation.error).toBe('SESSION_EXPIRED');
      });

      it('should reject sessions missing required fields', () => {
        const invalidSession = {
          id: '3',
          expires: new Date().toISOString()
        };

        const validation = validateSession(invalidSession);
        expect(validation.valid).toBe(false);
        expect(validation.error).toBe('INVALID_SESSION');
      });

      it('should handle invalid session structure', () => {
        const malformedSession = {
          id: '4',
          userId: '789',
          expires: 'invalid-date'
        };

        const validation = validateSession(malformedSession);
        expect(validation.valid).toBe(false);
        expect(validation.error).toBe('INVALID_SESSION');
      });
    });

    describe('Error Handling', () => {
      it('should log errors during session retrieval', async () => {
        jest.spyOn(redis, 'get').mockRejectedValue(new Error('Redis connection failed'));
        
        await expect(getSession('error-id'))
          .rejects
          .toThrow('Failed to retrieve session');
        expect(console.error).toHaveBeenCalled();
      });
    });
  });

      const user = await resetPassword(mockToken, 'NewPassword123!');
      expect(user).toEqual(mockUser);
    });

describe('Session Management', () => {
  beforeEach(() => {
    redis.flushall();
    jest.clearAllMocks();
  });

  describe('getSession()', () => {
    it('should return cached session when available', async () => {
      const mockSession = { id: '1', userId: '123' };
      await redis.setex('session:test123', 300, JSON.stringify(mockSession));

      const result = await getSession('test123');
      expect(result).toEqual(mockSession);
      expect(redis.get).toHaveBeenCalledTimes(1);
    });

    it('should fetch from database when cache miss', async () => {
      const mockSession = { 
        id: '2', 
        userId: '456',
        expires: new Date(Date.now() + 3600000).toISOString()
      };
      
      jest.spyOn(redis, 'get').mockResolvedValue(null);
      jest.spyOn(redis, 'setex').mockImplementation(() => {});
      jest.spyOn(db, 'session').mockResolvedValue(mockSession);

      const result = await getSession('valid-id');
      expect(result).toEqual(mockSession);
      expect(redis.setex).toHaveBeenCalledWith(
        'session:valid-id',
        300,
        JSON.stringify(mockSession)
      );
    });

    it('should handle database query errors', async () => {
      jest.spyOn(db, 'session').mockRejectedValue(new Error('Database timeout'));
      
      await expect(getSession('error-id'))
        .rejects
        .toThrow('Failed to retrieve session');
    });

    describe('validateSession()', () => {
      it('should detect expired sessions', () => {
        const expiredSession = {
          id: '2',
          userId: '456',
          expires: new Date(Date.now() - 1000).toISOString()
        };

        const validation = validateSession(expiredSession);
        expect(validation.valid).toBe(false);
        expect(validation.error).toBe('SESSION_EXPIRED');
      });

      it('should reject sessions missing required fields', () => {
        const invalidSession = {
          id: '3',
          expires: new Date().toISOString()
        };

        const validation = validateSession(invalidSession);
        expect(validation.valid).toBe(false);
        expect(validation.error).toBe('INVALID_SESSION');
      });

      it('should handle invalid session structure', () => {
        const malformedSession = {
          id: '4',
          userId: '789',
          expires: 'invalid-date'
        };

        const validation = validateSession(malformedSession);
        expect(validation.valid).toBe(false);
        expect(validation.error).toBe('INVALID_SESSION');
      });
    });

    describe('Error Handling', () => {
      it('should log errors during session retrieval', async () => {
        jest.spyOn(redis, 'get').mockRejectedValue(new Error('Redis connection failed'));
        
        await expect(getSession('error-id'))
          .rejects
          .toThrow('Failed to retrieve session');
        expect(console.error).toHaveBeenCalled();
      });
    });
  });

    it('should throw InvalidResetTokenError for invalid token', async () => {
      supabase.auth.updateUser.mockRejectedValueOnce(new Error('Invalid token'));
      await expect(resetPassword('invalid-token', 'NewPassword123!'))
        .rejects
        .toThrow(InvalidResetTokenError);
    });

describe('Session Management', () => {
  beforeEach(() => {
    redis.flushall();
    jest.clearAllMocks();
  });

  describe('getSession()', () => {
    it('should return cached session when available', async () => {
      const mockSession = { id: '1', userId: '123' };
      await redis.setex('session:test123', 300, JSON.stringify(mockSession));

      const result = await getSession('test123');
      expect(result).toEqual(mockSession);
      expect(redis.get).toHaveBeenCalledTimes(1);
    });

    it('should fetch from database when cache miss', async () => {
      const mockSession = { 
        id: '2', 
        userId: '456',
        expires: new Date(Date.now() + 3600000).toISOString()
      };
      
      jest.spyOn(redis, 'get').mockResolvedValue(null);
      jest.spyOn(redis, 'setex').mockImplementation(() => {});
      jest.spyOn(db, 'session').mockResolvedValue(mockSession);

      const result = await getSession('valid-id');
      expect(result).toEqual(mockSession);
      expect(redis.setex).toHaveBeenCalledWith(
        'session:valid-id',
        300,
        JSON.stringify(mockSession)
      );
    });

    it('should handle database query errors', async () => {
      jest.spyOn(db, 'session').mockRejectedValue(new Error('Database timeout'));
      
      await expect(getSession('error-id'))
        .rejects
        .toThrow('Failed to retrieve session');
    });

    describe('validateSession()', () => {
      it('should detect expired sessions', () => {
        const expiredSession = {
          id: '2',
          userId: '456',
          expires: new Date(Date.now() - 1000).toISOString()
        };

        const validation = validateSession(expiredSession);
        expect(validation.valid).toBe(false);
        expect(validation.error).toBe('SESSION_EXPIRED');
      });

      it('should reject sessions missing required fields', () => {
        const invalidSession = {
          id: '3',
          expires: new Date().toISOString()
        };

        const validation = validateSession(invalidSession);
        expect(validation.valid).toBe(false);
        expect(validation.error).toBe('INVALID_SESSION');
      });

      it('should handle invalid session structure', () => {
        const malformedSession = {
          id: '4',
          userId: '789',
          expires: 'invalid-date'
        };

        const validation = validateSession(malformedSession);
        expect(validation.valid).toBe(false);
        expect(validation.error).toBe('INVALID_SESSION');
      });
    });

    describe('Error Handling', () => {
      it('should log errors during session retrieval', async () => {
        jest.spyOn(redis, 'get').mockRejectedValue(new Error('Redis connection failed'));
        
        await expect(getSession('error-id'))
          .rejects
          .toThrow('Failed to retrieve session');
        expect(console.error).toHaveBeenCalled();
      });
    });
  });

    it('should throw PasswordTooWeakError for invalid password', async () => {
      await expect(resetPassword(mockToken, 'weak'))
        .rejects
        .toThrow(PasswordTooWeakError);
    });

describe('Session Management', () => {
  beforeEach(() => {
    redis.flushall();
    jest.clearAllMocks();
  });

  describe('getSession()', () => {
    it('should return cached session when available', async () => {
      const mockSession = { id: '1', userId: '123' };
      await redis.setex('session:test123', 300, JSON.stringify(mockSession));

      const result = await getSession('test123');
      expect(result).toEqual(mockSession);
      expect(redis.get).toHaveBeenCalledTimes(1);
    });

    it('should fetch from database when cache miss', async () => {
      const mockSession = { 
        id: '2', 
        userId: '456',
        expires: new Date(Date.now() + 3600000).toISOString()
      };
      
      jest.spyOn(redis, 'get').mockResolvedValue(null);
      jest.spyOn(redis, 'setex').mockImplementation(() => {});
      jest.spyOn(db, 'session').mockResolvedValue(mockSession);

      const result = await getSession('valid-id');
      expect(result).toEqual(mockSession);
      expect(redis.setex).toHaveBeenCalledWith(
        'session:valid-id',
        300,
        JSON.stringify(mockSession)
      );
    });

    it('should handle database query errors', async () => {
      jest.spyOn(db, 'session').mockRejectedValue(new Error('Database timeout'));
      
      await expect(getSession('error-id'))
        .rejects
        .toThrow('Failed to retrieve session');
    });

    describe('validateSession()', () => {
      it('should detect expired sessions', () => {
        const expiredSession = {
          id: '2',
          userId: '456',
          expires: new Date(Date.now() - 1000).toISOString()
        };

        const validation = validateSession(expiredSession);
        expect(validation.valid).toBe(false);
        expect(validation.error).toBe('SESSION_EXPIRED');
      });

      it('should reject sessions missing required fields', () => {
        const invalidSession = {
          id: '3',
          expires: new Date().toISOString()
        };

        const validation = validateSession(invalidSession);
        expect(validation.valid).toBe(false);
        expect(validation.error).toBe('INVALID_SESSION');
      });

      it('should handle invalid session structure', () => {
        const malformedSession = {
          id: '4',
          userId: '789',
          expires: 'invalid-date'
        };

        const validation = validateSession(malformedSession);
        expect(validation.valid).toBe(false);
        expect(validation.error).toBe('INVALID_SESSION');
      });
    });

    describe('Error Handling', () => {
      it('should log errors during session retrieval', async () => {
        jest.spyOn(redis, 'get').mockRejectedValue(new Error('Redis connection failed'));
        
        await expect(getSession('error-id'))
          .rejects
          .toThrow('Failed to retrieve session');
        expect(console.error).toHaveBeenCalled();
      });
    });
  });
  });

describe('Session Management', () => {
  beforeEach(() => {
    redis.flushall();
    jest.clearAllMocks();
  });

  describe('getSession()', () => {
    it('should return cached session when available', async () => {
      const mockSession = { id: '1', userId: '123' };
      await redis.setex('session:test123', 300, JSON.stringify(mockSession));

      const result = await getSession('test123');
      expect(result).toEqual(mockSession);
      expect(redis.get).toHaveBeenCalledTimes(1);
    });

    it('should fetch from database when cache miss', async () => {
      const mockSession = { 
        id: '2', 
        userId: '456',
        expires: new Date(Date.now() + 3600000).toISOString()
      };
      
      jest.spyOn(redis, 'get').mockResolvedValue(null);
      jest.spyOn(redis, 'setex').mockImplementation(() => {});
      jest.spyOn(db, 'session').mockResolvedValue(mockSession);

      const result = await getSession('valid-id');
      expect(result).toEqual(mockSession);
      expect(redis.setex).toHaveBeenCalledWith(
        'session:valid-id',
        300,
        JSON.stringify(mockSession)
      );
    });

    it('should handle database query errors', async () => {
      jest.spyOn(db, 'session').mockRejectedValue(new Error('Database timeout'));
      
      await expect(getSession('error-id'))
        .rejects
        .toThrow('Failed to retrieve session');
    });

    describe('validateSession()', () => {
      it('should detect expired sessions', () => {
        const expiredSession = {
          id: '2',
          userId: '456',
          expires: new Date(Date.now() - 1000).toISOString()
        };

        const validation = validateSession(expiredSession);
        expect(validation.valid).toBe(false);
        expect(validation.error).toBe('SESSION_EXPIRED');
      });

      it('should reject sessions missing required fields', () => {
        const invalidSession = {
          id: '3',
          expires: new Date().toISOString()
        };

        const validation = validateSession(invalidSession);
        expect(validation.valid).toBe(false);
        expect(validation.error).toBe('INVALID_SESSION');
      });

      it('should handle invalid session structure', () => {
        const malformedSession = {
          id: '4',
          userId: '789',
          expires: 'invalid-date'
        };

        const validation = validateSession(malformedSession);
        expect(validation.valid).toBe(false);
        expect(validation.error).toBe('INVALID_SESSION');
      });
    });

    describe('Error Handling', () => {
      it('should log errors during session retrieval', async () => {
        jest.spyOn(redis, 'get').mockRejectedValue(new Error('Redis connection failed'));
        
        await expect(getSession('error-id'))
          .rejects
          .toThrow('Failed to retrieve session');
        expect(console.error).toHaveBeenCalled();
      });
    });
  });
});

describe('Session Management', () => {
  beforeEach(() => {
    redis.flushall();
    jest.clearAllMocks();
  });

  describe('getSession()', () => {
    it('should return cached session when available', async () => {
      const mockSession = { id: '1', userId: '123' };
      await redis.setex('session:test123', 300, JSON.stringify(mockSession));

      const result = await getSession('test123');
      expect(result).toEqual(mockSession);
      expect(redis.get).toHaveBeenCalledTimes(1);
    });

    it('should fetch from database when cache miss', async () => {
      const mockSession = { 
        id: '2', 
        userId: '456',
        expires: new Date(Date.now() + 3600000).toISOString()
      };
      
      jest.spyOn(redis, 'get').mockResolvedValue(null);
      jest.spyOn(redis, 'setex').mockImplementation(() => {});
      jest.spyOn(db, 'session').mockResolvedValue(mockSession);

      const result = await getSession('valid-id');
      expect(result).toEqual(mockSession);
      expect(redis.setex).toHaveBeenCalledWith(
        'session:valid-id',
        300,
        JSON.stringify(mockSession)
      );
    });

    it('should handle database query errors', async () => {
      jest.spyOn(db, 'session').mockRejectedValue(new Error('Database timeout'));
      
      await expect(getSession('error-id'))
        .rejects
        .toThrow('Failed to retrieve session');
    });

    describe('validateSession()', () => {
      it('should detect expired sessions', () => {
        const expiredSession = {
          id: '2',
          userId: '456',
          expires: new Date(Date.now() - 1000).toISOString()
        };

        const validation = validateSession(expiredSession);
        expect(validation.valid).toBe(false);
        expect(validation.error).toBe('SESSION_EXPIRED');
      });

      it('should reject sessions missing required fields', () => {
        const invalidSession = {
          id: '3',
          expires: new Date().toISOString()
        };

        const validation = validateSession(invalidSession);
        expect(validation.valid).toBe(false);
        expect(validation.error).toBe('INVALID_SESSION');
      });

      it('should handle invalid session structure', () => {
        const malformedSession = {
          id: '4',
          userId: '789',
          expires: 'invalid-date'
        };

        const validation = validateSession(malformedSession);
        expect(validation.valid).toBe(false);
        expect(validation.error).toBe('INVALID_SESSION');
      });
    });

    describe('Error Handling', () => {
      it('should log errors during session retrieval', async () => {
        jest.spyOn(redis, 'get').mockRejectedValue(new Error('Redis connection failed'));
        
        await expect(getSession('error-id'))
          .rejects
          .toThrow('Failed to retrieve session');
        expect(console.error).toHaveBeenCalled();
      });
    });
  });

describe('MFA functionality', () => {
  describe('verifyMFA', () => {
    it('should successfully verify MFA code', async () => {
      supabase.auth.mfa.verify.mockResolvedValueOnce({ data: { success: true }, error: null });

describe('Session Management', () => {
  beforeEach(() => {
    redis.flushall();
    jest.clearAllMocks();
  });

  describe('getSession()', () => {
    it('should return cached session when available', async () => {
      const mockSession = { id: '1', userId: '123' };
      await redis.setex('session:test123', 300, JSON.stringify(mockSession));

      const result = await getSession('test123');
      expect(result).toEqual(mockSession);
      expect(redis.get).toHaveBeenCalledTimes(1);
    });

    it('should fetch from database when cache miss', async () => {
      const mockSession = { 
        id: '2', 
        userId: '456',
        expires: new Date(Date.now() + 3600000).toISOString()
      };
      
      jest.spyOn(redis, 'get').mockResolvedValue(null);
      jest.spyOn(redis, 'setex').mockImplementation(() => {});
      jest.spyOn(db, 'session').mockResolvedValue(mockSession);

      const result = await getSession('valid-id');
      expect(result).toEqual(mockSession);
      expect(redis.setex).toHaveBeenCalledWith(
        'session:valid-id',
        300,
        JSON.stringify(mockSession)
      );
    });

    it('should handle database query errors', async () => {
      jest.spyOn(db, 'session').mockRejectedValue(new Error('Database timeout'));
      
      await expect(getSession('error-id'))
        .rejects
        .toThrow('Failed to retrieve session');
    });

    describe('validateSession()', () => {
      it('should detect expired sessions', () => {
        const expiredSession = {
          id: '2',
          userId: '456',
          expires: new Date(Date.now() - 1000).toISOString()
        };

        const validation = validateSession(expiredSession);
        expect(validation.valid).toBe(false);
        expect(validation.error).toBe('SESSION_EXPIRED');
      });

      it('should reject sessions missing required fields', () => {
        const invalidSession = {
          id: '3',
          expires: new Date().toISOString()
        };

        const validation = validateSession(invalidSession);
        expect(validation.valid).toBe(false);
        expect(validation.error).toBe('INVALID_SESSION');
      });

      it('should handle invalid session structure', () => {
        const malformedSession = {
          id: '4',
          userId: '789',
          expires: 'invalid-date'
        };

        const validation = validateSession(malformedSession);
        expect(validation.valid).toBe(false);
        expect(validation.error).toBe('INVALID_SESSION');
      });
    });

    describe('Error Handling', () => {
      it('should log errors during session retrieval', async () => {
        jest.spyOn(redis, 'get').mockRejectedValue(new Error('Redis connection failed'));
        
        await expect(getSession('error-id'))
          .rejects
          .toThrow('Failed to retrieve session');
        expect(console.error).toHaveBeenCalled();
      });
    });
  });
      const result = await verifyMFA('user123', '123456');
      expect(result.success).toBe(true);
    });

describe('Session Management', () => {
  beforeEach(() => {
    redis.flushall();
    jest.clearAllMocks();
  });

  describe('getSession()', () => {
    it('should return cached session when available', async () => {
      const mockSession = { id: '1', userId: '123' };
      await redis.setex('session:test123', 300, JSON.stringify(mockSession));

      const result = await getSession('test123');
      expect(result).toEqual(mockSession);
      expect(redis.get).toHaveBeenCalledTimes(1);
    });

    it('should fetch from database when cache miss', async () => {
      const mockSession = { 
        id: '2', 
        userId: '456',
        expires: new Date(Date.now() + 3600000).toISOString()
      };
      
      jest.spyOn(redis, 'get').mockResolvedValue(null);
      jest.spyOn(redis, 'setex').mockImplementation(() => {});
      jest.spyOn(db, 'session').mockResolvedValue(mockSession);

      const result = await getSession('valid-id');
      expect(result).toEqual(mockSession);
      expect(redis.setex).toHaveBeenCalledWith(
        'session:valid-id',
        300,
        JSON.stringify(mockSession)
      );
    });

    it('should handle database query errors', async () => {
      jest.spyOn(db, 'session').mockRejectedValue(new Error('Database timeout'));
      
      await expect(getSession('error-id'))
        .rejects
        .toThrow('Failed to retrieve session');
    });

    describe('validateSession()', () => {
      it('should detect expired sessions', () => {
        const expiredSession = {
          id: '2',
          userId: '456',
          expires: new Date(Date.now() - 1000).toISOString()
        };

        const validation = validateSession(expiredSession);
        expect(validation.valid).toBe(false);
        expect(validation.error).toBe('SESSION_EXPIRED');
      });

      it('should reject sessions missing required fields', () => {
        const invalidSession = {
          id: '3',
          expires: new Date().toISOString()
        };

        const validation = validateSession(invalidSession);
        expect(validation.valid).toBe(false);
        expect(validation.error).toBe('INVALID_SESSION');
      });

      it('should handle invalid session structure', () => {
        const malformedSession = {
          id: '4',
          userId: '789',
          expires: 'invalid-date'
        };

        const validation = validateSession(malformedSession);
        expect(validation.valid).toBe(false);
        expect(validation.error).toBe('INVALID_SESSION');
      });
    });

    describe('Error Handling', () => {
      it('should log errors during session retrieval', async () => {
        jest.spyOn(redis, 'get').mockRejectedValue(new Error('Redis connection failed'));
        
        await expect(getSession('error-id'))
          .rejects
          .toThrow('Failed to retrieve session');
        expect(console.error).toHaveBeenCalled();
      });
    });
  });

    it('should throw InvalidMFACodeError for invalid code', async () => {
      supabase.auth.mfa.verify.mockRejectedValueOnce(new Error('Invalid code'));
      await expect(verifyMFA('user123', 'invalid'))
        .rejects
        .toThrow(InvalidMFACodeError);
    });

describe('Session Management', () => {
  beforeEach(() => {
    redis.flushall();
    jest.clearAllMocks();
  });

  describe('getSession()', () => {
    it('should return cached session when available', async () => {
      const mockSession = { id: '1', userId: '123' };
      await redis.setex('session:test123', 300, JSON.stringify(mockSession));

      const result = await getSession('test123');
      expect(result).toEqual(mockSession);
      expect(redis.get).toHaveBeenCalledTimes(1);
    });

    it('should fetch from database when cache miss', async () => {
      const mockSession = { 
        id: '2', 
        userId: '456',
        expires: new Date(Date.now() + 3600000).toISOString()
      };
      
      jest.spyOn(redis, 'get').mockResolvedValue(null);
      jest.spyOn(redis, 'setex').mockImplementation(() => {});
      jest.spyOn(db, 'session').mockResolvedValue(mockSession);

      const result = await getSession('valid-id');
      expect(result).toEqual(mockSession);
      expect(redis.setex).toHaveBeenCalledWith(
        'session:valid-id',
        300,
        JSON.stringify(mockSession)
      );
    });

    it('should handle database query errors', async () => {
      jest.spyOn(db, 'session').mockRejectedValue(new Error('Database timeout'));
      
      await expect(getSession('error-id'))
        .rejects
        .toThrow('Failed to retrieve session');
    });

    describe('validateSession()', () => {
      it('should detect expired sessions', () => {
        const expiredSession = {
          id: '2',
          userId: '456',
          expires: new Date(Date.now() - 1000).toISOString()
        };

        const validation = validateSession(expiredSession);
        expect(validation.valid).toBe(false);
        expect(validation.error).toBe('SESSION_EXPIRED');
      });

      it('should reject sessions missing required fields', () => {
        const invalidSession = {
          id: '3',
          expires: new Date().toISOString()
        };

        const validation = validateSession(invalidSession);
        expect(validation.valid).toBe(false);
        expect(validation.error).toBe('INVALID_SESSION');
      });

      it('should handle invalid session structure', () => {
        const malformedSession = {
          id: '4',
          userId: '789',
          expires: 'invalid-date'
        };

        const validation = validateSession(malformedSession);
        expect(validation.valid).toBe(false);
        expect(validation.error).toBe('INVALID_SESSION');
      });
    });

    describe('Error Handling', () => {
      it('should log errors during session retrieval', async () => {
        jest.spyOn(redis, 'get').mockRejectedValue(new Error('Redis connection failed'));
        
        await expect(getSession('error-id'))
          .rejects
          .toThrow('Failed to retrieve session');
        expect(console.error).toHaveBeenCalled();
      });
    });
  });
  });

describe('Session Management', () => {
  beforeEach(() => {
    redis.flushall();
    jest.clearAllMocks();
  });

  describe('getSession()', () => {
    it('should return cached session when available', async () => {
      const mockSession = { id: '1', userId: '123' };
      await redis.setex('session:test123', 300, JSON.stringify(mockSession));

      const result = await getSession('test123');
      expect(result).toEqual(mockSession);
      expect(redis.get).toHaveBeenCalledTimes(1);
    });

    it('should fetch from database when cache miss', async () => {
      const mockSession = { 
        id: '2', 
        userId: '456',
        expires: new Date(Date.now() + 3600000).toISOString()
      };
      
      jest.spyOn(redis, 'get').mockResolvedValue(null);
      jest.spyOn(redis, 'setex').mockImplementation(() => {});
      jest.spyOn(db, 'session').mockResolvedValue(mockSession);

      const result = await getSession('valid-id');
      expect(result).toEqual(mockSession);
      expect(redis.setex).toHaveBeenCalledWith(
        'session:valid-id',
        300,
        JSON.stringify(mockSession)
      );
    });

    it('should handle database query errors', async () => {
      jest.spyOn(db, 'session').mockRejectedValue(new Error('Database timeout'));
      
      await expect(getSession('error-id'))
        .rejects
        .toThrow('Failed to retrieve session');
    });

    describe('validateSession()', () => {
      it('should detect expired sessions', () => {
        const expiredSession = {
          id: '2',
          userId: '456',
          expires: new Date(Date.now() - 1000).toISOString()
        };

        const validation = validateSession(expiredSession);
        expect(validation.valid).toBe(false);
        expect(validation.error).toBe('SESSION_EXPIRED');
      });

      it('should reject sessions missing required fields', () => {
        const invalidSession = {
          id: '3',
          expires: new Date().toISOString()
        };

        const validation = validateSession(invalidSession);
        expect(validation.valid).toBe(false);
        expect(validation.error).toBe('INVALID_SESSION');
      });

      it('should handle invalid session structure', () => {
        const malformedSession = {
          id: '4',
          userId: '789',
          expires: 'invalid-date'
        };

        const validation = validateSession(malformedSession);
        expect(validation.valid).toBe(false);
        expect(validation.error).toBe('INVALID_SESSION');
      });
    });

    describe('Error Handling', () => {
      it('should log errors during session retrieval', async () => {
        jest.spyOn(redis, 'get').mockRejectedValue(new Error('Redis connection failed'));
        
        await expect(getSession('error-id'))
          .rejects
          .toThrow('Failed to retrieve session');
        expect(console.error).toHaveBeenCalled();
      });
    });
  });

  describe('generateMFARecoveryCodes', () => {
    it('should generate recovery codes successfully', async () => {
      const mockCodes = ['code1', 'code2', 'code3'];
      supabase.auth.mfa.generateRecoveryCodes.mockResolvedValueOnce({ data: mockCodes, error: null });

describe('Session Management', () => {
  beforeEach(() => {
    redis.flushall();
    jest.clearAllMocks();
  });

  describe('getSession()', () => {
    it('should return cached session when available', async () => {
      const mockSession = { id: '1', userId: '123' };
      await redis.setex('session:test123', 300, JSON.stringify(mockSession));

      const result = await getSession('test123');
      expect(result).toEqual(mockSession);
      expect(redis.get).toHaveBeenCalledTimes(1);
    });

    it('should fetch from database when cache miss', async () => {
      const mockSession = { 
        id: '2', 
        userId: '456',
        expires: new Date(Date.now() + 3600000).toISOString()
      };
      
      jest.spyOn(redis, 'get').mockResolvedValue(null);
      jest.spyOn(redis, 'setex').mockImplementation(() => {});
      jest.spyOn(db, 'session').mockResolvedValue(mockSession);

      const result = await getSession('valid-id');
      expect(result).toEqual(mockSession);
      expect(redis.setex).toHaveBeenCalledWith(
        'session:valid-id',
        300,
        JSON.stringify(mockSession)
      );
    });

    it('should handle database query errors', async () => {
      jest.spyOn(db, 'session').mockRejectedValue(new Error('Database timeout'));
      
      await expect(getSession('error-id'))
        .rejects
        .toThrow('Failed to retrieve session');
    });

    describe('validateSession()', () => {
      it('should detect expired sessions', () => {
        const expiredSession = {
          id: '2',
          userId: '456',
          expires: new Date(Date.now() - 1000).toISOString()
        };

        const validation = validateSession(expiredSession);
        expect(validation.valid).toBe(false);
        expect(validation.error).toBe('SESSION_EXPIRED');
      });

      it('should reject sessions missing required fields', () => {
        const invalidSession = {
          id: '3',
          expires: new Date().toISOString()
        };

        const validation = validateSession(invalidSession);
        expect(validation.valid).toBe(false);
        expect(validation.error).toBe('INVALID_SESSION');
      });

      it('should handle invalid session structure', () => {
        const malformedSession = {
          id: '4',
          userId: '789',
          expires: 'invalid-date'
        };

        const validation = validateSession(malformedSession);
        expect(validation.valid).toBe(false);
        expect(validation.error).toBe('INVALID_SESSION');
      });
    });

    describe('Error Handling', () => {
      it('should log errors during session retrieval', async () => {
        jest.spyOn(redis, 'get').mockRejectedValue(new Error('Redis connection failed'));
        
        await expect(getSession('error-id'))
          .rejects
          .toThrow('Failed to retrieve session');
        expect(console.error).toHaveBeenCalled();
      });
    });
  });
      const codes = await generateMFARecoveryCodes('user123');
      expect(codes).toEqual(mockCodes);
    });

describe('Session Management', () => {
  beforeEach(() => {
    redis.flushall();
    jest.clearAllMocks();
  });

  describe('getSession()', () => {
    it('should return cached session when available', async () => {
      const mockSession = { id: '1', userId: '123' };
      await redis.setex('session:test123', 300, JSON.stringify(mockSession));

      const result = await getSession('test123');
      expect(result).toEqual(mockSession);
      expect(redis.get).toHaveBeenCalledTimes(1);
    });

    it('should fetch from database when cache miss', async () => {
      const mockSession = { 
        id: '2', 
        userId: '456',
        expires: new Date(Date.now() + 3600000).toISOString()
      };
      
      jest.spyOn(redis, 'get').mockResolvedValue(null);
      jest.spyOn(redis, 'setex').mockImplementation(() => {});
      jest.spyOn(db, 'session').mockResolvedValue(mockSession);

      const result = await getSession('valid-id');
      expect(result).toEqual(mockSession);
      expect(redis.setex).toHaveBeenCalledWith(
        'session:valid-id',
        300,
        JSON.stringify(mockSession)
      );
    });

    it('should handle database query errors', async () => {
      jest.spyOn(db, 'session').mockRejectedValue(new Error('Database timeout'));
      
      await expect(getSession('error-id'))
        .rejects
        .toThrow('Failed to retrieve session');
    });

    describe('validateSession()', () => {
      it('should detect expired sessions', () => {
        const expiredSession = {
          id: '2',
          userId: '456',
          expires: new Date(Date.now() - 1000).toISOString()
        };

        const validation = validateSession(expiredSession);
        expect(validation.valid).toBe(false);
        expect(validation.error).toBe('SESSION_EXPIRED');
      });

      it('should reject sessions missing required fields', () => {
        const invalidSession = {
          id: '3',
          expires: new Date().toISOString()
        };

        const validation = validateSession(invalidSession);
        expect(validation.valid).toBe(false);
        expect(validation.error).toBe('INVALID_SESSION');
      });

      it('should handle invalid session structure', () => {
        const malformedSession = {
          id: '4',
          userId: '789',
          expires: 'invalid-date'
        };

        const validation = validateSession(malformedSession);
        expect(validation.valid).toBe(false);
        expect(validation.error).toBe('INVALID_SESSION');
      });
    });

    describe('Error Handling', () => {
      it('should log errors during session retrieval', async () => {
        jest.spyOn(redis, 'get').mockRejectedValue(new Error('Redis connection failed'));
        
        await expect(getSession('error-id'))
          .rejects
          .toThrow('Failed to retrieve session');
        expect(console.error).toHaveBeenCalled();
      });
    });
  });

    it('should throw AuthenticationError for generation failure', async () => {
      supabase.auth.mfa.generateRecoveryCodes.mockRejectedValueOnce(new Error('Generation failed'));
      await expect(generateMFARecoveryCodes('user123'))
        .rejects
        .toThrow(AuthenticationError);
    });

describe('Session Management', () => {
  beforeEach(() => {
    redis.flushall();
    jest.clearAllMocks();
  });

  describe('getSession()', () => {
    it('should return cached session when available', async () => {
      const mockSession = { id: '1', userId: '123' };
      await redis.setex('session:test123', 300, JSON.stringify(mockSession));

      const result = await getSession('test123');
      expect(result).toEqual(mockSession);
      expect(redis.get).toHaveBeenCalledTimes(1);
    });

    it('should fetch from database when cache miss', async () => {
      const mockSession = { 
        id: '2', 
        userId: '456',
        expires: new Date(Date.now() + 3600000).toISOString()
      };
      
      jest.spyOn(redis, 'get').mockResolvedValue(null);
      jest.spyOn(redis, 'setex').mockImplementation(() => {});
      jest.spyOn(db, 'session').mockResolvedValue(mockSession);

      const result = await getSession('valid-id');
      expect(result).toEqual(mockSession);
      expect(redis.setex).toHaveBeenCalledWith(
        'session:valid-id',
        300,
        JSON.stringify(mockSession)
      );
    });

    it('should handle database query errors', async () => {
      jest.spyOn(db, 'session').mockRejectedValue(new Error('Database timeout'));
      
      await expect(getSession('error-id'))
        .rejects
        .toThrow('Failed to retrieve session');
    });

    describe('validateSession()', () => {
      it('should detect expired sessions', () => {
        const expiredSession = {
          id: '2',
          userId: '456',
          expires: new Date(Date.now() - 1000).toISOString()
        };

        const validation = validateSession(expiredSession);
        expect(validation.valid).toBe(false);
        expect(validation.error).toBe('SESSION_EXPIRED');
      });

      it('should reject sessions missing required fields', () => {
        const invalidSession = {
          id: '3',
          expires: new Date().toISOString()
        };

        const validation = validateSession(invalidSession);
        expect(validation.valid).toBe(false);
        expect(validation.error).toBe('INVALID_SESSION');
      });

      it('should handle invalid session structure', () => {
        const malformedSession = {
          id: '4',
          userId: '789',
          expires: 'invalid-date'
        };

        const validation = validateSession(malformedSession);
        expect(validation.valid).toBe(false);
        expect(validation.error).toBe('INVALID_SESSION');
      });
    });

    describe('Error Handling', () => {
      it('should log errors during session retrieval', async () => {
        jest.spyOn(redis, 'get').mockRejectedValue(new Error('Redis connection failed'));
        
        await expect(getSession('error-id'))
          .rejects
          .toThrow('Failed to retrieve session');
        expect(console.error).toHaveBeenCalled();
      });
    });
  });
  });

describe('Session Management', () => {
  beforeEach(() => {
    redis.flushall();
    jest.clearAllMocks();
  });

  describe('getSession()', () => {
    it('should return cached session when available', async () => {
      const mockSession = { id: '1', userId: '123' };
      await redis.setex('session:test123', 300, JSON.stringify(mockSession));

      const result = await getSession('test123');
      expect(result).toEqual(mockSession);
      expect(redis.get).toHaveBeenCalledTimes(1);
    });

    it('should fetch from database when cache miss', async () => {
      const mockSession = { 
        id: '2', 
        userId: '456',
        expires: new Date(Date.now() + 3600000).toISOString()
      };
      
      jest.spyOn(redis, 'get').mockResolvedValue(null);
      jest.spyOn(redis, 'setex').mockImplementation(() => {});
      jest.spyOn(db, 'session').mockResolvedValue(mockSession);

      const result = await getSession('valid-id');
      expect(result).toEqual(mockSession);
      expect(redis.setex).toHaveBeenCalledWith(
        'session:valid-id',
        300,
        JSON.stringify(mockSession)
      );
    });

    it('should handle database query errors', async () => {
      jest.spyOn(db, 'session').mockRejectedValue(new Error('Database timeout'));
      
      await expect(getSession('error-id'))
        .rejects
        .toThrow('Failed to retrieve session');
    });

    describe('validateSession()', () => {
      it('should detect expired sessions', () => {
        const expiredSession = {
          id: '2',
          userId: '456',
          expires: new Date(Date.now() - 1000).toISOString()
        };

        const validation = validateSession(expiredSession);
        expect(validation.valid).toBe(false);
        expect(validation.error).toBe('SESSION_EXPIRED');
      });

      it('should reject sessions missing required fields', () => {
        const invalidSession = {
          id: '3',
          expires: new Date().toISOString()
        };

        const validation = validateSession(invalidSession);
        expect(validation.valid).toBe(false);
        expect(validation.error).toBe('INVALID_SESSION');
      });

      it('should handle invalid session structure', () => {
        const malformedSession = {
          id: '4',
          userId: '789',
          expires: 'invalid-date'
        };

        const validation = validateSession(malformedSession);
        expect(validation.valid).toBe(false);
        expect(validation.error).toBe('INVALID_SESSION');
      });
    });

    describe('Error Handling', () => {
      it('should log errors during session retrieval', async () => {
        jest.spyOn(redis, 'get').mockRejectedValue(new Error('Redis connection failed'));
        
        await expect(getSession('error-id'))
          .rejects
          .toThrow('Failed to retrieve session');
        expect(console.error).toHaveBeenCalled();
      });
    });
  });

  describe('Sign in with MFA', () => {
    it('should require MFA code for enabled users', async () => {
      supabase.auth.signInWithPassword.mockResolvedValueOnce({ 
        data: { user: { ...mockUser, mfa_enabled: true } }, 
        error: null 
      });

describe('Session Management', () => {
  beforeEach(() => {
    redis.flushall();
    jest.clearAllMocks();
  });

  describe('getSession()', () => {
    it('should return cached session when available', async () => {
      const mockSession = { id: '1', userId: '123' };
      await redis.setex('session:test123', 300, JSON.stringify(mockSession));

      const result = await getSession('test123');
      expect(result).toEqual(mockSession);
      expect(redis.get).toHaveBeenCalledTimes(1);
    });

    it('should fetch from database when cache miss', async () => {
      const mockSession = { 
        id: '2', 
        userId: '456',
        expires: new Date(Date.now() + 3600000).toISOString()
      };
      
      jest.spyOn(redis, 'get').mockResolvedValue(null);
      jest.spyOn(redis, 'setex').mockImplementation(() => {});
      jest.spyOn(db, 'session').mockResolvedValue(mockSession);

      const result = await getSession('valid-id');
      expect(result).toEqual(mockSession);
      expect(redis.setex).toHaveBeenCalledWith(
        'session:valid-id',
        300,
        JSON.stringify(mockSession)
      );
    });

    it('should handle database query errors', async () => {
      jest.spyOn(db, 'session').mockRejectedValue(new Error('Database timeout'));
      
      await expect(getSession('error-id'))
        .rejects
        .toThrow('Failed to retrieve session');
    });

    describe('validateSession()', () => {
      it('should detect expired sessions', () => {
        const expiredSession = {
          id: '2',
          userId: '456',
          expires: new Date(Date.now() - 1000).toISOString()
        };

        const validation = validateSession(expiredSession);
        expect(validation.valid).toBe(false);
        expect(validation.error).toBe('SESSION_EXPIRED');
      });

      it('should reject sessions missing required fields', () => {
        const invalidSession = {
          id: '3',
          expires: new Date().toISOString()
        };

        const validation = validateSession(invalidSession);
        expect(validation.valid).toBe(false);
        expect(validation.error).toBe('INVALID_SESSION');
      });

      it('should handle invalid session structure', () => {
        const malformedSession = {
          id: '4',
          userId: '789',
          expires: 'invalid-date'
        };

        const validation = validateSession(malformedSession);
        expect(validation.valid).toBe(false);
        expect(validation.error).toBe('INVALID_SESSION');
      });
    });

    describe('Error Handling', () => {
      it('should log errors during session retrieval', async () => {
        jest.spyOn(redis, 'get').mockRejectedValue(new Error('Redis connection failed'));
        
        await expect(getSession('error-id'))
          .rejects
          .toThrow('Failed to retrieve session');
        expect(console.error).toHaveBeenCalled();
      });
    });
  });
      await expect(signIn('test@example.com', 'Password123!'))
        .rejects
        .toThrow(MFARequiredError);
    });

describe('Session Management', () => {
  beforeEach(() => {
    redis.flushall();
    jest.clearAllMocks();
  });

  describe('getSession()', () => {
    it('should return cached session when available', async () => {
      const mockSession = { id: '1', userId: '123' };
      await redis.setex('session:test123', 300, JSON.stringify(mockSession));

      const result = await getSession('test123');
      expect(result).toEqual(mockSession);
      expect(redis.get).toHaveBeenCalledTimes(1);
    });

    it('should fetch from database when cache miss', async () => {
      const mockSession = { 
        id: '2', 
        userId: '456',
        expires: new Date(Date.now() + 3600000).toISOString()
      };
      
      jest.spyOn(redis, 'get').mockResolvedValue(null);
      jest.spyOn(redis, 'setex').mockImplementation(() => {});
      jest.spyOn(db, 'session').mockResolvedValue(mockSession);

      const result = await getSession('valid-id');
      expect(result).toEqual(mockSession);
      expect(redis.setex).toHaveBeenCalledWith(
        'session:valid-id',
        300,
        JSON.stringify(mockSession)
      );
    });

    it('should handle database query errors', async () => {
      jest.spyOn(db, 'session').mockRejectedValue(new Error('Database timeout'));
      
      await expect(getSession('error-id'))
        .rejects
        .toThrow('Failed to retrieve session');
    });

    describe('validateSession()', () => {
      it('should detect expired sessions', () => {
        const expiredSession = {
          id: '2',
          userId: '456',
          expires: new Date(Date.now() - 1000).toISOString()
        };

        const validation = validateSession(expiredSession);
        expect(validation.valid).toBe(false);
        expect(validation.error).toBe('SESSION_EXPIRED');
      });

      it('should reject sessions missing required fields', () => {
        const invalidSession = {
          id: '3',
          expires: new Date().toISOString()
        };

        const validation = validateSession(invalidSession);
        expect(validation.valid).toBe(false);
        expect(validation.error).toBe('INVALID_SESSION');
      });

      it('should handle invalid session structure', () => {
        const malformedSession = {
          id: '4',
          userId: '789',
          expires: 'invalid-date'
        };

        const validation = validateSession(malformedSession);
        expect(validation.valid).toBe(false);
        expect(validation.error).toBe('INVALID_SESSION');
      });
    });

    describe('Error Handling', () => {
      it('should log errors during session retrieval', async () => {
        jest.spyOn(redis, 'get').mockRejectedValue(new Error('Redis connection failed'));
        
        await expect(getSession('error-id'))
          .rejects
          .toThrow('Failed to retrieve session');
        expect(console.error).toHaveBeenCalled();
      });
    });
  });

    it('should successfully sign in with valid MFA code', async () => {
      supabase.auth.signInWithPassword.mockResolvedValueOnce({ 
        data: { user: { ...mockUser, mfa_enabled: true } }, 
        error: null 
      });

describe('Session Management', () => {
  beforeEach(() => {
    redis.flushall();
    jest.clearAllMocks();
  });

  describe('getSession()', () => {
    it('should return cached session when available', async () => {
      const mockSession = { id: '1', userId: '123' };
      await redis.setex('session:test123', 300, JSON.stringify(mockSession));

      const result = await getSession('test123');
      expect(result).toEqual(mockSession);
      expect(redis.get).toHaveBeenCalledTimes(1);
    });

    it('should fetch from database when cache miss', async () => {
      const mockSession = { 
        id: '2', 
        userId: '456',
        expires: new Date(Date.now() + 3600000).toISOString()
      };
      
      jest.spyOn(redis, 'get').mockResolvedValue(null);
      jest.spyOn(redis, 'setex').mockImplementation(() => {});
      jest.spyOn(db, 'session').mockResolvedValue(mockSession);

      const result = await getSession('valid-id');
      expect(result).toEqual(mockSession);
      expect(redis.setex).toHaveBeenCalledWith(
        'session:valid-id',
        300,
        JSON.stringify(mockSession)
      );
    });

    it('should handle database query errors', async () => {
      jest.spyOn(db, 'session').mockRejectedValue(new Error('Database timeout'));
      
      await expect(getSession('error-id'))
        .rejects
        .toThrow('Failed to retrieve session');
    });

    describe('validateSession()', () => {
      it('should detect expired sessions', () => {
        const expiredSession = {
          id: '2',
          userId: '456',
          expires: new Date(Date.now() - 1000).toISOString()
        };

        const validation = validateSession(expiredSession);
        expect(validation.valid).toBe(false);
        expect(validation.error).toBe('SESSION_EXPIRED');
      });

      it('should reject sessions missing required fields', () => {
        const invalidSession = {
          id: '3',
          expires: new Date().toISOString()
        };

        const validation = validateSession(invalidSession);
        expect(validation.valid).toBe(false);
        expect(validation.error).toBe('INVALID_SESSION');
      });

      it('should handle invalid session structure', () => {
        const malformedSession = {
          id: '4',
          userId: '789',
          expires: 'invalid-date'
        };

        const validation = validateSession(malformedSession);
        expect(validation.valid).toBe(false);
        expect(validation.error).toBe('INVALID_SESSION');
      });
    });

    describe('Error Handling', () => {
      it('should log errors during session retrieval', async () => {
        jest.spyOn(redis, 'get').mockRejectedValue(new Error('Redis connection failed'));
        
        await expect(getSession('error-id'))
          .rejects
          .toThrow('Failed to retrieve session');
        expect(console.error).toHaveBeenCalled();
      });
    });
  });
      supabase.auth.mfa.verify.mockResolvedValueOnce({ data: { success: true }, error: null });

describe('Session Management', () => {
  beforeEach(() => {
    redis.flushall();
    jest.clearAllMocks();
  });

  describe('getSession()', () => {
    it('should return cached session when available', async () => {
      const mockSession = { id: '1', userId: '123' };
      await redis.setex('session:test123', 300, JSON.stringify(mockSession));

      const result = await getSession('test123');
      expect(result).toEqual(mockSession);
      expect(redis.get).toHaveBeenCalledTimes(1);
    });

    it('should fetch from database when cache miss', async () => {
      const mockSession = { 
        id: '2', 
        userId: '456',
        expires: new Date(Date.now() + 3600000).toISOString()
      };
      
      jest.spyOn(redis, 'get').mockResolvedValue(null);
      jest.spyOn(redis, 'setex').mockImplementation(() => {});
      jest.spyOn(db, 'session').mockResolvedValue(mockSession);

      const result = await getSession('valid-id');
      expect(result).toEqual(mockSession);
      expect(redis.setex).toHaveBeenCalledWith(
        'session:valid-id',
        300,
        JSON.stringify(mockSession)
      );
    });

    it('should handle database query errors', async () => {
      jest.spyOn(db, 'session').mockRejectedValue(new Error('Database timeout'));
      
      await expect(getSession('error-id'))
        .rejects
        .toThrow('Failed to retrieve session');
    });

    describe('validateSession()', () => {
      it('should detect expired sessions', () => {
        const expiredSession = {
          id: '2',
          userId: '456',
          expires: new Date(Date.now() - 1000).toISOString()
        };

        const validation = validateSession(expiredSession);
        expect(validation.valid).toBe(false);
        expect(validation.error).toBe('SESSION_EXPIRED');
      });

      it('should reject sessions missing required fields', () => {
        const invalidSession = {
          id: '3',
          expires: new Date().toISOString()
        };

        const validation = validateSession(invalidSession);
        expect(validation.valid).toBe(false);
        expect(validation.error).toBe('INVALID_SESSION');
      });

      it('should handle invalid session structure', () => {
        const malformedSession = {
          id: '4',
          userId: '789',
          expires: 'invalid-date'
        };

        const validation = validateSession(malformedSession);
        expect(validation.valid).toBe(false);
        expect(validation.error).toBe('INVALID_SESSION');
      });
    });

    describe('Error Handling', () => {
      it('should log errors during session retrieval', async () => {
        jest.spyOn(redis, 'get').mockRejectedValue(new Error('Redis connection failed'));
        
        await expect(getSession('error-id'))
          .rejects
          .toThrow('Failed to retrieve session');
        expect(console.error).toHaveBeenCalled();
      });
    });
  });
      const user = await signIn('test@example.com', 'Password123!', '123456');
      expect(user).toEqual({ ...mockUser, mfa_enabled: true });

describe('Session Management', () => {
  beforeEach(() => {
    redis.flushall();
    jest.clearAllMocks();
  });

  describe('getSession()', () => {
    it('should return cached session when available', async () => {
      const mockSession = { id: '1', userId: '123' };
      await redis.setex('session:test123', 300, JSON.stringify(mockSession));

      const result = await getSession('test123');
      expect(result).toEqual(mockSession);
      expect(redis.get).toHaveBeenCalledTimes(1);
    });

    it('should fetch from database when cache miss', async () => {
      const mockSession = { 
        id: '2', 
        userId: '456',
        expires: new Date(Date.now() + 3600000).toISOString()
      };
      
      jest.spyOn(redis, 'get').mockResolvedValue(null);
      jest.spyOn(redis, 'setex').mockImplementation(() => {});
      jest.spyOn(db, 'session').mockResolvedValue(mockSession);

      const result = await getSession('valid-id');
      expect(result).toEqual(mockSession);
      expect(redis.setex).toHaveBeenCalledWith(
        'session:valid-id',
        300,
        JSON.stringify(mockSession)
      );
    });

    it('should handle database query errors', async () => {
      jest.spyOn(db, 'session').mockRejectedValue(new Error('Database timeout'));
      
      await expect(getSession('error-id'))
        .rejects
        .toThrow('Failed to retrieve session');
    });

    describe('validateSession()', () => {
      it('should detect expired sessions', () => {
        const expiredSession = {
          id: '2',
          userId: '456',
          expires: new Date(Date.now() - 1000).toISOString()
        };

        const validation = validateSession(expiredSession);
        expect(validation.valid).toBe(false);
        expect(validation.error).toBe('SESSION_EXPIRED');
      });

      it('should reject sessions missing required fields', () => {
        const invalidSession = {
          id: '3',
          expires: new Date().toISOString()
        };

        const validation = validateSession(invalidSession);
        expect(validation.valid).toBe(false);
        expect(validation.error).toBe('INVALID_SESSION');
      });

      it('should handle invalid session structure', () => {
        const malformedSession = {
          id: '4',
          userId: '789',
          expires: 'invalid-date'
        };

        const validation = validateSession(malformedSession);
        expect(validation.valid).toBe(false);
        expect(validation.error).toBe('INVALID_SESSION');
      });
    });

    describe('Error Handling', () => {
      it('should log errors during session retrieval', async () => {
        jest.spyOn(redis, 'get').mockRejectedValue(new Error('Redis connection failed'));
        
        await expect(getSession('error-id'))
          .rejects
          .toThrow('Failed to retrieve session');
        expect(console.error).toHaveBeenCalled();
      });
    });
  });
    });

describe('Session Management', () => {
  beforeEach(() => {
    redis.flushall();
    jest.clearAllMocks();
  });

  describe('getSession()', () => {
    it('should return cached session when available', async () => {
      const mockSession = { id: '1', userId: '123' };
      await redis.setex('session:test123', 300, JSON.stringify(mockSession));

      const result = await getSession('test123');
      expect(result).toEqual(mockSession);
      expect(redis.get).toHaveBeenCalledTimes(1);
    });

    it('should fetch from database when cache miss', async () => {
      const mockSession = { 
        id: '2', 
        userId: '456',
        expires: new Date(Date.now() + 3600000).toISOString()
      };
      
      jest.spyOn(redis, 'get').mockResolvedValue(null);
      jest.spyOn(redis, 'setex').mockImplementation(() => {});
      jest.spyOn(db, 'session').mockResolvedValue(mockSession);

      const result = await getSession('valid-id');
      expect(result).toEqual(mockSession);
      expect(redis.setex).toHaveBeenCalledWith(
        'session:valid-id',
        300,
        JSON.stringify(mockSession)
      );
    });

    it('should handle database query errors', async () => {
      jest.spyOn(db, 'session').mockRejectedValue(new Error('Database timeout'));
      
      await expect(getSession('error-id'))
        .rejects
        .toThrow('Failed to retrieve session');
    });

    describe('validateSession()', () => {
      it('should detect expired sessions', () => {
        const expiredSession = {
          id: '2',
          userId: '456',
          expires: new Date(Date.now() - 1000).toISOString()
        };

        const validation = validateSession(expiredSession);
        expect(validation.valid).toBe(false);
        expect(validation.error).toBe('SESSION_EXPIRED');
      });

      it('should reject sessions missing required fields', () => {
        const invalidSession = {
          id: '3',
          expires: new Date().toISOString()
        };

        const validation = validateSession(invalidSession);
        expect(validation.valid).toBe(false);
        expect(validation.error).toBe('INVALID_SESSION');
      });

      it('should handle invalid session structure', () => {
        const malformedSession = {
          id: '4',
          userId: '789',
          expires: 'invalid-date'
        };

        const validation = validateSession(malformedSession);
        expect(validation.valid).toBe(false);
        expect(validation.error).toBe('INVALID_SESSION');
      });
    });

    describe('Error Handling', () => {
      it('should log errors during session retrieval', async () => {
        jest.spyOn(redis, 'get').mockRejectedValue(new Error('Redis connection failed'));
        
        await expect(getSession('error-id'))
          .rejects
          .toThrow('Failed to retrieve session');
        expect(console.error).toHaveBeenCalled();
      });
    });
  });
  });

describe('Session Management', () => {
  beforeEach(() => {
    redis.flushall();
    jest.clearAllMocks();
  });

  describe('getSession()', () => {
    it('should return cached session when available', async () => {
      const mockSession = { id: '1', userId: '123' };
      await redis.setex('session:test123', 300, JSON.stringify(mockSession));

      const result = await getSession('test123');
      expect(result).toEqual(mockSession);
      expect(redis.get).toHaveBeenCalledTimes(1);
    });

    it('should fetch from database when cache miss', async () => {
      const mockSession = { 
        id: '2', 
        userId: '456',
        expires: new Date(Date.now() + 3600000).toISOString()
      };
      
      jest.spyOn(redis, 'get').mockResolvedValue(null);
      jest.spyOn(redis, 'setex').mockImplementation(() => {});
      jest.spyOn(db, 'session').mockResolvedValue(mockSession);

      const result = await getSession('valid-id');
      expect(result).toEqual(mockSession);
      expect(redis.setex).toHaveBeenCalledWith(
        'session:valid-id',
        300,
        JSON.stringify(mockSession)
      );
    });

    it('should handle database query errors', async () => {
      jest.spyOn(db, 'session').mockRejectedValue(new Error('Database timeout'));
      
      await expect(getSession('error-id'))
        .rejects
        .toThrow('Failed to retrieve session');
    });

    describe('validateSession()', () => {
      it('should detect expired sessions', () => {
        const expiredSession = {
          id: '2',
          userId: '456',
          expires: new Date(Date.now() - 1000).toISOString()
        };

        const validation = validateSession(expiredSession);
        expect(validation.valid).toBe(false);
        expect(validation.error).toBe('SESSION_EXPIRED');
      });

      it('should reject sessions missing required fields', () => {
        const invalidSession = {
          id: '3',
          expires: new Date().toISOString()
        };

        const validation = validateSession(invalidSession);
        expect(validation.valid).toBe(false);
        expect(validation.error).toBe('INVALID_SESSION');
      });

      it('should handle invalid session structure', () => {
        const malformedSession = {
          id: '4',
          userId: '789',
          expires: 'invalid-date'
        };

        const validation = validateSession(malformedSession);
        expect(validation.valid).toBe(false);
        expect(validation.error).toBe('INVALID_SESSION');
      });
    });

    describe('Error Handling', () => {
      it('should log errors during session retrieval', async () => {
        jest.spyOn(redis, 'get').mockRejectedValue(new Error('Redis connection failed'));
        
        await expect(getSession('error-id'))
          .rejects
          .toThrow('Failed to retrieve session');
        expect(console.error).toHaveBeenCalled();
      });
    });
  });
});

describe('Session Management', () => {
  beforeEach(() => {
    redis.flushall();
    jest.clearAllMocks();
  });

  describe('getSession()', () => {
    it('should return cached session when available', async () => {
      const mockSession = { id: '1', userId: '123' };
      await redis.setex('session:test123', 300, JSON.stringify(mockSession));

      const result = await getSession('test123');
      expect(result).toEqual(mockSession);
      expect(redis.get).toHaveBeenCalledTimes(1);
    });

    it('should fetch from database when cache miss', async () => {
      const mockSession = { 
        id: '2', 
        userId: '456',
        expires: new Date(Date.now() + 3600000).toISOString()
      };
      
      jest.spyOn(redis, 'get').mockResolvedValue(null);
      jest.spyOn(redis, 'setex').mockImplementation(() => {});
      jest.spyOn(db, 'session').mockResolvedValue(mockSession);

      const result = await getSession('valid-id');
      expect(result).toEqual(mockSession);
      expect(redis.setex).toHaveBeenCalledWith(
        'session:valid-id',
        300,
        JSON.stringify(mockSession)
      );
    });

    it('should handle database query errors', async () => {
      jest.spyOn(db, 'session').mockRejectedValue(new Error('Database timeout'));
      
      await expect(getSession('error-id'))
        .rejects
        .toThrow('Failed to retrieve session');
    });

    describe('validateSession()', () => {
      it('should detect expired sessions', () => {
        const expiredSession = {
          id: '2',
          userId: '456',
          expires: new Date(Date.now() - 1000).toISOString()
        };

        const validation = validateSession(expiredSession);
        expect(validation.valid).toBe(false);
        expect(validation.error).toBe('SESSION_EXPIRED');
      });

      it('should reject sessions missing required fields', () => {
        const invalidSession = {
          id: '3',
          expires: new Date().toISOString()
        };

        const validation = validateSession(invalidSession);
        expect(validation.valid).toBe(false);
        expect(validation.error).toBe('INVALID_SESSION');
      });

      it('should handle invalid session structure', () => {
        const malformedSession = {
          id: '4',
          userId: '789',
          expires: 'invalid-date'
        };

        const validation = validateSession(malformedSession);
        expect(validation.valid).toBe(false);
        expect(validation.error).toBe('INVALID_SESSION');
      });
    });

    describe('Error Handling', () => {
      it('should log errors during session retrieval', async () => {
        jest.spyOn(redis, 'get').mockRejectedValue(new Error('Redis connection failed'));
        
        await expect(getSession('error-id'))
          .rejects
          .toThrow('Failed to retrieve session');
        expect(console.error).toHaveBeenCalled();
      });
    });
  });

describe('Rate Limiting', () => {
  let mockSuccessResponse;

  beforeEach(() => {
    mockSuccessResponse = { success: true };
  });

describe('Session Management', () => {
  beforeEach(() => {
    redis.flushall();
    jest.clearAllMocks();
  });

  describe('getSession()', () => {
    it('should return cached session when available', async () => {
      const mockSession = { id: '1', userId: '123' };
      await redis.setex('session:test123', 300, JSON.stringify(mockSession));

      const result = await getSession('test123');
      expect(result).toEqual(mockSession);
      expect(redis.get).toHaveBeenCalledTimes(1);
    });

    it('should fetch from database when cache miss', async () => {
      const mockSession = { 
        id: '2', 
        userId: '456',
        expires: new Date(Date.now() + 3600000).toISOString()
      };
      
      jest.spyOn(redis, 'get').mockResolvedValue(null);
      jest.spyOn(redis, 'setex').mockImplementation(() => {});
      jest.spyOn(db, 'session').mockResolvedValue(mockSession);

      const result = await getSession('valid-id');
      expect(result).toEqual(mockSession);
      expect(redis.setex).toHaveBeenCalledWith(
        'session:valid-id',
        300,
        JSON.stringify(mockSession)
      );
    });

    it('should handle database query errors', async () => {
      jest.spyOn(db, 'session').mockRejectedValue(new Error('Database timeout'));
      
      await expect(getSession('error-id'))
        .rejects
        .toThrow('Failed to retrieve session');
    });

    describe('validateSession()', () => {
      it('should detect expired sessions', () => {
        const expiredSession = {
          id: '2',
          userId: '456',
          expires: new Date(Date.now() - 1000).toISOString()
        };

        const validation = validateSession(expiredSession);
        expect(validation.valid).toBe(false);
        expect(validation.error).toBe('SESSION_EXPIRED');
      });

      it('should reject sessions missing required fields', () => {
        const invalidSession = {
          id: '3',
          expires: new Date().toISOString()
        };

        const validation = validateSession(invalidSession);
        expect(validation.valid).toBe(false);
        expect(validation.error).toBe('INVALID_SESSION');
      });

      it('should handle invalid session structure', () => {
        const malformedSession = {
          id: '4',
          userId: '789',
          expires: 'invalid-date'
        };

        const validation = validateSession(malformedSession);
        expect(validation.valid).toBe(false);
        expect(validation.error).toBe('INVALID_SESSION');
      });
    });

    describe('Error Handling', () => {
      it('should log errors during session retrieval', async () => {
        jest.spyOn(redis, 'get').mockRejectedValue(new Error('Redis connection failed'));
        
        await expect(getSession('error-id'))
          .rejects
          .toThrow('Failed to retrieve session');
        expect(console.error).toHaveBeenCalled();
      });
    });
  });

  it('should allow requests within rate limit', async () => {
    supabase.auth.signInWithPassword.mockResolvedValue({ 
      data: { user: mockUser }, 
      error: null 
    });

describe('Session Management', () => {
  beforeEach(() => {
    redis.flushall();
    jest.clearAllMocks();
  });

  describe('getSession()', () => {
    it('should return cached session when available', async () => {
      const mockSession = { id: '1', userId: '123' };
      await redis.setex('session:test123', 300, JSON.stringify(mockSession));

      const result = await getSession('test123');
      expect(result).toEqual(mockSession);
      expect(redis.get).toHaveBeenCalledTimes(1);
    });

    it('should fetch from database when cache miss', async () => {
      const mockSession = { 
        id: '2', 
        userId: '456',
        expires: new Date(Date.now() + 3600000).toISOString()
      };
      
      jest.spyOn(redis, 'get').mockResolvedValue(null);
      jest.spyOn(redis, 'setex').mockImplementation(() => {});
      jest.spyOn(db, 'session').mockResolvedValue(mockSession);

      const result = await getSession('valid-id');
      expect(result).toEqual(mockSession);
      expect(redis.setex).toHaveBeenCalledWith(
        'session:valid-id',
        300,
        JSON.stringify(mockSession)
      );
    });

    it('should handle database query errors', async () => {
      jest.spyOn(db, 'session').mockRejectedValue(new Error('Database timeout'));
      
      await expect(getSession('error-id'))
        .rejects
        .toThrow('Failed to retrieve session');
    });

    describe('validateSession()', () => {
      it('should detect expired sessions', () => {
        const expiredSession = {
          id: '2',
          userId: '456',
          expires: new Date(Date.now() - 1000).toISOString()
        };

        const validation = validateSession(expiredSession);
        expect(validation.valid).toBe(false);
        expect(validation.error).toBe('SESSION_EXPIRED');
      });

      it('should reject sessions missing required fields', () => {
        const invalidSession = {
          id: '3',
          expires: new Date().toISOString()
        };

        const validation = validateSession(invalidSession);
        expect(validation.valid).toBe(false);
        expect(validation.error).toBe('INVALID_SESSION');
      });

      it('should handle invalid session structure', () => {
        const malformedSession = {
          id: '4',
          userId: '789',
          expires: 'invalid-date'
        };

        const validation = validateSession(malformedSession);
        expect(validation.valid).toBe(false);
        expect(validation.error).toBe('INVALID_SESSION');
      });
    });

    describe('Error Handling', () => {
      it('should log errors during session retrieval', async () => {
        jest.spyOn(redis, 'get').mockRejectedValue(new Error('Redis connection failed'));
        
        await expect(getSession('error-id'))
          .rejects
          .toThrow('Failed to retrieve session');
        expect(console.error).toHaveBeenCalled();
      });
    });
  });

    // Test multiple requests within limit
    for (let i = 0; i < 5; i++) {
      await expect(signIn('test@example.com', 'Password123!'))
        .resolves
        .toBeDefined();
    }
  });

describe('Session Management', () => {
  beforeEach(() => {
    redis.flushall();
    jest.clearAllMocks();
  });

  describe('getSession()', () => {
    it('should return cached session when available', async () => {
      const mockSession = { id: '1', userId: '123' };
      await redis.setex('session:test123', 300, JSON.stringify(mockSession));

      const result = await getSession('test123');
      expect(result).toEqual(mockSession);
      expect(redis.get).toHaveBeenCalledTimes(1);
    });

    it('should fetch from database when cache miss', async () => {
      const mockSession = { 
        id: '2', 
        userId: '456',
        expires: new Date(Date.now() + 3600000).toISOString()
      };
      
      jest.spyOn(redis, 'get').mockResolvedValue(null);
      jest.spyOn(redis, 'setex').mockImplementation(() => {});
      jest.spyOn(db, 'session').mockResolvedValue(mockSession);

      const result = await getSession('valid-id');
      expect(result).toEqual(mockSession);
      expect(redis.setex).toHaveBeenCalledWith(
        'session:valid-id',
        300,
        JSON.stringify(mockSession)
      );
    });

    it('should handle database query errors', async () => {
      jest.spyOn(db, 'session').mockRejectedValue(new Error('Database timeout'));
      
      await expect(getSession('error-id'))
        .rejects
        .toThrow('Failed to retrieve session');
    });

    describe('validateSession()', () => {
      it('should detect expired sessions', () => {
        const expiredSession = {
          id: '2',
          userId: '456',
          expires: new Date(Date.now() - 1000).toISOString()
        };

        const validation = validateSession(expiredSession);
        expect(validation.valid).toBe(false);
        expect(validation.error).toBe('SESSION_EXPIRED');
      });

      it('should reject sessions missing required fields', () => {
        const invalidSession = {
          id: '3',
          expires: new Date().toISOString()
        };

        const validation = validateSession(invalidSession);
        expect(validation.valid).toBe(false);
        expect(validation.error).toBe('INVALID_SESSION');
      });

      it('should handle invalid session structure', () => {
        const malformedSession = {
          id: '4',
          userId: '789',
          expires: 'invalid-date'
        };

        const validation = validateSession(malformedSession);
        expect(validation.valid).toBe(false);
        expect(validation.error).toBe('INVALID_SESSION');
      });
    });

    describe('Error Handling', () => {
      it('should log errors during session retrieval', async () => {
        jest.spyOn(redis, 'get').mockRejectedValue(new Error('Redis connection failed'));
        
        await expect(getSession('error-id'))
          .rejects
          .toThrow('Failed to retrieve session');
        expect(console.error).toHaveBeenCalled();
      });
    });
  });

  it('should throw AuthenticationError when rate limit is exceeded', async () => {
    // Exceed rate limit
    for (let i = 0; i < 6; i++) {
      if (i < 5) {
        await signIn('test@example.com', 'Password123!');
      } else {
        await expect(signIn('test@example.com', 'Password123!'))
          .rejects
          .toThrow(AuthenticationError);
      }
    }
  });

describe('Session Management', () => {
  beforeEach(() => {
    redis.flushall();
    jest.clearAllMocks();
  });

  describe('getSession()', () => {
    it('should return cached session when available', async () => {
      const mockSession = { id: '1', userId: '123' };
      await redis.setex('session:test123', 300, JSON.stringify(mockSession));

      const result = await getSession('test123');
      expect(result).toEqual(mockSession);
      expect(redis.get).toHaveBeenCalledTimes(1);
    });

    it('should fetch from database when cache miss', async () => {
      const mockSession = { 
        id: '2', 
        userId: '456',
        expires: new Date(Date.now() + 3600000).toISOString()
      };
      
      jest.spyOn(redis, 'get').mockResolvedValue(null);
      jest.spyOn(redis, 'setex').mockImplementation(() => {});
      jest.spyOn(db, 'session').mockResolvedValue(mockSession);

      const result = await getSession('valid-id');
      expect(result).toEqual(mockSession);
      expect(redis.setex).toHaveBeenCalledWith(
        'session:valid-id',
        300,
        JSON.stringify(mockSession)
      );
    });

    it('should handle database query errors', async () => {
      jest.spyOn(db, 'session').mockRejectedValue(new Error('Database timeout'));
      
      await expect(getSession('error-id'))
        .rejects
        .toThrow('Failed to retrieve session');
    });

    describe('validateSession()', () => {
      it('should detect expired sessions', () => {
        const expiredSession = {
          id: '2',
          userId: '456',
          expires: new Date(Date.now() - 1000).toISOString()
        };

        const validation = validateSession(expiredSession);
        expect(validation.valid).toBe(false);
        expect(validation.error).toBe('SESSION_EXPIRED');
      });

      it('should reject sessions missing required fields', () => {
        const invalidSession = {
          id: '3',
          expires: new Date().toISOString()
        };

        const validation = validateSession(invalidSession);
        expect(validation.valid).toBe(false);
        expect(validation.error).toBe('INVALID_SESSION');
      });

      it('should handle invalid session structure', () => {
        const malformedSession = {
          id: '4',
          userId: '789',
          expires: 'invalid-date'
        };

        const validation = validateSession(malformedSession);
        expect(validation.valid).toBe(false);
        expect(validation.error).toBe('INVALID_SESSION');
      });
    });

    describe('Error Handling', () => {
      it('should log errors during session retrieval', async () => {
        jest.spyOn(redis, 'get').mockRejectedValue(new Error('Redis connection failed'));
        
        await expect(getSession('error-id'))
          .rejects
          .toThrow('Failed to retrieve session');
        expect(console.error).toHaveBeenCalled();
      });
    });
  });
});

describe('Session Management', () => {
  beforeEach(() => {
    redis.flushall();
    jest.clearAllMocks();
  });

  describe('getSession()', () => {
    it('should return cached session when available', async () => {
      const mockSession = { id: '1', userId: '123' };
      await redis.setex('session:test123', 300, JSON.stringify(mockSession));

      const result = await getSession('test123');
      expect(result).toEqual(mockSession);
      expect(redis.get).toHaveBeenCalledTimes(1);
    });

    it('should fetch from database when cache miss', async () => {
      const mockSession = { 
        id: '2', 
        userId: '456',
        expires: new Date(Date.now() + 3600000).toISOString()
      };
      
      jest.spyOn(redis, 'get').mockResolvedValue(null);
      jest.spyOn(redis, 'setex').mockImplementation(() => {});
      jest.spyOn(db, 'session').mockResolvedValue(mockSession);

      const result = await getSession('valid-id');
      expect(result).toEqual(mockSession);
      expect(redis.setex).toHaveBeenCalledWith(
        'session:valid-id',
        300,
        JSON.stringify(mockSession)
      );
    });

    it('should handle database query errors', async () => {
      jest.spyOn(db, 'session').mockRejectedValue(new Error('Database timeout'));
      
      await expect(getSession('error-id'))
        .rejects
        .toThrow('Failed to retrieve session');
    });

    describe('validateSession()', () => {
      it('should detect expired sessions', () => {
        const expiredSession = {
          id: '2',
          userId: '456',
          expires: new Date(Date.now() - 1000).toISOString()
        };

        const validation = validateSession(expiredSession);
        expect(validation.valid).toBe(false);
        expect(validation.error).toBe('SESSION_EXPIRED');
      });

      it('should reject sessions missing required fields', () => {
        const invalidSession = {
          id: '3',
          expires: new Date().toISOString()
        };

        const validation = validateSession(invalidSession);
        expect(validation.valid).toBe(false);
        expect(validation.error).toBe('INVALID_SESSION');
      });

      it('should handle invalid session structure', () => {
        const malformedSession = {
          id: '4',
          userId: '789',
          expires: 'invalid-date'
        };

        const validation = validateSession(malformedSession);
        expect(validation.valid).toBe(false);
        expect(validation.error).toBe('INVALID_SESSION');
      });
    });

    describe('Error Handling', () => {
      it('should log errors during session retrieval', async () => {
        jest.spyOn(redis, 'get').mockRejectedValue(new Error('Redis connection failed'));
        
        await expect(getSession('error-id'))
          .rejects
          .toThrow('Failed to retrieve session');
        expect(console.error).toHaveBeenCalled();
      });
    });
  });

describe('Edge Cases', () => {
  it('should handle network errors during email validation', async () => {
    jest.spyOn(global, 'fetch').mockRejectedValueOnce(new Error('Network error'));
    await expect(signUp('test@example.com', 'ValidPassword123!'))
      .resolves
      .toBeDefined();
  });

describe('Session Management', () => {
  beforeEach(() => {
    redis.flushall();
    jest.clearAllMocks();
  });

  describe('getSession()', () => {
    it('should return cached session when available', async () => {
      const mockSession = { id: '1', userId: '123' };
      await redis.setex('session:test123', 300, JSON.stringify(mockSession));

      const result = await getSession('test123');
      expect(result).toEqual(mockSession);
      expect(redis.get).toHaveBeenCalledTimes(1);
    });

    it('should fetch from database when cache miss', async () => {
      const mockSession = { 
        id: '2', 
        userId: '456',
        expires: new Date(Date.now() + 3600000).toISOString()
      };
      
      jest.spyOn(redis, 'get').mockResolvedValue(null);
      jest.spyOn(redis, 'setex').mockImplementation(() => {});
      jest.spyOn(db, 'session').mockResolvedValue(mockSession);

      const result = await getSession('valid-id');
      expect(result).toEqual(mockSession);
      expect(redis.setex).toHaveBeenCalledWith(
        'session:valid-id',
        300,
        JSON.stringify(mockSession)
      );
    });

    it('should handle database query errors', async () => {
      jest.spyOn(db, 'session').mockRejectedValue(new Error('Database timeout'));
      
      await expect(getSession('error-id'))
        .rejects
        .toThrow('Failed to retrieve session');
    });

    describe('validateSession()', () => {
      it('should detect expired sessions', () => {
        const expiredSession = {
          id: '2',
          userId: '456',
          expires: new Date(Date.now() - 1000).toISOString()
        };

        const validation = validateSession(expiredSession);
        expect(validation.valid).toBe(false);
        expect(validation.error).toBe('SESSION_EXPIRED');
      });

      it('should reject sessions missing required fields', () => {
        const invalidSession = {
          id: '3',
          expires: new Date().toISOString()
        };

        const validation = validateSession(invalidSession);
        expect(validation.valid).toBe(false);
        expect(validation.error).toBe('INVALID_SESSION');
      });

      it('should handle invalid session structure', () => {
        const malformedSession = {
          id: '4',
          userId: '789',
          expires: 'invalid-date'
        };

        const validation = validateSession(malformedSession);
        expect(validation.valid).toBe(false);
        expect(validation.error).toBe('INVALID_SESSION');
      });
    });

    describe('Error Handling', () => {
      it('should log errors during session retrieval', async () => {
        jest.spyOn(redis, 'get').mockRejectedValue(new Error('Redis connection failed'));
        
        await expect(getSession('error-id'))
          .rejects
          .toThrow('Failed to retrieve session');
        expect(console.error).toHaveBeenCalled();
      });
    });
  });

  it('should handle invalid MFA code format', async () => {
    await expect(verifyMFA('user123', 'invalid-code'))
      .rejects
      .toThrow(InvalidMFACodeError);
  });

describe('Session Management', () => {
  beforeEach(() => {
    redis.flushall();
    jest.clearAllMocks();
  });

  describe('getSession()', () => {
    it('should return cached session when available', async () => {
      const mockSession = { id: '1', userId: '123' };
      await redis.setex('session:test123', 300, JSON.stringify(mockSession));

      const result = await getSession('test123');
      expect(result).toEqual(mockSession);
      expect(redis.get).toHaveBeenCalledTimes(1);
    });

    it('should fetch from database when cache miss', async () => {
      const mockSession = { 
        id: '2', 
        userId: '456',
        expires: new Date(Date.now() + 3600000).toISOString()
      };
      
      jest.spyOn(redis, 'get').mockResolvedValue(null);
      jest.spyOn(redis, 'setex').mockImplementation(() => {});
      jest.spyOn(db, 'session').mockResolvedValue(mockSession);

      const result = await getSession('valid-id');
      expect(result).toEqual(mockSession);
      expect(redis.setex).toHaveBeenCalledWith(
        'session:valid-id',
        300,
        JSON.stringify(mockSession)
      );
    });

    it('should handle database query errors', async () => {
      jest.spyOn(db, 'session').mockRejectedValue(new Error('Database timeout'));
      
      await expect(getSession('error-id'))
        .rejects
        .toThrow('Failed to retrieve session');
    });

    describe('validateSession()', () => {
      it('should detect expired sessions', () => {
        const expiredSession = {
          id: '2',
          userId: '456',
          expires: new Date(Date.now() - 1000).toISOString()
        };

        const validation = validateSession(expiredSession);
        expect(validation.valid).toBe(false);
        expect(validation.error).toBe('SESSION_EXPIRED');
      });

      it('should reject sessions missing required fields', () => {
        const invalidSession = {
          id: '3',
          expires: new Date().toISOString()
        };

        const validation = validateSession(invalidSession);
        expect(validation.valid).toBe(false);
        expect(validation.error).toBe('INVALID_SESSION');
      });

      it('should handle invalid session structure', () => {
        const malformedSession = {
          id: '4',
          userId: '789',
          expires: 'invalid-date'
        };

        const validation = validateSession(malformedSession);
        expect(validation.valid).toBe(false);
        expect(validation.error).toBe('INVALID_SESSION');
      });
    });

    describe('Error Handling', () => {
      it('should log errors during session retrieval', async () => {
        jest.spyOn(redis, 'get').mockRejectedValue(new Error('Redis connection failed'));
        
        await expect(getSession('error-id'))
          .rejects
          .toThrow('Failed to retrieve session');
        expect(console.error).toHaveBeenCalled();
      });
    });
  });

  it('should handle expired password reset tokens', async () => {
    supabase.auth.updateUser.mockRejectedValueOnce(new Error('Token expired'));
    await expect(resetPassword('expired-token', 'NewPassword123!'))
      .rejects
      .toThrow(InvalidResetTokenError);
  });

describe('Session Management', () => {
  beforeEach(() => {
    redis.flushall();
    jest.clearAllMocks();
  });

  describe('getSession()', () => {
    it('should return cached session when available', async () => {
      const mockSession = { id: '1', userId: '123' };
      await redis.setex('session:test123', 300, JSON.stringify(mockSession));

      const result = await getSession('test123');
      expect(result).toEqual(mockSession);
      expect(redis.get).toHaveBeenCalledTimes(1);
    });

    it('should fetch from database when cache miss', async () => {
      const mockSession = { 
        id: '2', 
        userId: '456',
        expires: new Date(Date.now() + 3600000).toISOString()
      };
      
      jest.spyOn(redis, 'get').mockResolvedValue(null);
      jest.spyOn(redis, 'setex').mockImplementation(() => {});
      jest.spyOn(db, 'session').mockResolvedValue(mockSession);

      const result = await getSession('valid-id');
      expect(result).toEqual(mockSession);
      expect(redis.setex).toHaveBeenCalledWith(
        'session:valid-id',
        300,
        JSON.stringify(mockSession)
      );
    });

    it('should handle database query errors', async () => {
      jest.spyOn(db, 'session').mockRejectedValue(new Error('Database timeout'));
      
      await expect(getSession('error-id'))
        .rejects
        .toThrow('Failed to retrieve session');
    });

    describe('validateSession()', () => {
      it('should detect expired sessions', () => {
        const expiredSession = {
          id: '2',
          userId: '456',
          expires: new Date(Date.now() - 1000).toISOString()
        };

        const validation = validateSession(expiredSession);
        expect(validation.valid).toBe(false);
        expect(validation.error).toBe('SESSION_EXPIRED');
      });

      it('should reject sessions missing required fields', () => {
        const invalidSession = {
          id: '3',
          expires: new Date().toISOString()
        };

        const validation = validateSession(invalidSession);
        expect(validation.valid).toBe(false);
        expect(validation.error).toBe('INVALID_SESSION');
      });

      it('should handle invalid session structure', () => {
        const malformedSession = {
          id: '4',
          userId: '789',
          expires: 'invalid-date'
        };

        const validation = validateSession(malformedSession);
        expect(validation.valid).toBe(false);
        expect(validation.error).toBe('INVALID_SESSION');
      });
    });

    describe('Error Handling', () => {
      it('should log errors during session retrieval', async () => {
        jest.spyOn(redis, 'get').mockRejectedValue(new Error('Redis connection failed'));
        
        await expect(getSession('error-id'))
          .rejects
          .toThrow('Failed to retrieve session');
        expect(console.error).toHaveBeenCalled();
      });
    });
  });
});

describe('Session Management', () => {
  beforeEach(() => {
    redis.flushall();
    jest.clearAllMocks();
  });

  describe('getSession()', () => {
    it('should return cached session when available', async () => {
      const mockSession = { id: '1', userId: '123' };
      await redis.setex('session:test123', 300, JSON.stringify(mockSession));

      const result = await getSession('test123');
      expect(result).toEqual(mockSession);
      expect(redis.get).toHaveBeenCalledTimes(1);
    });

    it('should fetch from database when cache miss', async () => {
      const mockSession = { 
        id: '2', 
        userId: '456',
        expires: new Date(Date.now() + 3600000).toISOString()
      };
      
      jest.spyOn(redis, 'get').mockResolvedValue(null);
      jest.spyOn(redis, 'setex').mockImplementation(() => {});
      jest.spyOn(db, 'session').mockResolvedValue(mockSession);

      const result = await getSession('valid-id');
      expect(result).toEqual(mockSession);
      expect(redis.setex).toHaveBeenCalledWith(
        'session:valid-id',
        300,
        JSON.stringify(mockSession)
      );
    });

    it('should handle database query errors', async () => {
      jest.spyOn(db, 'session').mockRejectedValue(new Error('Database timeout'));
      
      await expect(getSession('error-id'))
        .rejects
        .toThrow('Failed to retrieve session');
    });

    describe('validateSession()', () => {
      it('should detect expired sessions', () => {
        const expiredSession = {
          id: '2',
          userId: '456',
          expires: new Date(Date.now() - 1000).toISOString()
        };

        const validation = validateSession(expiredSession);
        expect(validation.valid).toBe(false);
        expect(validation.error).toBe('SESSION_EXPIRED');
      });

      it('should reject sessions missing required fields', () => {
        const invalidSession = {
          id: '3',
          expires: new Date().toISOString()
        };

        const validation = validateSession(invalidSession);
        expect(validation.valid).toBe(false);
        expect(validation.error).toBe('INVALID_SESSION');
      });

      it('should handle invalid session structure', () => {
        const malformedSession = {
          id: '4',
          userId: '789',
          expires: 'invalid-date'
        };

        const validation = validateSession(malformedSession);
        expect(validation.valid).toBe(false);
        expect(validation.error).toBe('INVALID_SESSION');
      });
    });

    describe('Error Handling', () => {
      it('should log errors during session retrieval', async () => {
        jest.spyOn(redis, 'get').mockRejectedValue(new Error('Redis connection failed'));
        
        await expect(getSession('error-id'))
          .rejects
          .toThrow('Failed to retrieve session');
        expect(console.error).toHaveBeenCalled();
      });
    });
  });
