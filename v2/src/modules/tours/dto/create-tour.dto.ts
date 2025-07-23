import { Type } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { TourDifficulty } from '../../../common/enums/tour-difficulty.enum';

class LocationDto {
  @IsString()
  type: 'Point';

  @IsArray()
  @IsNumber({}, { each: true })
  coordinates: [number, number];

  @IsString()
  @IsOptional()
  address?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @IsOptional()
  day?: number;
}

/**
 * Create tour data
 */
export class CreateTourDto {
  /**
   * Tour name
   * @example "Idanre Hills Adventure"
   */
  @IsString()
  @IsNotEmpty()
  name: string;

  /**
   * Tour duration in days
   * @example 5
   */
  @IsNumber()
  @Min(1)
  duration: number;

  /**
   * Maximum group size
   * @example 25
   */
  @IsNumber()
  @Min(1)
  maxGroupSize: number;

  /**
   * Tour difficulty level
   * @example "medium"
   */
  @IsEnum(TourDifficulty)
  difficulty: TourDifficulty;

  /**
   * Tour price in USD
   * @example 497
   */
  @IsNumber()
  @Min(0)
  price: number;

  /**
   * Price discount in USD
   * @example 100
   */
  @IsNumber()
  @IsOptional()
  @Min(0)
  priceDiscount?: number;

  /**
   * Tour summary
   * @example  "Breathtaking hike through the Idanre Hills with stunning views and rich cultural experiences."
   */
  @IsString()
  @IsNotEmpty()
  summary: string;

  /**
   * Tour description
   * @example "Join us for an unforgettable adventure through the Idanre Hills, where you'll experience breathtaking views, rich culture, and thrilling hikes. Perfect for nature lovers and adventure seekers alike."
   */
  @IsString()
  @IsOptional()
  description?: string;

  /**
   * Cover image filename
   * @example "tour-1-cover.jpg"
   */
  @IsString()
  @IsNotEmpty()
  imageCover: string;

  /**
   * Array of image filenames
   * @example ["tour-1-1.jpg", "tour-1-2.jpg", "tour-1-3.jpg"]
   */
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  images?: string[];

  /**
   * Array of tour start dates
   * @example ["2024-04-25T10:00:00.000Z", "2024-07-20T10:00:00.000Z"]
   */
  @IsArray()
  @IsDate({ each: true })
  startDates: Date[];

  /**
   * Tour start location
   */
  @ValidateNested()
  @Type(() => LocationDto)
  startLocation: LocationDto;

  /**
   * Array of tour locations
   */
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => LocationDto)
  @IsOptional()
  locations?: LocationDto[];

  /**
   * Array of guide user IDs
   * @example ["60c72b2f9b1d8b3a4c8e4b5a", "60c72b2f9b1d8b3a4c8e4b5b"]
   */
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  guides?: string[];
}
