import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const hotelId = searchParams.get('hotelId');

  if (!hotelId) {
    return NextResponse.json({ error: 'Missing hotelId' }, { status: 400 });
  }

  try {
    const complaints = await prisma.complaint.findMany({
      where: { hotelId }
    });

    const total = complaints.length;
    const resolved = complaints.filter(c => c.status === 'Resolved').length;

    // Calculate Average Resolution Time
    let totalTime = 0;
    let resolvedCount = 0;
    complaints.forEach(c => {
      if (c.status === 'Resolved' && c.resolvedAt && c.createdAt) {
         totalTime += (new Date(c.resolvedAt).getTime() - new Date(c.createdAt).getTime());
         resolvedCount++;
      }
    });
    
    // Average time in minutes
    const avgResolutionTime = resolvedCount > 0 ? Math.round(totalTime / resolvedCount / (1000 * 60)) : 0;

    // Heatmap (Category Counts)
    const categoryCounts: Record<string, number> = {};
    const roomCounts: Record<string, number> = {};

    complaints.forEach(c => {
       categoryCounts[c.category] = (categoryCounts[c.category] || 0) + 1;
       roomCounts[c.room] = (roomCounts[c.room] || 0) + 1;
    });

    // Top Category
    let topCategory = 'None';
    let maxCat = 0;
    Object.entries(categoryCounts).forEach(([cat, count]) => {
      if (count > maxCat) {
        maxCat = count;
        topCategory = cat;
      }
    });

    // Top Room (Most complaints)
    let topRoom = 'None';
    let maxRoom = 0;
    Object.entries(roomCounts).forEach(([room, count]) => {
        if (count > maxRoom) {
            maxRoom = count;
            topRoom = room;
        }
    });

    return NextResponse.json({
      summary: {
        total,
        resolved,
        avgResolutionTime,
        topCategory,
        topRoom
      },
      categoryCounts,
      roomCounts,
      recentComplaints: complaints.sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 10)
    });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
