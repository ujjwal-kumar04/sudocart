import { useState } from 'react';
// export default App;
import { useEffect } from 'react';
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import Swal from 'sweetalert2';
import AboutPage from './Admin/AboutPage';
import AddProduct from './Admin/AddProduct';
import AdminLogin from './Admin/Adminlogin';
import AdminOrdersPage from './Admin/Adminpage';
import EditProduct from './Admin/EditProduct';
import Loginpage from "./Admin/Loginpage";
import RegisterChoice from './Admin/RegisterChoice';
import RegisterForm from "./Admin/RegisterForm";
import SellerDashboard from './Admin/SellerDashboard';
import Sellerlogin from './Admin/Sellerlogin';
import SellerOrders from './Admin/SellerOrders';
import SellerRegister from './Admin/SellerRegister';
import CartPage from './components/CartPage';
import ProceedToPayPage from "./components/checkout";
import Homepage from "./components/Homepage";
import Kidspage from "./components/Kidspage";
import Menpage from "./components/Menpage";
import Paymentpage from './components/Paymentpage';
import Shop from "./components/Shop";
import WatchlistPage from "./components/Watchlistpage";
import Womenpage from "./components/Womenpage";
import Companyinfo from './pages/Companyinfo';
import ContectSection from './pages/Contectsection';
import Productdetail from "./pages/Productdetail";

function RequireAuth({ children }) {
  const location = useLocation();
  const loggedInUserRaw = localStorage.getItem('loggedInUser');
  let loggedInUser = null;

  try {
    loggedInUser = loggedInUserRaw ? JSON.parse(loggedInUserRaw) : null;
  } catch (error) {
    loggedInUser = null;
  }

  const isLoggedIn = Boolean(loggedInUser?.token && loggedInUser?.user);

  useEffect(() => {
    if (!isLoggedIn) {
      Swal.fire({
        toast: true,
        position: 'top',
        icon: 'warning',
        title: 'Please login first',
        showConfirmButton: false,
        timer: 1800,
        timerProgressBar: true
      });
    }
  }, [isLoggedIn]);

  if (!isLoggedIn) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}

function App() {
 const [loggedInUser, setLoggedInUser] = useState(() => {
    const saved = localStorage.getItem('loggedInUser');
    return saved ? JSON.parse(saved).user : null;
  });
  return (
   
      <Routes>
        <Route path="/" exact element={<Homepage />} />
        <Route path="/login" exact element={<Loginpage  setLoggedInUser={setLoggedInUser}/>} />
        <Route
          path="/userinfo"
          element={
            <RequireAuth>
              <AboutPage user={loggedInUser} />
            </RequireAuth>
          }
        />
        
        
        {/* Registration Routes */}
        <Route path="/register" exact element={<RegisterChoice />} />
        <Route path="/register/user" exact element={<RegisterForm />} />
        <Route path="/register/seller" exact element={<SellerRegister />} />
        
        <Route path="/Shop" exact element={<Shop />} />
        <Route path="/Menpage" exact element={<Menpage />} />
        <Route path="/Womenpage" exact element={<Womenpage />} />
        <Route path="/Kidspage" exact element={<Kidspage />} />
        <Route path="/product/:id" element={<Productdetail />} />
        <Route
          path="/cart"
          exact
          element={
            <RequireAuth>
              <CartPage user={loggedInUser} />
            </RequireAuth>
          }
        />
        <Route
          path="/watchlist"
          element={
            <RequireAuth>
              <WatchlistPage user={loggedInUser} />
            </RequireAuth>
          }
        />
        <Route
          path="/checkout"
          element={
            <RequireAuth>
              <ProceedToPayPage />
            </RequireAuth>
          }
        />
        <Route path="/admin" exact  element={<AdminLogin/>}/>
        <Route path="admin/orders" element={<AdminOrdersPage/>}></Route>
        <Route path="/payment" element={<Paymentpage />} />
        <Route path="/contect" element={<ContectSection/>}></Route>
        
        {/* Seller Routes */}
        <Route path="/seller/login" element={<Sellerlogin />} />
        <Route path="/seller/dashboard" element={<SellerDashboard />} />
        <Route path="/seller/orders" element={<SellerOrders />} />
        <Route path="/seller/add-product" element={<AddProduct />} />
        <Route path="/seller/edit-product/:id" element={<EditProduct />} />
      </Routes>
    // </CartProvider>
  );
}





export default App;
