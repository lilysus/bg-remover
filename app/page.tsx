import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function HomePage() {
  const session = await getServerSession(authOptions);

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Nav */}
      <nav className="border-b border-gray-800 px-6 py-4 sticky top-0 bg-gray-950/90 backdrop-blur z-40">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-pink-500 rounded-lg" />
            <span className="font-bold text-xl">BG Remover</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="#pricing" className="text-gray-400 hover:text-white text-sm transition-colors hidden md:block">
              Pricing
            </a>
            <a href="#faq" className="text-gray-400 hover:text-white text-sm transition-colors hidden md:block">
              FAQ
            </a>
            {session ? (
              <div className="flex items-center gap-3">
                <Link
                  href="/profile"
                  className="text-gray-400 hover:text-white text-sm transition-colors hidden md:block"
                >
                  Profile
                </Link>
                <Link
                  href="/tool"
                  className="bg-violet-600 hover:bg-violet-700 text-white px-5 py-2 rounded-lg font-medium transition-colors text-sm"
                >
                  Open Tool →
                </Link>
              </div>
            ) : (
              <Link
                href="/api/auth/signin"
                className="bg-violet-600 hover:bg-violet-700 text-white px-5 py-2 rounded-lg font-medium transition-colors text-sm"
              >
                Sign In Free
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
          Upload any photo and get a clean transparent PNG in seconds. Free for your first 5 images.
        </p>
        <Link
          href={session ? "/tool" : "/api/auth/signin"}
          className="inline-block bg-gradient-to-r from-violet-600 to-pink-600 hover:from-violet-500 hover:to-pink-500 text-white px-10 py-4 rounded-xl font-bold text-lg transition-all transform hover:scale-105 shadow-lg shadow-violet-500/25"
        >
          {session ? "Start Removing Backgrounds →" : "Get Started Free →"}
        </Link>
        <p className="text-gray-500 mt-4 text-sm">Sign in with Google · No credit card needed · 5 free removals</p>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { icon: "⚡", title: "Lightning Fast", desc: "Get results in under 5 seconds. No waiting, no queue." },
            { icon: "🎯", title: "Pixel Perfect", desc: "AI accurately detects hair, fur, and complex edges." },
            { icon: "🆓", title: "Free to Start", desc: "5 free removals when you sign up. No credit card required." },
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
      <section className="max-w-6xl mx-auto px-6 py-16 text-center">
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

      {/* Pricing */}
      <section id="pricing" className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-3">Simple Pricing</h2>
          <p className="text-gray-400">Start free. Upgrade when you need more.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {/* Free */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-7 flex flex-col">
            <div className="text-gray-400 text-sm font-medium mb-2">Free</div>
            <div className="text-4xl font-extrabold mb-1">
              $0
            </div>
            <div className="text-gray-600 text-sm mb-6">Forever free</div>
            <ul className="space-y-2.5 text-sm text-gray-400 mb-8 flex-1">
              {["5 background removals", "Standard quality", "PNG download", "Google sign-in"].map((f) => (
                <li key={f} className="flex items-center gap-2">
                  <span className="text-green-500">✓</span> {f}
                </li>
              ))}
            </ul>
            <Link
              href={session ? "/tool" : "/api/auth/signin"}
              className="block text-center border border-gray-700 hover:border-gray-500 text-gray-300 hover:text-white py-2.5 rounded-xl text-sm font-medium transition-colors"
            >
              {session ? "Go to Tool" : "Get Started"}
            </Link>
          </div>

          {/* Pro Monthly */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-7 flex flex-col">
            <div className="text-gray-400 text-sm font-medium mb-2">Pro Monthly</div>
            <div className="text-4xl font-extrabold mb-1">
              $9<span className="text-gray-500 text-xl font-normal">/mo</span>
            </div>
            <div className="text-gray-600 text-sm mb-6">Billed monthly</div>
            <ul className="space-y-2.5 text-sm text-gray-400 mb-8 flex-1">
              {[
                "Unlimited removals",
                "Highest quality output",
                "No daily caps",
                "Priority processing",
                "Cancel anytime",
              ].map((f) => (
                <li key={f} className="flex items-center gap-2">
                  <span className="text-green-500">✓</span> {f}
                </li>
              ))}
            </ul>
            <button
              disabled
              className="w-full border border-violet-500/40 text-violet-400 py-2.5 rounded-xl text-sm font-medium opacity-50 cursor-not-allowed"
            >
              Coming Soon
            </button>
          </div>

          {/* Pro Yearly — highlighted */}
          <div className="bg-gradient-to-b from-violet-900/40 to-gray-900 border border-violet-500/50 rounded-2xl p-7 flex flex-col relative">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
              <span className="bg-gradient-to-r from-violet-500 to-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap">
                BEST VALUE · SAVE 45%
              </span>
            </div>
            <div className="text-violet-300 text-sm font-medium mb-2 mt-2">Pro Yearly</div>
            <div className="text-4xl font-extrabold mb-0.5">
              $59<span className="text-gray-400 text-xl font-normal">/yr</span>
            </div>
            <div className="text-violet-400 text-sm mb-6">~$4.9/month · Save $49</div>
            <ul className="space-y-2.5 text-sm text-gray-300 mb-8 flex-1">
              {[
                "Everything in Pro Monthly",
                "Best price per removal",
                "Annual billing",
                "Priority support",
              ].map((f) => (
                <li key={f} className="flex items-center gap-2">
                  <span className="text-green-400">✓</span> {f}
                </li>
              ))}
            </ul>
            <button
              disabled
              className="w-full bg-gradient-to-r from-violet-600 to-pink-600 text-white py-2.5 rounded-xl text-sm font-semibold opacity-50 cursor-not-allowed"
            >
              Coming Soon
            </button>
          </div>
        </div>
        <p className="text-center text-gray-600 text-sm mt-6">
          💳 PayPal payment integration coming soon. Join free today and be notified when Pro launches.
        </p>
      </section>

      {/* FAQ */}
      <section id="faq" className="max-w-3xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-3">Frequently Asked Questions</h2>
        </div>
        <div className="space-y-4">
          {[
            {
              q: "Do I need a credit card to sign up?",
              a: "No. Just sign in with your Google account and you get 5 free removals immediately. No credit card needed.",
            },
            {
              q: "What does '5 free removals' mean?",
              a: "Every new account gets 5 free background removals for life. Once you've used them, you'll need to upgrade to Pro for more.",
            },
            {
              q: "What image formats are supported?",
              a: "We support JPG, PNG, and WebP. Output is always a transparent PNG file.",
            },
            {
              q: "How accurate is the background removal?",
              a: "We use the Remove.bg AI, which handles complex subjects like hair, fur, and transparent objects with high precision.",
            },
            {
              q: "Will my images be stored?",
              a: "No. Your images are processed in real-time and never stored on our servers. We only save a count of how many images you've processed.",
            },
            {
              q: "When will Pro be available?",
              a: "We're integrating PayPal for payments and expect to launch Pro soon. Sign up free now and you'll be the first to know.",
            },
            {
              q: "Can I use the images commercially?",
              a: "Yes. The transparent PNGs you download are yours to use however you like, including commercial projects.",
            },
          ].map((item) => (
            <details
              key={item.q}
              className="bg-gray-900 border border-gray-800 rounded-xl group"
            >
              <summary className="px-6 py-4 cursor-pointer text-sm font-medium text-gray-200 hover:text-white list-none flex items-center justify-between select-none">
                {item.q}
                <span className="text-gray-500 group-open:rotate-180 transition-transform text-lg leading-none">
                  ›
                </span>
              </summary>
              <div className="px-6 pb-4 text-sm text-gray-400 leading-relaxed">
                {item.a}
              </div>
            </details>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="max-w-6xl mx-auto px-6 py-20 text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to remove backgrounds?</h2>
        <p className="text-gray-400 mb-8">Start free. No credit card. Results in seconds.</p>
        <Link
          href={session ? "/tool" : "/api/auth/signin"}
          className="inline-block bg-gradient-to-r from-violet-600 to-pink-600 hover:from-violet-500 hover:to-pink-500 text-white px-10 py-4 rounded-xl font-bold text-lg transition-all transform hover:scale-105 shadow-lg shadow-violet-500/25"
        >
          {session ? "Open Tool →" : "Get Started Free →"}
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-10 text-center text-gray-600 text-sm">
        <div className="flex justify-center gap-6 mb-4">
          <a href="#pricing" className="hover:text-gray-400 transition-colors">Pricing</a>
          <a href="#faq" className="hover:text-gray-400 transition-colors">FAQ</a>
          {session && (
            <Link href="/profile" className="hover:text-gray-400 transition-colors">Profile</Link>
          )}
        </div>
        <p>© 2024 BG Remover. Built with Next.js + Remove.bg API.</p>
      </footer>
    </div>
  );
}
