export const runtime = 'nodejs';

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { removeBackground } from "@/lib/remove-bg";

const FREE_LIMIT = 5;

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;

  // Check usage
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

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
    console.error("Remove.bg error:", err);
    return NextResponse.json({ error: err.message || "Background removal failed" }, { status: 500 });
  }

  // Increment usage
  await prisma.user.update({
    where: { id: userId },
    data: { usageCount: { increment: 1 } },
  });

  const base64 = resultBuffer.toString("base64");
  return NextResponse.json({
    image: `data:image/png;base64,${base64}`,
    usageCount: user.usageCount + 1,
    remaining: FREE_LIMIT - user.usageCount - 1,
  });
}
