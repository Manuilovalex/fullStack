import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar.tsx'
import Footer from './components/Footer.tsx'
import Home from './pages/HomePage.tsx'
import Posts from './pages/PostsPage.tsx'
import Users from './pages/UsersPage.tsx'
import Todos from './pages/TodosPage.tsx'
import Products from './pages/ProductsPage.tsx'
import ProtectedRoute from './components/ProtectedRoute.tsx'

const App = () => {
  return (
    <BrowserRouter>
      <Navbar />
      <div className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<ProtectedRoute element={<Products />} />} />
          <Route path="/posts" element={<ProtectedRoute element={<Posts />} />} />
          <Route path="/users" element={<ProtectedRoute element={<Users />} />} />
          <Route path="/todos" element={<ProtectedRoute element={<Todos />} />} />
          <Route path="*" element={<h1>Not Found</h1>} />
        </Routes>
      </div>
      <Footer />
    </BrowserRouter>
  )
}

export default App
