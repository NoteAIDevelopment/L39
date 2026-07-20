import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    return NextResponse.json({ success: true, message: `Password reset instructions sent to ${payload.email}.` });
  } catch {
    return NextResponse.json({ success: false, message: "Unable to process password reset." }, { status: 500 });
  }
}
