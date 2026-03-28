interface Props {
  remaining: number;
}

export default function UsageBadge({ remaining }: Props) {
  const color =
    remaining === 0
      ? "bg-red-500/10 border-red-500/30 text-red-400"
      : remaining <= 2
      ? "bg-yellow-500/10 border-yellow-500/30 text-yellow-400"
      : "bg-green-500/10 border-green-500/30 text-green-400";

  return (
    <span className={`text-xs font-medium px-3 py-1 rounded-full border ${color}`}>
      {remaining === 0 ? "No free uses left" : `${remaining} free use${remaining !== 1 ? "s" : ""} left`}
    </span>
  );
}
