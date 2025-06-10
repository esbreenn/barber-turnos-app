// src/pages/AddTurno.jsx

import React, { useState } from 'react';
import { collection, addDoc, Timestamp, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useNavigate } from 'react-router-dom';
import TurnoForm from '../components/TurnoForm';
import toast from 'react-hot-toast';

// ¡AQUI es donde establecemos el precio base de 9000!
const initialState = { nombre: '', fecha: '', hora: '', servicio: '', precio: '9000' };

function AddTurno() {
  const [turno, setTurno] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTurno(prevTurno => ({ ...prevTurno, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Aseguramos que el precio sea un número antes de guardar, si se ingresó.
    const precioNumerico = turno.precio ? parseFloat(turno.precio) : 0; // Convertimos a número, 0 si está vacío o no es válido

    if (!turno.nombre.trim() || !turno.fecha || !turno.hora) {
      toast.error('Nombre, fecha y hora son campos obligatorios.');
      return;
    }
    setLoading(true);

    try {
      const q = query(
        collection(db, "turnos"),
        where("fecha", "==", turno.fecha),
        where("hora", "==", turno.hora)
      );
      
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        toast.error("Este horario ya está ocupado. Por favor, elige otro.");
        setLoading(false);
        return;
      }

      // Guardamos el turno con el precio (convertido a número)
      await addDoc(collection(db, "turnos"), { ...turno, precio: precioNumerico, creado: Timestamp.now() });
      toast.success('Turno guardado con éxito');
      navigate('/');

    } catch (err) {
      console.error("Error en handleSubmit de AddTurno:", err); 
      toast.error('Hubo un error al validar o guardar el turno.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4" style={{ maxWidth: '600px' }}>
      <h2 className="mb-4">Nuevo Turno</h2>
      <TurnoForm
        turnoData={turno}
        onFormChange={handleChange}
        onSubmit={handleSubmit}
        isSaving={loading}
        submitText="Guardar Turno"
      />
    </div>
  );
}

export default AddTurno;