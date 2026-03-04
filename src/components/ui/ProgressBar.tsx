interface ProgressBarProps {
  value: number; // 0-100
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  colorClass?: string;
}

export function ProgressBar({ value, size = "md", showLabel = true, colorClass }: ProgressBarProps) {
  const clampedValue = Math.min(100, Math.max(0, value));

  const heightClass = {
    sm: "h-1.5",
    md: "h-2.5",
    lg: "h-4",
  }[size];

  const autoColor =
    colorClass ??
    (clampedValue >= 80
      ? "bg-emerald-500"
      : clampedValue >= 50
      ? "bg-amber-500"
      : "bg-red-500");

  return (
    <div className="flex items-center gap-2">
      <div className={`flex-1 bg-gray-200 rounded-full overflow-hidden ${heightClass}`}>
        <div
          className={`${heightClass} rounded-full transition-all duration-500 ${autoColor}`}
          style={{ width: `${clampedValue}%` }}
        />
      </div>
      {showLabel && (
        <span className="text-xs font-semibold text-gray-700 w-10 text-right">
          {clampedValue}%
        </span>
      )}
    </div>
  );
}
