import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { BookingsService } from './bookings.service.js';
import { CreateBookingDto } from './dto/create-booking.dto.js';
import { UpdateBookingDto } from './dto/update-booking.dto.js';
import { QueryBookingsDto } from './dto/query-bookings.dto.js';
import { CurrentBookingQueryDto } from './dto/current-booking-query.dto.js';
import { Vid } from '../common/decorators/vid.decorator.js';
import { Rating } from '../common/decorators/rating.decorator.js';
import { VidGuard } from '../common/guards/vid.guard.js';
import { RatingLevel } from '../generated/prisma/enums.js';

@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Get()
  findAll(@Query() query: QueryBookingsDto) {
    if (query.date) {
      return this.bookingsService.findByDate(query.date);
    }
    if (query.upcoming === 'false') {
      throw new BadRequestException('Provide either "upcoming=true" or a "date"');
    }
    return this.bookingsService.findFuture();
  }

  @Get('current')
  findCurrent(@Query() query: CurrentBookingQueryDto) {
    return this.bookingsService.findCurrentForPosition(query.position);
  }

  @Post()
  @UseGuards(VidGuard)
  create(@Vid() vid: string, @Rating() rating: RatingLevel | undefined, @Body() dto: CreateBookingDto) {
    return this.bookingsService.create(vid, rating, dto);
  }

  @Patch(':id')
  @UseGuards(VidGuard)
  update(@Param('id', ParseIntPipe) id: number, @Vid() vid: string, @Body() dto: UpdateBookingDto) {
    return this.bookingsService.update(id, vid, dto);
  }

  @Delete(':id')
  @UseGuards(VidGuard)
  remove(@Param('id', ParseIntPipe) id: number, @Vid() vid: string) {
    return this.bookingsService.remove(id, vid);
  }
}
