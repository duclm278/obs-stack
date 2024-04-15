import Avatar from "@mui/joy/Avatar";
import Box from "@mui/joy/Box";
import Divider from "@mui/joy/Divider";
import GlobalStyles from "@mui/joy/GlobalStyles";
import IconButton from "@mui/joy/IconButton";
import Input from "@mui/joy/Input";
import List from "@mui/joy/List";
import { listItemButtonClasses } from "@mui/joy/ListItemButton";
import Sheet from "@mui/joy/Sheet";
import Typography from "@mui/joy/Typography";
import Select from "@mui/joy/Select";
import Option from "@mui/joy/Option";

import AccountTreeRoundedIcon from "@mui/icons-material/AccountTreeRounded";
import BarChartRoundedIcon from "@mui/icons-material/BarChartRounded";
import CampaignRoundedIcon from "@mui/icons-material/CampaignRounded";
import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import DeblurRoundedIcon from "@mui/icons-material/DeblurRounded";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import ManageSearchRoundedIcon from "@mui/icons-material/ManageSearchRounded";
import OpenWithRoundedIcon from "@mui/icons-material/OpenWithRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import SupportRoundedIcon from "@mui/icons-material/SupportRounded";
import BubbleChartIcon from "@mui/icons-material/BubbleChart";

import ModeToggle from "./ModeToggle";
import SideEntry from "./SideEntry";
import { closeSidebar } from "./utils";

export default function Sidebar() {
  return (
    <Sheet
      className="Sidebar"
      sx={{
        position: { xs: "fixed", md: "sticky" },
        transform: {
          xs: "translateX(calc(100% * (var(--SideNavigation-slideIn, 0) - 1)))",
          md: "none",
        },
        transition: "transform 0.4s, width 0.4s",
        zIndex: 1000,
        height: "100dvh",
        width: "var(--Sidebar-width)",
        top: 0,
        p: 2,
        flexShrink: 0,
        display: "flex",
        flexDirection: "column",
        gap: 2,
        borderRight: "1px solid",
        borderColor: "divider",
      }}
    >
      <GlobalStyles
        styles={(theme) => ({
          ":root": {
            "--Sidebar-width": "220px",
            [theme.breakpoints.up("lg")]: {
              "--Sidebar-width": "240px",
            },
          },
        })}
      />
      <Box
        className="Sidebar-overlay"
        sx={{
          position: "fixed",
          zIndex: 9998,
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          opacity: "var(--SideNavigation-slideIn)",
          backgroundColor: "var(--joy-palette-background-backdrop)",
          transition: "opacity 0.4s",
          transform: {
            xs: "translateX(calc(100% * (var(--SideNavigation-slideIn, 0) - 1) + var(--SideNavigation-slideIn, 0) * var(--Sidebar-width, 0px)))",
            lg: "translateX(-100%)",
          },
        }}
        onClick={() => closeSidebar()}
      />
      <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
        <IconButton variant="soft" color="primary" size="sm">
          <DeblurRoundedIcon />
        </IconButton>
        <Typography level="title-lg">obzob</Typography>
        <ModeToggle sx={{ ml: "auto" }} />
      </Box>
      {/* <Input
        size="sm"
        startDecorator={<SearchRoundedIcon />}
        placeholder="Search"
      /> */}
      <Select
        defaultValue="1"
        variant="outlined"
        size="sm"
        slotProps={{
          listbox: { placement: "bottom-start" },
        }}
        sx={{
          py: 1,
          bgcolor: "transparent",
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <Option value="1">Default</Option>
        <Option value="2">Test</Option>
        {/* <Option value="3">Kubernetes</Option> */}
        {/* <Option value="4">DevOps</Option> */}
        {/* <Option value="5">Spring Boot</Option> */}
      </Select>
      <Box
        sx={{
          minHeight: 0,
          overflow: "hidden auto",
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          [`& .${listItemButtonClasses.root}`]: {
            gap: 1.5,
          },
        }}
      >
        <List
          size="sm"
          sx={{
            gap: 1,
            "--List-nestedInsetStart": "30px",
            "--ListItem-radius": (theme) => theme.vars.radius.sm,
          }}
        >
          <SideEntry text="Home" path="/" icon={BubbleChartIcon} />
          <SideEntry
            text="Dashboard"
            path="/dashboard"
            icon={DashboardRoundedIcon}
          />
          <SideEntry
            text="Alerts"
            path="/alerts"
            icon={() => (
              <CampaignRoundedIcon
                sx={{ stroke: "currentColor", strokeWidth: 0.25 }}
              />
            )}
          />
          <SideEntry
            text="Scaling"
            path="/scaling"
            icon={() => (
              <OpenWithRoundedIcon
                sx={{ stroke: "currentColor", strokeWidth: 0.25 }}
              />
            )}
          />
          <SideEntry
            text="Logs"
            path="/logs"
            icon={() => (
              <ManageSearchRoundedIcon
                sx={{ stroke: "currentColor", strokeWidth: 0.75 }}
              />
            )}
          />
          <SideEntry
            text="Metrics"
            path="/metrics"
            icon={BarChartRoundedIcon}
          />
          <SideEntry
            text="Traces"
            path="/traces"
            icon={AccountTreeRoundedIcon}
          />
        </List>

        <List
          size="sm"
          sx={{
            mt: "auto",
            flexGrow: 0,
            "--ListItem-radius": (theme) => theme.vars.radius.sm,
            "--List-gap": "8px",
            mb: 2,
          }}
        >
          <SideEntry text="Help" path="/help" icon={SupportRoundedIcon} />
          <SideEntry
            text="Settings"
            path="/settings"
            icon={SettingsRoundedIcon}
          />
        </List>
      </Box>
      <Divider />
      <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
        <Avatar
          variant="outlined"
          size="sm"
          src="https://lh3.googleusercontent.com/TNPyyH07qCDgjSi49yII4M7A4zqwurKV2_wtgXizDDcqy12FCUVVh5H5JDBwqEselWNzfa_teHIl818UgXV7Ik_fuw=s32"
        />
        <Box sx={{ minWidth: 0, flex: 1 }}>
          <Typography level="title-sm">Pop P.</Typography>
          <Typography level="body-xs">admin@test.com</Typography>
        </Box>
        <IconButton size="sm" variant="plain" color="neutral">
          <LogoutRoundedIcon />
        </IconButton>
      </Box>
    </Sheet>
  );
}
