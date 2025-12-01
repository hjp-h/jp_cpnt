import { createBrowserRouter } from "react-router-dom";
import Layout from "../components/Layout/Layout";
import Home from "../pages/Home";
import Dashboard from "../pages/Dashboard";
import Users from "../pages/Users";
import Settings from "../pages/Settings";
import ButtonDemo from "../pages/Demo/ButtonDemo";
import LayoutDemo from "../pages/Demo/LayoutDemo";
import PixijsDemo from "../pages/Demo/PixiJs";
import DndKitDemo from "../pages/Demo/DndKitDemo";
import GsapDemo from "../pages/Demo/GsapDemo";
import AnimationDemo from "../pages/Demo/AnimationDemo";
import HowlerDemo from "../pages/Demo/HowlerDemo";

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
      {
        path: "components/gsap-demo",
        element: <GsapDemo />,
      },
      {
        path: "components/dndkit",
        element: <DndKitDemo />,
      },
      {
        path: "components/animationDemo",
        element: <AnimationDemo />,
      },
      {
        path: "components/howlerDemo",
        element: <HowlerDemo />,
      },
    ],
  },
]);

export default router;
