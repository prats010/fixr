import { NextResponse } from 'next/server';
import supabase from '@/lib/db';

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  const params = await context.params;
  try {
    const { data: complaint, error } = await supabase.from('Complaint').select('*').eq('id', params.id).maybeSingle();

    if (error || !complaint) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    return NextResponse.json(complaint);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const params = await context.params;
  try {
    const data = await request.json();
    const { status, staffAction, staffId } = data;

    const updatedData: any = {};
    if (status) updatedData.status = status;
    if (staffAction !== undefined) updatedData.staffAction = staffAction;
    if (staffId) updatedData.staffId = staffId;
    
    if (status === 'Resolved') {
        updatedData.resolvedAt = new Date().toISOString();
    }

    const { data: complaint, error } = await supabase.from('Complaint').update(updatedData).eq('id', params.id).select().maybeSingle();

    if (error) {
      throw new Error(error.message);
    }

    return NextResponse.json(complaint);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
