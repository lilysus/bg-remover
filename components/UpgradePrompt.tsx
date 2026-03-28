export default function UpgradePrompt() {
  return (
    <div className="bg-gradient-to-br from-violet-900/30 to-pink-900/30 border border-violet-500/30 rounded-2xl p-8 text-center">
      <div className="text-4xl mb-4">🚀</div>
      <h2 className="text-xl font-bold text-white mb-2">You've used all 5 free removals</h2>
      <p className="text-gray-400 mb-6">
        Upgrade to Pro for unlimited background removals at lightning speed.
      </p>
      <button
        disabled
        className="bg-gradient-to-r from-violet-600 to-pink-600 text-white px-8 py-3 rounded-xl font-semibold opacity-50 cursor-not-allowed"
      >
        Upgrade with PayPal — Coming Soon
      </button>
      <p className="text-gray-600 text-xs mt-3">PayPal payment integration coming soon</p>
    </div>
  );
}
