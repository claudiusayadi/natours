import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
} from 'class-validator';

/**
 * Create review data
 */
export class CreateReviewDto {
  /**
   * Review text content
   * @example "Amazing tour! The guides were very knowledgeable and the scenery was breathtaking."
   */
  @IsString()
  @IsNotEmpty()
  review: string;

  /**
   * Rating from 1 to 5
   * @example 5
   */
  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;

  /**
   * Tour ID (optional if provided in URL params)
   * @example "60c72b2f9b1d8b3a4c8e4b5a"
   */
  @IsUUID()
  @IsOptional()
  tourId?: string;
}
