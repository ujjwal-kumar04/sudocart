import { Delete } from "@mui/icons-material";
import {
    Avatar,
    Box,
    Button,
    Divider,
    IconButton,
    List,
    ListItem,
    ListItemText,
    Paper,
    Typography
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { addCartItem, deleteWatchlistItem, getWatchlistByUsername } from "../service/api";

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
        const res = await getWatchlistByUsername(username);
        setWatchlist(res.data);
      } catch (err) {
        console.error("Error loading watchlist", err);
      }
    };

    fetchWatchlist();
  }, [user, navigate]);

  const handleDelete = async (id) => {
    try {
      await deleteWatchlistItem(id);
      setWatchlist(watchlist.filter((item) => item._id !== id));
    } catch (err) {
      console.error("Delete failed", err);
    }
  };
  const handleMoveToCart = async (item) => {
    const username = user.username || user.email || user.mobile;
    try {
      await addCartItem({
        username,
        product: { ...item, quantity: 1 },
      });
      await deleteWatchlistItem(item._id);
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
    <Box display="flex" justifyContent="center" mt={{ xs: 2, md: 4 }} px={{ xs: 1, md: 0 }}>
      <Paper elevation={3} sx={{ p: { xs: 2, md: 4 }, width: { xs: '100%', md: 600 }, maxWidth: 760 }}>
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
                  sx={{
                    alignItems: { xs: 'flex-start', sm: 'center' },
                    gap: { xs: 1, sm: 2 },
                    flexWrap: { xs: 'wrap', sm: 'nowrap' }
                  }}
                  secondaryAction={
                    <IconButton edge="end" onClick={() => handleDelete(item._id)} color="error">
                      <Delete />
                    </IconButton>

                  }
                >

                  <Avatar sx={{
                    bgcolor: 'primary.main', width: 80, height: 100, fontSize: 20,borderRadius:4
                  }} variant="square" src={item.img} alt={item.name} />
                  <ListItemText
                    primary={item.name}
                    secondary={`₹${item.price}`}
                    sx={{ mr: { xs: 6, sm: 10 } }}
                  />
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
