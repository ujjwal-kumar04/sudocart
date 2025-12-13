
import "./CartPage.css"
// export default CartPage;
import React from "react";
import { useCart } from "../components/cartContext";

function Watchlist() {
  const { cartItems, removeFromCart, increaseQty, decreaseQty } = useCart();

  const total = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);

  return (
    <div className="container mt-4">
      <h3>Your Cart</h3>
      {cartItems.length === 0 ? (
        <p>No items in cart.</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Item</th>
              <th>Qty</th>
              <th>Price</th>
              <th>Total</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {cartItems.map((item) => (
              
              <tr key={item.id}>
                <td ><img src={item.img} alt={item.name} style={{ width: "70px", marginRight: "10px" ,borderRadius:"3px"}} /></td>
                <td >{item.name}</td>
                <td>
                  <button onClick={() => decreaseQty(item.id)} className="btn btn-sm btn-warning me-1">-</button>
                  {item.qty}
                  <button onClick={() => increaseQty(item.id)} className="btn btn-sm btn-success ms-1">+</button>
                </td>
                <td>₹{item.price}</td>
                <td>₹{item.price * item.qty}</td>
                <td>
                  <button onClick={() => removeFromCart(item.id)} className="btn btn-danger btn-sm">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <h4 className="mt-3">Total: ₹{total}</h4>
      <div className="buy-btn-container">
  <button className="proceed-btn">Proceed to Buy</button>
</div>
    </div>
  );
}

export default Watchlist;