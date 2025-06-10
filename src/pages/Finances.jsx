// src/pages/Finances.jsx

import React, { useState, useEffect, useMemo } from 'react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase/config';
import toast from 'react-hot-toast';

function Finances() {
    const [allTurnos, setAllTurnos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Estado para el mes y año seleccionados (por defecto, el mes y año actuales)
    const today = new Date();
    const [selectedMonth, setSelectedMonth] = useState(today.getMonth() + 1); // getMonth() es 0-11
    const [selectedYear, setSelectedYear] = useState(today.getFullYear());

    useEffect(() => {
        // Obtenemos todos los turnos, ordenados por fecha, para poder filtrarlos en el cliente
        const q = query(collection(db, "turnos"), orderBy("fecha", "asc"));

        const unsubscribe = onSnapshot(q,
            (snapshot) => {
                const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
                setAllTurnos(data);
                setLoading(false);
            },
            (err) => {
                console.error("Error al obtener turnos para finanzas:", err);
                setError("Error al cargar los datos de finanzas.");
                setLoading(false);
            }
        );

        return () => unsubscribe(); // Limpieza al desmontar el componente
    }, []);

    // Cálculo de las ganancias para el mes y año seleccionados
    const monthlyEarnings = useMemo(() => {
        let total = 0;
        const turnosDelMes = allTurnos.filter(turno => {
            // Asumimos que turno.fecha está en formato 'YYYY-MM-DD'
            const [year, month] = turno.fecha.split('-').map(Number);
            return year === selectedYear && month === selectedMonth;
        });

        turnosDelMes.forEach(turno => {
            // Aseguramos que el precio es un número antes de sumarlo
            total += parseFloat(turno.precio || 0);
        });

        return total;
    }, [allTurnos, selectedMonth, selectedYear]);

    // Opciones de años para el selector
    const years = useMemo(() => {
        const currentYear = new Date().getFullYear();
        // Generamos un rango de años, por ejemplo, 5 años antes y 1 año después del actual
        const yearsArray = [];
        for (let i = currentYear - 5; i <= currentYear + 1; i++) {
            yearsArray.push(i);
        }
        return yearsArray;
    }, []);

    // Opciones de meses
    const months = [
        { value: 1, name: 'Enero' }, { value: 2, name: 'Febrero' }, { value: 3, name: 'Marzo' },
        { value: 4, name: 'Abril' }, { value: 5, name: 'Mayo' }, { value: 6, name: 'Junio' },
        { value: 7, name: 'Julio' }, { value: 8, name: 'Agosto' }, { value: 9, name: 'Septiembre' },
        { value: 10, name: 'Octubre' }, { value: 11, name: 'Noviembre' }, { value: 12, name: 'Diciembre' }
    ];

    if (loading) return <div className="text-center mt-5"><div className="spinner-border text-primary"></div></div>;
    if (error) return <div className="alert alert-danger text-center mt-5">{error}</div>;

    return (
        <div className="container mt-4" style={{ maxWidth: '700px' }}>
            <h2 className="mb-4 text-white text-center">Resumen de Finanzas</h2>

            <div className="card bg-dark text-white p-4 shadow-sm mb-4">
                <div className="d-flex justify-content-center align-items-center mb-3">
                    <label htmlFor="month-select" className="form-label me-2 mb-0">Mes:</label>
                    <select
                        id="month-select"
                        className="form-select w-auto me-3 bg-secondary text-white border-0"
                        value={selectedMonth}
                        onChange={(e) => setSelectedMonth(Number(e.target.value))}
                    >
                        {months.map(month => (
                            <option key={month.value} value={month.value}>{month.name}</option>
                        ))}
                    </select>

                    <label htmlFor="year-select" className="form-label me-2 mb-0">Año:</label>
                    <select
                        id="year-select"
                        className="form-select w-auto bg-secondary text-white border-0"
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(Number(e.target.value))}
                    >
                        {years.map(year => (
                            <option key={year} value={year}>{year}</option>
                        ))}
                    </select>
                </div>

                <h3 className="text-center mt-4 mb-3">
                    Ganancias Totales del Mes: <span className="text-primary fs-4">${monthlyEarnings.toFixed(2)}</span>
                </h3>

                <p className="text-center text-white-50">
                    Calculado a partir de los turnos con precio en el mes seleccionado.
                </p>
            </div>

            {/* Opcional: Aquí podrías mostrar una tabla de los turnos de ese mes con sus precios individuales */}
            {/* Si te interesa, podemos añadir la visualización de los turnos que componen el total. */}
        </div>
    );
}

export default Finances;