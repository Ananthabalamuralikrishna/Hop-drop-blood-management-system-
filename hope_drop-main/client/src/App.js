import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import UserSignup from "./pages/UserSignup";
import UserDashboard from "./pages/UserDashboard";
import HospitalSignup from "./pages/HospitalSignup";
import HospitalDashboard from "./pages/HospitalDashboard";
import DonatePage from "./pages/DonatePage";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import { useAppContext } from "./context/AppContext";
import "./App.css";

const ProtectedRoute = ({ children, role }) => {
  const { auth } = useAppContext();

  if (!auth.isAuthenticated || auth.role !== role) {
    return <Navigate to="/" replace />;
  }

  return children;
};

function App() {
  return (
    <div className="app-shell">
      <Navbar />
      <main className="app-main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/donate" element={<DonatePage />} />
          <Route path="/user/signup" element={<UserSignup />} />
          <Route
            path="/user/dashboard"
            element={
              <ProtectedRoute role="user">
                <UserDashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/hospital/signup" element={<HospitalSignup />} />
          <Route
            path="/hospital/dashboard"
            element={
              <ProtectedRoute role="hospital">
                <HospitalDashboard />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
