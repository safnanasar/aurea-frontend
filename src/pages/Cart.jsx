import { Link, useNavigate } from 'react-router-dom'
import './Cart.css'

function Cart({ cart = [], setCart }) {
    const navigate = useNavigate()
    const updateQty = (id, change) => {
        setCart(cart
            .map(item => item.id === id ? { ...item, qty: (item.qty || 1) + change } : item)
            .filter(item => item.qty > 0)
        )
    }

    const removeItem = (id) => {
        setCart(cart.filter(item => item.id !== id))
    }

    const subtotal = cart.reduce((sum, item) => sum + Number(item.price) * (item.qty || 1), 0)
    const totalItems = cart.reduce((sum, item) => sum + (item.qty || 1), 0)

    return (
        <div className="cart-page">
            <Link to="/" className="cart-back">← SHOP</Link>

            <div className="cart-layout">

                {/* LEFT - Items */}
                <div className="cart-left">
                    <h2 className="cart-title">MY CART ({totalItems})</h2>

                    {cart.length === 0 ? (
                        <div className="cart-empty">
                            <p>Your cart is empty.</p>
                            <Link to="/" className="cart-shop-btn">SHOP NOW</Link>
                        </div>
                    ) : (
                        cart.map((item) => (
                            <div key={item.id} className="cart-item">
                                <img src={item.image} alt={item.name} className="cart-item-img" />

                                <div className="cart-item-info">
                                    <div className="cart-item-name">{item.name}</div>
                                    <div className="cart-item-cat">{item.category.toUpperCase()}</div>
                                    <div className="cart-item-price">
                                        ₹{(Number(item.price) * (item.qty || 1)).toLocaleString('en-IN')}
                                        <span className="cart-item-unit"> (₹{Number(item.price).toLocaleString('en-IN')} each)</span>
                                    </div>

                                    {/* Qty Controls */}
                                    <div className="cart-qty-row">
                                        <div className="cart-qty">
                                            <button onClick={() => updateQty(item.id, -1)}>−</button>
                                            <span>{item.qty || 1}</span>
                                            <button onClick={() => updateQty(item.id, 1)}>+</button>
                                        </div>
                                        <button className="cart-remove-btn" onClick={() => removeItem(item.id)}>
                                            REMOVE
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* RIGHT - Price Details */}
                {cart.length > 0 && (
                    <div className="cart-right">
                        <h3 className="cart-summary-title">PRICE DETAILS</h3>

                        <div className="cart-summary-row">
                            <span>Price ({totalItems} {totalItems === 1 ? 'item' : 'items'})</span>
                            <span>₹{subtotal.toLocaleString('en-IN')}</span>
                        </div>

                        <div className="cart-summary-row">
                            <span>Delivery</span>
                            <span className="cart-free">FREE</span>
                        </div>

                        <div className="cart-summary-divider" />

                        <div className="cart-summary-row cart-summary-total">
                            <span>TOTAL</span>
                            <span>₹{subtotal.toLocaleString('en-IN')}</span>
                        </div>

                        <button className="cart-checkout-btn" onClick={() => navigate('/payment')}>
                            PLACE ORDER
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Cart