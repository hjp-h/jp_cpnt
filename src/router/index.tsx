import { createBrowserRouter } from "react-router-dom";
import Layout from "../components/Layout/Layout";
import Home from "../pages/Home";
import Dashboard from "../pages/Dashboard";
import Users from "../pages/Users";
import Settings from "../pages/Settings";
import ButtonDemo from "../pages/components/Button";
import LayoutDemo from "../pages/components/Layout";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "dashboard",
        element: <Dashboard />,
      },
      {
        path: "users",
        element: <Users />,
      },
      {
        path: "settings",
        element: <Settings />,
      },
      {
        path: "components/button",
        element: <ButtonDemo />,
      },
      {
        path: "components/layout",
        element: <LayoutDemo />,
      },
    ],
  },
]);

export default router;
