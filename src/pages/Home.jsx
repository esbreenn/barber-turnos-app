// src/pages/Home.jsx

import React, { useEffect, useState, useMemo } from "react";
import { collection, onSnapshot, query, orderBy, deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase/config";
import { useNavigate } from "react-router-dom";
import CalendarView from "../components/CalendarView";
import TurnoList from "../components/TurnoList";
import toast from 'react-hot-toast'; // Importamos toast

function Home() {
  const [allTurnos, setAllTurnos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const navigate = useNavigate();

  useEffect(() => {
    const q = query(collection(db, "turnos"), orderBy("fecha", "asc"), orderBy("hora", "asc"));
    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setAllTurnos(data);
        setLoading(false);
      }, 
      (err) => {
        // Usamos la variable 'err' para que no dé advertencia y para depuración
        console.error("Error al obtener turnos en tiempo real:", err);
        setError("Error al cargar los turnos.");
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, []);

  const filteredTurnos = useMemo(() => {
    if (!selectedDate) return [];
    const dateString = selectedDate.toISOString().split('T')[0];
    return allTurnos.filter(turno => turno.fecha === dateString);
  }, [selectedDate, allTurnos]);

  const handleDateChange = (date) => {
    if (date) {
      setSelectedDate(date);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar este turno?")) {
      // Usamos toast.promise para una mejor UX al borrar
      const promise = deleteDoc(doc(db, "turnos", id));
      
      toast.promise(promise, {
        loading: 'Eliminando turno...',
        success: 'Turno eliminado con éxito',
        error: (err) => {
          // Usamos la variable 'err' para depuración
          console.error("Error al eliminar:", err);
          return 'No se pudo eliminar el turno.';
        }
      });
    }
  };

  const handleEdit = (id) => {
    navigate(`/edit-turno/${id}`);
  };

  if (loading) return <div className="text-center mt-5"><div className="spinner-border"></div></div>;
  if (error) return <div className="alert alert-danger text-center">{error}</div>;

  return (
    <div className="container mt-4">
      <h2 className="mb-3 text-white">Tu Agenda</h2>
      <CalendarView 
        onDateChange={handleDateChange}
        selectedDate={selectedDate}
        turnos={allTurnos} 
      />
      <h3 className="mb-3 mt-4 text-white">
        {selectedDate && `Turnos para el ${selectedDate.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}`}
      </h3>
      <TurnoList 
        turnos={filteredTurnos}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}

export default Home;