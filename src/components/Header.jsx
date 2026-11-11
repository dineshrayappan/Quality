import React from "react";
import { useLocation } from "react-router-dom";
import { useTranslation } from "../i18n/LanguageContext";
import { useTheme } from "../context/ThemeContext";
import {
  Menu,
  Sun,
  Moon,
  Clock,
  Layers,
  Shirt,
  Tv,
  PieChart,
  ClipboardCheck,
  AlertTriangle,
} from "lucide-react";

export const Header = ({ onOpenMobile }) => {
  const { t, language } = useTranslation();
  const { theme, toggleTheme, isDark } = useTheme();
  const location = useLocation();

  const getPageInfo = () => {
    switch (location.pathname) {
      case "/":
      case "/qc":
        return { title: t("navQC") || "QC Tablet Inspection", icon: ClipboardCheck, badge: "Live Station" };
      case "/tv":
        return { title: t("navTV") || "Shop-Floor TV Dashboard", icon: Tv, badge: "Broadcast" };
      case "/dashboard":
        return { title: t("navAnalytics") || "QC Analytics & Heatmap", icon: PieChart, badge: "Reports" };
      case "/techpacks":
        return { title: t("navTechPacks") || "Buyer Tech Packs", icon: Shirt, badge: "Specifications" };
      case "/defects":
        return { title: t("navDefects") || "Defect Master Library", icon: AlertTriangle, badge: "Master Data" };
      default:
        return { title: "Garment End-Line QC", icon: Layers, badge: "System" };
    }
  };

  const page = getPageInfo();
  const Icon = page.icon;

  return (
    <header className="h-16 sticky top-0 z-30 flex items-center justify-between px-4 sm:px-6 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">

      {/* Left: Mobile Toggle & Page Info */}
      <div className="flex items-center space-x-3">
        <button
          type="button"
          onClick={onOpenMobile}
          className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
          aria-label="Open navigation sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
            <Icon className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white leading-tight">
              {page.title}
            </h1>
            <span className="hidden sm:inline-block text-[10px] font-semibold text-slate-500 dark:text-slate-400">
              Garment Export End-Line Quality Control
            </span>
          </div>
        </div>
      </div>

      {/* Right: Quick Controls & Theme Toggle */}
      <div className="flex items-center space-x-2 sm:space-x-3">

        {/* Quick Shift Badge */}

        {/* Theme Toggle Button */}
        <button
          type="button"
          onClick={toggleTheme}
          className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:border-blue-500 hover:text-blue-600 dark:hover:text-amber-400 transition-all shadow-sm"
          title={isDark ? "Switch to Light Theme" : "Switch to Dark Theme"}
        >
          {isDark ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4 text-blue-600" />
          )}
        </button>
      </div>
    </header>
  );
};

