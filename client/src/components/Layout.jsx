import React, { useState } from "react";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";

export const Layout = ({ children }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-200">
      {/* Sidebar View */}
      <Sidebar
        isCollapsed={isCollapsed}
        onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
        isMobileOpen={isMobileOpen}
        onCloseMobile={() => setIsMobileOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        <Header onOpenMobile={() => setIsMobileOpen(true)} />
        <main className="flex-1 p-3 sm:p-5 lg:p-6 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
};

