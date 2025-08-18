// src/components/ProductoForm.jsx

import React from 'react';

const CATEGORIES = [
  'Cera',
  'Polvo texturizante',
  'Pantalon/Joggin',
  'Conjunto',
  'Short',
  'Perfume',
  'Campera',
];

function ProductoForm({ productoData, onFormChange, onSubmit, isSaving, submitText }) {
  const { nombre, costo, precioVenta, fecha, categoria } = productoData;

  return (
    <>
      <form onSubmit={onSubmit}>
        <div className="mb-3">
          <label htmlFor="nombre" className="form-label">Nombre</label>
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
          <label htmlFor="costo" className="form-label">Costo</label>
          <input
            type="number"
            step="0.01"
            min="0.01"
            className="form-control"
            id="costo"
            name="costo"
            value={costo}
            onChange={onFormChange}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="precioVenta" className="form-label">Precio de Venta</label>
          <input
            type="number"
            step="0.01"
            min="0.01"
            className="form-control"
            id="precioVenta"
            name="precioVenta"
            value={precioVenta}
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
          <label htmlFor="categoria" className="form-label">Categoría</label>
          <select
            id="categoria"
            name="categoria"
            className="form-select"
            value={categoria}
            onChange={onFormChange}
          >
            <option value="">Sin categoría</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <button type="submit" className="btn btn-primary w-100" disabled={isSaving}>
          {isSaving ? 'Guardando...' : submitText}
        </button>
      </form>
    </>
  );
}

export default ProductoForm;

