import { createBrowserRouter } from "react-router";
import Layout from "../layout/Layout";
import Login from "../pages/login/Login";
import ChatPage from "../pages/ChatPage/ChatPage";

export const routes = createBrowserRouter([
  { path: "/login", element: <Login /> },
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <ChatPage />,
      },
    ],
  },
]);
