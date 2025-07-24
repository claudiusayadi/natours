import * as argon from 'argon2';
import { TourDifficulty } from '../../common/enums/tour-difficulty.enum';
import { UserRole } from '../../common/enums/user-role.enum';
import dataSource from '../../config/data-source';

async function seed() {
  const apiDataSource = dataSource;

  await apiDataSource.initialize();

  console.log('🌱 Starting database seeding...');

  // Create users
  const userRepo = apiDataSource.getRepository('User');

  const adminUser = userRepo.create({
    firstName: 'Admin',
    email: 'admin@natours.live',
    password: await argon.hash('password123'),
    role: UserRole.ADMIN,
    photo: 'admin.jpg',
  });

  const leadGuide = userRepo.create({
    email: 'lead-guide@natours.live',
    password: await argon.hash('password123'),
  });

  const guide = userRepo.create({
    email: 'guide@natours.live',
    password: await argon.hash('password123'),
  });

  const user = userRepo.create({
    email: 'user@natours.live',
    password: await argon.hash('password123'),
  });

  await userRepo.save([adminUser, leadGuide, guide, user]);
  console.log('✅ Users created');

  // @TODO: Update users {firstName, lastName, role, photo - admin.jpg, lead-guide.jpg, guide.jpg, user.jpg}

  // Create tours
  const tourRepository = apiDataSource.getRepository('Tour');

  const tour1 = tourRepository.create({
    name: 'The Forest Hiker',
    duration: 5,
    maxGroupSize: 25,
    difficulty: TourDifficulty.EASY,
    ratingsAverage: 4.7,
    ratingsQuantity: 37,
    price: 397,
    summary: 'Breathtaking hike through the Canadian Banff National Park',
    description:
      'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
    imageCover: 'tour-1-cover.jpg',
    images: ['tour-1-1.jpg', 'tour-1-2.jpg', 'tour-1-3.jpg'],
    startDates: [
      new Date('2024-04-25T10:00:00.000Z'),
      new Date('2024-07-20T10:00:00.000Z'),
      new Date('2024-10-05T10:00:00.000Z'),
    ],
    startLocation: {
      type: 'Point',
      coordinates: [-115.570154, 51.178456],
      address: 'Banff, AB, Canada',
      description: 'Banff National Park',
    },
    locations: [
      {
        type: 'Point',
        coordinates: [-116.214531, 51.417611],
        address: 'Banff, AB, Canada',
        description: 'Banff National Park',
        day: 1,
      },
      {
        type: 'Point',
        coordinates: [-118.076152, 52.875223],
        address: 'Jasper, AB, Canada',
        description: 'Jasper National Park',
        day: 3,
      },
    ],
    guides: [leadGuide, guide],
  });

  const tour2 = tourRepository.create({
    name: 'The Sea Explorer',
    duration: 7,
    maxGroupSize: 15,
    difficulty: TourDifficulty.MEDIUM,
    ratingsAverage: 4.6,
    ratingsQuantity: 23,
    price: 497,
    summary: 'Exploring the jaw-dropping US east coast by foot and by boat',
    description:
      'Consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    imageCover: 'tour-2-cover.jpg',
    images: ['tour-2-1.jpg', 'tour-2-2.jpg', 'tour-2-3.jpg'],
    startDates: [
      new Date('2024-06-19T10:00:00.000Z'),
      new Date('2024-07-20T10:00:00.000Z'),
      new Date('2024-08-18T10:00:00.000Z'),
    ],
    startLocation: {
      type: 'Point',
      coordinates: [-80.185942, 25.774772],
      address: 'Miami, FL, USA',
      description: 'Miami South Beach',
    },
    locations: [
      {
        type: 'Point',
        coordinates: [-80.128473, 25.781842],
        address: 'Miami, FL, USA',
        description: 'Miami South Beach',
        day: 1,
      },
      {
        type: 'Point',
        coordinates: [-80.647885, 24.909047],
        address: 'Key Largo, FL, USA',
        description: 'Key Largo',
        day: 3,
      },
    ],
    guides: [leadGuide, guide],
  });

  await tourRepository.save([tour1, tour2]);
  console.log('✅ Tours created');

  await apiDataSource.destroy();
  console.log('🎉 Database seeding completed!');
}

seed().catch((error) => {
  console.error('❌ Error seeding database:', error);
  process.exit(1);
});
