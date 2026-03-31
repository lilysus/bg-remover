-- Migration: Add isPro, proExpiresAt to User; create ProcessingRecord table
-- Run this against your Neon PostgreSQL database

ALTER TABLE "User"
  ADD COLUMN IF NOT EXISTS "isPro" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS "proExpiresAt" TIMESTAMP WITH TIME ZONE;

CREATE TABLE IF NOT EXISTS "ProcessingRecord" (
  id           TEXT PRIMARY KEY,
  "userId"     TEXT NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
  "createdAt"  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS "ProcessingRecord_userId_createdAt_idx"
  ON "ProcessingRecord" ("userId", "createdAt" DESC);
