export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getUserUsage, getProcessingRecords } from "@/lib/db";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const user = await getUserUsage(session.user.email);
  if (!user) return NextResponse.json({ records: [], total: 0, page: 1 });

  const page = parseInt(req.nextUrl.searchParams.get("page") ?? "1");
  const data = await getProcessingRecords(user.id, page, 10);
  return NextResponse.json(data);
}
