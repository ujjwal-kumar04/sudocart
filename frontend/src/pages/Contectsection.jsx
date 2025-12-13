// src/components/ContactSection.jsx
import React from 'react';
import "./ContectSection.css"

const ContactSection = () => {
  return (
    <div className="contact-container">
      {/* Left Side - Info */}
      <div className="contact-info">
        <h1>Say Hello.</h1>
        <p>
          We’d love to hear from you — whether you have a question about a product, feedback to improve our service, or just want to say hello.
Our support team is here for you — fast, friendly, and always ready to assist.
Reach out via email, call, or follow us on social media.
        </p>
        <p className='pp'>
          At ShopKart, your satisfaction is our top priority. Let’s stay connected!
        </p>

        <div className="contact-details">
          <div>
             <p > 📍 Buxar Bihar India</p>
          </div>
          <div>
            
            <p> ✉️  sudocart@gmail.com</p>
          </div>
          <div>
          
            <p> 📞 91+ 7257981450</p>
          </div>
        </div>
        <div className="social-icon">
        <a href="#"><i className="fab fa-twitter"></i></a>
        <a href="#"><i className="fab fa-instagram"></i></a>
        <a href="#"><i className="fab fa-youtube"></i></a>
        <a href="#"><i className="fas fa-paper-plane"></i></a>
        <a href="#"><i className="fab fa-pinterest"></i></a>
      </div>
      </div>

      {/* Right Side - Form */}
      <div className="contact-form">
        <h2>Ask Your Queries</h2>
        
         <form  action="https://api.web3forms.com/submit" method="POST" id="contact-form" >
      <input type="hidden" name="access_key" value="d474f866-474d-4169-9a26-9a975d376a07"/>
      <div class="form-group">
        <div class="field">
          <input type="text" name="name" placeholder="Name" required/>
          <i class='fas fa-user'></i>
        </div>
        <div class="field">
          <input type="text" name="email" placeholder="Email" required/>
          <i class='fas fa-envelope'></i>
        </div>
        <div class="field">
          <input type="text" name="phone" placeholder="Phone"/>
          <i class='fas fa-phone-alt'></i>
        </div>
        <div class="message">
        <textarea placeholder="Message" name="message" required></textarea>
        <i class="fas fa-comment-dots"></i>
        </div>
        </div>
      <div class="button-area">
        <button type="submit">
          Submit <i class="fa fa-paper-plane"></i></button>
      </div>
    </form>
      </div>
    </div>
  );
};

export default ContactSection;
