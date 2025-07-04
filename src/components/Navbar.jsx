// src/components/Navbar.jsx

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAuth, signOut } from 'firebase/auth';

function Navbar({ currentUser }) {
  const navigate = useNavigate();
  const auth = getAuth();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  return (
    <nav className="app-navbar">
      <div className="nav-buttons">
        <Link to="/" className="btn btn-outline-light">
          Inicio
        </Link>
        <Link to="/nuevo" className="btn btn-primary">
          Agregar Turno
        </Link>
        {/* ¡NUEVO ENLACE para Finanzas! */}
        <Link to="/finanzas" className="btn btn-outline-success"> {/* Puedes elegir otro color de botón */}
          Finanzas
        </Link>
      </div>
      <div className="user-actions">
        {/* Aquí mostramos el email del usuario logueado */}
        <span className="welcome-text">
          Bienvenido {currentUser && currentUser.email ? currentUser.email.split('@')[0] : 'Usuario'}
        </span>
        <button onClick={handleLogout} className="btn btn-outline-danger">
          Cerrar Sesión
        </button>
      </div>
    </nav>
  );
}

export default Navbar;