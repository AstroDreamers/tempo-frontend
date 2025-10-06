


import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import MapPage from "./pages/MapPage";
import DashboardPage from "./pages/DashboardPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import VerifyPage from "./pages/VerifyPage";
import Header from "./components/Header";
import AlertsPage from "./pages/AlertsPage";
import GuidePage from "./pages/GuidePage";
import IntroductionPage from "./pages/IntroductionPage";

export default function App() {
  return (
    <Router>
      <Header />
  <Routes>
  <Route path="/introduction" element={<IntroductionPage />} />
  <Route path="/map" element={<MapPage />} />
  <Route path="/guide" element={<GuidePage />} />
    <Route path="/dashboard" element={<DashboardPage />} />
    <Route path="/map" element={<MapPage />} />
    <Route path="/alerts" element={<AlertsPage />} />
    <Route path="/subscriptions" element={<SubscriptionsPage />} />
    <Route path="/getting-started" element={<GettingStartedPage />} />
    <Route path="/login" element={<LoginPage />} />
    <Route path="/signup" element={<SignupPage />} />
    <Route path="/verify" element={<VerifyPage />} />
    {/* Add more protected routes here */}
    <Route path="*" element={<Navigate to="/" />} />
  </Routes>
    </Router>
  );
}