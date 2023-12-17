//this page displays all details involved with transaction
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import axios from "axios";
import { useUser } from "../contexts/User";
import { useNavigate } from "react-router-dom";
export default function Transactions() {
  const [txn, setTxn] = useState([]);
  const { userData } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (userData) {
      axios
        .get("http://localhost:8000/transactions")
        .then((res) => {
          setTxn(res.data);
        })
        .catch((err) => {
          console.error("Can't retrieve transaction data", err);
        });
    } else {
      navigate("/login");
    }
  });

  return (
    <>
      <TableContainer component={Paper}>
        <Table
          sx={{
            minWidth: 650,
            marginTop: "4rem",
            minHeight: "80vh",
            maxHeight: "auto",
          }}
          aria-label="simple table"
        >
          {/*columns of the table */}
          <TableHead>
            <TableRow sx={{ border: "2px solid black" }}>
              <TableCell>
                <b>Transaction Hash</b>
              </TableCell>

              <TableCell>
                <b>Block</b>
              </TableCell>

              <TableCell>
                <b>From</b>
              </TableCell>
              <TableCell>
                <b>To</b>
              </TableCell>
              <TableCell>
                <b>Date</b>
              </TableCell>
              <TableCell>
                <b>Status</b>
              </TableCell>
            </TableRow>
          </TableHead>

          {/*rows of the table */}
          <TableBody>
            {txn === null || txn.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      height: "80vh",
                    }}
                  >
                    <Typography
                      variant="h4"
                      component="div"
                      sx={{ alignSelf: "center" }}
                    >
                      No transactions are found
                    </Typography>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              /*map input value with corresponding column */
              txn.map((transaction) => (
                <TableRow
                  key={transaction.hash}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell>{transaction.hash}</TableCell>
                  <TableCell>{transaction.block}</TableCell>
                  <TableCell>{transaction.from}</TableCell>
                  <TableCell>{transaction.to}</TableCell>
                  <TableCell>{transaction.date}</TableCell>
                  <TableCell
                    style={{
                      color: transaction.status === 1 ? "lightgreen" : "red",
                    }}
                  >
                    {transaction.status === 1 ? "Completed" : "Incomplete"}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
