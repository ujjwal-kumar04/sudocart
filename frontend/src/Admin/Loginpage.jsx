
// import React, { useState } from 'react';
// import { loginUser } from '../service/api';
// import Swal from 'sweetalert2';
// import { useNavigate } from 'react-router-dom';
// import {
//   TextField,
//   Button,
//   Box,
//   Typography,
//   Paper,
//   Link,
// } from '@mui/material';

// const LoginForm = ({ setLoggedInUser }) => {
//   const [data, setData] = useState({ username: '', password: '' });
//   const navigate = useNavigate();

//   const onChange = (e) => {
//     setData({ ...data, [e.target.name]: e.target.value });
//   };

//   const submit = async (e) => {
//     e.preventDefault();
//     try {
//       const res = await loginUser(data);
//       if (res.status === 200) {
//         Swal.fire('Success', res.data.message, 'success');

//         // ✅ Save user in state and localStorage
//         setLoggedInUser(res.data.user);
//         localStorage.setItem("loggedInUser", JSON.stringify({ user: res.data.user }));

//         navigate('/'); // Redirect after login
//       }
//     } catch (err) {
//       Swal.fire('Error', err.response?.data || 'Something went wrong', 'error');
//     }
//   };

//   return (
//     <Box
//       display="flex"
//       justifyContent="center"
//       alignItems="center"
//       minHeight="100vh"
//       bgcolor="#f5f5f5"
//     >
//       <Paper elevation={3} sx={{ padding: 4, width: 350 }}>
//         <Typography variant="h5" align="center" gutterBottom>
//           Login
//         </Typography>
//         <form onSubmit={submit}>
//           <TextField
//             label="Email or Mobile"
//             name="username"
//             variant="outlined"
//             fullWidth
//             margin="normal"
//             value={data.username}
//             onChange={onChange}
//             required
//           />
//           <TextField
//             label="Password"
//             name="password"
//             type="password"
//             variant="outlined"
//             fullWidth
//             margin="normal"
//             value={data.password}
//             onChange={onChange}
//             required
//           />
//           <Button
//             type="submit"
//             variant="contained"
//             fullWidth
//             color="primary"
//             sx={{ marginTop: 2 }}
//           >
//             Login
//           </Button>
//         </form>
//         <Typography variant="body2" align="center" mt={2}>
//           Don&apos;t have an account?{' '}
//           <Link href="/register" underline="hover">
//             Register
//           </Link>
//         </Typography>
//       </Paper>
//     </Box>
//   );
// };

// export default LoginForm;

import {
    Box,
    Button,
    Link,
    Paper,
    TextField,
    Typography,
} from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { loginUser } from '../service/api';

const LoginForm = ({ setLoggedInUser }) => {
  const [data, setData] = useState({ username: '', password: '' });
  const navigate = useNavigate();

  const onChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await loginUser(data);
      if (res.status === 200) {
        // Success toast
        Swal.fire({
          toast: true,
          position: 'top',
          icon: 'success',
          title: res.data.message,
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
        });

        setLoggedInUser(res.data.user);
        // Save user data with JWT token
        localStorage.setItem('loggedInUser', JSON.stringify({ 
          user: res.data.user,
          token: res.data.token 
        }));
        
        // Navigate based on user role
        if (res.data.user.role === 'seller') {
          navigate('/seller/dashboard');
        } else {
          navigate('/');
        }
      }
    } catch (err) {
      Swal.fire('Error', err.response?.data?.message || 'Something went wrong', 'error');
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      bgcolor="#f5f5f5"
    >
      <Paper elevation={3} sx={{ padding: 4, width: 350 }}>
        <Typography variant="h5" align="center" gutterBottom>
          Login
        </Typography>
        <form onSubmit={submit}>
          <TextField
            label="Email or Mobile"
            name="username"
            variant="outlined"
            fullWidth
            margin="normal"
            value={data.username}
            onChange={onChange}
            required
          />
          <TextField
            label="Password"
            name="password"
            type="password"
            variant="outlined"
            fullWidth
            margin="normal"
            value={data.password}
            onChange={onChange}
            required
          />
          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{ marginTop: 2, backgroundColor: 'white', color: 'black', border: '2px solid yellow' }}
          >
            Login
          </Button>
        </form>
        <Typography variant="body2" align="center" mt={2}>
          Don&apos;t have an account?{' '}
          <Link href="/register" underline="hover">
            Register
          </Link>
        </Typography>
      </Paper>
    </Box>
  );
};

export default LoginForm;
