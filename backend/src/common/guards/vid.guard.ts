import { CanActivate, ExecutionContext, Injectable, BadRequestException } from '@nestjs/common';
import type { Request } from 'express';

export const VID_HEADER = 'x-vid';
const VID_PATTERN = /^\d{3,8}$/;

/**
 * Guards routes that need to know "who" the caller is.
 * We don't authenticate the VID (per the exercise spec, header forging is out of scope),
 * we only make sure it's present and looks like a real IVAO VID before trusting it downstream.
 */
@Injectable()
export class VidGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const vid = request.headers[VID_HEADER];

    if (typeof vid !== 'string' || !VID_PATTERN.test(vid)) {
      throw new BadRequestException(`A valid "${VID_HEADER}" header is required for this endpoint`);
    }

    return true;
  }
}
