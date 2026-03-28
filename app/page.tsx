import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function HomePage() {
  const session = await getServerSession(authOptions);

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Nav */}
      <nav className="border-b border-gray-800 px-6 py-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-pink-500 rounded-lg" />
            <span className="font-bold text-xl">BG Remover</span>
          </div>
          <div>
            {session ? (
              <Link
                href="/tool"
                className="bg-violet-600 hover:bg-violet-700 text-white px-5 py-2 rounded-lg font-medium transition-colors"
              >
                Open Tool →
              </Link>
            ) : (
              <Link
                href="/api/auth/signin"
                className="bg-violet-600 hover:bg-violet-700 text-white px-5 py-2 rounded-lg font-medium transition-colors"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-24 pb-20 text-center">
        <div className="inline-block bg-violet-500/10 border border-violet-500/30 text-violet-400 text-sm px-4 py-1.5 rounded-full mb-6">
          ✨ Powered by Remove.bg AI
        </div>
        <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight">
          Remove Image Background
          <br />
          <span className="bg-gradient-to-r from-violet-400 to-pink-400 bg-clip-text text-transparent">
            Instantly
          </span>
        </h1>
        <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
          Free for your first 5 images. No credit card required. Upload any photo and get a clean transparent PNG in seconds.
        </p>
        <Link
          href={session ? "/tool" : "/api/auth/signin"}
          className="inline-block bg-gradient-to-r from-violet-600 to-pink-600 hover:from-violet-500 hover:to-pink-500 text-white px-10 py-4 rounded-xl font-bold text-lg transition-all transform hover:scale-105 shadow-lg shadow-violet-500/25"
        >
          {session ? "Start Removing Backgrounds →" : "Get Started Free →"}
        </Link>
        <p className="text-gray-500 mt-4 text-sm">Sign in with Google • No credit card needed</p>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: "⚡",
              title: "Lightning Fast",
              desc: "Get results in under 5 seconds. No waiting, no queue.",
            },
            {
              icon: "🎯",
              title: "Pixel Perfect",
              desc: "AI accurately detects hair, fur, and complex edges.",
            },
            {
              icon: "🆓",
              title: "Free to Start",
              desc: "5 free images when you sign up. No credit card required.",
            },
          ].map((f) => (
            <div
              key={f.title}
              className="bg-gray-900 border border-gray-800 rounded-2xl p-8 hover:border-violet-500/50 transition-colors"
            >
              <div className="text-4xl mb-4">{f.icon}</div>
              <h3 className="text-xl font-bold mb-2">{f.title}</h3>
              <p className="text-gray-400">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-6xl mx-auto px-6 py-20 text-center">
        <h2 className="text-3xl font-bold mb-12">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { step: "1", title: "Upload Image", desc: "Drag & drop or click to upload your JPG, PNG, or WebP" },
            { step: "2", title: "AI Processing", desc: "Our AI instantly detects and removes the background" },
            { step: "3", title: "Download PNG", desc: "Get your transparent PNG file with one click" },
          ].map((s) => (
            <div key={s.step} className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-violet-600 flex items-center justify-center font-bold text-xl mb-4">
                {s.step}
              </div>
              <h3 className="font-bold text-lg mb-2">{s.title}</h3>
              <p className="text-gray-400">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-10 text-center text-gray-500 text-sm">
        <p>© 2024 BG Remover. Built with Next.js + Remove.bg API.</p>
      </footer>
    </div>
  );
}
