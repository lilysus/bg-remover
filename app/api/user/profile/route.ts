export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getUserProfile, getOrCreateUser } from "@/lib/db";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const user = await getUserProfile(session.user.email);
  if (!user) {
    // First-time: create and return
    const created = await getOrCreateUser(
      session.user.email,
      session.user.name,
      session.user.image
    );
    return NextResponse.json({ ...created, isProActive: false, remaining: 5, limit: 5 });
  }
  return NextResponse.json(user);
}
