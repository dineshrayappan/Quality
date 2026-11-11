import React, { useMemo } from "react";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { useTranslation } from "../i18n/LanguageContext";
import { useTheme } from "../context/ThemeContext";
import { PieChart as PieIcon, Award } from "lucide-react";

ChartJS.register(ArcElement, Tooltip, Legend);

const COLOR_PALETTE = [
  "#ef4444", // Red (Broken Stitch)
  "#f97316", // Orange (Skip Stitch)
  "#f59e0b", // Amber (Open Seam)
  "#eab308", // Yellow (Puckering)
  "#10b981", // Emerald (Uneven Hem)
  "#06b6d4", // Cyan (Loose Thread)
  "#3b82f6", // Blue (Raw Edge)
  "#6366f1", // Indigo (Needle Cut)
  "#8b5cf6", // Purple (Oil Stain)
  "#d946ef", // Fuchsia (Dirt Stain)
  "#ec4899", // Pink (Color Shading)
  "#14b8a6", // Teal (Fabric Knot)
  "#84cc16", // Lime (Measurement Out)
  "#a855f7", // Violet (Label Slanted)
  "#64748b", // Slate (Others / Custom)
];

export const DefectPieChart = ({
  data = [],
  totalDefects = 0,
  title,
  subtitle,
  compact = false,
  className = "h-full",
}) => {
  const { t } = useTranslation();
  const { isDark } = useTheme();

  const resolvedTotal =
    totalDefects || data.reduce((sum, item) => sum + (Number(item.count) || 0), 0);

  const chartData = useMemo(() => {
    if (!data || data.length === 0) {
      return {
        labels: ["No defects recorded"],
        datasets: [
          {
            data: [1],
            backgroundColor: [isDark ? "#334155" : "#e2e8f0"],
            borderWidth: 0,
          },
        ],
      };
    }

    const labels = data.map((item) => `${item.name} (${item.percentage}%)`);
    const counts = data.map((item) => item.count);
    const backgroundColors = data.map(
      (_, i) => COLOR_PALETTE[i % COLOR_PALETTE.length]
    );

    return {
      labels,
      datasets: [
        {
          data: counts,
          backgroundColor: backgroundColors,
          borderColor: isDark ? "#0f172a" : "#ffffff",
          borderWidth: 2,
          hoverOffset: 8,
        },
      ],
    };
  }, [data, isDark]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: isDark ? "#0f172a" : "#ffffff",
        titleColor: isDark ? "#f8fafc" : "#0f172a",
        bodyColor: isDark ? "#94a3b8" : "#475569",
        borderColor: isDark ? "#334155" : "#cbd5e1",
        borderWidth: 1,
        padding: 12,
        boxPadding: 6,
        usePointStyle: true,
        callbacks: {
          label: (context) => {
            const item = data[context.dataIndex];
            if (!item) return "";
            return ` Count: ${item.count} pieces (${item.percentage}%)`;
          },
        },
      },
    },
  };

  return (
    <div
      className={`defect-pie-card bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl ${
        compact ? "p-4" : "p-5"
      } shadow-sm flex flex-col min-w-0 transition-colors ${className}`.trim()}
    >
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-200 dark:border-slate-800">
        <div className="min-w-0">
          <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <PieIcon className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0" />
            <span className="truncate">{title || t("pieChartTitle") || "Defect Pareto Distribution"}</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {subtitle || t("pieChartSub") || "Breakdown of recorded defects"}
          </p>
        </div>
        <div className="px-3 py-1 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 text-xs font-bold shrink-0">
          {resolvedTotal} Total Instances
        </div>
      </div>

      {data.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-slate-400">
          <PieIcon className="w-12 h-12 stroke-[1.5] mb-2 opacity-50" />
          <p className="text-sm font-medium text-slate-600 dark:text-slate-400">No defect data for this selection</p>
          <p className="text-xs text-slate-400 dark:text-slate-500">All inspected pieces are 100% OK!</p>
        </div>
      ) : (
        <div className="defect-pie-body flex-1 pt-4">
          {/* Pie Chart Canvas */}
          <div
            className={`defect-pie-chart ${compact ? "defect-pie-chart--compact" : ""}`.trim()}
          >
            <Pie data={chartData} options={chartOptions} />
          </div>

          {/* Detailed Defect Percentage Table */}
          <div
            tabIndex={0}
            role="region"
            aria-label={title || t("pieChartTitle") || "Defect Pareto Distribution"}
            className={`defect-pie-table-wrap ${
              compact ? "max-h-48" : "max-h-72"
            } border border-slate-200 dark:border-slate-800/80 rounded-xl bg-slate-50/50 dark:bg-slate-950/40`}
          >
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 dark:bg-slate-850 sticky top-0 z-10 text-slate-500 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-2.5 px-2.5 w-8">#</th>
                  <th className="py-2.5 px-2.5">{t("defectType") || "Defect"}</th>
                  <th className="py-2.5 px-2.5 text-right whitespace-nowrap">{t("occurrences") || "Count"}</th>
                  <th className="py-2.5 px-2.5 text-right whitespace-nowrap">{t("percentage") || "%"}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {data.map((item, index) => {
                  const color = COLOR_PALETTE[index % COLOR_PALETTE.length];
                  return (
                    <tr key={item.name} className="hover:bg-slate-100 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-2 px-2.5 text-slate-400 font-mono text-[11px]">
                        {index + 1}
                      </td>
                      <td className="py-2 px-2.5 min-w-[110px]">
                        <div className="flex items-center gap-2 min-w-0">
                          <span
                            className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                            style={{ backgroundColor: color }}
                          />
                          <span className="font-medium text-slate-800 dark:text-slate-200 truncate" title={item.name}>
                            {item.name}
                          </span>
                        </div>
                      </td>
                      <td className="py-2 px-2.5 text-right font-semibold text-slate-800 dark:text-slate-200 whitespace-nowrap">
                        {item.count}
                      </td>
                      <td className="py-2 px-2.5 text-right whitespace-nowrap">
                        <span className="inline-block px-2 py-0.5 rounded font-mono font-bold text-xs bg-slate-100 dark:bg-slate-800 text-blue-600 dark:text-blue-400">
                          {item.percentage}%
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
