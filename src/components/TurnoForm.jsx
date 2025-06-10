// src/components/TurnoForm.jsx

import React from 'react';

// Definimos los servicios y sus precios aqui para que TurnoForm los conozca.
// Los usaremos en el selector.
const SERVICES_OPTIONS = [
  { value: '', label: 'Seleccione un servicio', price: 0 }, // Opción por defecto
  { value: 'Corte de Cabello', label: 'Corte de Cabello', price: 8000 },
  { value: 'Corte y Barba', label: 'Corte y Barba', price: 10000 },
];

function TurnoForm({ turnoData, onFormChange, onSubmit, isSaving, submitText }) {
  // Ya no desestructuramos 'precio' directamente, ya que no es un input directo aquí.
  // Pero 'servicio' sí lo es.
  const { nombre, fecha, hora, servicio } = turnoData; 

  return (
    <form onSubmit={onSubmit}>
      <div className="mb-3">
        <label htmlFor="nombre" className="form-label">Nombre del Cliente</label>
        <input
          type="text"
          className="form-control"
          id="nombre"
          name="nombre"
          value={nombre}
          onChange={onFormChange}
          required
        />
      </div>
      <div className="mb-3">
        <label htmlFor="fecha" className="form-label">Fecha</label>
        <input
          type="date"
          className="form-control"
          id="fecha"
          name="fecha"
          value={fecha}
          onChange={onFormChange}
          required
        />
      </div>
      <div className="mb-3">
        <label htmlFor="hora" className="form-label">Hora</label>
        <input
          type="time"
          className="form-control"
          id="hora"
          name="hora"
          value={hora}
          onChange={onFormChange}
          required
        />
      </div>
      
      <div className="mb-4"> {/* CAMPO SERVICIO AHORA ES UN SELECT */}
        <label htmlFor="servicio" className="form-label">Servicio</label>
        <select
          className="form-select" // Clase de Bootstrap para select
          id="servicio"
          name="servicio"
          value={servicio}
          onChange={onFormChange}
          required // Hacemos que la selección del servicio sea obligatoria
        >
          {SERVICES_OPTIONS.map(option => (
            <option key={option.value} value={option.value} disabled={option.value === ''}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <button type="submit" className="btn btn-primary w-100" disabled={isSaving}>
        {isSaving ? 'Guardando...' : submitText}
      </button>
    </form>
  );
}

export default TurnoForm;