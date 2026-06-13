import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Products from './pages/Products'
import ProductDetail from './pages/ProductDetail'
import Account from './pages/Account'
import Admin from './pages/Admin'
import Contact from './pages/Contact'
import Questionnaire from './pages/Questionnaire'
import NotFound from './pages/NotFound'

export default function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#1a1a1a',
            color: '#f0ede8',
            border: '1px solid #6b5a1a',
            fontFamily: 'Outfit, sans-serif',
            fontSize: '14px',
          },
        }}
      />
      <Navbar />
      <Routes>
        <Route path="/"              element={<Home />} />
        <Route path="/products"      element={<Products />} />
        <Route path="/products/:id"  element={<ProductDetail />} />
        <Route path="/account"       element={<Account />} />
        <Route path="/admin"         element={<Admin />} />
        <Route path="/contact"       element={<Contact />} />
        <Route path="/questionnaire" element={<Questionnaire />} />
        <Route path="*"              element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}
