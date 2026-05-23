import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from '../components/Navbar'

function Login({ setUser }) {
  const [input, setInput] = useState(""); // email or phone
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate(); // <-- Missing line

  const handleLogin = (e) => {
    e.preventDefault();

    if (!input || !password) {
      setError("Please fill all fields");
      return;
    }

    const users = JSON.parse(localStorage.getItem("users")) || [];

    const user = users.find(
      (u) => u.email === input && u.password === password
    );

    if (!user) {
      setError("Invalid credentials");
      return;
    }

    setUser(user.name);
    localStorage.setItem("currentUser", user.name);

    navigate("/");
  };


    return (
        <div className="auth-page">
            <div className="auth-box">
                <div className="auth-logo">AU<em>RÉ</em>A</div>
                <h2 className="auth-title">WELCOME BACK</h2>

                {error && <div className="auth-error">{error}</div>}

                 <input
                    className="auth-input"
                    type="text"
                    placeholder="Email or Phone Number"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                />
                
                <input
                    className="auth-input"
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />


                <button className="auth-btn" onClick={handleLogin}>LOGIN</button>

                <p className="auth-link">
                    Don't have an account? <Link to="/register">Register</Link>
                </p>
            </div>
        </div>
    )
}

export default Login