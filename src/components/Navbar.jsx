import { Link } from 'react-router-dom'


function Navbar({ onSearch, user, cart = [], onLogout }) {
    return (
        <nav className="navbar">
            <div className="logo">AU<em>RÉ</em>A</div>

           <div className="search-box">
            <i className="fa-solid fa-magnifying-glass search-icon"></i>
            <input type="text"
                placeholder="Search products..."
                onChange={(e) => onSearch(e.target.value)}/>
           </div>

            <div className="nav-right">
                <Link to="/cart" className="cart-btn">
                    🛒 CART
                    <span className="cart-count">{cart.reduce((total, item) => total + (item.qty || 1), 0)}</span>
                </Link>

                {user ? (
        <>
        <span className="user-chip">👤 {user.toUpperCase()}</span>
        <button className="logout-btn" onClick={onLogout}>LOGOUT</button>
        </>
        ) : (
            <>
            <Link to="/login" className="nav-btn">LOGIN</Link>
            <Link to="/register" className="nav-btn">REGISTER</Link>
            </>
        )}
        </div>
        </nav>
    )
}

export default Navbar