import { RouterProvider } from "react-router-dom";
import "./app.css";
import { AuthProvider } from "./providers/auth-provider";
import router from "./router";

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;
