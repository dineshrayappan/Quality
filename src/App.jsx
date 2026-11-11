import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LanguageProvider } from "./i18n/LanguageContext";
import { ThemeProvider } from "./context/ThemeContext";
import { Layout } from "./components/Layout";
import { QCTabletPage } from "./pages/QCTabletPage";
import { TVDashboardPage } from "./pages/TVDashboardPage";
import { AnalyticsPage } from "./pages/AnalyticsPage";
import { TechPackPage } from "./pages/TechPackPage";
import { DefectMasterPage } from "./pages/DefectMasterPage";

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <BrowserRouter>
          <Layout>
            <Routes>
              <Route path="/" element={<QCTabletPage />} />
              <Route path="/qc" element={<QCTabletPage />} />
              <Route path="/tv" element={<TVDashboardPage />} />
              <Route path="/dashboard" element={<AnalyticsPage />} />
              <Route path="/techpacks" element={<TechPackPage />} />
              <Route path="/defects" element={<DefectMasterPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </LanguageProvider>
    </ThemeProvider>
  );
}
