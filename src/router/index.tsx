import { createBrowserRouter } from "react-router-dom";
import Layout from "../components/Layout/Layout";
import Home from "../pages/Home";
import Dashboard from "../pages/Dashboard";
import Users from "../pages/Users";
import Settings from "../pages/Settings";
import ButtonDemo from "../pages/components/Button";
import LayoutDemo from "../pages/components/Layout";
import PixijsDemo from "../pages/components/Pixijs";

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
      {
        path: "components/pixijs",
        element: <PixijsDemo />,
      },
    ],
  },
]);

export default router;
