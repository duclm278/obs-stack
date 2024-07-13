import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { RouterProvider } from "react-router-dom";
import "./app.css";
import { AuthProvider } from "./providers/auth-provider";
import router from "./routes/router";

function App() {
  return (
    <AuthProvider>
      <TooltipProvider delayDuration={100}>
        <RouterProvider router={router} />
        <Toaster />
      </TooltipProvider>
    </AuthProvider>
  );
}

export default App;
