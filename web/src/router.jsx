import { Navigate, Outlet, createBrowserRouter } from "react-router-dom";
import Root from "./layouts/root";
import Page404 from "./pages/404";
import PageDashboard from "./pages/dashboard";
import PageHome from "./pages/home";
import PageLogin from "./pages/login";
import PageLogout from "./pages/logout";
import PageLogs from "./pages/logs";
import PageMetrics from "./pages/metrics";
import PageSignup from "./pages/signup";
import PageTraces from "./pages/traces";
import PageWorkflows from "./pages/workflows";
import PageAlert from "./pages/workflows/alert";
import PageScale from "./pages/workflows/scale";

const router = createBrowserRouter([
  {
    element: (
      <Root>
        <Outlet />
      </Root>
    ),
    children: [
      { index: true, element: <PageHome /> },
      { path: "dashboard", element: <PageDashboard /> },
      { path: "logs", element: <PageLogs /> },
      { path: "metrics", element: <PageMetrics /> },
      { path: "traces", element: <PageTraces /> },
      { path: "workflows", element: <PageWorkflows /> },
      { path: "alert", element: <PageAlert /> },
      { path: "scale", element: <PageScale /> },
    ],
  },
  { path: "login", element: <PageLogin /> },
  { path: "logout", element: <PageLogout /> },
  { path: "signup", element: <PageSignup /> },
  { path: "404", element: <Page404 /> },
  { path: "*", element: <Navigate to="/404" replace /> },
]);

export default router;
