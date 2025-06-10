// src/pages/EditTurno.jsx

import React, { useState, useEffect } from 'react';
// Asegúrate de importar collection, query, where, getDocs
import { doc, getDoc, updateDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useParams, useNavigate } from 'react-router-dom';
import TurnoForm from '../components/TurnoForm';
import toast from 'react-hot-toast';

function EditTurno() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [turno, setTurno] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchTurno = async () => {
      try {
        const turnoDoc = await getDoc(doc(db, 'turnos', id));
        if (turnoDoc.exists()) {
          const data = turnoDoc.data();
          // Aseguramos que el precio se cargue como string para el input type="number"
          setTurno({ id: turnoDoc.id, ...data, precio: data.precio !== undefined ? String(data.precio) : '' });
        } else {
          toast.error('El turno no existe.');
          navigate('/');
        }
      } catch (err) {
        // Añadimos console.error para depuración
        console.error("Error en fetchTurno de EditTurno:", err); 
        toast.error('Error al cargar el turno.');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };
    fetchTurno();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTurno(prevTurno => ({ ...prevTurno, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!turno.nombre || !turno.fecha || !turno.hora) {
      toast.error('Nombre, fecha y hora son campos obligatorios.');
      return;
    }
    setIsSaving(true);
    
    try {
      // Lógica para verificar si el horario ya está ocupado por otro turno
      const q = query(
        collection(db, "turnos"),
        where("fecha", "==", turno.fecha),
        where("hora", "==", turno.hora)
      );

      const querySnapshot = await getDocs(q);
      let isOccupied = false;
      
      querySnapshot.forEach((doc) => {
        // Importante: si el turno encontrado es el mismo que estamos editando, no lo consideramos "ocupado"
        if (doc.id !== id) { 
          isOccupied = true;
        }
      });

      if (isOccupied) {
        toast.error("Este horario ya está ocupado por otro turno.");
        setIsSaving(false);
        return;
      }

      // Convertimos el precio a número antes de actualizarlo en Firebase
      const precioNumerico = turno.precio ? parseFloat(turno.precio) : 0;

      const { id: turnoId, ...dataToUpdate } = turno; // Extraemos el ID
      const turnoDocRef = doc(db, 'turnos', turnoId);
      // Actualizamos el documento con los nuevos datos y el precio convertido a número
      await updateDoc(turnoDocRef, { ...dataToUpdate, precio: precioNumerico });
      
      toast.success('Turno actualizado con éxito');
      navigate('/');

    } catch (err) {
      // Añadimos console.error para depuración
      console.error("Error en handleSubmit de EditTurno:", err);
      toast.error('Error al actualizar el turno.');
    } finally {
      setIsSaving(false);
    }
  };
  
  if (loading) return <div className="text-center mt-5"><div className="spinner-border"></div></div>;
  // Añadimos un mensaje si el turno no se encontró (después de cargar)
  if (!turno) return <div className="alert alert-danger text-center">No se encontró el turno.</div>;

  return (
    // Contenedor para centrar la tarjeta
    <div className="container mt-4" style={{ maxWidth: '600px' }}>
      {/* La tarjeta que envuelve el formulario */}
      <div className="card bg-dark text-white p-4 shadow-sm" style={{ maxWidth: '500px', width: '100%' }}>
        <h2 className="mb-4 text-center">Editar Turno</h2>
        {turno && ( // Renderizamos el formulario solo si 'turno' no es null
          <TurnoForm
            turnoData={turno}
            onFormChange={handleChange}
            onSubmit={handleSubmit}
            isSaving={isSaving}
            submitText="Actualizar Turno"
          />
        )}
      </div>
    </div>
  );
}

export default EditTurno;