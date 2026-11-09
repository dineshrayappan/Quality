import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "../i18n/LanguageContext";
import { 
  ClipboardCheck, 
  Tv, 
  PieChart, 
  Shirt, 
  AlertTriangle, 
  Globe, 
  Check, 
  Menu, 
  X,
  Layers
} from "lucide-react";

export const Navbar = () => {
  const { t, language, setLanguage, languages } = useTranslation();
  const location = useLocation();
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { to: "/", label: t("navQC"), icon: ClipboardCheck, badge: "Tablet" },
    { to: "/tv", label: t("navTV"), icon: Tv, badge: "Live" },
    { to: "/dashboard", label: t("navAnalytics"), icon: PieChart },
    { to: "/techpacks", label: t("navTechPacks"), icon: Shirt },
    { to: "/defects", label: t("navDefects"), icon: AlertTriangle },
  ];

  return (
    <header className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/25 group-hover:scale-105 transition-transform">
              <Shirt className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                  {t("appTitle")}
                </span>
                <span className="hidden sm:inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  Export QC
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium hidden md:block">
                {t("subtitle")}
              </p>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-semibold transition-all ${
                    isActive
                      ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                      : "text-slate-300 hover:text-white hover:bg-slate-800/80"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{link.label}</span>
                  {link.badge && (
                    <span className={`text-[10px] font-bold uppercase px-1.5 py-0.2 rounded ${
                      isActive ? "bg-white/20 text-white" : "bg-slate-800 text-slate-400"
                    }`}>
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Controls: Language Selector & Status */}
          <div className="flex items-center space-x-3">
            
            {/* 4-Language Switcher Dropdown */}
            <div className="relative">
              <button
                onClick={() => setLangMenuOpen(!langMenuOpen)}
                className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-200 text-xs font-semibold shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500"
                title="Change language / மொழியை மாற்றவும்"
              >
                <Globe className="w-4 h-4 text-blue-400" />
                <span className="uppercase font-bold tracking-wider">{language}</span>
                <span className="text-slate-400 text-[11px] hidden sm:inline">
                  {languages.find((l) => l.code === language)?.native}
                </span>
              </button>

              {langMenuOpen && (
                <div
                  className="absolute right-0 mt-2 w-48 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl py-1 z-50 animate-in fade-in zoom-in-95 duration-100"
                  onClick={() => setLangMenuOpen(false)}
                >
                  <div className="px-3 py-2 border-b border-slate-800 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Select Language / மொழி
                  </div>
                  {languages.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => setLanguage(l.code)}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 text-xs text-left transition-colors ${
                        language === l.code
                          ? "bg-blue-600/20 text-blue-400 font-bold"
                          : "text-slate-200 hover:bg-slate-800"
                      }`}
                    >
                      <div className="flex items-center space-x-2.5">
                        <span className="text-base">{l.flag}</span>
                        <div>
                          <div className="font-semibold text-slate-100">{l.native}</div>
                          <div className="text-[10px] text-slate-400">{l.label}</div>
                        </div>
                      </div>
                      {language === l.code && <Check className="w-4 h-4 text-blue-400" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-800 bg-slate-900 px-4 pt-2 pb-4 space-y-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "text-slate-300 hover:bg-slate-800"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className="w-5 h-5" />
                  <span>{link.label}</span>
                </div>
                {link.badge && (
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                    {link.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
};

