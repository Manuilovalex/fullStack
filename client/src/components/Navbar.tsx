import { useState, useEffect } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { LinkInterface, NAVBAR_LINKS } from '../data/mockData.ts'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../redux/store.ts'
import { logout } from '../redux/slices/authSlice.ts'
import Modal from '../modal/Modal'
import SigninForm from './form/SigninForm.tsx'

const Navbar = () => {
  const dispatch = useDispatch()
  const { isLogin } = useSelector((state: RootState) => state.auth)
  const [modalOpen, setModalOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()

  const handleLogin = () => {
    setModalOpen(true)
  }

  const handleLogout = () => {
    dispatch(logout())
  }

  const toggleMenu = () => {
    setMenuOpen(!menuOpen)
  }

  useEffect(() => {
    setMenuOpen(false)
  }, [location])

  return (
    <nav className="navbar">
      <div>
        <p className="logo">Logo</p>
      </div>
      <div className="menu-toggle" onClick={toggleMenu}>
        &#9776;
      </div>
      <ul className={`navbar__list ${menuOpen ? 'open' : ''}`}>
        {NAVBAR_LINKS.map((link: LinkInterface, index: number) => (
          <li className="navbar__item" key={index}>
            {isLogin ? (
              <NavLink className="navbar__link" to={link.path} onClick={toggleMenu}>
                {link.name}
              </NavLink>
            ) : (
              <span className="navbar__link disabled" onClick={handleLogin}>
                {link.name}
              </span>
            )}
          </li>
        ))}
        {!isLogin ? (
          <li className="navbar__item">
            <button className="navbar__link navbar__link--login" onClick={handleLogin}>
              SIGN IN
            </button>
          </li>
        ) : (
          <li className="navbar__item">
            <button className="navbar__link navbar__link--logout" onClick={handleLogout}>
              Logout
            </button>
          </li>
        )}
      </ul>

      {modalOpen && (
        <Modal onClose={() => setModalOpen(false)}>
          <SigninForm onClose={() => setModalOpen(false)} />
        </Modal>
      )}
    </nav>
  )
}

export default Navbar
