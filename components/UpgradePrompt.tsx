import Link from "next/link";
import { PlanKey } from "@/lib/db";

interface Props {
  currentPlan?: PlanKey;
}

export default function UpgradePrompt({ currentPlan = "free" }: Props) {
  const isBasic = currentPlan === "basic";
  const isPro = currentPlan === "pro";

  return (
    <div className="bg-gradient-to-br from-violet-900/30 to-pink-900/30 border border-violet-500/30 rounded-2xl p-8 text-center">
      <div className="text-4xl mb-4">{isBasic ? "⚡" : isPro ? "🏆" : "🚀"}</div>
      <h2 className="text-xl font-bold text-white mb-2">
        {isPro
          ? "You've hit your Pro limit (600/month)"
          : isBasic
          ? "You've hit your Basic limit (200/month)"
          : "You've used all 5 free removals"}
      </h2>
      <p className="text-gray-400 mb-8">
        {isPro
          ? "Your quota resets at the start of your next billing cycle."
          : isBasic
          ? "Upgrade to Pro for 600 removals per month."
          : "Choose a plan to keep removing backgrounds."}
      </p>

      {!isPro && (
        <div className="grid md:grid-cols-2 gap-4 max-w-sm mx-auto mb-4">
          {/* Basic — only show for free users */}
          {!isBasic && (
            <div className="bg-gray-900/60 border border-gray-700 rounded-xl p-4">
              <div className="text-gray-300 text-sm font-medium mb-1">Basic</div>
              <div className="text-2xl font-bold mb-0.5">
                $2.99<span className="text-gray-500 text-sm font-normal">/mo</span>
              </div>
              <div className="text-gray-500 text-xs mb-3">200 removals/month</div>
              <button
                disabled
                className="w-full border border-violet-500/50 text-violet-400 py-1.5 rounded-lg text-xs font-medium opacity-60 cursor-not-allowed"
              >
                Coming Soon
              </button>
            </div>
          )}

          {/* Pro */}
          <div className={`bg-gradient-to-b from-violet-900/50 to-pink-900/30 border border-violet-500/50 rounded-xl p-4 ${isBasic ? "md:col-span-2 max-w-[200px] mx-auto" : ""}`}>
            <div className="text-violet-300 text-sm font-medium mb-1">Pro</div>
            <div className="text-2xl font-bold mb-0.5">
              $6.99<span className="text-gray-400 text-sm font-normal">/mo</span>
            </div>
            <div className="text-violet-400 text-xs mb-3">600 removals/month</div>
            <button
              disabled
              className="w-full bg-gradient-to-r from-violet-600 to-pink-600 text-white py-1.5 rounded-lg text-xs font-semibold opacity-60 cursor-not-allowed"
            >
              Coming Soon
            </button>
          </div>
        </div>
      )}

      <Link href="/profile#upgrade" className="text-violet-400 hover:underline text-sm">
        View all plans →
      </Link>
      <p className="text-gray-600 text-xs mt-2">PayPal payment integration coming soon</p>
    </div>
  );
}
