import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  Avatar,
  Button,
  Divider,
  IconButton
} from "@mui/material";
import { Delete } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const WatchlistPage = ({username}) => {
  const [watchlist, setWatchlist] = useState([]);
  const navigate = useNavigate();
  const user = username|| JSON.parse(localStorage.getItem("loggedInUser"))?.user;

  useEffect(() => {
    if (!user) {
   
  Swal.fire({
  toast: true,
  position: 'top',
  icon: 'warning',
  title: 'Please login first',
  showConfirmButton: false,
  
});
      navigate("/login");
      return;
    }

    const fetchWatchlist = async () => {
      const username = user.username || user.email || user.mobile;
      try {
        const res = await axios.get(`http://localhost:8000/watchlist/${username}`);
        setWatchlist(res.data);
      } catch (err) {
        console.error("Error loading watchlist", err);
      }
    };

    fetchWatchlist();
  }, [user, navigate]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/watchlist/${id}`);
      setWatchlist(watchlist.filter((item) => item._id !== id));
    } catch (err) {
      console.error("Delete failed", err);
    }
  };
  const handleMoveToCart = async (item) => {
    const username = user.username || user.email || user.mobile;
    try {
      await axios.post("http://localhost:8000/cart", {
        username,
        product: { ...item, quantity: 1 },
      });
      await axios.delete(`http://localhost:8000/watchlist/${item._id}`);
      setWatchlist(watchlist.filter((w) => w._id !== item._id));
      
     Swal.fire({
  toast: true,
  position: 'top',
  icon: 'success',
  title: 'Moved to cart',
  showConfirmButton: false,
  timer: 2000,
  timerProgressBar: true
});
    } catch (err) {
      console.error("Error moving to cart:", err);
    }
  };


  return (
    <Box display="flex" justifyContent="center" mt={4}>
      <Paper elevation={3} sx={{ padding: 4, width: 600 }}>
        <Typography variant="h5" gutterBottom>
          Your Watchlist  
        </Typography>

        {watchlist.length === 0 ? (
          <Typography>No items in watchlist.</Typography>
        ) : (
          <List>
            {watchlist.map((item) => (
              <React.Fragment key={item._id}>
                <ListItem
                  secondaryAction={
                    <IconButton edge="end" onClick={() => handleDelete(item._id)} color="error">
                      <Delete />
                    </IconButton>

                  }
                >

                  <Avatar sx={{
                    bgcolor: 'primary.main', width: 80, height: 100, fontSize: 20,borderRadius:4
                  }} variant="square" src={item.img} alt={item.name} />
                  <ListItemText primary={item.name} secondary={`₹${item.price}`} />
                <Button
  variant="contained"
  color="success"
  size="small"
  onClick={() => handleMoveToCart(item)}
  sx={{
    fontSize: '12px',          // small text
    padding: '4px 10px',
    backgroundColor: '#2ecc71', // green background
    textTransform: 'none',      // keep text as-is
    '&:hover': {
      backgroundColor: '#e74c3c', // red on hover
    },
  }}
>
  move to cart
</Button>
                </ListItem>
                <Divider />
              </React.Fragment>
            ))}
          </List>
        )}
      </Paper>
    </Box>
  );
};

export default WatchlistPage;
