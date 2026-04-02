"use client";

import { useSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  image: string;
  usageCount: number;
  monthlyUsage: number;
  monthlyLimit: number;
  remaining: number;
  plan: string;
  planExpiresAt: string | null;
  isSubscribed: boolean;
  createdAt: string;
}

interface ProcessingRecord {
  id: string;
  createdAt: string;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function UsageBar({ used, limit }: { used: number; limit: number }) {
  const pct = Math.min(100, Math.round((used / limit) * 100));
  const color =
    pct >= 100
      ? "bg-red-500"
      : pct >= 60
      ? "bg-yellow-500"
      : "bg-violet-500";
  return (
    <div className="w-full bg-gray-800 rounded-full h-2">
      <div
        className={`${color} h-2 rounded-full transition-all`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [records, setRecords] = useState<ProcessingRecord[]>([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/api/auth/signin?callbackUrl=/profile");
    }
  }, [status, router]);

  useEffect(() => {
    if (!session) return;
    Promise.all([
      fetch("/api/user/profile").then((r) => r.json()),
      fetch("/api/user/records").then((r) => r.json()),
    ]).then(([profileData, recordsData]) => {
      setProfile(profileData);
      setRecords(recordsData.records ?? []);
      setTotalRecords(recordsData.total ?? 0);
      setLoading(false);
    });
  }, [session]);

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!session || !profile) return null;

  const plan = profile.plan ?? "free";
  const isSubscribed = profile.isSubscribed;
  const monthlyUsage = profile.monthlyUsage ?? 0;
  const monthlyLimit = profile.monthlyLimit ?? 5;
  const remaining = profile.remaining ?? 0;
  const usedCount = profile.usageCount; // lifetime total for Account card

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Nav */}
      <nav className="border-b border-gray-800 px-6 py-4">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-pink-500 rounded-lg" />
            <span className="font-bold text-xl">BG Remover</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href="/tool"
              className="text-gray-400 hover:text-white text-sm transition-colors"
            >
              ← Back to Tool
            </Link>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="text-gray-500 hover:text-white text-sm transition-colors"
            >
              Sign out
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-12 space-y-6">
        {/* Profile Card */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 flex items-center gap-5">
          {profile.image ? (
            <img
              src={profile.image}
              alt="avatar"
              className="w-16 h-16 rounded-full ring-2 ring-violet-500/40"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center text-2xl font-bold">
              {profile.name?.[0] ?? "U"}
            </div>
          )}
          <div className="flex-1">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-xl font-bold">{profile.name}</h1>
              {plan === "pro" ? (
                <span className="text-xs font-semibold bg-gradient-to-r from-violet-500 to-pink-500 text-white px-2.5 py-0.5 rounded-full">
                  PRO
                </span>
              ) : plan === "basic" ? (
                <span className="text-xs font-semibold bg-blue-500 text-white px-2.5 py-0.5 rounded-full">
                  BASIC
                </span>
              ) : (
                <span className="text-xs font-medium bg-gray-800 text-gray-400 px-2.5 py-0.5 rounded-full border border-gray-700">
                  Free
                </span>
              )}
            </div>
            <p className="text-gray-400 text-sm mt-0.5">{profile.email}</p>
            <p className="text-gray-600 text-xs mt-1">
              Member since {formatDate(profile.createdAt)} · Google Account
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Usage Stats */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <h2 className="font-semibold mb-4 flex items-center gap-2">
              <span className="text-lg">📊</span> This Month
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between items-end">
                <div>
                  <span className="text-3xl font-bold text-violet-400">{monthlyUsage}</span>
                  <span className="text-gray-500 text-lg font-normal"> / {monthlyLimit}</span>
                </div>
                <span className="text-sm text-gray-400">{remaining} left</span>
              </div>
              <UsageBar used={monthlyUsage} limit={monthlyLimit} />
              <p className="text-gray-600 text-xs">
                {plan === "free"
                  ? "5 free removals · resets never (one-time)"
                  : `Resets monthly · ${plan === "pro" ? "Pro" : "Basic"} plan`}
              </p>
            </div>
          </div>

          {/* Account Info */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <h2 className="font-semibold mb-4 flex items-center gap-2">
              <span className="text-lg">🔐</span> Account
            </h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Sign-in method</span>
                <span className="flex items-center gap-1.5">
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Google
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Total processed</span>
                <span className="font-medium">{usedCount} images</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Plan</span>
                <span className={plan === "pro" ? "text-violet-400 font-medium" : plan === "basic" ? "text-blue-400 font-medium" : "text-gray-300"}>
                  {plan === "pro" ? "Pro" : plan === "basic" ? "Basic" : "Free"}
                </span>
              </div>
              {profile.planExpiresAt && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Renews</span>
                  <span className="text-gray-300">{formatDate(profile.planExpiresAt)}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Processing History */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <h2 className="font-semibold mb-4 flex items-center gap-2">
            <span className="text-lg">🕐</span> Processing History
            <span className="ml-auto text-xs text-gray-600 font-normal">{totalRecords} total</span>
          </h2>
          {records.length === 0 ? (
            <p className="text-gray-600 text-sm text-center py-6">
              No images processed yet.{" "}
              <Link href="/tool" className="text-violet-400 hover:underline">
                Try it now →
              </Link>
            </p>
          ) : (
            <div className="divide-y divide-gray-800">
              {records.map((r, i) => (
                <div key={r.id} className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center text-sm">
                      🖼️
                    </div>
                    <div>
                      <p className="text-sm font-medium">Background Removed</p>
                      <p className="text-xs text-gray-500">{formatDate(r.createdAt)}</p>
                    </div>
                  </div>
                  <span className="text-xs text-gray-600">#{totalRecords - i}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Upgrade CTA — only for free/basic users */}
        {plan === "free" && (
          <div id="upgrade" className="bg-gradient-to-br from-violet-900/40 to-pink-900/40 border border-violet-500/30 rounded-2xl p-8">
            <div className="text-center mb-8">
              <div className="text-4xl mb-3">🚀</div>
              <h2 className="text-2xl font-bold mb-2">Upgrade Your Plan</h2>
              <p className="text-gray-400">
                More removals every month. Cancel anytime.
              </p>
            </div>

            {/* Pricing Cards */}
            <div className="grid md:grid-cols-2 gap-4 max-w-2xl mx-auto mb-6">
              {/* Basic */}
              <div className="bg-gray-900/60 border border-gray-700 rounded-xl p-5 flex flex-col">
                <div className="text-gray-400 text-sm font-medium mb-1">Basic</div>
                <div className="text-3xl font-bold mb-1">
                  $2.99<span className="text-gray-500 text-lg font-normal">/mo</span>
                </div>
                <div className="text-gray-500 text-xs mb-5">200 removals/month · Cancel anytime</div>
                <div className="mt-auto">
                  <div className="w-full flex items-center justify-center gap-2 border border-dashed border-gray-600 text-gray-500 py-2 rounded-lg text-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse" />
                    Payment coming soon
                  </div>
                </div>
              </div>

              {/* Pro — highlighted */}
              <div className="bg-gradient-to-b from-violet-900/50 to-pink-900/30 border border-violet-500/50 rounded-xl p-5 relative flex flex-col">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-gradient-to-r from-violet-500 to-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                    BEST VALUE
                  </span>
                </div>
                <div className="text-violet-300 text-sm font-medium mb-1 mt-2">Pro</div>
                <div className="text-3xl font-bold mb-0.5">
                  $6.99<span className="text-gray-400 text-lg font-normal">/mo</span>
                </div>
                <div className="text-violet-400 text-xs mb-5">600 removals/month · Cancel anytime</div>
                <div className="mt-auto">
                  <div className="w-full flex items-center justify-center gap-2 border border-dashed border-violet-500/40 text-violet-400/70 py-2 rounded-lg text-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
                    Payment coming soon
                  </div>
                </div>
              </div>
            </div>

            {/* Feature list */}
            <ul className="max-w-xs mx-auto space-y-2 text-sm text-gray-400">
              {[
                "✅ More removals every month",
                "✅ Highest quality output",
                "✅ Priority processing",
                "✅ Cancel anytime",
              ].map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
          </div>
        )}
        {plan === "basic" && (
          <div id="upgrade" className="bg-gradient-to-br from-violet-900/40 to-pink-900/40 border border-violet-500/30 rounded-2xl p-8">
            <div className="text-center mb-6">
              <div className="text-4xl mb-3">⚡</div>
              <h2 className="text-xl font-bold mb-2">Upgrade to Pro</h2>
              <p className="text-gray-400 text-sm">Get 600 removals/month for just $6.99.</p>
            </div>
            <div className="max-w-xs mx-auto">
              <div className="bg-gradient-to-b from-violet-900/50 to-pink-900/30 border border-violet-500/50 rounded-xl p-5">
                <div className="text-violet-300 text-sm font-medium mb-1">Pro</div>
                <div className="text-3xl font-bold mb-0.5">
                  $6.99<span className="text-gray-400 text-lg font-normal">/mo</span>
                </div>
                <div className="text-violet-400 text-xs mb-4">600 removals/month</div>
                <div className="w-full flex items-center justify-center gap-2 border border-dashed border-violet-500/40 text-violet-400/70 py-2 rounded-lg text-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
                  Payment coming soon
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
