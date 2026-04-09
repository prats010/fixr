import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');
  // Check if hotel exists to prevent duplicate seeding
  const existingHotel = await prisma.hotel.findFirst();
  if (existingHotel) {
    console.log('Database already seeded');
    return;
  }

  const ownerPassword = await bcrypt.hash('password123', 10);
  const staffPassword = await bcrypt.hash('password123', 10);

  const hotel = await prisma.hotel.create({
    data: {
      name: 'Grand Nashik Budget Hotel',
      slug: 'grand-nashik',
      ownerEmail: 'owner@fixr.demo',
      ownerPassword,
      rooms: {
        create: [
          { roomNumber: '101' },
          { roomNumber: '102' },
          { roomNumber: '103' },
          { roomNumber: '201' },
          { roomNumber: '202' },
          { roomNumber: '203' },
          { roomNumber: '204' },
        ]
      },
      staff: {
        create: [
          {
            name: 'Priya D.',
            email: 'priya@fixr.demo',
            password: staffPassword,
            role: 'staff'
          },
          {
             name: 'Rajesh M.',
             email: 'owner@fixr.demo',
             password: ownerPassword,
             role: 'owner'
          }
        ]
      }
    }
  });

  const rooms = await prisma.room.findMany({ where: { hotelId: hotel.id } });
  const room204 = rooms.find(r => r.roomNumber === '204');

  if (room204) {
      await prisma.complaint.create({
          data: {
              hotelId: hotel.id,
              room: '204',
              category: 'Hot Water',
              description: 'No hot water since morning.',
              status: 'New',
              aiSuggestion: 'Send maintenance to check boiler immediately.'
          }
      });
  }

  console.log('Seed completed successfully!');
  console.log('Staff Login: priya@fixr.demo / password123');
  console.log('Owner Login: owner@fixr.demo / password123');
  console.log('Demo QR link for Room 204: http://localhost:3000/complaint?room=204&hotel=' + hotel.id);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
