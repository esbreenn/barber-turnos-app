// src/components/CalendarView.jsx

import React, { useMemo } from 'react';
import { DayPicker } from 'react-day-picker';
import { es } from 'date-fns/locale';

// 1. IMPORTAMOS LOS ESTILOS DEL CALENDARIO DIRECTAMENTE AQUÍ
import 'react-day-picker/dist/style.css';

function CalendarView({ onDateChange, selectedDate, turnos }) {

  const datesWithTurnos = useMemo(() => {
    // Convertimos las fechas de string 'YYYY-MM-DD' a objetos Date
    return turnos.map(turno => {
      const parts = turno.fecha.split('-').map(Number);
      // Ojo: los meses en el objeto Date van de 0 a 11
      return new Date(parts[0], parts[1] - 1, parts[2]);
    });
  }, [turnos]);

  // 'modifiers' es la forma en que react-day-picker resalta los días.
  // Usamos una clave 'hasTurno' que generará una clase CSS .rdp-day_hasTurno
  const modifiers = {
    hasTurno: datesWithTurnos,
  };

  return (
    <div className="calendar-container">
      <DayPicker
        mode="single"
        selected={selectedDate}
        onSelect={onDateChange}
        locale={es} // Usar el idioma español
        modifiers={modifiers} // Aplica los estilos a los días con turnos
        showOutsideDays
        fixedWeeks
      />
    </div>
  );
}

export default CalendarView;