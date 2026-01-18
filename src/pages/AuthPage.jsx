import React, { useState } from 'react';
import { useAuth } from '../context/authContext';
import '../compCSS/AuthPage.css';

const AuthPage = () => {
  const { login, register } = useAuth();
  const [isRegisterActive, setIsRegisterActive] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    apellido: '',
    email: '',
    password: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    const dataToSend = {
      nombre: formData.name,
      apellido: formData.apellido,
      email: formData.email,
      password: formData.password
    };

    const result = await register(dataToSend);

    if (result.success) {
      alert("Registro exitoso! Ahora inicia sesión.");
      setIsRegisterActive(false);
      setFormData(prev => ({ ...prev, password: '' }));
    } else {
      alert("Error: " + result.message);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    const result = await login(formData.email, formData.password);

    if (result.success) {
      alert("¡Login correcto!");
    } else {
      alert("Error: " + result.message);
    }
  };

  return (
    <div className="auth-page-wrapper">
      <div className={`container ${isRegisterActive ? 'right-panel-active' : ''}`} id="container">

        {/* --- FORMULARIO DE REGISTRO --- */}
        <div className="form-container register-container">
          <form onSubmit={handleRegister}>
            <h1>Register here.</h1>

            <input
              type="text"
              placeholder="Name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
            <input
              type="text"
              placeholder="Surname"
              name="apellido"
              value={formData.apellido}
              onChange={handleInputChange}
              required
            />
            <input
              type="email"
              placeholder="Email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
            <input
              type="password"
              placeholder="Password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
            />

            <button type="submit">Register</button>

            <span>or use your account</span>
            <div className="social-container">
              <a href="#" className="social"><i className="lni lni-facebook-fill"></i></a>
              <a href="#" className="social"><i className="lni lni-google"></i></a>
              <a href="#" className="social"><i className="lni lni-linkedin-original"></i></a>
            </div>
          </form>
        </div>

        {/* --- FORMULARIO DE LOGIN --- */}
        <div className="form-container login-container">
          <form onSubmit={handleLogin}>
            <h1>Login here.</h1>
            <input
              type="email"
              placeholder="Email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
            <input
              type="password"
              placeholder="Password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
            <div className="content">
              <div className="checkbox">
                <input type="checkbox" name="checkbox" id="checkbox" />
                <label htmlFor="checkbox">Remember me</label>
              </div>
              <div className="pass-link">
                <a href="#">Forgot password?</a>
              </div>
            </div>
            <button type="submit">Login</button>
            <span>or use your account</span>
            <div className="social-container">
              <a href="#" className="social"><i className="lni lni-facebook-fill"></i></a>
              <a href="#" className="social"><i className="lni lni-google"></i></a>
              <a href="#" className="social"><i className="lni lni-linkedin-original"></i></a>
            </div>
          </form>
        </div>

        {/* --- PANELES DE SUPERPOSICIÓN (OVERLAYS) --- */}
        <div className="overlay-container">
          <div className="overlay">

            <div className="overlay-panel overlay-left">
              <h1 className="title">Welcome <br /> Back!</h1>
              <p>To keep connected with us please login with your personal info</p>
              <button className="ghost" id="login" onClick={() => setIsRegisterActive(false)}>
                <i className="lni lni-arrow-left login"></i> Login
              </button>
            </div>

            <div className="overlay-panel overlay-right">
              <h1 className="title">Hello, <br /> Friend!</h1>
              <p>Enter your personal details and start your journey with us</p>
              <button className="ghost" id="register" onClick={() => setIsRegisterActive(true)}>
                Register <i className="lni lni-arrow-right register"></i>
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
