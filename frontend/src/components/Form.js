import { useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  IconButton,
  Box,
  TextField,
  Button,
  Alert,
} from "@mui/material";
import { CurrencyExchange } from "@mui/icons-material";
import axios from "axios";
import { useState } from "react";
import { useUser } from "../contexts/User";

export default function Form() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const navigate = useNavigate();
  const { updateUser } = useUser();

  const handleSubmit = () => {
    axios
      .get(`http://localhost:8000/users/${username}?password=${password}`)
      .then((res) => {
        if (res.status === 200) {
          const user = res.data;
          updateUser(user);
          navigate(`/users/${username}`, {
            state: { user },
            replace: true,
          });

          setUsername("");
          setPassword("");
        }
      })
      .catch((error) => {
        console.error("Error fetching user:", error);
        setShowAlert(true);
      });
  };

  return (
    <Container maxWidth="xs" sx={{ height: "80vh" }}>
      <Box
        sx={{
          mt: 10,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {/*website logo and name */}
        <IconButton color="inherit" size="large">
          <CurrencyExchange style={{ fontSize: 30 }} />
        </IconButton>
        <Typography
          variant="h4"
          noWrap
          href="/"
          sx={{
            fontWeight: 700,
            letterSpacing: ".2rem",
            color: "inherit",
          }}
        >
          DecTraSys
        </Typography>
      </Box>
      {/*form has two input elements - username, password */}
      <Box component="form" noValidate sx={{ mt: 1 }}>
        <TextField
          margin="normal"
          required
          fullWidth
          id="username"
          label="Username"
          onChange={(e) => setUsername(e.target.value)}
        />

        <TextField
          margin="normal"
          required
          fullWidth
          label="Password"
          type="password"
          id="password"
          onChange={(e) => setPassword(e.target.value)}
        />

        {/*link to profile page after signed in */}
        <Button
          onClick={handleSubmit}
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2, backgroundColor: "#4219fa" }}
        >
          Sign In
        </Button>
        {showAlert && (
          <Alert
            severity="error"
            onClose={() => {
              setShowAlert(false);
            }}
          >
            Invalid username or password!
          </Alert>
        )}
      </Box>
    </Container>
  );
}
