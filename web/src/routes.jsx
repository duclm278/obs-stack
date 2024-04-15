import { Navigate, Outlet, useRoutes } from "react-router-dom";

import Main from "./layouts/Main";
import Page404 from "./pages/404";
import PageLogin from "./pages/login";
import PageHome from "./pages/home";
import PageDashboard from "./pages/dashboard";
import PageAlerts from "./pages/alerts";
import PageScaling from "./pages/scaling";
import PageLogs from "./pages/logs";
import PageMetrics from "./pages/metrics";
import PageTraces from "./pages/traces";

export default function Router() {
  // const { user } = useAuthContext();
  return useRoutes([
    {
      element: (
        <Main>
          <Outlet />
        </Main>
      ),
      children: [
        {
          element: <PageHome />,
          index: true,
        },
        {
          path: "dashboard",
          element: <PageDashboard />,
        },
        {
          path: "alerts",
          element: <PageAlerts />,
        },
        {
          path: "scaling",
          element: <PageScaling />,
        },
        {
          path: "logs",
          element: <PageLogs />,
        },
        {
          path: "metrics",
          element: <PageMetrics />,
        },
        {
          path: "traces",
          element: <PageTraces />,
        },
        {
          path: "help",
          element: <Navigate to="/404" replace />,
        },
        {
          path: "settings",
          element: <Navigate to="/404" replace />,
        },
      ],
    },
    {
      path: "login",
      element: <PageLogin />,
    },
    {
      path: "404",
      element: <Page404 />,
    },
    {
      path: "*",
      element: <Navigate to="/404" replace />,
    },
  ]);
}
