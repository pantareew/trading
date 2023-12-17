import {
  Typography,
  AppBar,
  Toolbar,
  Container,
  Box,
  IconButton,
  Drawer,
  List,
  ListItemText,
  ListItemButton,
  ListItemIcon,
  Paper,
  capitalize,
} from "@mui/material";
import {
  CurrencyExchange,
  ShoppingCart,
  Wallet,
  AccountCircle,
  Menu,
  Login,
} from "@mui/icons-material";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useUser } from "../contexts/User";

export default function Navbar() {
  /*get user based on login*/
  const { userData } = useUser();
  /*Handle event for displaying the sidebar nav */

  const [drawerOpen, setDrawerOpen] = useState(false);
  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  /*menu items for sidebar nav */

  const pages = ["home", "checkout", "transaction"];

  return (
    <>
      <AppBar position="fixed" sx={{ backgroundColor: "#4219fa" }}>
        <Container maxWidth="xl">
          <Toolbar>
            {/*website name and logo*/}
            <Box sx={{ flexGrow: 1 }}>
              <Link
                to="/"
                style={{
                  textDecoration: "none",
                  color: "inherit",
                }}
              >
                <IconButton color="inherit" sx={{ mb: 0.5, mr: 0.5 }}>
                  <CurrencyExchange />
                </IconButton>
                <Typography
                  variant="h6"
                  noWrap
                  component="a"
                  sx={{
                    fontWeight: 700,
                    letterSpacing: ".2rem",
                    color: "inherit",
                    textDecoration: "none",
                  }}
                >
                  DecTraSys
                </Typography>
              </Link>
            </Box>
            {/*Navigation Items */}
            <Box sx={{ display: { xs: "none", md: "flex" }, flexGrow: 0 }}>
              <Link
                to="/transaction"
                style={{
                  textDecoration: "none",
                  color: "inherit",
                  marginTop: 4,
                }}
              >
                <IconButton color="inherit" sx={{ mx: 0.5 }}>
                  <Wallet />
                </IconButton>
              </Link>
              <Link
                to="/checkout"
                style={{
                  textDecoration: "none",
                  color: "inherit",
                }}
              >
                <IconButton
                  size="large"
                  aria-label="account of current user"
                  color="inherit"
                  sx={{ mx: 0.5 }}
                >
                  <ShoppingCart />
                </IconButton>
              </Link>

              {userData ? (
                <Link
                  to={`users/${userData.username}`}
                  style={{
                    textDecoration: "none",
                    color: "inherit",
                  }}
                >
                  <IconButton size="large" color="inherit" sx={{ mx: 0.5 }}>
                    <AccountCircle />
                  </IconButton>
                </Link>
              ) : (
                <Link
                  to="/login"
                  style={{
                    textDecoration: "none",
                    color: "inherit",
                  }}
                >
                  <IconButton size="large" color="inherit">
                    <Login />
                  </IconButton>
                </Link>
              )}
            </Box>
            {/*Menu icon for  smaller screen*/}
            <IconButton
              size="large"
              color="inherit"
              onClick={toggleDrawer}
              sx={{ display: { xs: "flex", md: "none" }, flexGrow: 0 }}
            >
              <Menu />
            </IconButton>
          </Toolbar>
        </Container>
      </AppBar>
      {/*Navbar for smaller screen */}
      <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer}>
        <Paper
          sx={{ backgroundColor: "#C3B1E1", height: "100%", paddingX: "10px" }}
        >
          <List>
            {pages.map((page, index) => (
              <ListItemButton onClick={toggleDrawer} key={index}>
                <Link to={"/" + page}>
                  <ListItemIcon>
                    <ListItemText sx={{ color: "#5D3FD3" }}>
                      {capitalize(page)}
                    </ListItemText>
                  </ListItemIcon>
                </Link>
              </ListItemButton>
            ))}
            <ListItemButton onClick={toggleDrawer}>
              {!userData ? (
                <Link to={"/login"}>
                  <ListItemIcon>
                    <ListItemText sx={{ color: "#5D3FD3" }}>Login</ListItemText>
                  </ListItemIcon>
                </Link>
              ) : (
                <Link to={`/users/${userData.username}`}>
                  <ListItemIcon>
                    <ListItemText sx={{ color: "#5D3FD3" }}>
                      Profile
                    </ListItemText>
                  </ListItemIcon>
                </Link>
              )}
            </ListItemButton>
          </List>
        </Paper>
      </Drawer>
    </>
  );
}
