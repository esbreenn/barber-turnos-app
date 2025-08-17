// src/pages/EditTurno.jsx

import React, { useState, useEffect } from 'react';
import { doc, getDoc, updateDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useParams, useNavigate } from 'react-router-dom';
import TurnoForm from '../components/TurnoForm';
import toast from 'react-hot-toast';
import useServices from '../hooks/useServices';

function EditTurno() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [turno, setTurno] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { services, servicePrices } = useServices();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const turnoDoc = await getDoc(doc(db, 'turnos', id));
        if (turnoDoc.exists()) {
          const data = turnoDoc.data();
          setTurno({
            id: turnoDoc.id,
            nombre: data.nombre || '',
            fecha: data.fecha || '',
            hora: data.hora || '',
            servicio: data.servicio || '',
            precio: data.precio !== undefined ? String(data.precio) : '0',
          });
        } else {
          toast.error('El turno no existe.');
          navigate('/');
        }
      } catch (err) {
        console.error('Error en fetchTurno de EditTurno:', err);
        toast.error('Error al cargar el turno.');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'servicio') {
      // Si el campo que cambia es el servicio, actualizamos el precio automáticamente
      const selectedPrice = servicePrices[value] || 0; // Asignamos el precio del servicio seleccionado
      setTurno((prevTurno) => ({
        ...prevTurno,
        servicio: value,
        precio: selectedPrice,
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
    if (!turno.nombre || !turno.fecha || !turno.hora || !turno.servicio) {
      toast.error('Nombre, fecha, hora y servicio son campos obligatorios.');
      return;
    }
    setIsSaving(true);
    
    try {
      const q = query(
        collection(db, "turnos"),
        where("fecha", "==", turno.fecha),
        where("hora", "==", turno.hora)
      );

      const querySnapshot = await getDocs(q);
      let isOccupied = false;
      
      querySnapshot.forEach((doc) => {
        if (doc.id !== id) { 
          isOccupied = true;
        }
      });

      if (isOccupied) {
        toast.error("Este horario ya está ocupado por otro turno.");
        setIsSaving(false);
        return;
      }

      // El precio ya está actualizado en el estado por handleChange o cargado de la DB.
      // Aseguramos que se guarde como número.
      const precioNumerico = parseFloat(turno.precio); 

      const { id: turnoId, ...dataToUpdate } = turno; // Extraemos el ID
      const turnoDocRef = doc(db, 'turnos', turnoId);
      // Actualizamos el documento con los nuevos datos y el precio convertido
      await updateDoc(turnoDocRef, { ...dataToUpdate, precio: precioNumerico });
      
      toast.success('Turno actualizado con éxito');
      navigate('/');

    } catch (err) {
      console.error("Error en handleSubmit de EditTurno:", err);
      toast.error('Error al actualizar el turno.');
    } finally {
      setIsSaving(false);
    }
  };
  
  if (loading) return <div className="text-center mt-5"><div className="spinner-border text-primary"></div></div>;
  if (!turno) return <div className="alert alert-danger text-center">No se encontró el turno.</div>;

  return (
    <div className="container mt-4" style={{ maxWidth: '600px' }}>
      <div className="card bg-dark text-white p-4 shadow-sm" style={{ maxWidth: '500px', width: '100%' }}>
        <h2 className="mb-4 text-center">Editar Turno</h2>
        {turno && ( // Renderizamos el formulario solo si 'turno' no es null
          <TurnoForm
            turnoData={turno}
            onFormChange={handleChange}
            onSubmit={handleSubmit}
            isSaving={isSaving}
            submitText="Actualizar Turno"
            services={services}
          />
        )}
      </div>
    </div>
  );
}

export default EditTurno;