import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { Navbar } from '../components/Navbar.jsx';
import {
  createVehicleRequest,
  deleteVehicleRequest,
  getVehiclesRequest,
  updateVehicleRequest,
} from '../modules/fleet/api.js';
import { VehicleForm } from '../modules/fleet/VehicleForm.jsx';

const emptyVehicleForm = {
  vin: '',
  category: '',
  status: 'available',
  mileage: 0,
  location: '',
  fuelType: 'diesel',
  capacity: 2,
};

export const VehiclesPage = () => {
  const [vehicles, setVehicles] = useState([]);
  const [form, setForm] = useState(emptyVehicleForm);
  const [editingVehicleId, setEditingVehicleId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const loadVehicles = async () => {
    try {
      const data = await getVehiclesRequest();
      setVehicles(data.vehicles);
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to load vehicles');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadVehicles();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    const normalizedValue = ['mileage', 'capacity'].includes(name) ? Number(value) : value;
    setForm((current) => ({ ...current, [name]: normalizedValue }));
  };

  const resetForm = () => {
    setForm(emptyVehicleForm);
    setEditingVehicleId(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      if (editingVehicleId) {
        const { vehicle } = await updateVehicleRequest(editingVehicleId, {
          category: form.category,
          status: form.status,
          mileage: form.mileage,
          location: form.location,
          fuelType: form.fuelType,
          capacity: form.capacity,
        });

        setVehicles((current) => current.map((item) => (item.id === editingVehicleId ? vehicle : item)));
      } else {
        const { vehicle } = await createVehicleRequest(form);
        setVehicles((current) => [vehicle, ...current]);
      }

      resetForm();
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to save vehicle');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (vehicle) => {
    setEditingVehicleId(vehicle.id);
    setForm({
      vin: vehicle.vin,
      category: vehicle.category,
      status: vehicle.status,
      mileage: vehicle.mileage,
      location: vehicle.location,
      fuelType: vehicle.fuelType,
      capacity: vehicle.capacity,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (vehicleId) => {
    try {
      await deleteVehicleRequest(vehicleId);
      setVehicles((current) => current.filter((vehicle) => vehicle.id !== vehicleId));
      if (editingVehicleId === vehicleId) {
        resetForm();
      }
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to delete vehicle');
    }
  };

  return (
    <>
      <Navbar />
      <div className="page-shell page-shell-with-nav">
        <div className="page-card fleet-page">
          <div className="page-header">
            <div>
              <span className="eyebrow">Fleet Management</span>
              <h1>Vehicles</h1>
              <p>Create, update, and monitor the active camper van fleet.</p>
            </div>
            <Link className="secondary-button" to="/fleet/documents">
              Vehicle documents
            </Link>
          </div>

          {error ? <div className="alert error">{error}</div> : null}

          <VehicleForm
            form={form}
            onChange={handleChange}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            isEditing={Boolean(editingVehicleId)}
            onCancel={resetForm}
          />

          <section className="resource-section">
            <div className="resource-section-header">
              <h2>Fleet list</h2>
              <span>{vehicles.length} vehicles</span>
            </div>

            {isLoading ? (
              <div className="screen-inline">Loading vehicles...</div>
            ) : (
              <div className="resource-grid">
                {vehicles.map((vehicle) => (
                  <article key={vehicle.id} className="resource-card">
                    <div className="resource-card-header">
                      <div>
                        <span className={`status-pill status-${vehicle.status}`}>{vehicle.status}</span>
                        <h3>{vehicle.category}</h3>
                      </div>
                      <strong>{vehicle.vin}</strong>
                    </div>
                    <div className="resource-meta">
                      <span>Mileage: {vehicle.mileage.toLocaleString()} km</span>
                      <span>Fuel: {vehicle.fuelType}</span>
                      <span>Capacity: {vehicle.capacity} people</span>
                      <span>Location: {vehicle.location}</span>
                    </div>
                    <div className="resource-actions">
                      <button type="button" className="secondary-button" onClick={() => handleEdit(vehicle)}>
                        Edit
                      </button>
                      <button type="button" className="danger-button" onClick={() => handleDelete(vehicle.id)}>
                        Delete
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </>
  );
};
