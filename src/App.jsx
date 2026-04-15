import React, { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { BottomNav } from "./components/BottomNav.jsx";
import { TopNav } from "./components/TopNav.jsx";
import { pageTransition, pageVariants } from "./lib/motion.js";
import { useTheme } from "./lib/theme.js";
import HomePage from "./pages/HomePage.jsx";
import RecommendationsPage from "./pages/RecommendationsPage.jsx";
import RequestsPage from "./pages/RequestsPage.jsx";
import ChatPage from "./pages/ChatPage.jsx";
import StoriesPage from "./pages/StoriesPage.jsx";
import SearchPage from "./pages/SearchPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import TestsPage from "./pages/TestsPage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import ForgotPasswordPage from "./pages/ForgotPasswordPage.jsx";
import CompatibilityTestPage from "./pages/CompatibilityTestPage.jsx";
import CompatibilityReportPage from "./pages/CompatibilityReportPage.jsx";

export default function App() {
  const theme = useTheme();
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location.pathname]);

  return (
    <div className="appRoot">
      <div className="bgLayer" aria-hidden="true" />

      <TopNav theme={theme.theme} onToggleTheme={theme.toggle} />
      <div className="topSpacer" />

      <div className="container">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={location.pathname}
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={pageTransition}
          >
            <Routes location={location}>
              <Route path="/" element={<HomePage />} />
              <Route path="/recommendations" element={<RecommendationsPage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/requests" element={<RequestsPage />} />
              <Route path="/chat" element={<ChatPage />} />
              <Route path="/stories" element={<StoriesPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/tests" element={<TestsPage />} />
              <Route path="/test/:matchId" element={<CompatibilityTestPage />} />
              <Route path="/compatibility-report/:matchId" element={<CompatibilityReportPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </div>

      <div style={{ height: 96 }} aria-hidden="true" />
      <BottomNav />
    </div>
  );
}

