// src/pages/UPIPaymentPage.jsx
import {
    Avatar,
    Box,
    Button,
    Divider,
    FormControlLabel,
    Paper,
    Radio,
    RadioGroup,
    TextField,
    Typography
} from "@mui/material";
import axios from "axios";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const UPIPaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { user, totalAmount, address, cartItems } = location.state || {};

  const [upiMethod, setUpiMethod] = useState("PhonePe");
  const [upiId, setUpiId] = useState("");

  const handleFinalPayment = async () => {
    if (!upiId.trim()) {
      Swal.fire({
        toast: true,
        position: "top",
        icon: "warning",
        title: "Please enter your UPI ID",
        showConfirmButton: false,
        timer: 2000,
      });
      return;
    }

    // Enhance cart items with productId and sellerId
    const enhancedCartItems = cartItems.map(item => ({
      productId: item._id,
      sellerId: item.sellerId,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      img: item.img,
      status: 'Ordered'
    }));

    const orderData = {
      username: user?.email || user?.mobile,
      fullName: user?.fullName || user?.name,
      email: user?.email,
      mobile: user?.mobile,
      address,
      paymentMethod: "upi",
      bank: upiMethod,
      upiId,
      cartItems: enhancedCartItems,
      totalAmount,
    };

    try {
      await axios.post("http://localhost:8000/order", orderData);
      Swal.fire({
        toast: true,
        position: "top",
        icon: "success",
        title: "Payment Successful & Order Placed!",
        showConfirmButton: false,
        timer: 2000,
      });
      navigate("/");
    } catch (err) {
      Swal.fire({
        toast: true,
        position: "top",
        icon: "error",
        title: "Payment failed!",
        showConfirmButton: false,
        timer: 2000,
      });
    }
  };

  return (
    <Box display="flex" justifyContent="center" mt={5}>
      <Paper elevation={4} sx={{ p: 5, width: "100%", maxWidth: 700, borderRadius: 3 }}>
        <Typography variant="h4" textAlign="center" fontWeight={600} gutterBottom>
          UPI Payment
        </Typography>

        <Typography>Name: {user?.name}</Typography>
        <Typography>Email: {user?.email}</Typography>
        <Typography>Mobile: {user?.mobile}</Typography>
        <Typography sx={{ mt: 1 }}>Deliver To: {address}</Typography>

        <Divider sx={{ my: 3 }} />

        <Typography variant="subtitle1" fontWeight={500}>Select UPI Method:</Typography>
        <RadioGroup
          row
          value={upiMethod}
          onChange={(e) => setUpiMethod(e.target.value)}
          sx={{ mb: 2 }}
        >
          <FormControlLabel value="PhonePe" control={<Radio />} label="PhonePe" />
          <FormControlLabel value="Google Pay" control={<Radio />} label="Google Pay" />
          <FormControlLabel value="Paytm" control={<Radio />} label="Paytm" />
          <FormControlLabel value="BHIM" control={<Radio />} label="BHIM" />
        </RadioGroup>

        <TextField
          label="Enter your UPI ID"
          variant="outlined"
          fullWidth
          value={upiId}
          onChange={(e) => setUpiId(e.target.value)}
          placeholder="example@upi"
          sx={{ mb: 3 }}
        />

        <Typography variant="subtitle1" fontWeight={500}>Items:</Typography>
        {cartItems?.map((item) => (
          <Box key={item._id} display="flex" alignItems="center" gap={2} mt={2}>
            <Avatar src={item.img} variant="square" sx={{ width: 60, height: 60 }} />
            <Box>
              <Typography>{item.name}</Typography>
              <Typography variant="body2">
                ₹{item.price} x {item.quantity} = ₹{item.price * item.quantity}
              </Typography>
            </Box>
          </Box>
        ))}

        {/* ✅ Amount after items */}
        <Typography variant="h6" align="right" mt={4}>
          Amount to Pay: ₹{totalAmount}
        </Typography>

        <Box mt={4} display="flex" justifyContent="center">
          <Button
  variant="contained"
  size="large"
  onClick={handleFinalPayment}
  sx={{ backgroundColor: "#2ecc71", '&:hover': { backgroundColor: "#d32f2f" } }}
>
  Confirm UPI Payment
</Button>

        </Box>
      </Paper>
    </Box>
  );
};

export default UPIPaymentPage;
