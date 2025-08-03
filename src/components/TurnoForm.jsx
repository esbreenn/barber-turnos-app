// src/components/TurnoForm.jsx

import React, { useState } from 'react';
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase/config';
import toast from 'react-hot-toast';

function TurnoForm({ turnoData, onFormChange, onSubmit, isSaving, submitText, services = [], reloadServices }) {
  // Desestructuramos todos los campos, incluido "precio" para el input numérico.
  const { nombre, fecha, hora, servicio, precio } = turnoData;

  const [showModal, setShowModal] = useState(false);
  const [newService, setNewService] = useState({ nombre: '', precio: '' });
  const [savingService, setSavingService] = useState(false);

  const openModal = () => setShowModal(true);
  const closeModal = () => {
    setShowModal(false);
    setNewService({ nombre: '', precio: '' });
  };

  const handleNewServiceChange = (e) => {
    const { name, value } = e.target;
    setNewService((prev) => ({ ...prev, [name]: value }));
  };

  const handleNewServiceSubmit = async (e) => {
    e.preventDefault();
    if (!newService.nombre.trim()) {
      toast.error('El nombre es obligatorio');
      return;
    }
    setSavingService(true);
    try {
      const q = query(collection(db, 'services'), where('nombre', '==', newService.nombre));
      const existing = await getDocs(q);
      if (!existing.empty) {
        toast.error('Ya existe un servicio con ese nombre');
        setSavingService(false);
        return;
      }
      await addDoc(collection(db, 'services'), {
        nombre: newService.nombre,
        precio: Number(newService.precio),
      });
      toast.success('Servicio agregado');
      if (reloadServices) {
        await reloadServices();
      }
      onFormChange({ target: { name: 'servicio', value: newService.nombre } });
      onFormChange({ target: { name: 'precio', value: newService.precio } });
      closeModal();
    } catch (err) {
      console.error('Error al agregar servicio:', err);
      toast.error('Error al agregar servicio');
    } finally {
      setSavingService(false);
    }
  };

  return (
    <>
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
          className="form-select"
          id="servicio"
          name="servicio"
          value={servicio}
          onChange={onFormChange}
          required
        >
          <option value="" disabled>Seleccione un servicio</option>
          {services.map((s) => (
            <option key={s.id} value={s.nombre}>
              {s.nombre}
            </option>
          ))}
        </select>
        <button type="button" className="btn btn-sm btn-outline-primary mt-2" onClick={openModal}>
          Agregar servicio
        </button>
      </div>

      <div className="mb-3">
        <label htmlFor="precio" className="form-label">Precio</label>
        <input
          type="number"
          className="form-control"
          id="precio"
          name="precio"
          value={precio}
          onChange={onFormChange}
          required
        />
      </div>

      <button type="submit" className="btn btn-primary w-100" disabled={isSaving}>
        {isSaving ? 'Guardando...' : submitText}
      </button>
    </form>
    {showModal && (
      <>
        <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Nuevo Servicio</h5>
                <button type="button" className="btn-close" onClick={closeModal}></button>
              </div>
              <form onSubmit={handleNewServiceSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label htmlFor="nuevo-nombre" className="form-label">Nombre</label>
                    <input
                      type="text"
                      id="nuevo-nombre"
                      name="nombre"
                      className="form-control"
                      value={newService.nombre}
                      onChange={handleNewServiceChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="nuevo-precio" className="form-label">Precio</label>
                    <input
                      type="number"
                      id="nuevo-precio"
                      name="precio"
                      className="form-control"
                      value={newService.precio}
                      onChange={handleNewServiceChange}
                      required
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={closeModal} disabled={savingService}>
                    Cancelar
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={savingService}>
                    {savingService ? 'Guardando...' : 'Guardar'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
        <div className="modal-backdrop fade show"></div>
      </>
    )}
    </>
  );
}

export default TurnoForm;