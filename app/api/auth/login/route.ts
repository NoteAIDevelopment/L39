import { NextResponse } from "next/server";
import { comparePassword, signJwt } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import { User } from "@/lib/models";

const fallbackUsers: Array<Record<string, unknown>> = [];

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const db = await connectToDatabase();

    if (db) {
      const user = await User.findOne({ email: payload.email });
      if (!user) {
        return NextResponse.json({ success: false, message: "No account found for that email." }, { status: 404 });
      }
      const isValid = await comparePassword(payload.password, user.passwordHash);
      if (!isValid) {
        return NextResponse.json({ success: false, message: "Incorrect password." }, { status: 400 });
      }
      const token = signJwt({ email: user.email, role: user.role });
      return NextResponse.json({ success: true, message: "Signed in successfully.", token, user: { name: user.name, email: user.email, role: user.role } });
    }

    const existing = fallbackUsers.find((entry) => entry.email === payload.email);
    if (!existing) {
      return NextResponse.json({ success: false, message: "No account found for that email." }, { status: 404 });
    }
    const isValid = await comparePassword(payload.password, existing.passwordHash as string);
    if (!isValid) {
      return NextResponse.json({ success: false, message: "Incorrect password." }, { status: 400 });
    }
    const token = signJwt({ email: payload.email, role: existing.role as string });
    return NextResponse.json({ success: true, message: "Signed in successfully in demo mode.", token, user: { name: existing.name, email: payload.email, role: existing.role } });
  } catch {
    return NextResponse.json({ success: false, message: "Unable to sign in." }, { status: 500 });
  }
}
