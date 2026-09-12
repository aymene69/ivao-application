import { IsEnum, IsISO8601, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { BookingType } from '../../generated/prisma/enums.js';

export class CreateBookingDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  position!: string;

  @IsISO8601()
  fromTime!: string;

  @IsISO8601()
  toTime!: string;

  @IsOptional()
  @IsEnum(BookingType)
  type?: BookingType;
}
