import React, { useEffect, useState } from 'react';
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import toast from 'react-hot-toast';

function ManageServices() {
  const [services, setServices] = useState([]);
  const [form, setForm] = useState({ nombre: '', precio: '' });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchServices = async () => {
    try {
      const snapshot = await getDocs(collection(db, 'services'));
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setServices(data);
    } catch (err) {
      console.error('Error fetching services:', err);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.nombre.trim()) {
      toast.error('El nombre es obligatorio');
      return;
    }
    setLoading(true);
    try {
      if (editingId) {
        await updateDoc(doc(db, 'services', editingId), {
          nombre: form.nombre,
          precio: Number(form.precio),
        });
        toast.success('Servicio actualizado');
      } else {
        await addDoc(collection(db, 'services'), {
          nombre: form.nombre,
          precio: Number(form.precio),
        });
        toast.success('Servicio agregado');
      }
      setForm({ nombre: '', precio: '' });
      setEditingId(null);
      fetchServices();
    } catch (err) {
      console.error('Error saving service:', err);
      toast.error('Error al guardar el servicio');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (service) => {
    setForm({ nombre: service.nombre, precio: service.precio });
    setEditingId(service.id);
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar servicio?')) return;
    try {
      await deleteDoc(doc(db, 'services', id));
      toast.success('Servicio eliminado');
      fetchServices();
    } catch (err) {
      console.error('Error deleting service:', err);
      toast.error('Error al eliminar el servicio');
    }
  };

  return (
    <div className="container mt-4" style={{ maxWidth: '600px' }}>
      <h2 className="mb-4">Servicios</h2>
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="mb-3">
          <label htmlFor="nombre" className="form-label">Nombre</label>
          <input
            type="text"
            id="nombre"
            name="nombre"
            className="form-control"
            value={form.nombre}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="precio" className="form-label">Precio</label>
          <input
            type="number"
            id="precio"
            name="precio"
            className="form-control"
            value={form.precio}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary w-100" disabled={loading}>
          {loading ? 'Guardando...' : editingId ? 'Actualizar' : 'Agregar'}
        </button>
      </form>

      <ul className="list-group">
        {services.map((service) => (
          <li key={service.id} className="list-group-item d-flex justify-content-between align-items-center">
            <span>
              {service.nombre} - ${service.precio}
            </span>
            <div>
              <button className="btn btn-sm btn-outline-secondary me-2" onClick={() => handleEdit(service)}>
                Editar
              </button>
              <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(service.id)}>
                Eliminar
              </button>
            </div>
          </li>
        ))}
        {services.length === 0 && <li className="list-group-item text-center">No hay servicios</li>}
      </ul>
    </div>
  );
}

export default ManageServices;

