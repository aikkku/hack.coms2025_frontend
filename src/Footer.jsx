import "./Footer.css";

function Footer() {
    return (
        <footer className="footer">
            <div className="footer-title">URSmart</div>

            <div className="footer-center">
                <div className="footer-section">
                    <h4>Contact</h4>
                    <a href="mxiia8@u.rochester.edu">mxiia8@u.rochester.edu</a>
                </div>

                <div className="footer-section">
                    <h4>People</h4>
                    <a href="#rain">Rain Xia</a>
                    <a href="#earvin">Earvin Chen</a>
                    <a href="#asilbek ">Asilbek Ismatilloev</a>
                    <a href="#david ">David Yen</a>

                </div>
            </div>

            <div className="footer-bottom">
                © 2025 University of Rochester. All rights reserved.
            </div>
        </footer>
    );
}

export default Footer;