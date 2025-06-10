// src/App.jsx

import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom"; 
import Home from "./pages/Home";
import AddTurno from "./pages/AddTurno";
import EditTurno from "./pages/EditTurno";
import Login from "./pages/Login";
// ¡Importamos la nueva página de Finanzas!
import Finances from "./pages/Finances"; // <-- NUEVA IMPORTACIÓN

import Navbar from "./components/Navbar";

import { auth } from "./firebase/config";
import { onAuthStateChanged } from "firebase/auth";

// PrivateRoute está perfecto, no necesita cambios.
function PrivateRoute({ user, children }) {
  if (user === undefined) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '80vh' }}>
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Cargando...</span>
        ientos/div>
        </div>
      </div>
    );
  }
  return user ? children : <Navigate to="/login" />;
}

function App() {
  const [currentUser, setCurrentUser] = useState(undefined);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="container-fluid px-3 py-4 bg-dark text-white min-vh-100 d-flex flex-column">
      {currentUser && <Navbar currentUser={currentUser} />}

      <main className="flex-grow-1 mt-3">
        <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route path="/" element={<PrivateRoute user={currentUser}><Home /></PrivateRoute>} />
          <Route path="/nuevo" element={<PrivateRoute user={currentUser}><AddTurno /></PrivateRoute>} />
          <Route path="/edit-turno/:id" element={<PrivateRoute user={currentUser}><EditTurno /></PrivateRoute>} />
          
          {/* ¡NUEVA RUTA para la sección de Finanzas! */}
          <Route path="/finanzas" element={<PrivateRoute user={currentUser}><Finances /></PrivateRoute>} /> {/* <-- NUEVA RUTA */}
          
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;