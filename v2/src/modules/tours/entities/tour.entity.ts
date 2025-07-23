import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { TourDifficulty } from '../../../common/enums/tour-difficulty.enum';
import { Booking } from '../../bookings/entities/booking.entity';
import { Review } from '../../reviews/entities/review.entity';
import { User } from '../../users/entities/user.entity';

export interface Location {
  type: 'Point';
  coordinates: [number, number];
  address?: string;
  description?: string;
  day?: number;
}

@Entity('tours')
export class Tour {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column({ unique: true })
  slug: string;

  @Column()
  duration: number;

  @Column({ name: 'max_group_size' })
  maxGroupSize: number;

  @Column({
    type: 'enum',
    enum: TourDifficulty,
    enumName: 'difficulty',
  })
  difficulty: TourDifficulty;

  @Column({
    type: 'decimal',
    precision: 3,
    scale: 2,
    default: 4.5,
    name: 'ratings_average',
  })
  ratingsAverage: number;

  @Column({ default: 0, name: 'ratings_quantity' })
  ratingsQuantity: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
    name: 'price_discount',
  })
  priceDiscount: number;

  @Column('text')
  summary: string;

  @Column('text', { nullable: true })
  description: string;

  @Column({ name: 'image_cover' })
  imageCover: string;

  @Column('text', { array: true, default: '{}' })
  images: string[];

  @Column('timestamp', { array: true, default: '{}', name: 'start_dates' })
  startDates: Date[];

  @Column({ default: false })
  special: boolean;

  @Column('jsonb', { name: 'start_location' })
  startLocation: Location;

  @Column('jsonb', { array: true, default: '{}' })
  locations: Location[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => Review, (review) => review.tour)
  reviews: Review[];

  @OneToMany(() => Booking, (booking) => booking.tour)
  bookings: Booking[];

  @ManyToMany(() => User)
  @JoinTable({
    name: 'tour_guides',
    joinColumn: { name: 'tour_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'user_id', referencedColumnName: 'id' },
  })
  guides: User[];

  @BeforeInsert()
  @BeforeUpdate()
  generateSlug() {
    if (this.name) {
      this.slug = this.name
        .toLowerCase()
        .replace(/[^a-zA-Z0-9]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
    }
  }

  get durationInWeeks(): number {
    return this.duration / 7;
  }
}
