import Box from "@mui/joy/Box";

import Header from "./Header";
import SideBar from "./SideBar";

export default function Main({ children }) {
  return (
    <Box sx={{ display: "flex", minHeight: "100dvh" }}>
      <Header />
      <SideBar />
      <Box
        component="main"
        className="MainContent"
        sx={{
          px: { xs: 2, md: 6 },
          pt: {
            xs: "calc(24px + var(--Header-height))",
            sm: "calc(24px + var(--Header-height))",
            md: 4,
          },
          pb: { xs: 2, sm: 2, md: 3 },
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minWidth: 0,
          height: "100dvh",
          gap: 1,
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
