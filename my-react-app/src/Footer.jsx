import "./Footer.css";

function Footer() {
    return (
        <footer className="footer">
            <div className="footer-left">
                <h3>URSmart</h3>
                <p>© 2025 University of Rochester. All rights reserved.</p>
            </div>

            <div className="footer-right">
                <a href="#contact">Contact</a>
                <a href="#people">People</a>
            </div>
        </footer>
    );
}

export default Footer;