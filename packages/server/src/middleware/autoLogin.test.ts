import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import type { Request, Response, NextFunction } from 'express';

// Create mock functions using vi.hoisted - these return the actual mock functions
const mockFindUnique = vi.hoisted(() => vi.fn());
const mockFindFirst = vi.hoisted(() => vi.fn());

// Mock @carton/shared prisma export
vi.mock('@carton/shared', () => ({
  prisma: {
    user: {
      findUnique: mockFindUnique,
      findFirst: mockFindFirst,
    },
    $disconnect: vi.fn(),
  },
}));

// Mock the constants file
vi.mock('../../db/constants.js', () => ({
  FIRST_USER_EMAIL: 'alex.morgan@carton.com',
}));

import { autoLoginMiddleware } from './autoLogin.js';

// Define constant for tests
const FIRST_USER_EMAIL = 'alex.morgan@carton.com';

describe('autoLoginMiddleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;
  let mockCookie: ReturnType<typeof vi.fn>;
  let consoleLogSpy: ReturnType<typeof vi.spyOn>;
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    mockCookie = vi.fn();
    mockRequest = {
      cookies: {},
    };
    mockResponse = {
      cookie: mockCookie,
    };
    mockNext = vi.fn();
    consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    // Reset mock implementations and calls
    mockFindUnique.mockReset();
    mockFindFirst.mockReset();

    // Reset environment variables
    delete process.env.MOCK_USER_EMAIL;
  });

  afterEach(() => {
    vi.clearAllMocks();
    consoleLogSpy.mockRestore();
    consoleErrorSpy.mockRestore();
  });

  it('should set cookie when no userId cookie exists', async () => {
    const mockUser = {
      id: 'user-123',
      name: 'Alex Morgan',
      email: FIRST_USER_EMAIL,
    };

    mockFindFirst.mockResolvedValue(mockUser);

    await autoLoginMiddleware(mockRequest as Request, mockResponse as Response, mockNext);

    expect(mockFindFirst).toHaveBeenCalledWith({
      where: { email: FIRST_USER_EMAIL },
    });
    expect(mockCookie).toHaveBeenCalledWith('userId', 'user-123', {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    expect(consoleLogSpy).toHaveBeenCalledWith(
      `Auto-logged in as: ${mockUser.name} (${mockUser.email})`
    );
    expect(mockNext).toHaveBeenCalled();
  });

  it('should also set req.cookies.userId so context can access it immediately', async () => {
    const mockUser = {
      id: 'user-123',
      name: 'Alex Morgan',
      email: FIRST_USER_EMAIL,
    };

    mockFindFirst.mockResolvedValue(mockUser);

    await autoLoginMiddleware(mockRequest as Request, mockResponse as Response, mockNext);

    // Verify the userId is set on req.cookies for immediate access by context
    expect(mockRequest.cookies?.userId).toBe('user-123');
  });

  it('should use MOCK_USER_EMAIL from env variable if set', async () => {
    const customEmail = 'custom.user@carton.com';
    process.env.MOCK_USER_EMAIL = customEmail;

    const mockUser = {
      id: 'user-456',
      name: 'Custom User',
      email: customEmail,
    };

    mockFindFirst.mockResolvedValue(mockUser);

    await autoLoginMiddleware(mockRequest as Request, mockResponse as Response, mockNext);

    expect(mockFindFirst).toHaveBeenCalledWith({
      where: { email: customEmail },
    });
    expect(mockCookie).toHaveBeenCalledWith('userId', 'user-456', {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    expect(mockNext).toHaveBeenCalled();
  });

  it('should not set new cookie when valid userId cookie exists with matching email', async () => {
    mockRequest.cookies = { userId: 'existing-user-id' };

    const mockUser = {
      id: 'existing-user-id',
      name: 'Alex Morgan',
      email: FIRST_USER_EMAIL,
    };

    mockFindUnique.mockResolvedValue(mockUser);

    await autoLoginMiddleware(mockRequest as Request, mockResponse as Response, mockNext);

    expect(mockFindUnique).toHaveBeenCalledWith({
      where: { id: 'existing-user-id' },
    });
    expect(mockFindFirst).not.toHaveBeenCalled();
    expect(mockCookie).not.toHaveBeenCalled();
    expect(mockNext).toHaveBeenCalled();
  });

  it('should reset cookie when existing user email does not match env variable', async () => {
    mockRequest.cookies = { userId: 'existing-user-id' };

    const existingUser = {
      id: 'existing-user-id',
      name: 'Old User',
      email: 'old.user@carton.com',
    };

    const newUser = {
      id: 'new-user-id',
      name: 'Alex Morgan',
      email: FIRST_USER_EMAIL,
    };

    mockFindUnique.mockResolvedValue(existingUser);
    mockFindFirst.mockResolvedValue(newUser);

    await autoLoginMiddleware(mockRequest as Request, mockResponse as Response, mockNext);

    expect(mockFindUnique).toHaveBeenCalledWith({
      where: { id: 'existing-user-id' },
    });
    expect(mockFindFirst).toHaveBeenCalledWith({
      where: { email: FIRST_USER_EMAIL },
    });
    expect(mockCookie).toHaveBeenCalledWith('userId', 'new-user-id', {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    expect(mockNext).toHaveBeenCalled();
  });

  it('should reset cookie when user with cookie id does not exist', async () => {
    mockRequest.cookies = { userId: 'nonexistent-user-id' };

    const newUser = {
      id: 'new-user-id',
      name: 'Alex Morgan',
      email: FIRST_USER_EMAIL,
    };

    mockFindUnique.mockResolvedValue(null);
    mockFindFirst.mockResolvedValue(newUser);

    await autoLoginMiddleware(mockRequest as Request, mockResponse as Response, mockNext);

    expect(mockFindUnique).toHaveBeenCalledWith({
      where: { id: 'nonexistent-user-id' },
    });
    expect(mockFindFirst).toHaveBeenCalledWith({
      where: { email: FIRST_USER_EMAIL },
    });
    expect(mockCookie).toHaveBeenCalledWith('userId', 'new-user-id', {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    expect(mockNext).toHaveBeenCalled();
  });

  it('should handle findUnique error gracefully and set new cookie', async () => {
    mockRequest.cookies = { userId: 'error-user-id' };

    const newUser = {
      id: 'new-user-id',
      name: 'Alex Morgan',
      email: FIRST_USER_EMAIL,
    };

    mockFindUnique.mockRejectedValue(new Error('Database error'));
    mockFindFirst.mockResolvedValue(newUser);

    await autoLoginMiddleware(mockRequest as Request, mockResponse as Response, mockNext);

    expect(mockFindFirst).toHaveBeenCalledWith({
      where: { email: FIRST_USER_EMAIL },
    });
    expect(mockCookie).toHaveBeenCalledWith('userId', 'new-user-id', {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    expect(mockNext).toHaveBeenCalled();
  });

  it('should handle findFirst error gracefully and still call next', async () => {
    mockRequest.cookies = {};

    mockFindFirst.mockRejectedValue(new Error('Database error'));

    await autoLoginMiddleware(mockRequest as Request, mockResponse as Response, mockNext);

    expect(mockFindFirst).toHaveBeenCalled();
    expect(mockCookie).not.toHaveBeenCalled();
    expect(consoleErrorSpy).toHaveBeenCalledWith('Auto-login failed:', expect.any(Error));
    expect(mockNext).toHaveBeenCalled();
  });

  it('should not set cookie when no user found with mock email', async () => {
    mockRequest.cookies = {};

    mockFindFirst.mockResolvedValue(null);

    await autoLoginMiddleware(mockRequest as Request, mockResponse as Response, mockNext);

    expect(mockFindFirst).toHaveBeenCalledWith({
      where: { email: FIRST_USER_EMAIL },
    });
    expect(mockCookie).not.toHaveBeenCalled();
    expect(consoleLogSpy).not.toHaveBeenCalled();
    expect(mockNext).toHaveBeenCalled();
  });

  it('should handle cookie validation and reset in correct order', async () => {
    mockRequest.cookies = { userId: 'user-with-wrong-email' };
    process.env.MOCK_USER_EMAIL = 'jordan.doe@carton.com';

    const existingUser = {
      id: 'user-with-wrong-email',
      name: 'Alex Morgan',
      email: FIRST_USER_EMAIL,
    };

    const correctUser = {
      id: 'correct-user-id',
      name: 'Jordan Doe',
      email: 'jordan.doe@carton.com',
    };

    mockFindUnique.mockResolvedValue(existingUser);
    mockFindFirst.mockResolvedValue(correctUser);

    await autoLoginMiddleware(mockRequest as Request, mockResponse as Response, mockNext);

    // Verify the order of operations
    expect(mockFindUnique).toHaveBeenCalledWith({
      where: { id: 'user-with-wrong-email' },
    });
    expect(mockFindFirst).toHaveBeenCalledWith({
      where: { email: 'jordan.doe@carton.com' },
    });
    expect(mockCookie).toHaveBeenCalledWith('userId', 'correct-user-id', {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    expect(consoleLogSpy).toHaveBeenCalledWith(
      `Auto-logged in as: Jordan Doe (jordan.doe@carton.com)`
    );
    expect(mockNext).toHaveBeenCalled();
  });
});
