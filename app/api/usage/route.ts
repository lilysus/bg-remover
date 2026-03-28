export const runtime = 'nodejs';

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { usageCount: true },
  });
  const FREE_LIMIT = 5;
  return NextResponse.json({
    usageCount: user?.usageCount ?? 0,
    remaining: Math.max(0, FREE_LIMIT - (user?.usageCount ?? 0)),
    limit: FREE_LIMIT,
  });
}
