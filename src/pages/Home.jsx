import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'


const STATS = [
    { val: '500+', lbl: 'Products' },
    { val: 'Free', lbl: 'Delivery' },
    { val: '6', lbl: 'Categories' },
    { val: '30d', lbl: 'Easy Returns' },
    { val: '4.9★', lbl: 'Avg Rating' },
    { val: '24/7', lbl: 'Support' },
]

function Toast({ msg, onClose }) {
    useEffect(() => {
        const t = setTimeout(onClose, 2000)
        return () => clearTimeout(t)
    }, [onClose])
    return <div className="toast">{msg}</div>
}

function StarRating({ rating = 4 }) {
    return (
        <div className="star-rating">
            {[1, 2, 3, 4, 5].map(i => (
                <span key={i} className={i <= rating ? 'star filled' : 'star'}>★</span>
            ))}
        </div>
    )
}

function Home({ user, onLogout, cart, setCart }) {
    const [products, setProducts] = useState([])
    const [filtered, setFiltered] = useState([])
    const [category, setCategory] = useState('all')
    const [search, setSearch] = useState('')
    const [statIdx, setStatIdx] = useState(0)
    const [heroImg, setHeroImg] = useState(0)
    const [toast, setToast] = useState(null)
    const [wishlist, setWishlist] = useState([])
    const [showHero, setShowHero] = useState(true) 

    useEffect(() => {
        fetch('https://aurea-backend-f6gt.onrender.com/api/products/')
            .then(r => r.json())
            .then(data => { setProducts(data); setFiltered(data) })
            .catch(err => console.error('Failed to fetch products:', err))
    }, [])

    useEffect(() => {
        let result = products
        if (category !== 'all') result = result.filter(p => p.category === category)
        if (search) {
            result = result.filter(p => p.name.toLowerCase().includes(search.toLowerCase()))
            setShowHero(false)
        }
        if (!search && category === 'all') setShowHero(true)
        setFiltered(result)
    }, [category, search, products])

    useEffect(() => {
        const timer = setInterval(() => {
            setStatIdx(prev => prev + 1)
        }, 3000)
        return () => clearInterval(timer)
    }, [])

    useEffect(() => {
        if (products.length === 0) return
        const timer = setInterval(() => {
            setHeroImg(prev => (prev + 1) % Math.min(products.length, 6))
        }, 3000)
        return () => clearInterval(timer)
    }, [products])

    const currentStat = STATS[statIdx % STATS.length]

    const handleAddToCart = (p) => {
    if (!user) {
        window.location.href = '/login'
        return
    }
    const exists = cart.find(i => i.id === p.id)
    if (exists) {
        setCart(cart.map(i => i.id === p.id ? { ...i, qty: (i.qty || 1) + 1 } : i))
    } else {
        setCart([...cart, { ...p, qty: 1 }])
    }
    setToast(`${p.name} added to cart!`)
}

    const toggleWishlist = (id) => {
        setWishlist(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
    }

    return (
        <div>
            <Navbar user={user} onLogout={onLogout} onSearch={setSearch} cart={cart} />

            {/* Categories */}
            <div className="cats">
                {['all', 'gents', 'ladies', 'electronics', 'kids', 'cosmetics', 'jewellery'].map(cat => (
                    <div
                        key={cat}
                        className={`cat ${category === cat ? 'active' : ''}`}
                        onClick={() => {
                            setCategory(cat)
                            if (cat !== 'all') setShowHero(false)
                            else setShowHero(true)
                        }}
                    >
                
                        {cat.toUpperCase()}
                    </div>
                ))}
            </div>

            {/* Hero */}
            {showHero && (
                <div className="hero">
                    <div className="hero-left">
                        <div className="hero-eyebrow">✦ PREMIUM STORE</div>
                        <div className="hero-text">
                            <h1>Premium Picks,<br /><span>Golden Value.</span></h1>
                            <p>SHOP PHYSICAL &amp; DIGITAL PRODUCTS</p>
                            <button
                                className="hero-btn"
                                onClick={() => document.getElementById('products').scrollIntoView({ behavior: 'smooth' })}
                            >
                                EXPLORE NOW 
                            </button>
                        </div>
                        <div className="hero-badge">
                            <div className="hero-stat-val" key={currentStat.val}>
                                {currentStat.val}
                            </div>
                            <div className="hero-stat-line"></div>
                            <div className="hero-stat-lbl">
                                {currentStat.lbl}
                            </div>
                        </div>
                    </div>

                    {/* CENTER — Offer Banner */}
                    <div className="hero-offer">
                        <div className="hero-offer-tag">✦ Limited Offer ✦</div>
                        <div className="hero-offer-body">
                            <div className="hero-offer-title">GRAND SALE</div>
                            <div className="hero-offer-val">50<span>%</span></div>
                            <div className="hero-offer-sub">Off selected items</div>
                            <div className="hero-offer-divider" />
                            <div className="hero-offer-code">Use code <strong>AUREA10</strong></div>
                            <div className="hero-offer-free">Free delivery above ₹999</div>
                        </div>
                    </div>

                    {/* RIGHT — Sliding Image */}
                    {products.length > 0 && (
                        <div className="hero-img-wrap">
                            <div className="hero-img-glow" />
                            <img
                                key={heroImg}
                                src={products[heroImg]?.image}
                                alt={products[heroImg]?.name}
                                className="hero-img"
                            />
                            <div className="hero-img-label">
                                <span className="hero-img-cat">
                                    {products[heroImg]?.category?.toUpperCase()}
                                </span>
                                <span className="hero-img-name">
                                    {products[heroImg]?.name}
                                </span>
                            </div>
                            <div className="hero-dots">
                                {products.slice(0, 6).map((_, i) => (
                                    <div
                                        key={i}
                                        className={`hero-dot ${i === heroImg ? 'active' : ''}`}
                                        onClick={() => setHeroImg(i)}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Trust Bar */}
            {showHero && (
                <div className="trust-bar">
                    {['🚚 Free Delivery', '🔄 30-Day Returns', '🔒 Secure Payment', '⭐ 4.9 Rated', '💬 24/7 Support'].map(item => (
                        <div key={item} className="trust-item">{item}</div>
                    ))}
                </div>
            )}

            {/* Product Section */}
            <div className="section">
                <div className="section-header">
                    <div className="section-title">✦ FEATURED PRODUCTS</div>
                    <div className="section-count">{filtered.length} items</div>
                </div>
                <div className="grid" id="products">
                    {filtered.length === 0 ? (
                        <p className="no-products">No products found.</p>
                    ) : (
                        filtered.map(p => {
                            const inCart = cart.find(i => i.id === p.id)
                            const inWish = wishlist.includes(p.id)
                            return (
                                <div key={p.id} className="card">
                                    <div className="card-img">
                                        <img src={p.image} alt={p.name} />
                                        <button
                                            className={`wish-btn ${inWish ? 'wished' : ''}`}
                                            onClick={() => toggleWishlist(p.id)}
                                        >
                                            {inWish ? '❤️' : '🤍'}
                                        </button>
                                        {inCart && <div className="in-cart-badge">IN CART ✓</div>}
                                    </div>
                                    <div className="card-body">
                                        <div className="card-name">{p.name}</div>
                                        <div className="card-cat">{p.category.toUpperCase()}</div>
                                        <StarRating rating={4} />
                                        <div className="card-bottom">
                                            <div className="card-price">₹{p.price}</div>
                                            <button
                                                className={`add-btn ${inCart ? 'in-cart' : ''}`}
                                                onClick={() => handleAddToCart(p)}
                                            >
                                                {inCart ? '✓ ADDED' : 'ADD TO CART'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    )}
                </div>
            </div>

            {/* Footer */}
            <footer className="footer">
                <div className="footer-top">
                    <div className="footer-brand">
                        <div className="footer-logo">AU<em>RÉ</em>A</div>
                        <div className="footer-tagline">Premium Picks, Golden Value.</div>
                    </div>
                    <div className="footer-links">
                        <div className="footer-col">
                            <div className="footer-col-title">SHOP</div>
                            {['Gents', 'Ladies', 'Kids', 'Electronics', 'Cosmetics', 'Jewellery'].map(l => (
                                <div key={l} className="footer-link">{l}</div>
                            ))}
                        </div>
                        <div className="footer-col">
                            <div className="footer-col-title">SUPPORT</div>
                            {['Contact Us', 'Track Order', 'Returns', 'FAQ'].map(l => (
                                <div key={l} className="footer-link">{l}</div>
                            ))}
                        </div>
                        <div className="footer-col">
                            <div className="footer-col-title">TRUST</div>
                            <div className="footer-badges">
                                {['🚚 Free Delivery', '🔄 Easy Returns', '🔒 Secure Pay'].map(b => (
                                    <div key={b} className="footer-badge">{b}</div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="footer-bottom">
                    <p>© 2025 AURÉA — All rights reserved</p>
                    <p>PREMIUM STORE</p>
                </div>
            </footer>

            {toast && <Toast msg={toast} onClose={() => setToast(null)} />}
        </div>
    )
}

export default Home