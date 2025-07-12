import './Footer.css';

const Footer = () => (
  <footer className="footer">
    <span className="footer-text">&copy; {new Date().getFullYear()} TodoBoard &mdash; Crafted by Your Name</span>
    <div className="footer-anim-bg"></div>
  </footer>
);

export default Footer; 