// src/components/TurnoCard.jsx

import React from 'react';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import toast from 'react-hot-toast';

function TurnoCard({ turno, onDelete, onEdit }) {
  const { id, nombre, hora, servicio, completado } = turno; // Mantenemos servicio aquí por si lo usamos en el 'title'

  const handleCompletado = async () => {
    try {
      await updateDoc(doc(db, 'turnos', id), { completado: true });
      toast.success('Turno completado');
    } catch (err) {
      console.error('Error al marcar como completado:', err);
      toast.error('No se pudo marcar como completado');
    }
  };

  return (
    <div className="turno-row">
      <div className="col-hora">{hora}</div>
      {/* Añadimos un 'title' para poder ver el servicio al pasar el ratón */}
      <div className="col-nombre" title={`Servicio: ${servicio || 'N/A'}`}>
        {nombre}
      </div>
      <div className="col-acciones">
        <button
          type="button"
          aria-label="Editar turno"
          onClick={() => onEdit(id)}
          className="btn btn-sm btn-outline-info"
        >
          <FaEdit />
        </button>
        <button
          type="button"
          aria-label="Eliminar turno"
          onClick={() => onDelete(id)}
          className="btn btn-sm btn-outline-danger"
        >
          <FaTrashAlt />
        </button>
        <button
          type="button"
          aria-label="Marcar como completado"
          onClick={handleCompletado}
          className="btn btn-sm btn-outline-success"
          disabled={completado}
        >
          Completado
        </button>
      </div>
    </div>
  );
}

export default TurnoCard;