import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import { AuthProvider } from "./contexts/authContext.jsx";
import { ConversationProvider } from "./contexts/conversationContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ConversationProvider>
          <App />
        </ConversationProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);