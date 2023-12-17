import { Container, Typography, Button } from "@mui/material";
import { Assets } from "../components";
import { useState, useEffect } from "react";
import axios from "axios";
import { useUser } from "../contexts/User";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  //get userData from Login
  const { userData, updateUser } = useUser();
  const navigate = useNavigate();

  //set Log out
  const handleLogout = () => {
    updateUser(null);
    navigate("/login");
  };
  /*Handle data from database  */
  const [assets, setAssets] = useState(null);
  useEffect(() => {
    axios
      .get(`http://localhost:8000/purchasedAssets/${userData.id}`)
      .then((res) => {
        const purchasedAssets = res.data.map((item) => ({
          asset_id: item.asset_id,
          image: item.img,
          title: item.name,
          price: `${item.eth} ETH`,
        }));
        setAssets(purchasedAssets);
      })
      .catch((err) => console.error("Error fetching purchased assets: ", err));
  });

  return (
    <>
      <Container
        maxWidth="xl"
        sx={{
          display: "flex",
          marginTop: "5rem",
          marginBottom: "10px",
          textAlign: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ flex: "1", marginLeft: "6rem" }}>
          <img
            src={userData.pic}
            style={{
              minWidth: "20vw",
              maxHeight: "35vh",
              marginTop: "10px",
              borderRadius: "50%",
            }}
          />
          <Typography variant="h4" fontFamily="Roboto" color="#4219fa">
            {userData.name}
          </Typography>
        </div>
        <Button
          onClick={handleLogout}
          variant="contained"
          sx={{ alignSelf: "flex-end" }}
        >
          Log out
        </Button>
      </Container>

      {assets ? (
        <Assets heading="My Assets" items={assets} />
      ) : (
        <Typography
          variant="h5"
          component="div"
          sx={{
            height: "40vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          You have not purchased any item yet.
        </Typography>
      )}
    </>
  );
}
