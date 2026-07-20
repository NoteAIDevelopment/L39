import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { User } from "@/lib/models";
import { hashPassword, signJwt } from "@/lib/auth";

const fallbackUsers: Array<Record<string, unknown>> = [];

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const db = await connectToDatabase();

    if (db) {
      const existing = await User.findOne({ email: payload.email });
      if (existing) {
        return NextResponse.json({ success: false, message: "An account already exists for that email." }, { status: 400 });
      }

      const passwordHash = await hashPassword(payload.password);
      const user = await User.create({
        name: payload.name,
        email: payload.email,
        passwordHash,
        role: "Customer",
        emailVerified: false,
      });

      const token = signJwt({ email: user.email, role: user.role });
      return NextResponse.json({ success: true, message: "Account created successfully.", token, user: { name: user.name, email: user.email, role: user.role } }, { status: 201 });
    }

    const existing = fallbackUsers.find((entry) => entry.email === payload.email);
    if (existing) {
      return NextResponse.json({ success: false, message: "An account already exists for that email." }, { status: 400 });
    }

    const passwordHash = await hashPassword(payload.password);
    fallbackUsers.push({ name: payload.name, email: payload.email, role: "Customer", passwordHash });
    const token = signJwt({ email: payload.email, role: "Customer" });
    return NextResponse.json({ success: true, message: "Account created successfully in demo mode.", token, user: { name: payload.name, email: payload.email, role: "Customer" } }, { status: 201 });
  } catch {
    return NextResponse.json({ success: false, message: "Unable to create account." }, { status: 500 });
  }
}
