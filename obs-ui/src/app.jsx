import { TooltipProvider } from "@/components/ui/tooltip";
import { RouterProvider } from "react-router-dom";
import "./app.css";
import { AuthProvider } from "./providers/auth-provider";
import router from "./router";

function App() {
  return (
    <AuthProvider>
      <TooltipProvider delayDuration={100}>
        <RouterProvider router={router} />
      </TooltipProvider>
    </AuthProvider>
  );
}

export default App;
