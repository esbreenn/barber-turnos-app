// src/pages/AddProducto.jsx

import React, { useState } from 'react';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const initialState = {
  nombre: '',
  costo: '',
  precioVenta: '',
  fecha: '',
  categoria: '',
};

function AddProducto() {
  const [producto, setProducto] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProducto((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!producto.nombre.trim() || !producto.costo || !producto.precioVenta || !producto.fecha) {
      toast.error('Nombre, costo, precio de venta y fecha son campos obligatorios.');
      return;
    }

    setLoading(true);

    try {
      await addDoc(collection(db, 'productSales'), {
        ...producto,
        costo: Number(producto.costo),
        precioVenta: Number(producto.precioVenta),
        categoria: producto.categoria.trim() || null,
        creado: Timestamp.now(),
      });
      toast.success('Venta registrada con éxito');
      navigate('/');
    } catch (err) {
      console.error('Error al registrar la venta:', err);
      toast.error('Hubo un error al guardar la venta.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4" style={{ maxWidth: '600px' }}>
      <h2 className="mb-4">Registrar Venta de Producto</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="nombre" className="form-label">Nombre</label>
          <input
            type="text"
            id="nombre"
            name="nombre"
            className="form-control"
            value={producto.nombre}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="costo" className="form-label">Costo</label>
          <input
            type="number"
            step="0.01"
            id="costo"
            name="costo"
            className="form-control"
            value={producto.costo}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="precioVenta" className="form-label">Precio de Venta</label>
          <input
            type="number"
            step="0.01"
            id="precioVenta"
            name="precioVenta"
            className="form-control"
            value={producto.precioVenta}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="fecha" className="form-label">Fecha</label>
          <input
            type="date"
            id="fecha"
            name="fecha"
            className="form-control"
            value={producto.fecha}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="categoria" className="form-label">Categoría (opcional)</label>
          <input
            type="text"
            id="categoria"
            name="categoria"
            className="form-control"
            value={producto.categoria}
            onChange={handleChange}
          />
        </div>

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Guardando...' : 'Guardar Venta'}
        </button>
      </form>
    </div>
  );
}

export default AddProducto;

