import { NextResponse } from 'next/server';
import supabase from '@/lib/db';
import QRCode from 'qrcode';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const hotelId = searchParams.get('hotelId');
  if (!hotelId) return NextResponse.json({ error: 'Missing hotelId' }, { status: 400 });

  const { data: rooms, error } = await supabase.from('Room').select('*').eq('hotelId', hotelId);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(rooms || []);
}

export async function POST(request: Request) {
  try {
    const { hotelId, roomNumber } = await request.json();
    if (!hotelId || !roomNumber) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    // Generate link based on the production URL natively
    const protocol = request.headers.get('x-forwarded-proto') || 'http';
    const host = request.headers.get('host') || 'localhost:3000';
    const link = `${protocol}://${host}/complaint?room=${roomNumber}&hotel=${hotelId}`;
    const qrCode = await QRCode.toDataURL(link);

    const { data: room, error } = await supabase.from('Room').insert([{
      hotelId,
      roomNumber,
      qrCode
    }]).select().maybeSingle();

    if (error || !room) throw new Error(error?.message || 'Failed to create room');

    return NextResponse.json(room, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Server Error' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

  const { error } = await supabase.from('Room').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
