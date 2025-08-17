// src/pages/Finances.jsx

import React, { useState, useEffect, useMemo } from 'react';
import { collection, onSnapshot, query, orderBy, Timestamp } from 'firebase/firestore';
import { db, auth } from '../firebase/config';
import { formatCurrency } from '../utils/formatCurrency';

function parseYearMonth(fecha) {
    if (typeof fecha === 'string') {
        return fecha.split('-').map(Number);
    }
    if (fecha instanceof Timestamp) {
        const date = fecha.toDate();
        return [date.getFullYear(), date.getMonth() + 1];
    }
    return [NaN, NaN];
}

function Finances() {
    const [allTurnos, setAllTurnos] = useState([]);
    const [allProductSales, setAllProductSales] = useState([]);
    const [loadingTurnos, setLoadingTurnos] = useState(true);
    const [loadingProducts, setLoadingProducts] = useState(true);
    const [error, setError] = useState(null);

    const today = new Date();
    const [selectedMonth, setSelectedMonth] = useState(today.getMonth() + 1);
    const [selectedYear, setSelectedYear] = useState(today.getFullYear());
    const [selectedCategory, setSelectedCategory] = useState('');

    const productCategories = useMemo(() => {
        const categories = allProductSales.map((venta) => venta.categoria).filter(Boolean);
        return Array.from(new Set(categories));
    }, [allProductSales]);

    useEffect(() => {
        if (!auth.currentUser) {
            setError('Debes iniciar sesión para ver los datos de finanzas.');
            setLoadingTurnos(false);
            return;
        }

        const q = query(collection(db, "turnos"), orderBy("fecha", "asc"));

        const unsubscribe = onSnapshot(
            q,
            (snapshot) => {
                const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
                setAllTurnos(data);
                setLoadingTurnos(false);
            },
            (err) => {
                console.error("Error al obtener turnos para finanzas:", err);
                setError(err.code === 'permission-denied' ? 'No tienes permisos para ver los datos.' : 'Error al cargar los datos de finanzas.');
                setLoadingTurnos(false);
            }
        );

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (!auth.currentUser) {
            setError('Debes iniciar sesión para ver los datos de finanzas.');
            setLoadingProducts(false);
            return;
        }

        const q = query(collection(db, 'productSales'), orderBy('fecha', 'asc'));

        const unsubscribe = onSnapshot(
            q,
            (snapshot) => {
                const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
                setAllProductSales(data);
                setLoadingProducts(false);
            },
            (err) => {
                console.error('Error al obtener ventas de productos:', err);
                setError(err.code === 'permission-denied' ? 'No tienes permisos para ver los datos.' : 'Error al cargar los datos de finanzas.');
                setLoadingProducts(false);
            }
        );

        return () => unsubscribe();
    }, []);

    // Cálculo de las ganancias y filtrado de turnos para el mes y año seleccionados
    // ¡Aquí añadimos el contador de cortes!
    const { gananciaTurnos, totalCortes, turnosDelMesFiltrados } = useMemo(() => {
        let total = 0;
        let cortesCount = 0; // NUEVO: Contador de cortes

        const turnosFiltrados = allTurnos.filter((turno) => {
            const [year, month] = parseYearMonth(turno.fecha);
            return year === selectedYear && month === selectedMonth;
        });

        turnosFiltrados.forEach((turno) => {
            total += parseFloat(turno.precio || 0);

            // NUEVO: Contamos solo si el servicio es un tipo de corte
            if (turno.servicio === 'Corte de Cabello' || turno.servicio === 'Corte de Cabello y Barba') {
                cortesCount++;
            }
        });

        return {
            gananciaTurnos: total,
            totalCortes: cortesCount, // Retornamos el nuevo contador
            turnosDelMesFiltrados: turnosFiltrados,
        };
    }, [allTurnos, selectedMonth, selectedYear]);

    // Cálculo de las ganancias de productos para el mes y año seleccionados
    const {
        ingresosProductos: _ingresosProductos,
        costosProductos: _costosProductos,
        gananciaProductos,
        ventasDelMesFiltradas,
    } = useMemo(() => {
        let ingresos = 0;
        let costos = 0;

        const ventasFiltradas = allProductSales.filter((venta) => {
            const [year, month] = parseYearMonth(venta.fecha);
            const matchesDate = year === selectedYear && month === selectedMonth;
            const matchesCategory = selectedCategory ? venta.categoria === selectedCategory : true;
            return matchesDate && matchesCategory;
        });

        ventasFiltradas.forEach((venta) => {
            ingresos += parseFloat(venta.precioVenta || 0);
            costos += parseFloat(venta.costo || 0);
        });

        return {
            ingresosProductos: ingresos,
            costosProductos: costos,
            gananciaProductos: ingresos - costos,
            ventasDelMesFiltradas: ventasFiltradas,
        };
    }, [allProductSales, selectedMonth, selectedYear, selectedCategory]);

    const gananciaTotal = gananciaTurnos + gananciaProductos;

    // Opciones de años para el selector
    const years = useMemo(() => {
        const currentYear = new Date().getFullYear();
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

    if (loadingTurnos || loadingProducts) {
        return (
            <div className="text-center mt-5">
                <div className="spinner-border text-primary"></div>
            </div>
        );
    }
    if (error) return <div className="alert alert-danger text-center mt-5">{error}</div>;

    return (
        <div className="container mt-4" style={{ maxWidth: '800px' }}>
            <h2 className="mb-4 text-white text-center">Resumen de Finanzas</h2>

            <div className="card bg-dark text-white p-4 shadow-sm mb-4">
                <div className="d-flex flex-wrap justify-content-center align-items-center mb-3">
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
                        className="form-select w-auto me-3 bg-secondary text-white border-0"
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(Number(e.target.value))}
                    >
                        {years.map(year => (
                            <option key={year} value={year}>{year}</option>
                        ))}
                    </select>

                    <label htmlFor="category-select" className="form-label me-2 mb-0">Categoría:</label>
                    <select
                        id="category-select"
                        className="form-select w-auto bg-secondary text-white border-0"
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                        <option value="">Todas</option>
                        {productCategories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>

                <h3 className="text-center mt-4 mb-3">
                    Ganancia de Turnos: <span className="text-primary fs-4">{formatCurrency(gananciaTurnos)}</span>
                </h3>
                <h3 className="text-center mb-3">
                    Ganancia de Productos: <span className="text-success fs-4">{formatCurrency(gananciaProductos)}</span>
                </h3>
                <h3 className="text-center mb-3">
                    Ganancia Total Combinada: <span className="text-warning fs-4">{formatCurrency(gananciaTotal)}</span>
                </h3>

                {/* NUEVO: Contador de Cortes */}
                <h4 className="text-center mb-3">
                    Cortes Realizados: <span className="text-info fs-5">{totalCortes}</span>
                </h4>
                {/* FIN NUEVO */}

                <p className="text-center text-white-50">
                    Calculado a partir de los turnos con precio y las ventas de productos en el mes seleccionado.
                </p>
                
                {turnosDelMesFiltrados.length > 0 && (
                    <div className="mt-4 table-responsive">
                        <h4 className="text-white-50 mb-3">Detalle de Turnos del Mes:</h4>
                        <table className="table table-dark table-striped table-hover">
                            <thead>
                                <tr>
                                    <th>Fecha</th>
                                    <th>Hora</th>
                                    <th>Nombre</th>
                                    <th>Servicio</th>
                                    <th>Precio</th>
                                </tr>
                            </thead>
                            <tbody>
                                {turnosDelMesFiltrados.map((turno) => (
                                    <tr key={turno.id}>
                                        <td>{turno.fecha instanceof Timestamp ? turno.fecha.toDate().toISOString().split('T')[0] : turno.fecha}</td>
                                        <td>{turno.hora}</td>
                                        <td>{turno.nombre}</td>
                                        <td>{turno.servicio || 'N/A'}</td>
                                        <td>{formatCurrency(turno.precio || 0)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
                {turnosDelMesFiltrados.length === 0 && (
                    <p className="text-white-50 text-center mt-3">No hay turnos con precio para este mes.</p>
                )}

                {ventasDelMesFiltradas.length > 0 && (
                    <div className="mt-4 table-responsive">
                        <h4 className="text-white-50 mb-3">Detalle de Ventas de Productos del Mes:</h4>
                        <table className="table table-dark table-striped table-hover">
                            <thead>
                                <tr>
                                    <th>Fecha</th>
                                    <th>Nombre</th>
                                    <th>Categoría</th>
                                    <th>Costo</th>
                                    <th>Precio</th>
                                    <th>Ganancia</th>
                                </tr>
                            </thead>
                            <tbody>
                                {ventasDelMesFiltradas.map((venta) => (
                                    <tr key={venta.id}>
                                        <td>{venta.fecha instanceof Timestamp ? venta.fecha.toDate().toISOString().split('T')[0] : venta.fecha}</td>
                                        <td>{venta.nombre}</td>
                                        <td>{venta.categoria || 'N/A'}</td>
                                        <td>{formatCurrency(venta.costo || 0)}</td>
                                        <td>{formatCurrency(venta.precioVenta || 0)}</td>
                                        <td>{formatCurrency((venta.precioVenta || 0) - (venta.costo || 0))}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
                {ventasDelMesFiltradas.length === 0 && (
                    <p className="text-white-50 text-center mt-3">No hay ventas de productos para este mes.</p>
                )}

            </div>
        </div>
    );
}

export default Finances;
