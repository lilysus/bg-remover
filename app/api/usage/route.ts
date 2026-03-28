export const runtime = 'nodejs';

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getUserUsage, getOrCreateUser } from "@/lib/db";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const FREE_LIMIT = 5;
  const user = await getOrCreateUser(session.user.email, session.user.name, session.user.image);
  return NextResponse.json({
    usageCount: user.usageCount,
    remaining: Math.max(0, FREE_LIMIT - user.usageCount),
    limit: FREE_LIMIT,
  });
}
