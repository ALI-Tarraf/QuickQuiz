import {
  AppBar,
  Box,
  Button,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import { useState } from "react";
import MenuIcon from "@mui/icons-material/Menu";
import QuizIcon from "@mui/icons-material/Quiz";
import RuleIcon from "@mui/icons-material/Rule";
import EditNoteIcon from "@mui/icons-material/EditNote";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../store/slices/auth/authSlice";
import logo from "../assets/logo.png";

const NavBar = () => {
  const [drawerIsVisible, setDrawerIsVisible] = useState(false);
  const { user } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const links = [
    {
      name: "Tests",
      path: "/testspage",
      icon: <QuizIcon />,
      private: false,
    },
    {
      name: "Test Results",
      path: "/testresults",
      icon: <RuleIcon />,
      private: false,
    },
    // {
    //   name: "Create Test",
    //   path: "/createtest",
    //   icon: <EditNoteIcon />,
    //   private: true,
    // },
    {
      name: "Tests Dashboard ",
      path: "/testsdashboard",
      icon: <DashboardRoundedIcon />,
      private: true,
    },
  ];
  const handleClick = async () => {
    await dispatch(logout());
    navigate("/");
  };
  return (
    <nav>
      <AppBar
        position="sticky"
        sx={{
          background: "#272727",
          py: "7px",
          borderBottom: "1px solid black",
          boxShadow: "none",
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Stack direction="row" spacing={0}>
            <Box
              component="img"
              src={logo}
              alt="Online Test Logo"
              sx={{
                display: "block",
                width: { xs: "56px", sm: "64px" },
              }}
            />

            <Typography
              variant="h4"
              sx={{
                display: "flex",
                justifyContent: "start",
                alignItems: "center",
                fontWeight: 600,
                color: "white",
                fontSize: {
                  xs: "h5.fontSize",
                  sm: "h4.fontSize",
                },
              }}
            >
              Quick Quiz
            </Typography>
          </Stack>
          <Stack
            direction="row"
            spacing={4}
            sx={{ display: { xs: "none", md: "flex" } }}
          >
            {links.map((link) => {
              if (!user || (user?.role === "student" && link.private)) return;
              return (
                <NavLink
                  to={link.path}
                  key={link.name}
                  style={({ isActive }) => {
                    return {
                      borderRadius: isActive ? "5px" : "",
                      background: isActive ? "rgba(255, 255, 255, 0.3)" : "",
                    };
                  }}
                >
                  <Button
                    aria-label={link.name}
                    variant="text"
                    startIcon={link.icon}
                    sx={{
                      color: "white",
                      ":hover": {
                        backgroundColor: "rgba(255, 255, 255, 0.1)",
                      },
                    }}
                  >
                    <Typography variant="body3" sx={{ fontWeight: "500" }}>
                      {link.name}
                    </Typography>
                  </Button>
                </NavLink>
              );
            })}
          </Stack>
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography
              sx={{
                display: {
                  xs: "none",
                  md: "block",
                },
              }}
              variant="h6"
            >
              {user?.role === "teacher" ? "Mr. " : ""}
              {user?.first_name.toUpperCase()} {user?.last_name.toUpperCase()}
            </Typography>
            <Tooltip title="Logout" arrow>
              <IconButton
                sx={{
                  color: "white",
                  display: { xs: "none", md: "flex" },
                  alignItems: "center",
                  cursor: "pointer",
                }}
                key="logout"
                aria-label="logout"
                onClick={handleClick}
              >
                <LogoutRoundedIcon />
              </IconButton>
            </Tooltip>
          </Stack>
          <Stack
            direction="row"
            spacing={1}
            sx={{
              display: {
                md: "none",
              },
            }}
          >
            <Tooltip title="Logout" arrow>
              <IconButton
                sx={{
                  color: "white",
                  display: { xs: "flex", md: "none" },
                  alignItems: "center",
                  cursor: "pointer",
                }}
                key="logout"
                aria-label="logout"
                onClick={handleClick}
              >
                <LogoutRoundedIcon />
              </IconButton>
            </Tooltip>
            <IconButton
              key={"menu button"}
              aria-label={"menu button"}
              sx={{
                color: "white",
                ":hover": { backgroundColor: "rgba(255, 255, 255, 0.2)" },
              }}
              onClick={() => setDrawerIsVisible(true)}
            >
              {<MenuIcon />}
            </IconButton>
          </Stack>
        </Toolbar>
      </AppBar>
      <Drawer
        anchor="right"
        open={drawerIsVisible}
        onClose={() => setDrawerIsVisible(false)}
      >
        <List
          sx={{
            height: "100%",
            minWidth: "275px",
            paddingTop: "1rem",
            background: "#272727",
          }}
        >
          <Typography
            variant="h6"
            sx={{ fontWeight: "500", color: "white", padding: "1rem" }}
          >
            {user?.role === "teacher" ? "Mr. " : ""}
            {user?.first_name.toUpperCase()} {user?.last_name.toUpperCase()}
          </Typography>

          <Divider sx={{ backgroundColor: "white" }} />

          {links.map((link) => {
            return (
              <ListItem key={link.name}>
                <NavLink
                  to={link.path}
                  style={({ isActive }) => {
                    return {
                      width: "100%",
                      textDecoration: "none",
                      fontSize: "40px",
                      color: "inherit",
                      backgroundColor: isActive
                        ? "rgba(255, 255, 255, 0.3)"
                        : "",
                    };
                  }}
                >
                  <ListItemButton
                    aria-label={link.name}
                    onClick={() => setDrawerIsVisible(false)}
                  >
                    <ListItemIcon
                      sx={{
                        color: "white",
                        fontSize: "100px",
                      }}
                    >
                      {link.icon}
                    </ListItemIcon>
                    <ListItemText sx={{ color: "white" }}>
                      {link.name.toUpperCase()}
                    </ListItemText>
                  </ListItemButton>
                </NavLink>
              </ListItem>
            );
          })}
        </List>
      </Drawer>
    </nav>
  );
};

export default NavBar;
