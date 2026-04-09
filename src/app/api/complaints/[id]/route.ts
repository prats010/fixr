import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  const params = await context.params;
  try {
    const complaint = await prisma.complaint.findUnique({
      where: { id: params.id }
    });

    if (!complaint) {
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
        updatedData.resolvedAt = new Date();
    }

    const complaint = await prisma.complaint.update({
      where: { id: params.id },
      data: updatedData
    });

    return NextResponse.json(complaint);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
