import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../common/enums/user-role.enum';
import { RolesGuard } from '../../common/guards/roles.guard';
import { User } from '../users/entities/user.entity';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';

/**
 * Booking management endpoints
 */
@Controller('bookings')
@UseGuards(AuthGuard('jwt'))
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  /**
   * Create a new booking (Admin/Lead Guide only)
   */
  @Post()
  @Roles(UserRole.ADMIN, UserRole.LEAD_GUIDE)
  @UseGuards(RolesGuard)
  create(@Body() dto: CreateBookingDto) {
    return this.bookingsService.create(dto);
  }

  /**
   * Get all bookings (Admin/Lead Guide only)
   */
  @Get()
  @Roles(UserRole.ADMIN, UserRole.LEAD_GUIDE)
  @UseGuards(RolesGuard)
  findAll() {
    return this.bookingsService.findAll();
  }

  /**
   * Get current user's bookings
   */
  @Get('my-bookings')
  getMyBookings(@CurrentUser() user: User) {
    return this.bookingsService.findByUserId(user.id);
  }

  /**
   * Create checkout session for a tour
   */
  @Get('checkout/:tourId')
  createCheckoutSession(
    @Param('tourId', ParseUUIDPipe) tourId: string,
    @CurrentUser() user: User,
  ) {
    return this.bookingsService.createCheckoutSession(tourId, user.id);
  }

  /**
   * Get booking by ID (Admin/Lead Guide only)
   */
  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.LEAD_GUIDE)
  @UseGuards(RolesGuard)
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.bookingsService.findById(id);
  }

  /**
   * Update booking by ID (Admin/Lead Guide only)
   */
  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.LEAD_GUIDE)
  @UseGuards(RolesGuard)
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateBookingDto,
  ) {
    return this.bookingsService.update(id, dto);
  }

  /**
   * Delete booking by ID (Admin/Lead Guide only)
   */
  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.LEAD_GUIDE)
  @UseGuards(RolesGuard)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.bookingsService.remove(id);
  }
}
