import { PartialType } from '@nestjs/swagger';
import { CreateReviewDto } from './create-review.dto';

/**
 * Update review data
 */
export class UpdateReviewDto extends PartialType(CreateReviewDto) {}
