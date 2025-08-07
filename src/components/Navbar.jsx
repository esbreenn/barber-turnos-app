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
        <Link to="/" className="btn btn-nav">
          Inicio
        </Link>
        <Link to="/nuevo" className="btn btn-nav">
          Agregar Turno
        </Link>
        {/* ¡NUEVO ENLACE para Finanzas! */}
        <Link to="/finanzas" className="btn btn-nav">
          Finanzas
        </Link>
        <Link to="/venta-producto" className="btn btn-nav">
          Venta de Producto
        </Link>
      </div>
      <div className="user-actions">
        {/* Aquí mostramos el email del usuario logueado */}
        <span className="welcome-text">
          Bienvenido {currentUser && currentUser.email ? currentUser.email.split('@')[0] : 'Usuario'}
        </span>
        <button onClick={handleLogout} className="btn btn-nav">
          Cerrar Sesión
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
