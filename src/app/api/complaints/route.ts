import { NextResponse } from 'next/server';
import supabase from '@/lib/db';
import { getResolutionSuggestion } from '@/lib/gemini';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { hotelId, room, category, description, guestName } = data;

    if (!hotelId || !room || !category) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Verify hotel and room exist
    const { data: roomRecord } = await supabase.from('Room').select('*').eq('hotelId', hotelId).eq('roomNumber', room).maybeSingle();

    if (!roomRecord) {
      return NextResponse.json({ error: 'Invalid room or hotel' }, { status: 404 });
    }

    // Get AI suggestion
    const aiSuggestion = await getResolutionSuggestion(category, description);

    // Create complaint
    const { data: complaint, error } = await supabase.from('Complaint').insert([{
        hotelId,
        room,
        category,
        description,
        guestName,
        status: 'New',
        aiSuggestion
    }]).select().maybeSingle();

    if (error || !complaint) throw new Error(error?.message || 'Failed to create');

    // Send SSE event
    try {
        const streamResponse = await fetch(`http://localhost:3000/api/complaints/stream?action=notify`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(complaint)
        });
    } catch(e) { /* ignore SSE error if stream server isn't up */ }

    return NextResponse.json(complaint, { status: 201 });
  } catch (error) {
    console.error('Error creating complaint:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const hotelId = searchParams.get('hotelId');
  const status = searchParams.get('status');

  if (!hotelId) {
    return NextResponse.json({ error: 'Missing hotelId' }, { status: 400 });
  }

  try {
    let query = supabase.from('Complaint').select('*').eq('hotelId', hotelId).order('createdAt', { ascending: false });
    if (status) query = query.eq('status', status);

    const { data: complaints, error } = await query;
    if (error) throw new Error(error.message);

    return NextResponse.json(complaints || []);
  } catch (error) {
    console.error('Error fetching complaints:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
