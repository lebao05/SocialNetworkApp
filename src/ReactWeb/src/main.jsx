import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import { AuthProvider } from "./contexts/authContext.jsx";
import { ChatProvider } from "./contexts/ChatContext.jsx";
import { FriendProvider } from "./contexts/friendContext.jsx";
import { ReelsProvider } from "./contexts/ReelsContext.jsx";
import { StoriesProvider } from "./contexts/StoriesContext.jsx";
import { CallProvider } from "./contexts/CallContext.jsx";
import IncomingCallModal from "./components/Messenger/IncomingCallModal.jsx";
import ActiveCallUI from "./components/Messenger/ActiveCallUI.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <CallProvider>
          <ChatProvider>
            <FriendProvider>
              <ReelsProvider>
                <StoriesProvider>
                  <App />
                  <IncomingCallModal />
                  <ActiveCallUI />
                </StoriesProvider>
              </ReelsProvider>
            </FriendProvider>
          </ChatProvider>
        </CallProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
