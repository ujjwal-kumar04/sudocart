import axios from 'axios';
import Swal from "sweetalert2";

const LOCAL_API_URL = "http://localhost:8000";
const PROD_API_URL = "https://sudocart.onrender.com";

const envApiUrl = (process.env.REACT_APP_API_URL || '').trim();
const isBrowser = typeof window !== 'undefined';
const isLocalFrontend = isBrowser && (
  window.location.hostname === 'localhost' ||
  window.location.hostname === '127.0.0.1'
);

let URL = envApiUrl || (isLocalFrontend ? LOCAL_API_URL : PROD_API_URL);

// Safety: never allow deployed frontend to call loopback API endpoints.
if (!isLocalFrontend && /localhost|127\.0\.0\.1/i.test(URL)) {
  URL = PROD_API_URL;
}

export const API_BASE_URL = URL;

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
export const loginSeller = (data) => axios.post(`${URL}/seller/login`, data);
export const getUserInfo = () => 
  axios.get(`${URL}/userinfo`, { headers: getAuthHeaders() });

// Product APIs
export const getAllProducts = () => axios.get(`${URL}/api/products`);
export const getProductById = (id) => axios.get(`${URL}/api/products/${id}`);
export const getProductByIdForSeller = (id, token) =>
  axios.get(`${URL}/api/products/${id}`, { headers: { Authorization: `Bearer ${token}` } });
export const getProductsByCategory = (category) => axios.get(`${URL}/api/products/category/${category}`);
export const getProductsBySubcategory = (subcategory) => axios.get(`${URL}/api/products/subcategory/${subcategory}`);
export const getProductsByCategoryAndSubcategory = (category, subcategory) => 
  axios.get(`${URL}/api/products/category/${category}/subcategory/${subcategory}`);
export const getRandomProducts = (count = 12) => axios.get(`${URL}/api/products/random/${count}`);
export const createProduct = (data, token) =>
  axios.post(`${URL}/api/products`, data, { headers: { Authorization: `Bearer ${token}` } });
export const updateProduct = (id, data, token) =>
  axios.put(`${URL}/api/products/${id}`, data, { headers: { Authorization: `Bearer ${token}` } });
export const deleteProduct = (id, token) =>
  axios.delete(`${URL}/api/products/${id}`, { headers: { Authorization: `Bearer ${token}` } });

// Cart APIs
export const addCartItem = (payload, token) =>
  axios.post(`${URL}/cart`, payload, { headers: token ? { Authorization: `Bearer ${token}` } : {} });
export const getCartByUsername = (username) => axios.get(`${URL}/cart/${username}`);
export const deleteCartItem = (id) => axios.delete(`${URL}/cart/${id}`);
export const updateCartItemQuantity = (id, quantity) =>
  axios.put(`${URL}/cart/${id}`, { quantity });

// Watchlist APIs
export const addWatchlistItem = (payload, token) =>
  axios.post(`${URL}/watchlist`, payload, { headers: token ? { Authorization: `Bearer ${token}` } : {} });
export const getWatchlistByUsername = (username) => axios.get(`${URL}/watchlist/${username}`);
export const deleteWatchlistItem = (id) => axios.delete(`${URL}/watchlist/${id}`);

// Order APIs
export const createOrder = (data) => axios.post(`${URL}/order`, data);
export const getAllOrders = () => axios.get(`${URL}/order/all`);

// Seller APIs
export const getSellerProducts = (token) =>
  axios.get(`${URL}/api/seller/products`, { headers: { Authorization: `Bearer ${token}` } });
export const getSellerAnalytics = (token) =>
  axios.get(`${URL}/api/seller/analytics`, { headers: { Authorization: `Bearer ${token}` } });
export const getSellerOrderAnalytics = (token) =>
  axios.get(`${URL}/api/seller/order-analytics`, { headers: { Authorization: `Bearer ${token}` } });
export const getSellerOrders = (token) =>
  axios.get(`${URL}/api/seller/orders`, { headers: { Authorization: `Bearer ${token}` } });
export const updateSellerOrderItemStatus = (orderId, itemIndex, status, token) =>
  axios.put(
    `${URL}/api/seller/order/${orderId}/item/${itemIndex}/status`,
    { status },
    { headers: { Authorization: `Bearer ${token}` } }
  );

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
      await addCartItem({
        username,
        product,
      }, token);
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
      await addWatchlistItem({
        username,
        product,
      }, token);
      
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
