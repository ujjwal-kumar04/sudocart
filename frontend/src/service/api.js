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

const isAbsoluteHttpUrl = /^https?:\/\//i.test(envApiUrl);

let URL = isAbsoluteHttpUrl
  ? envApiUrl
  : (isLocalFrontend ? LOCAL_API_URL : PROD_API_URL);

const normalizedUrl = URL.replace(/\/$/, '');
const currentOrigin = isBrowser ? window.location.origin.replace(/\/$/, '') : '';
const isSelfOrigin = isBrowser && normalizedUrl === currentOrigin;

// Safety: never allow deployed frontend to call loopback API endpoints.
if (!isLocalFrontend && (/localhost|127\.0\.0\.1/i.test(URL) || isSelfOrigin)) {
  URL = PROD_API_URL;
}

const normalizeBaseUrl = (value) => value.replace(/\/$/, '');
URL = normalizeBaseUrl(URL);

export const API_BASE_URL = URL;
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 20000
});

const getLoggedInUserData = () => {
  try {
    const rawUserData = localStorage.getItem("loggedInUser");
    return rawUserData ? JSON.parse(rawUserData) : null;
  } catch (error) {
    return null;
  }
};

// Helper function to get JWT token from localStorage
const getAuthToken = () => {
  const userData = getLoggedInUserData();
  return userData?.token;
};

// Helper function to set auth header
const getAuthHeaders = () => {
  const token = getAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const loginUser = (data) => apiClient.post('/login', data);
export const loginSeller = (data) => apiClient.post('/seller/login', data);
export const getUserInfo = () => 
  apiClient.get('/userinfo', { headers: getAuthHeaders() });

// Product APIs
export const addUser = (data) => apiClient.post('/register', data);
export const getAllProducts = () => apiClient.get('/api/products');
export const getProductById = (id) => apiClient.get(`/api/products/${id}`);
export const getProductByIdForSeller = (id, token) =>
  apiClient.get(`/api/products/${id}`, { headers: { Authorization: `Bearer ${token}` } });
export const getProductsByCategory = (category) => apiClient.get(`/api/products/category/${category}`);
export const getProductsBySubcategory = (subcategory) => apiClient.get(`/api/products/subcategory/${subcategory}`);
export const getProductsByCategoryAndSubcategory = (category, subcategory) => 
  apiClient.get(`/api/products/category/${category}/subcategory/${subcategory}`);
export const getRandomProducts = (count = 12) => apiClient.get(`/api/products/random/${count}`);
export const createProduct = (data, token) =>
  apiClient.post('/api/products', data, { headers: { Authorization: `Bearer ${token}` } });
export const updateProduct = (id, data, token) =>
  apiClient.put(`/api/products/${id}`, data, { headers: { Authorization: `Bearer ${token}` } });
export const deleteProduct = (id, token) =>
  apiClient.delete(`/api/products/${id}`, { headers: { Authorization: `Bearer ${token}` } });

// Cart APIs
export const addCartItem = (payload, token) =>
  apiClient.post('/cart', payload, { headers: token ? { Authorization: `Bearer ${token}` } : {} });
export const getCartByUsername = (username) => apiClient.get(`/cart/${username}`);
export const deleteCartItem = (id) => apiClient.delete(`/cart/${id}`);
export const updateCartItemQuantity = (id, quantity) =>
  apiClient.put(`/cart/${id}`, { quantity });

// Watchlist APIs
export const addWatchlistItem = (payload, token) =>
  apiClient.post('/watchlist', payload, { headers: token ? { Authorization: `Bearer ${token}` } : {} });
export const getWatchlistByUsername = (username) => apiClient.get(`/watchlist/${username}`);
export const deleteWatchlistItem = (id) => apiClient.delete(`/watchlist/${id}`);

// Order APIs
export const createOrder = (data) => apiClient.post('/order', data);
export const getAllOrders = () => apiClient.get('/order/all');
export const getMyOrders = () =>
  apiClient.get('/order/my', { headers: getAuthHeaders() });
export const submitProductReview = (productId, data) =>
  apiClient.post(`/api/products/${productId}/reviews`, data, { headers: getAuthHeaders() });

// Seller APIs
export const getSellerProducts = (token) =>
  apiClient.get('/api/seller/products', { headers: { Authorization: `Bearer ${token}` } });
export const getSellerAnalytics = (token) =>
  apiClient.get('/api/seller/analytics', { headers: { Authorization: `Bearer ${token}` } });
export const getSellerOrderAnalytics = (token) =>
  apiClient.get('/api/seller/order-analytics', { headers: { Authorization: `Bearer ${token}` } });
export const getSellerOrders = (token) =>
  apiClient.get('/api/seller/orders', { headers: { Authorization: `Bearer ${token}` } });
export const updateSellerOrderItemStatus = (orderId, itemIndex, status, token) =>
  apiClient.put(
    `/api/seller/order/${orderId}/item/${itemIndex}/status`,
    { status },
    { headers: { Authorization: `Bearer ${token}` } }
  );

export const useCart = () => {
  const addToCart = async (product) => {
    const userData = getLoggedInUserData();
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
    const userData = getLoggedInUserData();
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
