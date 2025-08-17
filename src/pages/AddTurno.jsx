// src/pages/AddTurno.jsx

import React, { useState } from 'react';
import { collection, addDoc, Timestamp, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useNavigate } from 'react-router-dom';
import TurnoForm from '../components/TurnoForm';
import toast from 'react-hot-toast';
import useServices from '../hooks/useServices';

// Estado inicial: Ahora incluimos el servicio por defecto y el precio correspondiente
const initialState = {
  nombre: '',
  fecha: '',
  hora: '',
  servicio: '', // Servicio inicial vacío para obligar a la selección
  precio: 0 // Precio inicial 0, se actualizará al seleccionar un servicio
};

function AddTurno() {
  const [turno, setTurno] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { services, servicePrices } = useServices();

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'servicio') {
      // Si el campo que cambia es el servicio, actualizamos el precio automáticamente
      const selectedPrice = servicePrices[value] || 0; // Asignamos el precio del servicio seleccionado
      setTurno(prevTurno => ({
        ...prevTurno,
        servicio: value, // Actualizamos el servicio
        precio: selectedPrice // Actualizamos el precio
      }));
    } else if (name === 'precio') {
      // Permitimos cambiar manualmente el precio desde el input
      setTurno(prevTurno => ({ ...prevTurno, precio: value }));
    } else {
      // Para otros campos, solo actualizamos el valor
      setTurno(prevTurno => ({ ...prevTurno, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Ahora, el servicio también es un campo obligatorio
    if (!turno.nombre.trim() || !turno.fecha || !turno.hora || !turno.servicio) {
      toast.error('Nombre, fecha, hora y servicio son campos obligatorios.');
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

      // El precio ya está actualizado en el estado por handleChange.
      // Aseguramos que se guarde como número.
      const precioNumerico = parseFloat(turno.precio); 

      // Guardamos el turno con el precio (ya calculado)
      await addDoc(
        collection(db, "turnos"),
        { ...turno, precio: precioNumerico, creado: Timestamp.now() }
      );
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
        services={services}
      />
    </div>
  );
}

export default AddTurno;