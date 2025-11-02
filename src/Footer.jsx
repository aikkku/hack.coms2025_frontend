import "./Footer.css";

function Footer() {
    return (
        <footer className="footer">
            <div className="footer-title">URSmart</div>

            <div className="footer-center">
                <div className="footer-section">
                    <h4>Contact</h4>
                    <a href="/">feedback@ursmart.tech</a>
                </div>

                <div className="footer-section">
                    <h4>People</h4>
                    <a href="https://asilbek.co" target="_blank" rel="noopener noreferrer">Asilbek Ismatilloev</a>
                    <a href="https://www.linkedin.com/in/mohanxia/" target="_blank" rel="noopener noreferrer">Rain Xia</a>
                    <a href="https://www.linkedin.com/in/earvin-chen/" target="_blank" rel="noopener noreferrer">Earvin Chen</a>
                    <a href="https://www.linkedin.com/in/david-yen66/" target="_blank" rel="noopener noreferrer">David Yen</a>
                </div>
            </div>

            <div className="footer-bottom">
                © 2025 UR Smart. All rights reserved.
            </div>
        </footer>
    );
}

export default Footer;