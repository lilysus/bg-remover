"use client";

import { useSession, signOut } from "next-auth/react";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import ImageUploader from "@/components/ImageUploader";
import BeforeAfterSlider from "@/components/BeforeAfterSlider";
import UsageBadge from "@/components/UsageBadge";
import UpgradePrompt from "@/components/UpgradePrompt";

export default function ToolPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [limitReached, setLimitReached] = useState(false);
  const [remaining, setRemaining] = useState<number | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/api/auth/signin?callbackUrl=/tool");
    }
  }, [status, router]);

  const fetchUsage = useCallback(async () => {
    const res = await fetch("/api/usage");
    if (res.ok) {
      const data = await res.json();
      setRemaining(data.remaining);
      if (data.remaining <= 0) setLimitReached(true);
    }
  }, []);

  useEffect(() => {
    if (session) fetchUsage();
  }, [session, fetchUsage]);

  const handleUpload = async (file: File) => {
    setError(null);
    setResultImage(null);

    const reader = new FileReader();
    reader.onload = (e) => setOriginalImage(e.target?.result as string);
    reader.readAsDataURL(file);

    setLoading(true);
    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await fetch("/api/remove-bg", { method: "POST", body: formData });
      const data = await res.json();

      if (!res.ok) {
        if (data.code === "LIMIT_REACHED") {
          setLimitReached(true);
        }
        setError(data.error || "Something went wrong");
        return;
      }

      setResultImage(data.image);
      setRemaining(data.remaining);
      if (data.remaining <= 0) setLimitReached(true);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!resultImage) return;
    const a = document.createElement("a");
    a.href = resultImage;
    a.download = "removed-background.png";
    a.click();
  };

  const handleReset = () => {
    setOriginalImage(null);
    setResultImage(null);
    setError(null);
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Nav */}
      <nav className="border-b border-gray-800 px-6 py-4">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <a href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-pink-500 rounded-lg" />
            <span className="font-bold text-xl">BG Remover</span>
          </a>
          <div className="flex items-center gap-4">
            {remaining !== null && <UsageBadge remaining={remaining} />}
            <div className="flex items-center gap-3">
              {session.user?.image && (
                <img
                  src={session.user.image}
                  alt="avatar"
                  className="w-8 h-8 rounded-full"
                />
              )}
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="text-gray-400 hover:text-white text-sm transition-colors"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-6 py-12">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold mb-2">Remove Background</h1>
          <p className="text-gray-400">Upload an image and get a transparent PNG in seconds</p>
        </div>

        {limitReached && !resultImage && <UpgradePrompt />}

        {!limitReached && !originalImage && (
          <ImageUploader onUpload={handleUpload} loading={loading} />
        )}

        {loading && (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-14 h-14 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-gray-400">Removing background...</p>
          </div>
        )}

        {error && !loading && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl p-4 text-center mb-6">
            {error}
          </div>
        )}

        {originalImage && resultImage && !loading && (
          <div className="space-y-8">
            <BeforeAfterSlider before={originalImage} after={resultImage} />
            <div className="flex justify-center gap-4">
              <button
                onClick={handleDownload}
                className="bg-gradient-to-r from-violet-600 to-pink-600 hover:from-violet-500 hover:to-pink-500 text-white px-8 py-3 rounded-xl font-semibold transition-all"
              >
                ⬇ Download PNG
              </button>
              {!limitReached && (
                <button
                  onClick={handleReset}
                  className="border border-gray-700 hover:border-gray-500 text-gray-300 px-8 py-3 rounded-xl font-semibold transition-colors"
                >
                  Upload Another
                </button>
              )}
            </div>
            {limitReached && (
              <div className="mt-6">
                <UpgradePrompt />
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
