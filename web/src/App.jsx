import CssBaseline from "@mui/joy/CssBaseline";
import { CssVarsProvider } from "@mui/joy/styles";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { BrowserRouter } from "react-router-dom";
import { AuthContextProvider } from "./contexts/AuthContext";

import "./App.css";
import Router from "./routes";

export default function App() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <AuthContextProvider>
        <BrowserRouter>
          <CssVarsProvider>
            <CssBaseline />
            <Router />
          </CssVarsProvider>
        </BrowserRouter>
      </AuthContextProvider>
    </LocalizationProvider>
  );
}
