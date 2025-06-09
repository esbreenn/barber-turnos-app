// src/pages/EditTurno.jsx

import React, { useState, useEffect } from 'react';
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
          setTurno({ id: turnoDoc.id, ...turnoDoc.data() });
        } else {
          toast.error('El turno no existe.');
          navigate('/');
        }
      } catch (err) {
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

      const { id: turnoId, ...dataToUpdate } = turno;
      const turnoDocRef = doc(db, 'turnos', turnoId);
      await updateDoc(turnoDocRef, dataToUpdate);
      toast.success('Turno actualizado con éxito');
      navigate('/');

    } catch (err) {
      console.error("Error en handleSubmit de EditTurno:", err);
      toast.error('Error al actualizar el turno.');
    } finally {
      setIsSaving(false);
    }
  };
  
  if (loading) return <div className="text-center mt-5"><div className="spinner-border"></div></div>;
  if (!turno) return <div className="alert alert-danger text-center">No se encontró el turno.</div>;

  return (
    <div className="container mt-4" style={{ maxWidth: '600px' }}>
      <h2 className="mb-4">Editar Turno</h2>
      <TurnoForm
        turnoData={turno}
        onFormChange={handleChange}
        onSubmit={handleSubmit}
        isSaving={isSaving}
        submitText="Actualizar Turno"
      />
    </div>
  );
}

export default EditTurno;