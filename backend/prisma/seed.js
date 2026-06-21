const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const sampleEvents = [
  {
    name: 'Tech Innovation Summit 2025',
    description:
      'A premier technology conference featuring keynote speakers from leading tech companies. Explore the latest trends in AI, cloud computing, and software engineering with hands-on workshops and networking sessions.',
    date: new Date('2025-08-15T09:00:00Z'),
    venue: 'Bangalore International Exhibition Centre, Bangalore',
    totalSeats: 500,
    availableSeats: 500,
  },
  {
    name: 'Indie Music Festival',
    description:
      'A two-day celebration of independent music featuring 20+ artists across three stages. From folk and jazz to electronic and hip-hop, experience the best of indie music with food trucks and art installations.',
    date: new Date('2025-09-20T16:00:00Z'),
    venue: 'Jawaharlal Nehru Stadium, New Delhi',
    totalSeats: 2000,
    availableSeats: 2000,
  },
  {
    name: 'Full-Stack Development Workshop',
    description:
      'An intensive hands-on workshop covering React, Node.js, and PostgreSQL. Build a complete web application from scratch with guidance from senior engineers. Laptops required.',
    date: new Date('2025-07-10T10:00:00Z'),
    venue: 'WeWork Embassy Golf Links, Bangalore',
    totalSeats: 50,
    availableSeats: 50,
  },
  {
    name: 'Stand-Up Comedy Night',
    description:
      'An evening of laughter featuring five of India\'s top comedians. Enjoy two hours of non-stop comedy with a complimentary welcome drink. Age 16+ only.',
    date: new Date('2025-08-05T19:30:00Z'),
    venue: 'Canvas Laugh Club, Mumbai',
    totalSeats: 150,
    availableSeats: 150,
  },
  {
    name: 'Hackathon: Code for Good',
    description:
      'A 48-hour hackathon focused on building solutions for social impact. Form teams, ideate, and prototype solutions for real-world problems. Prizes worth ₹5,00,000. Meals and accommodation provided.',
    date: new Date('2025-10-01T08:00:00Z'),
    venue: 'IIT Madras Research Park, Chennai',
    totalSeats: 200,
    availableSeats: 200,
  },
  {
    name: 'Contemporary Art Exhibition',
    description:
      'A curated exhibition showcasing works from 30 emerging artists exploring themes of identity, technology, and sustainability. Includes guided tours, artist talks, and an opening night reception.',
    date: new Date('2025-11-15T11:00:00Z'),
    venue: 'National Gallery of Modern Art, Mumbai',
    totalSeats: 300,
    availableSeats: 300,
  },
];

async function main() {
  console.log('🌱 Seeding database...');

  // Clear existing data
  await prisma.booking.deleteMany();
  await prisma.event.deleteMany();
  await prisma.user.deleteMany();

  // Create events
  for (const event of sampleEvents) {
    const created = await prisma.event.create({ data: event });
    console.log(`  ✅ Created event: ${created.name}`);
  }

  console.log(`\n🎉 Seeding complete! Created ${sampleEvents.length} events.`);
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
