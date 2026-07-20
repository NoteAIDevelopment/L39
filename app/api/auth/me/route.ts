import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { verifyJwt } from "@/lib/auth";

export async function GET() {
  try {
    const headerList = await headers();
    const authHeader = headerList.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ success: false, message: "No token supplied" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const payload = verifyJwt(token);
    return NextResponse.json({ success: true, user: { email: payload.email, role: payload.role } });
  } catch {
    return NextResponse.json({ success: false, message: "Invalid or expired token" }, { status: 401 });
  }
}
