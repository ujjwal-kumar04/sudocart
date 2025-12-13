
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import logo from "../Assets/Slider/logo.png";
import { getAllCategories, getCategoryIcon, getSubcategories } from '../data/categories';
import { getAllProducts } from "../service/api";
import "./Navbar.css";

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
  const [searchName, setSearchName] = useState("");
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

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

  const handleOptionClick = (path) => {
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

  return (
    <>
      <nav className="navbar">
        <div className="navbar1">
          <div className="logo"><img src={logo}></img><h1>SudoCart</h1> </div>
<div className="search1"></div>
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

          {/* ICONS SECTION */}
          <div className="icons" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            {/* Login Button */}
          
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
      backgroundColor: "#ffe680", // Slightly lighter on hover
      borderColor: "#ffe680"
    }
  }}
>
  Login
</Button>

            {/* Cart Icon */}
            <Link to="/cart" style={{ color: "black" }}>
              <i className="fas fa-shopping-cart" style={{ fontSize: "20px" }}></i>
            </Link>

            {/* Popover Menu Icon */}
            <IconButton onClick={handleUserIconClick}>
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

