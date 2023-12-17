import { Box, Typography } from "@mui/material";
import { Facebook, Instagram, Mail, Twitter } from "@mui/icons-material";

const Footer = () => {
  return (
    <Box
      sx={{ backgroundColor: "#4219fa", position: "absolute", width: "100%" }}
    >
      {/* A div containing all the four icons placed at the top centre of the footer */}
      <div
        className="icons"
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: "10px",
          marginBottom: "10px",
        }}
      >
        <Mail sx={{ marginX: "20px", fontSize: "100", color: "White" }}></Mail>
        <Facebook
          sx={{ marginX: "20px", fontSize: "100", color: "White" }}
        ></Facebook>
        <Twitter
          sx={{ marginX: "20px", fontSize: "100", color: "White" }}
        ></Twitter>
        <Instagram
          sx={{ marginX: "20px", fontSize: "100", color: "White" }}
        ></Instagram>
      </div>

      <div
        className="footer-items"
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: "20px",
          flexWrap: "wrap",
        }}
      >
        <Typography
          variant="h6"
          sx={{ display: "inline-block", marginX: "30px", color: "White" }}
        >
          Home
        </Typography>
        <Typography
          variant="h6"
          sx={{ display: "inline-block", marginX: "30px", color: "White" }}
        >
          About Us
        </Typography>
        <Typography
          variant="h6"
          sx={{ display: "inline-block", marginX: "30px", color: "White" }}
        >
          Privacy Policy
        </Typography>
        <Typography
          variant="h6"
          sx={{ display: "inline-block", marginX: "30px", color: "White" }}
        >
          FAQ
        </Typography>
        <Typography
          variant="h6"
          sx={{
            display: "inline-block",
            marginLeft: "30px",
            paddingBottom: "50px",
            color: "White",
          }}
        >
          Contact Us
        </Typography>
      </div>

      <hr />

      <Typography
        variant="p6"
        sx={{ display: "flex", justifyContent: "center", color: "White" }}
      >
        &copy;{new Date().getFullYear()} DecTraSys Inc. All rights reserved
      </Typography>
    </Box>
  );
};

export default Footer;
