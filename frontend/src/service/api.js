import axios from 'axios';
import Swal from "sweetalert2";
const URL = "http://localhost:8000";

// Helper function to get JWT token from localStorage
const getAuthToken = () => {
  const userData = JSON.parse(localStorage.getItem("loggedInUser"));
  return userData?.token;
};

// Helper function to set auth header
const getAuthHeaders = () => {
  const token = getAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const addUser = (data) => axios.post(`${URL}/register`, data);
export const loginUser = (data) => axios.post(`${URL}/login`, data);
export const getUserInfo = () => 
  axios.get(`${URL}/userinfo`, { headers: getAuthHeaders() });

// Product APIs
export const getAllProducts = () => axios.get(`${URL}/api/products`);
export const getProductById = (id) => axios.get(`${URL}/api/products/${id}`);
export const getProductsByCategory = (category) => axios.get(`${URL}/api/products/category/${category}`);
export const getProductsBySubcategory = (subcategory) => axios.get(`${URL}/api/products/subcategory/${subcategory}`);
export const getProductsByCategoryAndSubcategory = (category, subcategory) => 
  axios.get(`${URL}/api/products/category/${category}/subcategory/${subcategory}`);
export const getRandomProducts = (count = 12) => axios.get(`${URL}/api/products/random/${count}`);

export const useCart = () => {
  const addToCart = async (product) => {
    const userData = JSON.parse(localStorage.getItem("loggedInUser"));
    const username = userData?.user?.username || userData?.user?.email || userData?.user?.mobile;
    const token = userData?.token;

    if (!username || !token) {
      alert("Please login first");
      return;
    }

    try {
      await axios.post("http://localhost:8000/cart", {
        username,
        product,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });               
      Swal.fire({
        toast: true,
        position: 'top',
        icon: 'success',
        title: 'Item added to cart!',
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true
      });
    } catch (error) {
      console.error("Error adding to cart:", error);
      if (error.response?.status === 401 || error.response?.status === 403) {
        alert("Session expired. Please login again.");
        localStorage.removeItem("loggedInUser");
        window.location.href = "/login";
      }
    }
  };

  return { addToCart };
};
export const useWatchlist = () => {
  const addToWatchlist = async (product) => {
    const userData = JSON.parse(localStorage.getItem("loggedInUser"));
    const username = userData?.user?.username || userData?.user?.email || userData?.user?.mobile;
    const token = userData?.token;

    if (!username || !token) {
      alert("Please login first");
      return;
    }

    try {
      await axios.post("http://localhost:8000/watchlist", {
        username,
        product,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      Swal.fire({
        toast: true,
        position: 'top',
        icon: 'success',
        title: 'Added to watchlist!',
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true
      });
    } catch (error) {
      console.error("Failed to save watchlist:", error);
      if (error.response?.status === 401 || error.response?.status === 403) {
        alert("Session expired. Please login again.");
        localStorage.removeItem("loggedInUser");
        window.location.href = "/login";
      }
    }
  };

  return { addToWatchlist };
};
