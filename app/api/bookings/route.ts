import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { Booking } from "@/lib/models";

const fallbackBookings: Array<Record<string, unknown>> = [];

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const db = await connectToDatabase();

    if (db) {
      const booking = await Booking.create(payload);
      return NextResponse.json(
        { success: true, message: "Your booking request has been received.", booking },
        { status: 201 },
      );
    }

    fallbackBookings.push({ ...payload, createdAt: new Date().toISOString() });
    return NextResponse.json(
      { success: true, message: "Your booking request has been received in demo mode.", booking: payload },
      { status: 201 },
    );
  } catch {
    return NextResponse.json({ success: false, message: "Unable to create booking." }, { status: 500 });
  }
}

export async function GET() {
  try {
    const db = await connectToDatabase();

    if (db) {
      const bookings = await Booking.find().sort({ createdAt: -1 }).lean();
      return NextResponse.json(bookings);
    }

    return NextResponse.json(fallbackBookings);
  } catch {
    return NextResponse.json([], { status: 500 });
  }
}
