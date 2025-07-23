import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Tour } from '../tours/entities/tour.entity';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { Review } from './entities/review.entity';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewsRepo: Repository<Review>,
    @InjectRepository(Tour)
    private readonly toursRepos: Repository<Tour>,
  ) {}

  async create(
    dto: CreateReviewDto,
    userId: string,
    tourId?: string,
  ): Promise<Review> {
    const finalTourId = tourId || dto.tourId;

    if (!finalTourId) throw new Error('Tour ID is required');

    // Check if tour exists
    const tour = await this.toursRepos.findOne({
      where: { id: finalTourId },
    });
    if (!tour)
      throw new NotFoundException(`Tour with ID ${finalTourId} not found`);

    // Check if user already reviewed this tour
    const existingReview = await this.reviewsRepo.findOne({
      where: { tourId: finalTourId, userId },
    });

    if (existingReview)
      throw new ForbiddenException('You have already reviewed this tour');

    const review = this.reviewsRepo.create({
      ...dto,
      tourId: finalTourId,
      userId,
    });

    const savedReview = await this.reviewsRepo.save(review);

    // Update tour ratings
    await this.updateTourRatings(finalTourId);

    return this.findById(savedReview.id);
  }

  async findAll(tourId?: string): Promise<Review[]> {
    const where = tourId ? { tourId } : {};

    return this.reviewsRepo.find({
      where,
      relations: { user: true, tour: true },
      order: { createdAt: 'DESC' },
    });
  }

  async findById(id: string): Promise<Review> {
    const review = await this.reviewsRepo.findOne({
      where: { id },
      relations: { user: true, tour: true },
    });

    if (!review) throw new NotFoundException(`Review with ID ${id} not found`);

    return review;
  }

  async update(
    id: string,
    dto: UpdateReviewDto,
    userId: string,
  ): Promise<Review> {
    const review = await this.findById(id);

    if (review.userId !== userId)
      throw new ForbiddenException('You can only update your own reviews');

    await this.reviewsRepo.update(id, dto);

    // Update tour ratings if rating changed
    if (dto.rating !== undefined) await this.updateTourRatings(review.tourId);

    return this.findById(id);
  }

  async remove(id: string, userId: string): Promise<void> {
    const review = await this.findById(id);

    if (review.userId !== userId)
      throw new ForbiddenException('You can only delete your own reviews');

    const tourId = review.tourId;

    const result = await this.reviewsRepo.delete(id);
    if (result.affected === 0)
      throw new NotFoundException(`Review with ID ${id} not found`);

    await this.updateTourRatings(tourId);
  }

  private async updateTourRatings(tourId: string): Promise<void> {
    const result = (await this.reviewsRepo
      .createQueryBuilder('review')
      .select(['COUNT(review.id) as count', 'AVG(review.rating) as average'])
      .where('review.tourId = :tourId', { tourId })
      .getRawOne()) as { count: string; average: string | null };

    const ratingsQuantity = parseInt(result.count) || 0;
    const ratingsAverage =
      ratingsQuantity > 0 && result.average !== null
        ? parseFloat(result.average)
        : 0;

    await this.toursRepos.update(tourId, {
      ratingsQuantity,
      ratingsAverage: Math.round(ratingsAverage * 10) / 10,
    });
  }
}
