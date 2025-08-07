// src/pages/AddProducto.jsx

import React, { useState } from 'react';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import ProductoForm from '../components/ProductoForm';

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
    if (Number(producto.costo) <= 0 || Number(producto.precioVenta) <= 0) {
      toast.error('Costo y precio de venta deben ser mayores que 0.');
      return;
    }

    setLoading(true);

    try {
      await addDoc(collection(db, 'productSales'), {
        nombre: producto.nombre,
        costo: Number(producto.costo),
        precioVenta: Number(producto.precioVenta),
        fecha: Timestamp.fromDate(new Date(producto.fecha)),
        categoria: producto.categoria || null,
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
      <ProductoForm
        productoData={producto}
        onFormChange={handleChange}
        onSubmit={handleSubmit}
        isSaving={loading}
        submitText="Guardar Venta"
      />
    </div>
  );
}

export default AddProducto;

