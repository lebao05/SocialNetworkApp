import React from "react";
import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import MessengerPage from "./pages/MessengerPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/messenger" element={<MessengerPage />} />
      <Route path="/messenger/:convId" element={<MessengerPage />} />
    </Routes>
  );
}
