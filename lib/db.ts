import { neon } from "@neondatabase/serverless";

export async function getOrCreateUser(email: string, name?: string | null, image?: string | null) {
  const sql = neon(process.env.DATABASE_URL!);

  // Try to get existing user
  const existing = await sql`
    SELECT id, email, "usageCount" FROM "User" WHERE email = ${email} LIMIT 1
  `;

  if (existing.length > 0) {
    return existing[0];
  }

  // Create new user
  const created = await sql`
    INSERT INTO "User" (id, email, name, image, "usageCount", "createdAt")
    VALUES (gen_random_uuid()::text, ${email}, ${name ?? null}, ${image ?? null}, 0, NOW())
    RETURNING id, email, "usageCount"
  `;

  return created[0];
}

export async function getUserUsage(email: string): Promise<{ usageCount: number; id: string } | null> {
  const sql = neon(process.env.DATABASE_URL!);
  const result = await sql`
    SELECT id, "usageCount" FROM "User" WHERE email = ${email} LIMIT 1
  `;
  if (result.length === 0) return null;
  return { id: result[0].id, usageCount: result[0].usageCount };
}

export async function incrementUserUsage(email: string): Promise<number> {
  const sql = neon(process.env.DATABASE_URL!);
  const result = await sql`
    UPDATE "User" SET "usageCount" = "usageCount" + 1
    WHERE email = ${email}
    RETURNING "usageCount"
  `;
  return result[0]?.usageCount ?? 0;
}
