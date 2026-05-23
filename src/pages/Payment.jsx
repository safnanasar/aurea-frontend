import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Payment.css'

function Payment({ cart = [], setCart }) {
    const navigate = useNavigate()
    const [step, setStep] = useState('form') // 'form' | 'success'
    const [method, setMethod] = useState('card')
    const [form, setForm] = useState({
        name: '', card: '', expiry: '', cvv: '',
        upi: '', wallet: ''
    })
    const [errors, setErrors] = useState({})

    const subtotal = cart.reduce((sum, item) => sum + Number(item.price) * (item.qty || 1), 0)
    const totalItems = cart.reduce((sum, item) => sum + (item.qty || 1), 0)

    const handleChange = (e) => {
        let { name, value } = e.target
        if (name === 'card') value = value.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim()
        if (name === 'expiry') value = value.replace(/\D/g, '').slice(0, 4).replace(/(.{2})/, '$1/')
        if (name === 'cvv') value = value.replace(/\D/g, '').slice(0, 3)
        setForm({ ...form, [name]: value })
        setErrors({ ...errors, [name]: '' })
    }

    const validate = () => {
        const e = {}
        if (method === 'card') {
            if (!form.name.trim()) e.name = 'Name required'
            if (form.card.replace(/\s/g, '').length !== 16) e.card = 'Enter valid 16-digit card number'
            if (form.expiry.length !== 5) e.expiry = 'Enter valid expiry'
            if (form.cvv.length !== 3) e.cvv = 'Enter valid CVV'
        }
        if (method === 'upi' && !form.upi.includes('@')) e.upi = 'Enter valid UPI ID'
        return e
    }

    const handlePay = () => {
        const e = validate()
        if (Object.keys(e).length > 0) { setErrors(e); return }
        setStep('success')
        setCart([])
    }

    if (step === 'success') return (
        <div className="pay-page">
            <div className="pay-success">
                <div className="pay-success-icon">✦</div>
                <div className="pay-success-title">Order Confirmed</div>
                <div className="pay-success-sub">Thank you for shopping with Auréa</div>
                <div className="pay-success-amount">₹{subtotal.toLocaleString('en-IN')}</div>
                <div className="pay-success-note">Your order will arrive in 3–5 business days</div>
                <div className="pay-order-id">Order #{Math.floor(Math.random() * 900000 + 100000)}</div>
                <button className="pay-home-btn" onClick={() => navigate('/')}>BACK TO SHOP</button>
            </div>
        </div>
    )

    return (
        <div className="pay-page">
            <div className="pay-layout">

                {/* LEFT — Form */}
                <div className="pay-left">
                    <div className="pay-logo">AU<em>RÉ</em>A</div>
                    <div className="pay-title">Secure Payment</div>
                    <div className="pay-sub">Complete your order</div>

                    {/* Method Tabs */}
                    <div className="pay-methods">
                        {['card', 'upi', 'wallet'].map(m => (
                            <button
                                key={m}
                                className={`pay-method-btn ${method === m ? 'active' : ''}`}
                                onClick={() => setMethod(m)}
                            >
                                {m === 'card' ? '💳 Card' : m === 'upi' ? '📱 UPI' : '👜 Wallet'}
                            </button>
                        ))}
                    </div>

                    {/* Card Form */}
                    {method === 'card' && (
                        <div className="pay-form">
                            <div className="pay-field">
                                <label>Cardholder Name</label>
                                <input name="name" placeholder="Name on card" value={form.name} onChange={handleChange} />
                                {errors.name && <span className="pay-error">{errors.name}</span>}
                            </div>
                            <div className="pay-field">
                                <label>Card Number</label>
                                <input name="card" placeholder="1234 5678 9012 3456" value={form.card} onChange={handleChange} />
                                {errors.card && <span className="pay-error">{errors.card}</span>}
                            </div>
                            <div className="pay-row">
                                <div className="pay-field">
                                    <label>Expiry</label>
                                    <input name="expiry" placeholder="MM/YY" value={form.expiry} onChange={handleChange} />
                                    {errors.expiry && <span className="pay-error">{errors.expiry}</span>}
                                </div>
                                <div className="pay-field">
                                    <label>CVV</label>
                                    <input name="cvv" placeholder="•••" type="password" value={form.cvv} onChange={handleChange} />
                                    {errors.cvv && <span className="pay-error">{errors.cvv}</span>}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* UPI Form */}
                    {method === 'upi' && (
                        <div className="pay-form">
                            <div className="pay-field">
                                <label>UPI ID</label>
                                <input name="upi" placeholder="yourname@upi" value={form.upi} onChange={handleChange} />
                                {errors.upi && <span className="pay-error">{errors.upi}</span>}
                            </div>
                        </div>
                    )}

                    {/* Wallet */}
                    {method === 'wallet' && (
                        <div className="pay-form">
                            <div className="pay-wallets">
                                {['PhonePe', 'Paytm', 'GPay', 'Amazon Pay'].map(w => (
                                    <div
                                        key={w}
                                        className={`pay-wallet-opt ${form.wallet === w ? 'active' : ''}`}
                                        onClick={() => setForm({ ...form, wallet: w })}
                                    >
                                        {w}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <button className="pay-btn" onClick={handlePay}>
                        PAY ₹{subtotal.toLocaleString('en-IN')}
                    </button>

                    <div className="pay-secure">🔒 256-bit SSL Encrypted · Safe & Secure</div>
                </div>

                {/* RIGHT — Order Summary */}
                <div className="pay-right">
                    <div className="pay-summary-title">Order Summary</div>
                    <div className="pay-summary-count">{totalItems} {totalItems === 1 ? 'item' : 'items'}</div>

                    <div className="pay-items">
                        {cart.map(item => (
                            <div key={item.id} className="pay-item">
                                <img src={item.image} alt={item.name} className="pay-item-img" />
                                <div className="pay-item-info">
                                    <div className="pay-item-name">{item.name}</div>
                                    <div className="pay-item-qty">Qty: {item.qty || 1}</div>
                                </div>
                                <div className="pay-item-price">₹{(Number(item.price) * (item.qty || 1)).toLocaleString('en-IN')}</div>
                            </div>
                        ))}
                    </div>

                    <div className="pay-summary-divider" />
                    <div className="pay-summary-row"><span>Subtotal</span><span>₹{subtotal.toLocaleString('en-IN')}</span></div>
                    <div className="pay-summary-row"><span>Delivery</span><span className="pay-free">FREE</span></div>
                    <div className="pay-summary-divider" />
                    <div className="pay-summary-row pay-summary-total">
                        <span>Total</span>
                        <span>₹{subtotal.toLocaleString('en-IN')}</span>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default Payment