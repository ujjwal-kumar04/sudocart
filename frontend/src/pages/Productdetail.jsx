// // src/ProductcardDetails.jsx
// import { useParams } from "react-router-dom";

// import"./Productdetail.css"

// import  {products} from "./ProductList";



// export default function Productcarddetails() {
//   const { id } = useParams();
 
//   const productList = products.find((p) => p.id === id);

//   if (!productList) return <h2>Product Not Found</h2>;

//   return (
    
//     <div class="product-detail-container">
//     <div class="image-section">
//       <img src={productList.img} alt="Men Cotton Shirt"/>
//     </div>

//     <div class="info-section">
//       <h2>{productList.name}</h2>
//       <p class="rating">★★★★☆ <span>(4.3)</span></p>

//       <p class="description">
//         Premium cotton shirt with a perfect fit, soft feel, and modern look.
//         Ideal for daily wear and semi-formal occasions.
//       </p>

//       <div class="price">
//         <span class="new-price">₹{productList.price}</span>
//         <span class="old-price">₹{productList.originalprice}</span>
//         <span class="discount">{productList.discount}</span>
//       </div>

//       <div class="details">
//         <p><strong>Brand:</strong> UrbanStyle</p>
//         <p><strong>Color:</strong> Sky Blue</p>
//         <p><strong>Category:</strong> Men Shirt</p>

//         <label for="size"><strong>Size:</strong></label>
//         <select id="size" name="size">
//           <option value="S">S</option>
//           <option value="M" selected>M</option>
//           <option value="L">L</option>
//           <option value="XL">XL</option>
//         </select>
//       </div>

//       <div class="actions">
//         <button class="add-to-cart">Add to Cart</button>
//         <button class="buy-now">Buy Now</button>
//       </div>
//     </div>
//   </div>
//   );
// }
// src/ProductcardDetails.jsx
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { useCart } from "../components/cartContext";
import { getProductById } from "../service/api";
import "./Productdetail.css";

export default function Productcarddetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await getProductById(id);
      setProduct(response.data);
      setSelectedImage(response.data.img); // Set main image as initial selected
      setLoading(false);
    } catch (error) {
      console.error('Error fetching product:', error);
      setLoading(false);
    }
  };

  // Get all images (main + additional)
  const getAllImages = () => {
    if (!product) return [];
    const images = [product.img];
    if (product.images && product.images.length > 0) {
      images.push(...product.images);
    }
    return images;
  };

  if (loading) {
    return <div style={{textAlign: 'center', padding: '50px'}}><h2>Loading...</h2></div>;
  }

  if (!product) return <h2>Product Not Found</h2>;

  const handleBuyNow = () => {
    const user = JSON.parse(localStorage.getItem("loggedInUser"))?.user;
    
    if (!user) {
      Swal.fire({
        toast: true,
        position: 'top',
        icon: 'warning',
        title: 'Please login first',
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true
      });
      navigate("/login");
      return;
    }

    // Create cart item format similar to cart
    const cartItems = [{
      _id: product._id,
      sellerId: product.seller,
      name: product.name,
      img: product.img,
      price: product.price,
      quantity: 1
    }];

    // Navigate to checkout with product details
    navigate("/checkout", {
      state: {
        cartItems: cartItems,
        totalAmount: product.price,
        user: user
      }
    });
  };

  return (
    <div className="product-detail-container">
      <div className="image-section">
        <div className="main-image-container">
          <img src={selectedImage || product.img} alt={product.name} className="main-image" />
        </div>
        
        {/* Additional Images Section */}
        {product.images && product.images.length > 0 && (
          <div className="additional-images-section">
            <h3 className="additional-images-title">More Images</h3>
            <div className="additional-images-grid">
              {product.images.map((img, index) => (
                <div 
                  key={index}
                  className={`additional-image-item ${selectedImage === img ? 'active' : ''}`}
                  onClick={() => setSelectedImage(img)}
                >
                  <img src={img} alt={`Additional view ${index + 1}`} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="info-section">
        <h2>{product.name}</h2>
        <p className="rating">★★★★☆ <span>(4.3)</span></p>

        <p className="description">
          Premium cotton shirt with a perfect fit, soft feel, and modern look.
          Ideal for daily wear and semi-formal occasions.
        </p>

        <div className="price">
          <span className="new-price">₹{product.price}</span>
          <span className="old-price">₹{product.originalprice || 999}</span>
          <span className="discount">{product.discount || "50% off"}</span>
        </div>

        <div className="details">
          <p><strong>Category:</strong> {product.category}</p>
          <p><strong>Subcategory:</strong> {product.subcategory}</p>

          <label htmlFor="size"><strong>Size:</strong></label>
          <select id="size" name="size" defaultValue="M">
            <option value="S">S</option>
            <option value="M">M</option>
            <option value="L">L</option>
            <option value="XL">XL</option>
          </select>
        </div>

        {/* Product Specifications */}
        {product.specifications && Object.keys(product.specifications).length > 0 && (
          <div className="specifications">
            <h3>Product Specifications</h3>
            <div className="specifications-grid">
              {Object.entries(product.specifications).map(([key, value]) => (
                <div key={key} className="specification-item">
                  <span className="spec-label">{key}:</span>
                  <span className="spec-value">{value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="actions">
          <button className="add-to-cart" onClick={() => addToCart(product)}>Add to Cart</button>
          <button className="buy-now" onClick={handleBuyNow}>Buy Now</button>
        </div>
      </div>
    </div>
  );
}
