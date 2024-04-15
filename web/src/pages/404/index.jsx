import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import Typography from "@mui/joy/Typography";
import { Link } from "react-router-dom";
import PacMan404 from "../../assets/404.gif";

export default function Page404() {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
    >
      <img src={PacMan404} alt="404 Not Found" width="400" />
      <Typography variant="h4" align="center" gutterBottom>
        Oops! Page Not Found!
      </Typography>
      <Typography variant="body1" align="center" gutterBottom>
        The page you are looking for does not exist.
      </Typography>
      <Button
        component={Link}
        to="/"
        variant="contained"
        color="primary"
        size="large"
        sx={{ mt: 1 }}
      >
        Back Home
      </Button>
    </Box>
  );
}
