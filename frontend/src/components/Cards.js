import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  CardActionArea,
} from "@mui/material";

export default function Cards({ items }) {
  const navigate = useNavigate();
  return (
    <div
      style={{
        display: "flex",
        gap: "30px",

        marginTop: 10,
        marginBottom: 30,
        flexWrap: "wrap",
      }}
    >
      {items.map((item, index) => (
        <Card
          key={index}
          sx={{ minWidth: { xl: 340, xs: "100%", sm: "45%", md: "23%" } }}
          onClick={() => {
            navigate(`/assets/${item.id}`);
          }}
        >
          <CardActionArea>
            <CardMedia
              component="img"
              height="160"
              image={item.image}
              alt={item.title}
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                {item.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {item.price}
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>
      ))}
    </div>
  );
}
