
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import logo from "../Assets/logo.png";
import { getAllCategories, getCategoryIcon, getSubcategories } from '../data/categories';
import { getAllProducts } from "../service/api";

import {
  Box,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Popover
} from "@mui/material";

function Navbar() {
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [searchName, setSearchName] = useState("");
  const [products, setProducts] = useState([]);
  const [authState, setAuthState] = useState(() => localStorage.getItem("loggedInUser"));
  const navigate = useNavigate();

  const isLoggedIn = (() => {
    try {
      if (!authState) return false;
      const parsed = JSON.parse(authState);
      return Boolean(parsed?.user && parsed?.token);
    } catch (error) {
      return false;
    }
  })();

  useEffect(() => {
    const syncAuthState = () => setAuthState(localStorage.getItem("loggedInUser"));
    window.addEventListener("storage", syncAuthState);
    window.addEventListener("focus", syncAuthState);

    return () => {
      window.removeEventListener("storage", syncAuthState);
      window.removeEventListener("focus", syncAuthState);
    };
  }, []);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await getAllProducts();
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleSearch = () => {
    // Remove spaces and convert to lowercase for comparison
    const searchTerm = searchName.trim().toLowerCase().replace(/\s+/g, '');
    
    const matchedProduct = products.find(
      (p) => p.name.toLowerCase().replace(/\s+/g, '') === searchTerm
    );
    
    if (matchedProduct) {
      navigate(`/product/${matchedProduct._id}`);
    } else {
      Swal.fire({
        toast: true,
        position: 'top',
        icon: 'warning',
        title: 'Product not found!',
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true
      });
    }
  };

  // Popover logic
  const [anchorEl, setAnchorEl] = useState(null);
  const handleUserIconClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => setAnchorEl(null);
  const open = Boolean(anchorEl);

  const redirectToLoginFirst = () => {
    Swal.fire({
      toast: true,
      position: 'top',
      icon: 'warning',
      title: 'Please login first',
      showConfirmButton: false,
      timer: 1800,
      timerProgressBar: true
    });
    navigate('/login');
  };

  const handleProtectedNavigate = (path) => {
    if (!isLoggedIn) {
      redirectToLoginFirst();
      return;
    }
    navigate(path);
  };

  const handleOptionClick = (path) => {
    if ((path === '/userinfo' || path === '/cart' || path === '/watchlist') && !isLoggedIn) {
      redirectToLoginFirst();
      handleClose();
      return;
    }

    navigate(path);
    handleClose();
  };

  // Category dropdown logic
  const [categoryAnchor, setCategoryAnchor] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const categoryOpen = Boolean(categoryAnchor);

  const handleCategoryClick = (event) => {
    const category = event.currentTarget.getAttribute('data-category');
    setSelectedCategory(category);
    setCategoryAnchor(event.currentTarget);
  };

  const handleCategoryClose = () => {
    setCategoryAnchor(null);
    setSelectedCategory(null);
  };

  const handleSubcategoryClick = (category, subcategory) => {
    navigate('/Shop', { state: { category, subcategory } });
    handleCategoryClose();
  };
  const toggleMobileSearch = () => setShowMobileSearch((prev) => !prev);

  return (
    <>
      <nav className="navbar">
        <div className="navbar1">
          <div className="logo">
            <img src={logo} alt="SudoCart logo"></img><h5>SudoCart</h5>
          </div>

          <div className="search-box">
            <input
              type="text"
              placeholder="Search product by name"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
            />
            <button onClick={handleSearch}>
              <i className="fas fa-search"></i>
            </button>
          </div>

          {showMobileSearch && (
            <div className="mobile-search-panel">
              <input
                type="text"
                placeholder="Search product"
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
              <button onClick={handleSearch}>Go</button>
            </div>
          )}

          {/* ICONS SECTION */}
          <div className="icons" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <button className="mobile-search-btn" onClick={toggleMobileSearch} aria-label="Search">
              <i className="fas fa-search"></i>
            </button>
            {!isLoggedIn ? (
              <Button
                variant="contained"
                size="small"
                onClick={() => navigate("/login")}
                sx={{
                  textTransform: "none",
                  fontWeight: 800,
                  color: "black",
                  backgroundColor: "white",
                  border: "2px solid #ffe680",
                  '&:hover': {
                    backgroundColor: "#ffe680",
                    borderColor: "#ffe680"
                  }
                }}
              >
                Login
              </Button>
            ) : (
              <IconButton onClick={() => navigate('/userinfo')} title="Profile">
                <i className="fas fa-user-circle" style={{ fontSize: "24px" }}></i>
              </IconButton>
            )}

            {/* Cart Icon */}
            <button
              type="button"
              onClick={() => handleProtectedNavigate('/cart')}
              style={{ background: 'transparent', border: 'none', padding: 0, cursor: 'pointer', color: 'black' }}
              aria-label="Cart"
            >
              <i className="fas fa-shopping-cart" style={{ fontSize: "20px" }}></i>
            </button>

            {/* Popover Menu Icon */}
            <IconButton className="menu-toggle" onClick={handleUserIconClick}>
              <i className="fa-solid fa-bars" style={{ fontSize: "20px" }}></i>
            </IconButton>
          </div>
        </div>

        {/* Category Carousel */}
        <div className="category-carousel-container">
          <button 
            className="carousel-btn prev-btn"
            onClick={() => document.querySelector('.category-carousel').scrollBy({ left: -200, behavior: 'smooth' })}
          >
            <i className="fas fa-chevron-left"></i>
          </button>
          
          <div className="category-carousel">
            {getAllCategories().map(cat => (
              <div 
                key={cat}
                className="category-item"
                onClick={handleCategoryClick}
                data-category={cat}
              >
                <span className="category-icon">{getCategoryIcon(cat)}</span>
                <span className="category-name">{cat}</span>
                <i className="fas fa-chevron-down" style={{ fontSize: '10px', marginLeft: '5px' }}></i>
              </div>
            ))}
          </div>
          
          <button 
            className="carousel-btn next-btn"
            onClick={() => document.querySelector('.category-carousel').scrollBy({ left: 200, behavior: 'smooth' })}
          >
            <i className="fas fa-chevron-right"></i>
          </button>
        </div>
      </nav>

      {/* Category Subcategory Popover */}
      <Popover
        open={categoryOpen}
        anchorEl={categoryAnchor}
        onClose={handleCategoryClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        transformOrigin={{ vertical: "top", horizontal: "center" }}
        PaperProps={{
          style: {
            borderRadius: '8px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
            marginTop: '5px',
            border: '2px solid #ffe680'
          }
        }}
      >
        <Box sx={{ minWidth: '250px' }}>
          <div style={{
            padding: '8px 12px',
            background: '#ffe680',
            fontWeight: '600',
            fontSize: '14px'
          }}>
            {selectedCategory && getCategoryIcon(selectedCategory)} {selectedCategory}
          </div>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
            padding: '8px'
          }}>
            {selectedCategory && getSubcategories(selectedCategory).map((sub) => (
              <div
                key={sub}
                onClick={() => handleSubcategoryClick(selectedCategory, sub)}
                style={{
                  padding: '6px 10px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '13px',
                  border: '1px solid #dee2e6',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => e.target.style.background = '#ffe680'}
                onMouseLeave={(e) => e.target.style.background = 'transparent'}
              >
                › {sub}
              </div>
            ))}
          </div>
        </Box>
      </Popover>

      {/* Popover Menu */}
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Box sx={{ width: 200 }}>
          <List>
            <ListItem button onClick={() => handleOptionClick("/admin")}>
              <ListItemText primary="Admin" />
            </ListItem>
            <ListItem button onClick={() => handleOptionClick("/userinfo")}>
              <ListItemText primary="About" />
            </ListItem>
            <ListItem button onClick={() => handleOptionClick("/cart")}>
              <ListItemText primary="Your cart" />
            </ListItem>
            <ListItem button onClick={() => handleOptionClick("/watchlist")}>
              <ListItemText primary="WatchList" />
            </ListItem>
            <ListItem button onClick={() => handleOptionClick("/help")}>
              <ListItemText primary="Help" />
            </ListItem>
            <ListItem button onClick={() => handleOptionClick("/settings")}>
              <ListItemText primary="Settings" />
            </ListItem>
            <ListItem
              button
              onClick={() => {
                localStorage.removeItem("loggedInUser");
                setAuthState(null);
                navigate("/login");
                handleClose();
              }}
            >
              <ListItemText primary="Logout" />
            </ListItem>
          </List>
        </Box>
      </Popover>
    </>
  );
}

export default Navbar;

