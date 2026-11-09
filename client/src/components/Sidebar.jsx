import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "../i18n/LanguageContext";
import { useTheme } from "../context/ThemeContext";
import {
  ClipboardCheck,
  Tv,
  PieChart,
  Shirt,
  AlertTriangle,
  Sun,
  Moon,
  ChevronLeft,
  ChevronRight,
  Globe,
  Check,
  Activity,
  Layers,
} from "lucide-react";

export const Sidebar = ({ isCollapsed, onToggleCollapse, isMobileOpen, onCloseMobile }) => {
  const { t, language, setLanguage, languages } = useTranslation();
  const { theme, toggleTheme, isDark } = useTheme();
  const location = useLocation();
  const [langMenuOpen, setLangMenuOpen] = useState(false);

  const navLinks = [
    { to: "/", label: t("navQC") || "QC Tablet", icon: ClipboardCheck, badge: "Tablet" },
    { to: "/tv", label: t("navTV") || "Live TV", icon: Tv, badge: "Live" },
    { to: "/dashboard", label: t("navAnalytics") || "Analytics", icon: PieChart },
    { to: "/techpacks", label: t("navTechPacks") || "Tech Packs", icon: Shirt },
    { to: "/defects", label: t("navDefects") || "Defect Master", icon: AlertTriangle },
  ];

  const currentLangObj = languages.find((l) => l.code === language) || languages[0];

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed lg:static top-0 bottom-0 left-0 z-50 flex flex-col transition-all duration-300 ease-in-out border-r
          ${isCollapsed ? "w-20" : "w-64"}
          ${isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          bg-white border-slate-200 text-slate-800
          dark:bg-slate-900 dark:border-slate-800 dark:text-slate-100 shadow-xl lg:shadow-none
        `}
      >
        {/* Brand & Collapse Bar */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-200 dark:border-slate-800">
          <Link
            to="/"
            onClick={onCloseMobile}
            className="flex items-center space-x-3 overflow-hidden group"
          >
            <div className="w-10 h-10 min-w-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/25 group-hover:scale-105 transition-transform">
              <Shirt className="w-5 h-5" />
            </div>
            {!isCollapsed && (
              <div className="truncate">
                <div className="flex items-center space-x-1.5">
                  <span className="font-extrabold text-base tracking-tight text-slate-900 dark:text-white">
                    GarmentQC
                  </span>
                  <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400">
                    Export
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                  End-Line Inspection
                </p>
              </div>
            )}
          </Link>

          {/* Desktop Collapse Toggle */}
          <button
            type="button"
            onClick={onToggleCollapse}
            className="hidden lg:flex p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1.5">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
                onClick={onCloseMobile}
                title={isCollapsed ? link.label : undefined}
                className={`flex items-center rounded-xl text-sm font-semibold transition-all group ${
                  isCollapsed ? "justify-center p-3" : "px-3.5 py-2.5 space-x-3"
                } ${
                  isActive
                    ? "bg-blue-600 text-white shadow-md shadow-blue-600/25"
                    : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? "text-white" : "text-slate-500 dark:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400"}`} />
                {!isCollapsed && (
                  <div className="flex-1 flex items-center justify-between">
                    <span className="truncate">{link.label}</span>
                    {link.badge && (
                      <span
                        className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${
                          isActive
                            ? "bg-white/20 text-white"
                            : "bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
                        }`}
                      >
                        {link.badge}
                      </span>
                    )}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Utility Area: Theme Toggle & Language */}
        <div className="p-3 border-t border-slate-200 dark:border-slate-800 space-y-2">
          
          {/* Light / Dark Mode Toggle Button */}
          <button
            type="button"
            onClick={toggleTheme}
            title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            className={`w-full flex items-center rounded-xl transition-all border ${
              isCollapsed ? "justify-center p-2.5" : "px-3 py-2 space-x-2.5"
            } bg-slate-100 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-blue-400`}
          >
            {isDark ? (
              <Sun className="w-4 h-4 text-amber-400 flex-shrink-0" />
            ) : (
              <Moon className="w-4 h-4 text-blue-600 flex-shrink-0" />
            )}
            {!isCollapsed && (
              <span className="text-xs font-bold flex-1 text-left">
                {isDark ? "Light Theme" : "Dark Theme"}
              </span>
            )}
          </button>

          {/* Language Selector */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setLangMenuOpen(!langMenuOpen)}
              title="Change Language"
              className={`w-full flex items-center rounded-xl border transition-all ${
                isCollapsed ? "justify-center p-2.5" : "px-3 py-2 space-x-2.5"
              } bg-slate-100 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-blue-400`}
            >
              <Globe className="w-4 h-4 text-blue-500 flex-shrink-0" />
              {!isCollapsed && (
                <div className="flex-1 flex items-center justify-between text-xs font-semibold">
                  <span className="truncate">{currentLangObj.native}</span>
                  <span className="uppercase text-[10px] text-slate-400 font-mono">
                    {language}
                  </span>
                </div>
              )}
            </button>

            {/* Language Dropdown Menu */}
            {langMenuOpen && (
              <div
                className="absolute bottom-full left-0 mb-2 w-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-2xl py-1 z-50 animate-in fade-in zoom-in-95"
                onClick={() => setLangMenuOpen(false)}
              >
                <div className="px-3 py-1.5 border-b border-slate-100 dark:border-slate-800 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Select Language / மொழி
                </div>
                {languages.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => setLanguage(l.code)}
                    className={`w-full flex items-center justify-between px-3 py-2 text-xs text-left transition-colors ${
                      language === l.code
                        ? "bg-blue-50 dark:bg-blue-600/20 text-blue-600 dark:text-blue-400 font-bold"
                        : "text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <span>{l.flag}</span>
                      <span>{l.native}</span>
                    </div>
                    {language === l.code && <Check className="w-3.5 h-3.5 text-blue-500" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Factory Server Status indicator */}
          {!isCollapsed && (
            <div className="px-2 pt-1 flex items-center justify-between text-[11px] text-slate-400">
              <span className="flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Server Connected</span>
              </span>
              <span className="font-mono text-[10px]">Direct DB</span>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};

