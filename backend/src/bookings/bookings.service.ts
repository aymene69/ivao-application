import { BadRequestException, ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateBookingDto } from './dto/create-booking.dto.js';
import { UpdateBookingDto } from './dto/update-booking.dto.js';
import { RatingLevel } from '../generated/prisma/enums.js';

const MAX_FUTURE_BOOKINGS_PER_VID = 3;

@Injectable()
export class BookingsService {
  constructor(private readonly prisma: PrismaService) {}

  findFuture() {
    return this.prisma.booking.findMany({
      where: { fromTime: { gt: new Date() } },
      orderBy: { position: 'asc' },
    });
  }

  findByDate(date: string) {
    const dayStart = new Date(`${date}T00:00:00.000Z`);
    const dayEnd = new Date(`${date}T00:00:00.000Z`);
    dayEnd.setUTCDate(dayEnd.getUTCDate() + 1);

    return this.prisma.booking.findMany({
      where: { fromTime: { lt: dayEnd }, toTime: { gt: dayStart } },
      orderBy: { position: 'asc' },
    });
  }

  findCurrentForPosition(position: string) {
    const now = new Date();
    return this.prisma.booking.findFirst({
      where: { position, fromTime: { lte: now }, toTime: { gt: now } },
    });
  }

  async create(vid: string, rating: RatingLevel | undefined, dto: CreateBookingDto) {
    const fromTime = new Date(dto.fromTime);
    const toTime = new Date(dto.toTime);
    this.assertValidRange(fromTime, toTime);

    if (fromTime <= new Date()) {
      throw new BadRequestException('fromTime must be in the future');
    }

    const futureCount = await this.prisma.booking.count({
      where: { vid, fromTime: { gt: new Date() } },
    });
    if (futureCount >= MAX_FUTURE_BOOKINGS_PER_VID) {
      throw new BadRequestException(`You cannot have more than ${MAX_FUTURE_BOOKINGS_PER_VID} future bookings`);
    }

    await this.assertNoOverlap({ vid, position: dto.position, fromTime, toTime });

    return this.prisma.booking.create({
      data: { vid, rating, position: dto.position, fromTime, toTime, type: dto.type },
    });
  }

  async update(id: number, vid: string, dto: UpdateBookingDto) {
    const booking = await this.findOwnedFutureBooking(id, vid);

    const fromTime = dto.fromTime ? new Date(dto.fromTime) : booking.fromTime;
    const toTime = dto.toTime ? new Date(dto.toTime) : booking.toTime;
    const position = dto.position ?? booking.position;
    this.assertValidRange(fromTime, toTime);

    await this.assertNoOverlap({ vid, position, fromTime, toTime, excludeId: id });

    return this.prisma.booking.update({
      where: { id },
      data: { position, fromTime, toTime, type: dto.type ?? booking.type },
    });
  }

  async remove(id: number, vid: string) {
    await this.findOwnedFutureBooking(id, vid);
    await this.prisma.booking.delete({ where: { id } });
  }

  private async findOwnedFutureBooking(id: number, vid: string) {
    const booking = await this.prisma.booking.findUnique({ where: { id } });
    if (!booking) {
      throw new NotFoundException('Booking not found');
    }
    if (booking.vid !== vid) {
      throw new ForbiddenException('You can only manage your own bookings');
    }
    if (booking.fromTime <= new Date()) {
      throw new BadRequestException('Past or ongoing bookings can no longer be edited or deleted');
    }
    return booking;
  }

  private assertValidRange(fromTime: Date, toTime: Date) {
    if (Number.isNaN(fromTime.getTime()) || Number.isNaN(toTime.getTime()) || toTime <= fromTime) {
      throw new BadRequestException('toTime must be strictly after fromTime');
    }
  }

  private async assertNoOverlap(params: {
    vid: string;
    position: string;
    fromTime: Date;
    toTime: Date;
    excludeId?: number;
  }) {
    const { vid, position, fromTime, toTime, excludeId } = params;

    const [samePosition, sameVid] = await Promise.all([
      this.prisma.booking.findFirst({
        where: {
          id: excludeId ? { not: excludeId } : undefined,
          position,
          fromTime: { lt: toTime },
          toTime: { gt: fromTime },
        },
      }),
      this.prisma.booking.findFirst({
        where: {
          id: excludeId ? { not: excludeId } : undefined,
          vid,
          fromTime: { lt: toTime },
          toTime: { gt: fromTime },
        },
      }),
    ]);

    if (samePosition) {
      throw new ConflictException('This position is already booked during that time range');
    }
    if (sameVid) {
      throw new ConflictException('You already have another booking during that time range');
    }
  }
}
