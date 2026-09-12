import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CurrentBookingQueryDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  position!: string;
}
