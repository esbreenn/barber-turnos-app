// src/components/TurnoCard.jsx

import React from 'react';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';

function TurnoCard({ turno, onDelete, onEdit }) {
  const { id, nombre, hora, servicio } = turno; // Mantenemos servicio aquí por si lo usamos en el 'title'

  return (
    <div className="turno-row">
      <div className="col-hora">{hora}</div>
      {/* Añadimos un 'title' para poder ver el servicio al pasar el ratón */}
      <div className="col-nombre" title={`Servicio: ${servicio || 'N/A'}`}>
        {nombre}
      </div>
      <div className="col-acciones">
        <button onClick={() => onEdit(id)} className="btn btn-sm btn-outline-info">
          <FaEdit />
        </button>
        <button onClick={() => onDelete(id)} className="btn btn-sm btn-outline-danger">
          <FaTrashAlt />
        </button>
      </div>
    </div>
  );
}

export default TurnoCard;