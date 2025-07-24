import { PartialType } from '@nestjs/swagger';
import { CreateTourDto } from './create-tour.dto';

/**
 * Update tour data
 */
export class UpdateTourDto extends PartialType(CreateTourDto) {}
