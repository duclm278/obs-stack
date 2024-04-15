import ListItem from "@mui/joy/ListItem";
import ListItemButton from "@mui/joy/ListItemButton";
import ListItemContent from "@mui/joy/ListItemContent";
import Typography from "@mui/joy/Typography";
import { NavLink } from "react-router-dom";

export default function SideEntry({ text, path, icon: ListItemIcon }) {
  return (
    <NavLink to={path} style={{ textDecoration: "none" }}>
      {({ isActive }) =>
        isActive ? (
          <ListItem>
            <ListItemButton selected>
              <ListItemIcon />
              <ListItemContent>
                <Typography level="title-sm">{text}</Typography>
              </ListItemContent>
            </ListItemButton>
          </ListItem>
        ) : (
          <ListItem>
            <ListItemButton>
              <ListItemIcon />
              <ListItemContent>
                <Typography level="title-sm">{text}</Typography>
              </ListItemContent>
            </ListItemButton>
          </ListItem>
        )
      }
    </NavLink>
  );
}
