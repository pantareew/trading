/** This page is will display all items in the shopping cart **/

import { useState, useEffect } from "react";
import {
  Alert,
  Box,
  Container,
  Modal,
  Typography,
  Button,
  AlertTitle,
} from "@mui/material";
import { Clear } from "@mui/icons-material";
import { HrCard } from "../components";
import axios from "axios";
import { useUser } from "../contexts/User";
const Checkout = () => {
  const { userData } = useUser();

  /*Event handling for confirm popup */
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  /*Event handling for success alert*/
  const [showSuccess, setSuccess] = useState(false);
  /*automatically close modal after confirmed*/
  useEffect(() => {
    if (showSuccess) {
      setTimeout(() => {
        setSuccess(false);
        handleClose();
        window.location.reload();
      }, 3000);
    }
  }, [showSuccess]);

  /*Handle data from cart  */
  const [data, setData] = useState(null);
  useEffect(() => {
    axios
      .get("http://localhost:8000/cart")
      .then((res) => {
        const cartItem = res.data.map((item) => ({
          asset_id: item.asset_id,
          image: item.img,
          name: item.name,
          eth: item.eth,
          aud: item.aud,
          user_id: item.userid,
        }));
        setData(cartItem);
      })
      .catch((err) => console.error("Error fetching data from cart: ", err));
  }, []);
  if (data === null || data.length === 0) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          height: "80vh",
        }}
      >
        <Typography variant="h4" component="div" sx={{ alignSelf: "center" }}>
          No items in the carts
        </Typography>
      </div>
    );
  }

  /**Modal
   * Used to create the checkout popover with a backdrop
   **/
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 1,
  };

  //sum of cart in eth
  const total_eth = data.reduce((sum, item) => sum + item.eth, 0).toFixed(2);

  //sum of cart in aud
  const total_aud = data.reduce((sum, item) => sum + item.aud, 0).toFixed(2);

  const purchasedData = [];
  data.forEach((item) => {
    const purchasedItem = {
      assetId: item.asset_id,
      userId: item.user_id,
    };
    purchasedData.push(purchasedItem);
  });

  //handle confirm
  const handleConfirm = async () => {
    await axios.post("http://localhost:8000/transaction");
    await axios.post("http://localhost:8000/purchasedAssets", purchasedData);
    await axios.delete(`http://localhost:8000/cart?userid=${userData.id}`);
    setSuccess(true);
  };

  return (
    <Container maxWidth="xl">
      <Box
        sx={{
          minHeight: "80vh",
          maxHeight: "auto",
          marginY: 5,
        }}
      >
        <Typography
          variant="h3"
          component="div"
          sx={{ flexGrow: 1, paddingY: 5 }}
        >
          Checkout
        </Typography>
        {/*include HRcard component to display details of the item */}

        <HrCard items={data} />
        {/*check out button */}
        <div
          className="checkout-btn"
          style={{
            display: "flex",
            justifyContent: "right",
            paddingTop: "2rem",
          }}
        >
          <Button variant="contained" size="large" onClick={handleOpen}>
            Checkout
          </Button>
        </div>
        {/*Confirm pop up */}
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography
              variant="h6"
              sx={{ display: "inline-block", paddingLeft: 19 }}
            >
              Checkout
            </Typography>
            <Clear
              onClick={handleClose}
              sx={{
                paddingTop: 2,
                paddingLeft: 15,
                display: "inline-block",
                fontSize: 30,
              }}
            ></Clear>
            <hr />

            <Typography sx={{ fontSize: 18, paddingLeft: 2 }}>
              Items:
            </Typography>

            {/*details inside checkout pop up */}
            {data.map((item, index) => (
              <div key={index}>
                <br />
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",

                    border: "1px solid grey",
                    borderRadius: 5,
                    height: 65,
                  }}
                >
                  <div style={{ position: "relative" }}>
                    <img
                      style={{
                        paddingLeft: "15px",
                        width: 100,
                        height: 65,
                        objectFit: "cover",
                      }}
                      src={item.image}
                      alt={item.name}
                    />

                    <Typography
                      sx={{
                        display: "inline",
                        fontSize: 18,
                        position: "absolute",
                        top: "30%",
                        width: "100%",
                        paddingLeft: 2,
                      }}
                    >
                      <b>{item.name}</b>
                    </Typography>
                  </div>
                  <Typography
                    sx={{
                      alignSelf: "center",
                      fontSize: 15,
                      color: "grey",
                      marginX: "5px",
                    }}
                  >
                    {item.eth} ETH
                  </Typography>
                </Box>
              </div>
            ))}
            <br />
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Typography
                sx={{
                  display: "inline",
                  fontSize: 18,
                  paddingLeft: 2,
                }}
              >
                Total price
              </Typography>
              <div>
                <Typography
                  sx={{
                    paddingLeft: "16px",
                    fontSize: 20,
                    color: "blue",
                  }}
                >
                  {total_eth} ETH
                </Typography>
                <Typography
                  sx={{
                    fontSize: 16,
                    color: "grey",
                  }}
                >
                  ({total_aud} AUD)
                </Typography>
              </div>
            </div>

            <br />

            <Button
              variant="contained"
              size="large"
              onClick={handleConfirm}
              sx={{
                marginLeft: "auto",
                marginRight: "auto",
                marginTop: 5,
                display: "block",
              }}
            >
              Confirm
            </Button>

            <br />
            <br />
            {/*show success alert only after clicked the confirm button */}
            {showSuccess && (
              <Alert severity="success">
                <AlertTitle>
                  <strong>Successfully Traded!</strong>
                </AlertTitle>
              </Alert>
            )}
          </Box>
        </Modal>
      </Box>
    </Container>
  );
};

export default Checkout;
