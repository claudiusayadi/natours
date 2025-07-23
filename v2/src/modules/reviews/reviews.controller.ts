import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';
import { UserRole } from '../../common/enums/user-role.enum';

/**
 * Review management endpoints
 */
@Controller('reviews')
@UseGuards(AuthGuard('jwt'))
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  /**
   * Create a new review (Users only)
   */
  @Post()
  @Roles(UserRole.USER)
  @UseGuards(RolesGuard)
  create(@Body() createReviewDto: CreateReviewDto, @CurrentUser() user: User) {
    return this.reviewsService.create(createReviewDto, user.id);
  }

  /**
   * Get all reviews
   */
  @Get()
  findAll() {
    return this.reviewsService.findAll();
  }

  /**
   * Get review by ID
   */
  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.reviewsService.findById(id);
  }

  /**
   * Update review by ID (Owner or Admin only)
   */
  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateReviewDto: UpdateReviewDto,
    @CurrentUser() user: User,
  ) {
    return this.reviewsService.update(id, updateReviewDto, user.id);
  }

  /**
   * Delete review by ID (Owner or Admin only)
   */
  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: User) {
    return this.reviewsService.remove(id, user.id);
  }
}

/**
 * Tour-specific review endpoints
 */
@Controller('tours/:tourId/reviews')
@UseGuards(AuthGuard('jwt'))
export class TourReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  /**
   * Create a review for a specific tour (Users only)
   */
  @Post()
  @Roles(UserRole.USER)
  @UseGuards(RolesGuard)
  create(
    @Param('tourId', ParseUUIDPipe) tourId: string,
    @Body() createReviewDto: CreateReviewDto,
    @CurrentUser() user: User,
  ) {
    return this.reviewsService.create(createReviewDto, user.id, tourId);
  }

  /**
   * Get all reviews for a specific tour
   */
  @Get()
  findAll(@Param('tourId', ParseUUIDPipe) tourId: string) {
    return this.reviewsService.findAll(tourId);
  }
}