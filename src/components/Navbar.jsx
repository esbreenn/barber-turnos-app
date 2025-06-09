// src/components/Navbar.jsx

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAuth, signOut } from 'firebase/auth';

function Navbar() {
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
      </div>
      <div className="user-actions">
        <span className="welcome-text">
          Bienvenido Benja
        </span>
        <button onClick={handleLogout} className="btn btn-outline-danger">
          Cerrar Sesión
        </button>
      </div>
    </nav>
  );
}

export default Navbar;