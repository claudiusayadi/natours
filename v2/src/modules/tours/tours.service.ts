import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { CreateTourDto } from './dto/create-tour.dto';
import { TourQueryDto } from './dto/tour-query.dto';
import { UpdateTourDto } from './dto/update-tour.dto';
import { Tour } from './entities/tour.entity';

@Injectable()
export class ToursService {
  constructor(
    @InjectRepository(Tour) private readonly toursRepo: Repository<Tour>,
  ) {}

  async create(dto: CreateTourDto): Promise<Tour> {
    const tour = this.toursRepo.create({
      ...dto,
      startDates: dto.startDates.map((date) => new Date(date)),
      guides: dto.guides ? dto.guides.map((id) => ({ id })) : undefined,
    });
    return this.toursRepo.save(tour);
  }

  async findAll(
    query: TourQueryDto,
  ): Promise<{ tours: Tour[]; total: number }> {
    const queryBuilder = this.createQueryBuilder();

    // Apply filters
    this.applyFilters(queryBuilder, query);

    // Apply sorting
    this.applySorting(queryBuilder, query.sort);

    // Apply field selection
    this.applyFieldSelection(queryBuilder, query.fields);

    // Apply pagination
    const { skip, take } = this.applyPagination(query.page, query.limit);
    queryBuilder.skip(skip).take(take);

    const [tours, total] = await queryBuilder.getManyAndCount();

    return { tours, total };
  }

  async findBy(identifier: string, name: string): Promise<Tour> {
    const tour = await this.toursRepo.findOneOrFail({
      where: [
        { id: identifier, special: false },
        { slug: identifier, special: false },
      ],
      relations: { reviews: true, guides: true },
    });

    if (!tour) {
      throw new NotFoundException(`Tour with ${name} ${identifier} not found`);
    }

    return tour;
  }

  async update(id: string, dto: UpdateTourDto): Promise<Tour> {
    // Extract guides from dto to handle separately
    const { guides, ...updateData } = dto;

    // Prepare data for update (excluding guides)
    const data = { ...updateData };

    if (dto.startDates) {
      data.startDates = dto.startDates.map((date) => new Date(date));
    }

    await this.toursRepo.update(id, data);

    // Handle guides relationship update if provided
    if (guides !== undefined) {
      const tour = await this.toursRepo.findOne({
        where: { id },
        relations: { guides: true },
      });

      if (!tour) throw new NotFoundException(`Tour with ID ${id} not found`);

      // Update guides relationship
      tour.guides = guides.map((guideId) => ({ id: guideId }) as User);
      await this.toursRepo.save(tour);
    }

    return this.findBy(id, 'id');
  }

  async remove(id: string): Promise<void> {
    const tour = await this.toursRepo.findOne({ where: { id } });
    if (!tour) throw new NotFoundException(`Tour with ID ${id} not found`);

    await this.toursRepo.delete(tour.id);
  }

  async getTopTours(limit: number = 5): Promise<Tour[]> {
    return this.toursRepo.find({
      where: { special: false },
      order: {
        ratingsAverage: 'DESC',
        price: 'ASC',
      },
      take: limit,
    });
  }

  async getTourStats(): Promise<any> {
    const queryBuilder = this.toursRepo
      .createQueryBuilder('tour')
      .select([
        'tour.difficulty as difficulty',
        'COUNT(tour.id) as totalTours',
        'SUM(tour.ratingsQuantity) as ratingCount',
        'AVG(tour.ratingsAverage) as avgRating',
        'AVG(tour.price) as avgPrice',
        'MIN(tour.price) as minPrice',
        'MAX(tour.price) as maxPrice',
      ])
      .where('tour.ratingsAverage >= :rating', { rating: 4.5 })
      .groupBy('tour.difficulty')
      .orderBy('avgPrice', 'ASC');

    return queryBuilder.getRawMany();
  }

  private createQueryBuilder(): SelectQueryBuilder<Tour> {
    return this.toursRepo
      .createQueryBuilder('tour')
      .where('tour.special = :special', { special: false });
  }

  private applyFilters(
    queryBuilder: SelectQueryBuilder<Tour>,
    query: TourQueryDto,
  ): void {
    if (query.difficulty) {
      queryBuilder.andWhere('tour.difficulty = :difficulty', {
        difficulty: query.difficulty,
      });
    }

    if (query['duration[gte]']) {
      queryBuilder.andWhere('tour.duration >= :minDuration', {
        minDuration: query['duration[gte]'],
      });
    }

    if (query['duration[lte]']) {
      queryBuilder.andWhere('tour.duration <= :maxDuration', {
        maxDuration: query['duration[lte]'],
      });
    }

    if (query['price[gte]']) {
      queryBuilder.andWhere('tour.price >= :minPrice', {
        minPrice: query['price[gte]'],
      });
    }

    if (query['price[lte]']) {
      queryBuilder.andWhere('tour.price <= :maxPrice', {
        maxPrice: query['price[lte]'],
      });
    }
  }

  private applySorting(
    queryBuilder: SelectQueryBuilder<Tour>,
    sort?: string,
  ): void {
    if (sort) {
      const sortFields = sort.split(',');
      sortFields.forEach((field, index) => {
        const isDescending = field.startsWith('-');
        const fieldName = isDescending ? field.substring(1) : field;
        const direction = isDescending ? 'DESC' : 'ASC';

        if (index === 0) {
          queryBuilder.orderBy(`tour.${fieldName}`, direction);
        } else {
          queryBuilder.addOrderBy(`tour.${fieldName}`, direction);
        }
      });
    } else {
      queryBuilder.orderBy('tour.createdAt', 'DESC');
    }
  }

  private applyFieldSelection(
    queryBuilder: SelectQueryBuilder<Tour>,
    fields?: string,
  ): void {
    if (fields) {
      const selectedFields = fields
        .split(',')
        .map((field) => `tour.${field.trim()}`);
      queryBuilder.select(['tour.id', ...selectedFields]);
    }
  }

  private applyPagination(
    page: number = 1,
    limit: number = 10,
  ): { skip: number; take: number } {
    const skip = (page - 1) * limit;
    return { skip, take: limit };
  }
}
