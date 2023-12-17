import Background from "../assets/background.png";
import { Box, Typography } from "@mui/material";
export default function Hero() {
  return (
    <div>
      <Box
        sx={{
          backgroundImage: `url(${Background})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          minHeight: "100vh",
          marginBottom: 3,
        }}
      >
        {/*display welcoming message */}
        <Typography
          sx={{
            typography: { xs: "h3", sm: "h3", xl: "h2", md: "h2" },
            position: "absolute",
            top: { xl: "80%", md: "80%", sm: "75%", xs: "74%" },
            left: "50%",
            transform: "translate(-50%, -50%)",
            textAlign: "center",
            color: "whitesmoke",
            textShadow: "5px 2px 4px rgba(255, 181, 133, 0.5)",
          }}
        >
          Discover the Digital World
        </Typography>

        <Typography
          sx={{
            typography: { sm: "h6", md: "h6", xl: "h5" },
            position: "absolute",
            top: { xl: "90%", sm: "95%", xs: "95%" },
            left: "50%",
            transform: "translate(-50%, -50%)",
            textAlign: "center",
            color: "#DD58A0",
            textShadow: "2px 2px 4px rgba(66, 25, 250, 0.6)",
          }}
        >
          BUY AND SELL DIGITAL ASSETS WITH EASE
        </Typography>
      </Box>
    </div>
  );
}
