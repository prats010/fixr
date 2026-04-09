import { NextResponse } from 'next/server';
import supabase from '@/lib/db';
import { hashPassword } from '@/lib/auth';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const hotelId = searchParams.get('hotelId');
  if (!hotelId) return NextResponse.json({ error: 'Missing hotelId' }, { status: 400 });

  const { data: staff, error } = await supabase.from('Staff').select('id, name, email, role').eq('hotelId', hotelId);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(staff || []);
}

export async function POST(request: Request) {
  try {
    const { hotelId, name, email, password, role } = await request.json();
    
    const hashed = await hashPassword(password);

    const { data: newStaff, error } = await supabase.from('Staff').insert([{
        hotelId,
        name,
        email,
        password: hashed,
        role: role || 'staff'
    }]).select('id, name, email, role').maybeSingle();

    if (error || !newStaff) throw new Error(error?.message || 'Failed to create staff');

    return NextResponse.json(newStaff, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Server Error or Duplicate Email' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
    
    const { error } = await supabase.from('Staff').delete().eq('id', id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
}
