import { Type } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { TourDifficulty } from '../../../common/enums/tour-difficulty.enum';

/**
 * Tour query parameters
 */
export class TourQueryDto {
  /**
   * Page number for pagination
   * @example 1
   */
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  page?: number = 1;

  /**
   * Number of items per page
   * @example 10
   */
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  limit?: number = 10;

  /**
   * Sort field and order
   * @example "-price,ratingsAverage"
   */
  @IsOptional()
  @IsString()
  sort?: string;

  /**
   * Fields to include in response
   * @example "name,duration,difficulty,price"
   */
  @IsOptional()
  @IsString()
  fields?: string;

  /**
   * Filter by difficulty
   * @example "easy"
   */
  @IsOptional()
  @IsEnum(TourDifficulty)
  difficulty?: TourDifficulty;

  /**
   * Filter by minimum duration
   * @example 5
   */
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  'duration[gte]'?: number;

  /**
   * Filter by maximum duration
   * @example 10
   */
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  'duration[lte]'?: number;

  /**
   * Filter by minimum price
   * @example 5000
   */
  @IsOptional()
  @Type(() => String)
  @IsString()
  'price[gte]'?: string;

  /**
   * Filter by maximum price
   * @example 50,000
   */
  @IsOptional()
  @Type(() => String)
  @IsString()
  'price[lte]'?: string;
}
