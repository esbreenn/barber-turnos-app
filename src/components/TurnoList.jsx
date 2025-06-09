// src/components/TurnoList.jsx

import React from 'react';
import TurnoCard from './TurnoCard';

function TurnoList({ turnos, onEdit, onDelete }) {
  if (turnos.length === 0) {
    return <p className="text-white-50 text-center mt-4">No hay turnos registrados para este día.</p>;
  }

  return (
    <div className="turnos-table-container">
      <div className="turnos-table-header">
        <div className="col-hora">Hora</div>
        {/* Dejamos solo Nombre, ya que Servicio no se mostrará */}
        <div className="col-nombre">Nombre</div>
        <div className="col-acciones">Acciones</div>
      </div>

      <div className="turnos-table-body">
        {turnos.map((turno) => (
          <TurnoCard 
            key={turno.id} 
            turno={turno} 
            onDelete={onDelete} 
            onEdit={onEdit} 
          />
        ))}
      </div>
    </div>
  );
}

export default TurnoList;