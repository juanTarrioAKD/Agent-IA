import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/authContext';
import showAlerts from '../utils/alerts';
import { FaFacebookF, FaGoogle, FaLinkedinIn } from 'react-icons/fa';
import { IoArrowBack, IoArrowForward } from 'react-icons/io5';
import '../compCSS/AuthPage.css';

const AuthPage = () => {
  const navigate = useNavigate();
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
      showAlerts.success('Registro exitoso', 'Ahora inicia sesión.');
      setIsRegisterActive(false);
      setFormData(prev => ({ ...prev, password: '' }));
    } else {
      showAlerts.error('Error', result.message);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    const result = await login(formData.email, formData.password);

    if (result.success) {
      showAlerts.toast('¡Login correcto!', 'success');
      navigate('/store');
    } else {
      showAlerts.error('Error', result.message);
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
              <a href="#" className="social" aria-label="Facebook"><FaFacebookF /></a>
              <a href="#" className="social" aria-label="Google"><FaGoogle /></a>
              <a href="#" className="social" aria-label="LinkedIn"><FaLinkedinIn /></a>
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
              <a href="#" className="social" aria-label="Facebook"><FaFacebookF /></a>
              <a href="#" className="social" aria-label="Google"><FaGoogle /></a>
              <a href="#" className="social" aria-label="LinkedIn"><FaLinkedinIn /></a>
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
                <IoArrowBack className="login" aria-hidden /> Login
              </button>
            </div>

            <div className="overlay-panel overlay-right">
              <h1 className="title">Hello, <br /> Friend!</h1>
              <p>Enter your personal details and start your journey with us</p>
              <button className="ghost" id="register" onClick={() => setIsRegisterActive(true)}>
                Register <IoArrowForward className="register" aria-hidden />
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
