import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { Request } from 'express';
import { RatingLevel } from '../../generated/prisma/enums.js';

export const RATING_HEADER = 'x-rating';
const VALID_RATINGS = new Set(Object.values(RatingLevel));

/**
 * Extracts the caller's self-declared ATC rating from the x-rating header.
 * Unlike the VID, this is purely informational (no ownership/security relies on it),
 * so an absent or invalid value is not an error — it just falls back to undefined
 * and the service applies the schema default.
 */
export const Rating = createParamDecorator((_data: unknown, ctx: ExecutionContext): RatingLevel | undefined => {
  const request = ctx.switchToHttp().getRequest<Request>();
  const value = request.headers[RATING_HEADER];
  return typeof value === 'string' && VALID_RATINGS.has(value as RatingLevel) ? (value as RatingLevel) : undefined;
});
