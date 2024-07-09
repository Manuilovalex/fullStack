
import { FaTwitter, FaTelegram, FaGithub, FaViber, FaInstagram, FaLinkedin } from 'react-icons/fa'

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__content">
          <ul className="footer__links">
            <li>
              <a href="https://twitter.com" className="footer__link" target="_blank" rel="noopener noreferrer">
                <FaTwitter />
              </a>
            </li>
            <li>
              <a href="https://t.me" className="footer__link" target="_blank" rel="noopener noreferrer">
                <FaTelegram />
              </a>
            </li>
            <li>
              <a href="https://t.me" className="footer__link" target="_blank" rel="noopener noreferrer">
                <FaViber />
              </a>
            </li>
            <li>
              <a
                href="https://www.instagram.com/"
                className="footer__link"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaInstagram />
              </a>
            </li>
            <li>
              <a href="https://github.com" className="footer__link" target="_blank" rel="noopener noreferrer">
                <FaGithub />
              </a>
            </li>
            <li>
              <a href="https://t.me" className="footer__link" target="_blank" rel="noopener noreferrer">
                <FaLinkedin />
              </a>
            </li>
          </ul>
          <p className="footer__text">&copy; {new Date().getFullYear()}</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
