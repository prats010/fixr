import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { checkPassword, login, logout } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    const staff = await prisma.staff.findUnique({
      where: { email },
      include: { hotel: true }
    });

    // Check staff first
    if (staff && await checkPassword(password, staff.password)) {
        await login(staff.id, staff.hotelId, staff.role);
        return NextResponse.json({ success: true, role: staff.role });
    }

    // Check hotel owner fallback (for demo simplicity)
    const hotel = await prisma.hotel.findUnique({
      where: { ownerEmail: email }
    });

    if (hotel && await checkPassword(password, hotel.ownerPassword)) {
        await login(hotel.id, hotel.id, 'owner');
        return NextResponse.json({ success: true, role: 'owner' });
    }

    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE() {
  await logout();
  return NextResponse.json({ success: true });
}
