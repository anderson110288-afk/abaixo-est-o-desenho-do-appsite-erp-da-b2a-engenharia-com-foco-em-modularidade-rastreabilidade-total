import type { ReactNode } from "react";

interface KpiCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: ReactNode;
  colorClass?: string;
  trend?: "up" | "down" | "neutral";
}

export function KpiCard({ title, value, subtitle, icon, colorClass = "bg-blue-50 text-blue-600", trend }: KpiCardProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm flex items-start gap-4">
      <div className={`rounded-lg p-2.5 ${colorClass} flex-shrink-0`}>
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs text-gray-500 font-medium uppercase tracking-wide truncate">{title}</p>
        <p className="text-2xl font-bold text-gray-900 mt-0.5">{value}</p>
        {subtitle && (
          <p className={`text-xs mt-0.5 ${trend === "up" ? "text-red-500" : trend === "down" ? "text-emerald-500" : "text-gray-500"}`}>
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}
