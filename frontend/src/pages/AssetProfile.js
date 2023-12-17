import {
  Container,
  Typography,
  Button,
  Card,
  CardMedia,
  CardContent,
  Alert,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";

import axios from "axios";
import { useUser } from "../contexts/User";
const AssetProfile = () => {
  //userData
  const { userData } = useUser();
  //alert event handling
  const [showAlert, setShowAlert] = useState(false);

  const handleClose = () => setShowAlert(false);
  //navigate
  const navigate = useNavigate();
  //view individual asset details
  const [data, setData] = useState(null);
  const { asset_id } = useParams();
  useEffect(() => {
    axios
      .get(`http://localhost:8000/assets/${asset_id}`)
      .then((response) => setData(response.data))
      .catch((error) => console.error("Error fetching asset data: ", error));
  }, [asset_id]);
  if (!data) {
    return <div>Loading...</div>;
  }
  //values for asset information
  const itemInfo = {
    name: data.name,
    image: data.img,
    eth: data.eth,
    aud: data.aud,
    createdBy: data.creator,
    ownedBy: data.owner,
  };

  //proceed to trade
  const handleTrade = async () => {
    try {
      if (userData) {
        const res = await axios.post(
          `http://localhost:8000/cart?asset_id=${asset_id}&userid=${userData.id}`
        );
        if (res.status === 201) {
          navigate("/checkout");
        }
      } else {
        navigate("/login");
      }
    } catch (err) {
      setShowAlert(true);
    }
  };

  return (
    <>
      <div style={{ height: "80vh" }}>
        <Container maxWidth="xl" sx={{ position: "relative" }}>
          {showAlert && (
            <Alert
              sx={{
                position: "absolute",
                right: 25,
                bottom: 50,
              }}
              onClose={handleClose}
              severity="error"
            >
              This item has been added to your cart !
            </Alert>
          )}
          {/*use Card component from MUI to display information */}
          <Card
            sx={{
              display: "flex",
              height: "50vh",
              marginTop: "10rem",
              marginBottom: "10rem",
            }}
          >
            <CardMedia
              component="img"
              sx={{
                maxWidth: { xs: "40vw", xl: "30vw" },
                height: "100%",
                flex: "1",
              }}
              image={itemInfo.image}
              alt={itemInfo.name}
            />
            <CardContent>
              <Typography variant="body1" color="#039dfc">
                {itemInfo.createdBy}
              </Typography>
              <br />
              <Typography variant="h4" color="#702963">
                {itemInfo.name}
              </Typography>

              <br />
              <div
                style={{
                  display: "flex",
                  alignItems: "start",
                }}
              >
                <Typography typography={{ xl: "body1" }}>Owner: </Typography>
                <Typography
                  typography={{ xl: "body1" }}
                  sx={{ color: "#039dfc" }}
                >
                  {itemInfo.ownedBy}
                </Typography>
              </div>
              <br />

              <br />
              <br />

              <Typography
                typography={{ xl: "h5", xs: "h6" }}
                sx={{ color: "grey" }}
              >
                Current Price:
              </Typography>
              <br />
              <Typography typography={{ xl: "h4", xs: "h5" }} color="#301934">
                <b>
                  {itemInfo.eth} ETH (${itemInfo.aud} AUD){" "}
                </b>
              </Typography>
            </CardContent>

            {/* Clicking on this button will take to the shopping cart page */}
            <Button
              variant="contained"
              size="large"
              sx={{ marginLeft: "auto", marginTop: "auto" }}
              onClick={handleTrade}
            >
              Trade Now
            </Button>
          </Card>
        </Container>
      </div>
    </>
  );
};
export default AssetProfile;
