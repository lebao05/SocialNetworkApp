import { createBrowserRouter } from "react-router-dom";
import Home from "../facebook/pages/Home";
import MessengerPage from "../messenger/pages/MessengerPage";

export const router = createBrowserRouter([
  { path: "/", element: <Home /> },
  { path: "/messenger", element: <MessengerPage /> },
  { path: "/messenger/:id", element: <MessengerPage /> },
]);
