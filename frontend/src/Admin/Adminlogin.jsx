import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const AdminLogin = () => {
  const [admin, setAdmin] = useState({ username: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setAdmin({ ...admin, [e.target.name]: e.target.value });
  };

  const handleLogin = () => {
    const { username, password } = admin;

    // Hardcoded admin login
    if (username === "admin" && password === "admin123") {
      localStorage.setItem("isAdmin", true);
      navigate("/admin/orders");
    } else {
           Swal.fire({
              toast: true,
              position: 'top',
              icon: 'warning',
              title: 'Invalid Admin Credentials',
              showConfirmButton: false,
              timer: 2000,
              timerProgressBar: true
            });
    }
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" height="80vh">
      <Paper elevation={3} sx={{ p: 4, width: 400 }}>
        <Typography variant="h5" gutterBottom>
          Admin Login
        </Typography>
        <TextField
          fullWidth
          label="Username"
          name="username"
          margin="normal"
          value={admin.username}
          onChange={handleChange}
        />
        <TextField
          fullWidth
          label="Password"
          name="password"
          type="password"
          margin="normal"
          value={admin.password}
          onChange={handleChange}
        />
        <Button fullWidth variant="contained" color="primary" onClick={handleLogin} sx={{ mt: 2 }}>
          Login
        </Button>
      </Paper>
    </Box>
  );
};

export default AdminLogin;
