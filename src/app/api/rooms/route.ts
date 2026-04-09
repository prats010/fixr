import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import QRCode from 'qrcode';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const hotelId = searchParams.get('hotelId');
  if (!hotelId) return NextResponse.json({ error: 'Missing hotelId' }, { status: 400 });

  const rooms = await prisma.room.findMany({ where: { hotelId } });
  return NextResponse.json(rooms);
}

export async function POST(request: Request) {
  try {
    const { hotelId, roomNumber } = await request.json();
    if (!hotelId || !roomNumber) {
        return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    // Generate link
    const link = `http://localhost:3000/complaint?room=${roomNumber}&hotel=${hotelId}`;
    const qrCode = await QRCode.toDataURL(link);

    const room = await prisma.room.create({
      data: {
        hotelId,
        roomNumber,
        qrCode
      }
    });

    return NextResponse.json(room, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Server Error' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
    
    await prisma.room.delete({ where: { id } });
    return NextResponse.json({ success: true });
}
