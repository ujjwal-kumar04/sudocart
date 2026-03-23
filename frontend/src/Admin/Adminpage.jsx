import {
    Box,
    Divider,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { getAllOrders } from "../service/api";

  import { useNavigate } from "react-router-dom";
  
const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);



// inside component
const navigate = useNavigate();

useEffect(() => {
  const isAdmin = localStorage.getItem("isAdmin");
  if (!isAdmin) {
    navigate("/admin");
  }
}, [navigate]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await getAllOrders();
        setOrders(res.data);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
      }
    };

    fetchOrders();
  }, []);

  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>
        All User Orders
      </Typography>

      {orders.length === 0 ? (
        <Typography>No orders found.</Typography>
      ) : (
        orders.map((order, idx) => (
          <Paper key={idx} sx={{ p: 2, mb: 4 }}>
            <Typography variant="h6">Order #{idx + 1}</Typography>
            <Typography><strong>Username:</strong> {order.username}</Typography>
            <Typography><strong>Name:</strong> {order.fullName}</Typography>
            <Typography><strong>Email:</strong> {order.email}</Typography>
            <Typography><strong>Mobile:</strong> {order.mobile}</Typography>
            <Typography><strong>Address:</strong> {order.address}</Typography>
            <Typography><strong>Payment:</strong> {order.paymentMethod} {order.bank ? `(${order.bank})` : ''}</Typography>

            <Divider sx={{ my: 2 }} />

            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Product</TableCell>
                    <TableCell>Price</TableCell>
                    <TableCell>Quantity</TableCell>
                    <TableCell>Total</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {order.cartItems.map((item, i) => (
                    <TableRow key={i}>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>₹{item.price}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>₹{item.price * item.quantity}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <Typography variant="h6" align="right" sx={{ mt: 2 }}>
              Grand Total: ₹{order.totalAmount}
            </Typography>
          </Paper>
        ))
      )}
    </Box>
  );
};

export default AdminOrdersPage;
