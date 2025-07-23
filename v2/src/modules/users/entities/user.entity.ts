import * as argon from 'argon2';
import { Exclude } from 'class-transformer';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { UserRole } from '../../../common/enums/user-role.enum';
import { Booking } from '../../bookings/entities/booking.entity';
import { Review } from '../../reviews/entities/review.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'first_name' })
  firstName: string;

  @Column({ name: 'last_name' })
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column({ default: 'default.jpg' })
  photo: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    enumName: 'role',
    default: UserRole.USER,
  })
  role: UserRole;

  @Column()
  @Exclude()
  password: string;

  @Column({ name: 'password_changed_at', nullable: true })
  @Exclude()
  passwordChangedAt: Date;

  @Column({ name: 'password_reset_token', nullable: true })
  @Exclude()
  passwordResetToken: string;

  @Column({ name: 'password_reset_expires', nullable: true })
  @Exclude()
  passwordResetExpires: Date;

  @Column({ default: true })
  @Exclude()
  active: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => Review, (review) => review.user)
  reviews: Review[];

  @OneToMany(() => Booking, (booking) => booking.user)
  bookings: Booking[];

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.password) {
      this.password = await argon.hash(this.password);
    }
  }

  async compare(password: string): Promise<boolean> {
    return await argon.verify(password, this.password);
  }

  changedPasswordAfter(JWTTimestamp: number): boolean {
    if (!this.passwordChangedAt) return false;

    const changedTimestamp = parseInt(
      (this.passwordChangedAt.getTime() / 1000).toString(),
      10,
    );
    return JWTTimestamp < changedTimestamp;
  }
}
