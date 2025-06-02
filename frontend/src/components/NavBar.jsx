import {
  AppBar,
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
  Typography,
} from "@mui/material";
import { useState } from "react";
import MenuIcon from "@mui/icons-material/Menu";
import QuizIcon from "@mui/icons-material/Quiz";
import RuleIcon from "@mui/icons-material/Rule";
import EditNoteIcon from "@mui/icons-material/EditNote";
import { NavLink } from "react-router-dom";

const NavBar = () => {
  const [drawerIsVisible, setDrawerIsVisible] = useState(false);

  const links = [
    {
      name: "Tests",
      path: "/testspage",
      icon: <QuizIcon />,
    },
    {
      name: "Test Results",
      path: "/testresults",
      icon: <RuleIcon />,
    },
    {
      name: "Create Test",
      path: "/createtest",
      icon: <EditNoteIcon />,
    },
  ];

  const appBarBtns = [
    {
      name: "menu button",
      icon: <MenuIcon />,
      action: () => setDrawerIsVisible(true),
      isPrivate: false,
    },
  ];
  return (
    <nav>
      <AppBar
        position="sticky"
        sx={{
          background: "#1F2937",
          padding: "10px",
          borderBottom: "1px solid black",
          boxShadow: "none",
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Typography
            variant="h4"
            sx={{
              mr: 2,
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
          <Stack
            direction="row"
            spacing={4}
            sx={{ display: { xs: "none", md: "flex" } }}
          >
            {links.map((link) => {
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
                      ":hover": { backgroundColor: "rgba(255, 255, 255, 0.1)" },
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
          <Stack direction="row" spacing={1}>
            {appBarBtns.map((btn) => {
              return (
                <IconButton
                  key={btn.name}
                  aria-label={btn.name}
                  sx={{
                    color: "white",
                    ":hover": { backgroundColor: "rgba(255, 255, 255, 0.2)" },
                    display: {
                      md: `${btn.name === "menu button" && "none"}`,
                    },
                  }}
                  onClick={() => btn.action()}
                >
                  {btn.icon}
                </IconButton>
              );
            })}
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
            background: "#1F2937",
          }}
        >
          <Typography
            variant="h5"
            sx={{ fontWeight: "500", padding: "1rem", color: "white" }}
          >
            Menu
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
