import { Box, Typography, Container } from "@mui/material";
import Cards from "./Cards";

export default function Assets({ heading, items }) {
  return (
    <Container maxWidth="xl">
      <Box
        id="main_box"
        sx={{ display: { sm: "flex" }, alignItems: "center", marginBottom: 2 }}
      >
        {/*Heading of this component */}
        <Typography variant="h4" component="div" sx={{ flexGrow: 1 }}>
          {" "}
          {heading}{" "}
        </Typography>
      </Box>

      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Cards items={items} />
      </Box>
    </Container>
  );
}
