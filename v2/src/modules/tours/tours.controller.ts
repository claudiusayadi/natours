import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../common/enums/user-role.enum';
import { RolesGuard } from '../../common/guards/roles.guard';
import { CreateTourDto } from './dto/create-tour.dto';
import { TourQueryDto } from './dto/tour-query.dto';
import { UpdateTourDto } from './dto/update-tour.dto';
import { ToursService } from './tours.service';

/**
 * Tour management endpoints
 */
@Controller('tours')
export class ToursController {
  constructor(private readonly toursService: ToursService) {}

  /**
   * Create a new tour (Admin/Lead Guide only)
   */
  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.LEAD_GUIDE)
  create(@Body() dto: CreateTourDto) {
    return this.toursService.create(dto);
  }

  /**
   * Get all tours with filtering, sorting, and pagination
   */
  @Get()
  async findAll(@Query() query: TourQueryDto) {
    const { tours, total } = await this.toursService.findAll(query);
    return {
      tours,
      total,
      page: query.page || 1,
      limit: query.limit || 10,
    };
  }

  /**
   * Get top ${limit} tours by rating and price
   */
  @Get('top-cheap')
  getTopTours(@Query('limit') limit: number) {
    return this.toursService.getTopTours(Number(limit));
  }

  /**
   * Get tour statistics
   */
  @Get('stats')
  getTourStats() {
    return this.toursService.getTourStats();
  }

  /**
   * Get tour by ID
   */
  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.toursService.findBy(id, 'id');
  }

  /**
   * Get tour by slug
   */
  @Get('slug/:slug')
  findBySlug(@Param('slug') slug: string) {
    return this.toursService.findBy(slug, 'slug');
  }

  /**
   * Update tour by ID (Admin/Lead Guide only)
   */
  @Patch(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.LEAD_GUIDE)
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateTourDto) {
    return this.toursService.update(id, dto);
  }

  /**
   * Delete tour by ID (Admin/Lead Guide only)
   */
  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.LEAD_GUIDE)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.toursService.remove(id);
  }
}
