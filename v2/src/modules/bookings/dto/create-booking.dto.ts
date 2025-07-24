import { IsBoolean, IsNumber, IsOptional, IsUUID, Min } from 'class-validator';

/**
 * Create booking data
 */
export class CreateBookingDto {
  /**
   * Tour ID
   * @example "60c72b2f9b1d8b3a4c8e4b5a"
   */
  @IsUUID()
  tourId: string;

  /**
   * User ID (optional if provided from auth context)
   * @example "60c72b2f9b1d8b3a4c8e4b5b"
   */
  @IsUUID()
  @IsOptional()
  userId?: string;

  /**
   * Booking price
   * @example 497
   */
  @IsNumber()
  @Min(0)
  price: number;

  /**
   * Payment status
   * @example true
   */
  @IsBoolean()
  @IsOptional()
  paid?: boolean = true;
}
