export const runtime = 'nodejs';

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getUserUsage, getOrCreateUser, incrementUserUsage } from "@/lib/db";
import { removeBackground } from "@/lib/remove-bg";

const FREE_LIMIT = 5;

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const email = session.user.email;

  // Get or create user
  const user = await getOrCreateUser(email, session.user.name, session.user.image);

  if (user.usageCount >= FREE_LIMIT) {
    return NextResponse.json(
      { error: "Free limit reached. Please upgrade to continue.", code: "LIMIT_REACHED" },
      { status: 402 }
    );
  }

  // Parse image from multipart form
  let imageBuffer: Buffer;
  try {
    const formData = await req.formData();
    const file = formData.get("image") as File | null;
    if (!file) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }
    const arrayBuffer = await file.arrayBuffer();
    imageBuffer = Buffer.from(arrayBuffer);
  } catch {
    return NextResponse.json({ error: "Failed to read image" }, { status: 400 });
  }

  // Call Remove.bg
  let resultBuffer: Buffer;
  try {
    resultBuffer = await removeBackground(imageBuffer);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Background removal failed" }, { status: 500 });
  }

  // Increment usage
  const newCount = await incrementUserUsage(email);

  const base64 = resultBuffer.toString("base64");
  return NextResponse.json({
    image: `data:image/png;base64,${base64}`,
    usageCount: newCount,
    remaining: Math.max(0, FREE_LIMIT - newCount),
  });
}
