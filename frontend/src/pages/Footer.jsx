import "./Footer.css";

export default function Footer() {
  return (
    <>
      <footer className="footer">
        <div className="footer-part">
           <div className="footer-section">
            <h3> SudoCart</h3>
             <div className="social-icons">
              <a href="#"><i className="fab fa-twitter"></i></a>
              <a href="#"><i className="fab fa-instagram"></i></a>
              <a href="#"><i className="fab fa-youtube"></i></a>
              <a href="#"><i className="fas fa-paper-plane"></i></a>
              <a href="#"><i className="fab fa-pinterest"></i></a>
            </div>
          </div>
          

          <div className="footer-section">
            <h3>Contact Us</h3>
            <ul>
              <li><i className="fas fa-phone-alt"></i> 91+ 7257981450</li>
              <li><i className="fas fa-envelope"></i> sudocart.com</li>
              <li><i className="fas fa-map-marker-alt"></i> Buxar, Bihar</li>
            </ul>
          </div>

          <div className="footer-section">
            <h3>Important Links</h3>
            
            <ul>
              <li><a href="/aboutus">About Us</a></li>
               <li><a href="/contect">Let's Connect</a></li>
              <li><a href="#">Privacy Policy</a></li>
             
              <li><a href="#">Terms &  Conditions</a></li>
            </ul>
        
          </div>
        </div>

        <div className="Copyright">
          <p><i className="fa-regular fa-copyright"></i>
            2025 SUDOCART. All rights reserved.
          </p>
        </div>
      </footer>
    </>
  );
}
