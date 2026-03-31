import { neon } from "@neondatabase/serverless";

const FREE_LIMIT = 5;

function sql() {
  return neon(process.env.DATABASE_URL!);
}

// ─── User ─────────────────────────────────────────────────────────────────────

export async function getOrCreateUser(
  email: string,
  name?: string | null,
  image?: string | null
) {
  const db = sql();
  const existing = await db`
    SELECT id, email, "usageCount", "isPro", "proExpiresAt", "createdAt"
    FROM "User" WHERE email = ${email} LIMIT 1
  `;
  if (existing.length > 0) return existing[0];

  const created = await db`
    INSERT INTO "User" (id, email, name, image, "usageCount", "isPro", "createdAt")
    VALUES (gen_random_uuid()::text, ${email}, ${name ?? null}, ${image ?? null}, 0, false, NOW())
    RETURNING id, email, "usageCount", "isPro", "proExpiresAt", "createdAt"
  `;
  return created[0];
}

export async function getUserProfile(email: string) {
  const db = sql();
  const result = await db`
    SELECT id, name, email, image, "usageCount", "isPro", "proExpiresAt", "createdAt"
    FROM "User" WHERE email = ${email} LIMIT 1
  `;
  if (result.length === 0) return null;
  const u = result[0];
  const isProActive = u.isPro && (!u.proExpiresAt || new Date(u.proExpiresAt) > new Date());
  return {
    ...u,
    isProActive,
    remaining: isProActive ? Infinity : Math.max(0, FREE_LIMIT - u.usageCount),
    limit: FREE_LIMIT,
  };
}

export async function getUserUsage(
  email: string
): Promise<{ usageCount: number; id: string; isPro: boolean; proExpiresAt: Date | null } | null> {
  const db = sql();
  const result = await db`
    SELECT id, "usageCount", "isPro", "proExpiresAt"
    FROM "User" WHERE email = ${email} LIMIT 1
  `;
  if (result.length === 0) return null;
  return {
    id: result[0].id,
    usageCount: result[0].usageCount,
    isPro: result[0].isPro,
    proExpiresAt: result[0].proExpiresAt,
  };
}

export async function incrementUserUsage(email: string): Promise<number> {
  const db = sql();
  const result = await db`
    UPDATE "User" SET "usageCount" = "usageCount" + 1
    WHERE email = ${email}
    RETURNING "usageCount"
  `;
  return result[0]?.usageCount ?? 0;
}

// ─── Processing Records ────────────────────────────────────────────────────────

export async function addProcessingRecord(userId: string) {
  const db = sql();
  await db`
    INSERT INTO "ProcessingRecord" (id, "userId", "createdAt")
    VALUES (gen_random_uuid()::text, ${userId}, NOW())
  `;
}

export async function getProcessingRecords(
  userId: string,
  page = 1,
  pageSize = 10
) {
  const db = sql();
  const offset = (page - 1) * pageSize;
  const [records, countResult] = await Promise.all([
    db`
      SELECT id, "createdAt" FROM "ProcessingRecord"
      WHERE "userId" = ${userId}
      ORDER BY "createdAt" DESC
      LIMIT ${pageSize} OFFSET ${offset}
    `,
    db`
      SELECT COUNT(*) as total FROM "ProcessingRecord"
      WHERE "userId" = ${userId}
    `,
  ]);
  return {
    records,
    total: parseInt(countResult[0].total),
    page,
    pageSize,
  };
}
