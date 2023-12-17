//this component is horizontal card that composed of both image and text
import {
  Card,
  CardContent,
  CardMedia,
  IconButton,
  Typography,
} from "@mui/material";
import { Delete } from "@mui/icons-material";
import axios from "axios";
import { useUser } from "../contexts/User";

const HrCard = ({ items }) => {
  const { userData } = useUser();
  const handleDelete = async (asset_id) => {
    if (asset_id) {
      try {
        await axios.delete(
          `http://localhost:8000/cart/${asset_id}?userid=${userData.id}`
        );
        window.location.reload();
      } catch (err) {
        console.error("Error to remove asset: ", err);
      }
    } else {
      console.error("Asset ID is undefined.");
    }
  };

  return (
    <div>
      {items.map((item, index) => (
        <Card
          key={index}
          sx={{
            marginBottom: "25px",
            display: "flex",
            border: "5px solid #5D3FD3",
            borderRadius: 10,
            height: "30vh",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", width: "100%" }}>
            {/*image at the leftmost of the card */}
            <CardMedia
              component="img"
              sx={{ maxWidth: "30vw", height: "100%" }}
              image={item.image}
              alt={item.name}
            />
            {/*text details */}
            <CardContent>
              <Typography typography={{ xs: "h5", sm: "h4" }} color="#702963">
                {item.name}
              </Typography>

              <br />
              <Typography variant="h6" color="#301934">
                <b>{item.eth} ETH </b>
                <br />${item.aud} AUD
              </Typography>
            </CardContent>
          </div>
          {/*icons*/}
          <IconButton
            onClick={() => handleDelete(item.asset_id)}
            size="large"
            color="inherit"
            sx={{ alignSelf: "flex-end", marginX: "10px" }}
          >
            <Delete
              sx={{
                fontSize: 33,
              }}
            ></Delete>
          </IconButton>
        </Card>
      ))}
    </div>
  );
};

export default HrCard;
