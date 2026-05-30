import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'

function Register() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [number, setNumber] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");

    const navigate = useNavigate();

    const handleRegister = (e) => {
        e.preventDefault();

    
    if (!name || !email || !number || !password || !confirmPassword) {
      setError("Please fill all fields");
      return;
    }


    if (password !== confirmPassword) {
        setError("Passwords do not match");
      return;
    }

    
    const users = JSON.parse(localStorage.getItem("users")) || [];


    const exists = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (exists) {
      setError("User already exists");
      return;
    }

    
    users.push({
      name,
      email: email.toLowerCase(),
      number,
      password,
    });

    localStorage.setItem("users", JSON.stringify(users));
    navigate("/login");
  };

    return (
        <div className="auth-page">
            <div className="auth-box">
                <div className="auth-logo">AU<em>RÉ</em>A</div>
                <h2 className="auth-title">CREATE ACCOUNT</h2>

                {error && <div className="auth-error">{error}</div>}

                <input
                    className="auth-input"
                    type="text"
                    placeholder="Username"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <input
                    className="auth-input"
                    type="text"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    className="auth-input"
                    type="tel"
                    placeholder="Number"
                    value={number}
                    onChange={(e) => setNumber(e.target.value)}
                />
                <input
                    className="auth-input"
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <input
                    className="auth-input"
                    type="password"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />

                <button className="auth-btn" onClick={handleRegister}>REGISTER</button>
                <p className="auth-link">
                    Already have an account? <Link to="/login">Login</Link>
                </p>
            </div>
        </div>
    )
}

export default Register