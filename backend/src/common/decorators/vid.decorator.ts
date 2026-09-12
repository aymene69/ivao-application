import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { Request } from 'express';
import { VID_HEADER } from '../guards/vid.guard.js';

/**
 * Extracts the caller's VID from the x-vid header.
 * Only use on routes protected by VidGuard, which guarantees the header is present and valid.
 */
export const Vid = createParamDecorator((_data: unknown, ctx: ExecutionContext): string => {
  const request = ctx.switchToHttp().getRequest<Request>();
  return request.headers[VID_HEADER] as string;
});
