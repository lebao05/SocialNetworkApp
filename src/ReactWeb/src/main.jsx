import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import { AuthProvider } from "./contexts/authContext.jsx";
import { ConversationProvider } from "./contexts/conversationContext.jsx";
import { FriendProvider } from "./contexts/friendContext.jsx";
import { ReelsProvider } from "./contexts/ReelsContext.jsx";
import { StoriesProvider } from "./contexts/StoriesContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ConversationProvider>
          <FriendProvider>
            <ReelsProvider>
              <StoriesProvider>
                <App />
              </StoriesProvider>
            </ReelsProvider>
          </FriendProvider>
        </ConversationProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);