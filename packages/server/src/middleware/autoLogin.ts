import { prisma } from '@carton/shared';
import type { Request, Response, NextFunction } from 'express';
import { FIRST_USER_EMAIL } from '../../db/constants.js';

/**
 * Auto-login middleware for development
 * Sets userId cookie based on MOCK_USER_EMAIL env variable
 * Validates and updates cookie if the email changes between server restarts
 */
export async function autoLoginMiddleware(req: Request, res: Response, next: NextFunction) {
  const mockEmail = process.env.MOCK_USER_EMAIL || FIRST_USER_EMAIL;
  let needsNewCookie = false;

  // Check if cookie exists and matches the expected user
  if (req.cookies.userId) {
    try {
      const existingUser = await prisma.user.findUnique({
        where: { id: req.cookies.userId },
      });
      // If user doesn't exist or email doesn't match env variable, reset cookie
      if (!existingUser || existingUser.email !== mockEmail) {
        needsNewCookie = true;
      }
    } catch {
      needsNewCookie = true;
    }
  } else {
    needsNewCookie = true;
  }

  if (needsNewCookie) {
    try {
      const user = await prisma.user.findFirst({
        where: { email: mockEmail },
      });

      if (user) {
        res.cookie('userId', user.id, {
          httpOnly: true,
          sameSite: 'lax',
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });
        // Also set on req.cookies so context can pick it up for this request
        req.cookies = req.cookies || {};
        req.cookies.userId = user.id;
        console.log(`Auto-logged in as: ${user.firstName} ${user.lastName} (${user.email})`);
      }
    } catch (error) {
      console.error('Auto-login failed:', error);
    }
  }
  next();
}
