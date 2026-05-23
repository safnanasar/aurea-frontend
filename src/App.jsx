import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Payment from './pages/Payment'
import Home from './pages/Home'
import Register from './pages/Register'
import Login from './pages/Login'
import Cart from './pages/Cart'
import './App.css'


function App() {
    const [user, setUser] = useState(
        localStorage.getItem('currentUser') || null
    )

    // Global cart state
    const [cart, setCart] = useState([])

    const handleLogout = () => {
        setUser(null)
        localStorage.removeItem('currentUser')
    }

    return (
        <BrowserRouter>
            <Routes>
                <Route
                    path="/"
                    element={
                        <Home
                            user={user}
                            onLogout={handleLogout}
                            cart={cart}
                            setCart={setCart}
                        />
                    }
                />

                <Route path="/register" element={<Register />} />

                <Route
                    path="/login"
                    element={<Login setUser={setUser} />}
                />

                <Route
                path="/cart"
                element={<Cart cart={cart} setCart={setCart} />}
                />
                <Route path="/payment" element={<Payment cart={cart} setCart={setCart} />}/>
            </Routes>
        </BrowserRouter>
    )
}

export default App
