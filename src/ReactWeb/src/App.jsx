import React from "react";
import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import MessengerPage from "./pages/MessengerPage";
import SignupPage from "./pages/SignUpPage";
import SigninPage from "./pages/SigninPage";

export default function App() {
  return (
    <Routes>
      <Route path="/sign-in" element={<SigninPage />} />
      <Route path="/sign-up" element={<SignupPage />} />
      <Route path="/" element={<HomePage />} />
      <Route path="/messenger" element={<MessengerPage />} />
      <Route path="/messenger/:convId" element={<MessengerPage />} />
    </Routes>
  );
}
