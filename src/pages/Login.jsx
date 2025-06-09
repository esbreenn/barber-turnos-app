// src/pages/Login.jsx

import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase/config';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast'; // Asegúrate de tenerlo importado

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validar campos vacíos antes de intentar el login
      if (!email || !password) {
        toast.error('Por favor, completa todos los campos.');
        setLoading(false); // Detener el spinner si faltan campos
        return; // Detener la ejecución de la función
      }

      await signInWithEmailAndPassword(auth, email, password);
      navigate('/'); // Redirigir a la página principal tras un login exitoso
    } catch (err) {
      console.error("Error en handleLogin:", err);
      // Mensaje de error genérico para email/contraseña incorrectos
      toast.error('Email o contraseña incorrectos.');
    } finally {
      setLoading(false); // Siempre detener el spinner al finalizar
    }
  };

  return (
    <div className="container mt-5 d-flex justify-content-center">
      <div className="card bg-dark text-white p-4 shadow" style={{ maxWidth: '400px', width: '100%' }}>
        <h2 className="card-title text-center mb-4">Iniciar Sesión</h2>
        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="form-label">Contraseña</label>
            <input
              type="password"
              className="form-control"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100" disabled={loading}>
            {loading ? 'Iniciando...' : 'Iniciar Sesión'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;