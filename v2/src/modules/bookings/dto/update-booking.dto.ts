import { PartialType } from '@nestjs/swagger';
import { CreateBookingDto } from './create-booking.dto';

/**
 * Update booking data
 */
export class UpdateBookingDto extends PartialType(CreateBookingDto) {}
