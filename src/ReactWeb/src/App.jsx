import React from "react";
import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import MessengerPage from "./pages/MessengerPage";
import SignupPage from "./pages/SignUpPage";
import SigninPage from "./pages/SigninPage";
import ProfilePage from "./pages/ProfilePage";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <Routes>
      <Route path="/sign-in" element={<SigninPage />} />
      <Route path="/sign-up" element={<SignupPage />} />

      {/* Protected Routes */}
      <Route path="/" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
      <Route path="/messenger" element={<ProtectedRoute><MessengerPage /></ProtectedRoute>} />
      <Route path="/messenger/:convId" element={<ProtectedRoute><MessengerPage /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
      <Route path="/profile/:userId" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
    </Routes>
  );
}
