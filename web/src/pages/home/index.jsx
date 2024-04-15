import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import Typography from "@mui/joy/Typography";

import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";

import React from "react";
import OrderList from "./OrderList";
import OrderTable from "./OrderTable";

export default function PageHome() {
  return (
    <React.Fragment>
      <Box
        sx={{
          display: "flex",
          gap: 1,
          flexDirection: { xs: "column", sm: "row" },
          alignItems: { xs: "start", sm: "center" },
          flexWrap: "wrap",
          justifyContent: "space-between",
        }}
      >
        <Typography level="h2" component="h1">
          Home
        </Typography>
        <Button
          color="primary"
          startDecorator={<DownloadRoundedIcon />}
          size="sm"
        >
          Download PDF
        </Button>
      </Box>
      <OrderTable />
      <OrderList />
    </React.Fragment>
  );
}
