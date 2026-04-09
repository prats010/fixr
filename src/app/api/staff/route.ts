import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { hashPassword } from '@/lib/auth';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const hotelId = searchParams.get('hotelId');
  if (!hotelId) return NextResponse.json({ error: 'Missing hotelId' }, { status: 400 });

  const staff = await prisma.staff.findMany({ 
      where: { hotelId },
      select: { id: true, name: true, email: true, role: true } 
  });
  return NextResponse.json(staff);
}

export async function POST(request: Request) {
  try {
    const { hotelId, name, email, password, role } = await request.json();
    
    const hashed = await hashPassword(password);

    const newStaff = await prisma.staff.create({
      data: {
        hotelId,
        name,
        email,
        password: hashed,
        role: role || 'staff'
      },
      select: { id: true, name: true, email: true, role: true }
    });

    return NextResponse.json(newStaff, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Server Error or Duplicate Email' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
    
    await prisma.staff.delete({ where: { id } });
    return NextResponse.json({ success: true });
}
