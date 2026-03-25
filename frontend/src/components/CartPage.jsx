import { Add, Delete, Remove } from "@mui/icons-material";
import {
    Avatar,
    Box,
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { deleteCartItem, getCartByUsername, updateCartItemQuantity } from "../service/api";

const CartPage = ({ username }) => {
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();
  const user = username || JSON.parse(localStorage.getItem("loggedInUser"))?.user;

  useEffect(() => {
    if (!user) {
      Swal.fire({
        toast: true,
        position: "top",
        icon: "warning",
        title: "Please login first",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true
      });
      navigate("/login");
      return;
    }

    const fetchCart = async () => {
      const userNameOrEmail = user.username || user.email || user.mobile;
      try {
        const res = await getCartByUsername(userNameOrEmail);
        setCartItems(res.data);
      } catch (err) {
        console.error("Error fetching cart:", err);
      }
    };

    fetchCart();
  }, [user, navigate]);

  const handleDelete = async (id) => {
    try {
      await deleteCartItem(id);
      setCartItems(cartItems.filter((item) => item._id !== id));
    } catch (err) {
      console.error("Failed to delete item:", err);
    }
  };

  const handleQuantityChange = async (id, newQty) => {
    if (newQty < 1) return;
    try {
      const res = await updateCartItemQuantity(id, newQty);
      setCartItems(
        cartItems.map((item) =>
          item._id === id ? { ...item, quantity: res.data.quantity } : item
        )
      );
    } catch (err) {
      console.error("Failed to update quantity:", err);
    }
  };

  const getTotal = () => {
    return cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  };

  return (
    <Box display="flex" justifyContent="center" mt={{ xs: 2, md: 4 }} px={{ xs: 1, md: 0 }}>
      <Paper elevation={3} sx={{ p: { xs: 2, md: 4 }, width: { xs: "100%", md: 800 }, maxWidth: 900 }}>
        <Typography variant="h5" gutterBottom>
          Your Cart
        </Typography>

        {cartItems.length === 0 ? (
          <Typography variant="body1">Your cart is empty.</Typography>
        ) : (
          <>
            <TableContainer sx={{ overflowX: "auto" }}>
              <Table sx={{ minWidth: 640 }}>
                <TableHead>
                  <TableRow>
                    <TableCell>Product</TableCell>
                    <TableCell align="center">Price</TableCell>
                    <TableCell align="center">Quantity</TableCell>
                    <TableCell align="center">Delete</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {cartItems.map((item) => (
                    <TableRow key={item._id}>
                      <TableCell>
                        <Box display="flex" alignItems="center" gap={2}>
                          <Avatar
                            src={item.img}
                            alt={item.name}
                            variant="square"
                            sx={{ width: 70, height: 90, borderRadius: 2 }}
                          />
                          <Typography>{item.name}</Typography>
                        </Box>
                      </TableCell>

                      <TableCell align="center">₹{item.price}</TableCell>

                      <TableCell align="center">
                        <Box display="flex" alignItems="center" justifyContent="center">
                          <IconButton
                            onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                            sx={{ color: "green" }}
                          >
                            <Add />
                          </IconButton>

                          <Typography variant="body1" sx={{ mx: 1, minWidth: 20, textAlign: "center" }}>
                            {item.quantity}
                          </Typography>

                          <IconButton
                            onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                            sx={{ color: "orange" }}
                          >
                            <Remove />
                          </IconButton>
                        </Box>
                      </TableCell>

                      <TableCell align="center">
                        <IconButton
                          color="error"
                          onClick={() => handleDelete(item._id)}
                          sx={{
                            "&:hover": {
                              backgroundColor: "rgba(255, 0, 0, 0.1)"
                            }
                          }}
                        >
                          <Delete />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <Typography variant="h6" align="right" mt={2}>
              Total: ₹{getTotal()}
            </Typography>

            <button
              style={{
                backgroundColor: "#2ecc71",
                color: "white",
                border: "none",
                padding: "10px 20px",
                borderRadius: "5px",
                cursor: "pointer",
                fontWeight: "bold",
                width: "100%",
                maxWidth: "280px",
                marginTop: "10px"
              }}
              onClick={() =>
                navigate("/checkout", {
                  state: {
                    cartItems,
                    totalAmount: getTotal(),
                    user
                  }
                })
              }
            >
              Proceed to Pay
            </button>
          </>
        )}
      </Paper>
    </Box>
  );
};

export default CartPage;

