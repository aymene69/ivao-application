import { IsBooleanString, IsDateString, IsOptional } from 'class-validator';

export class QueryBookingsDto {
  @IsOptional()
  @IsBooleanString()
  upcoming?: string;

  @IsOptional()
  @IsDateString()
  date?: string;
}
