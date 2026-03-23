import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { Navbar } from '../components/Navbar.jsx';
import {
  createVehicleDocumentRequest,
  deleteVehicleDocumentRequest,
  getVehicleDocumentsRequest,
  getVehiclesRequest,
  updateVehicleDocumentRequest,
} from '../modules/fleet/api.js';
import { VehicleDocumentForm } from '../modules/fleet/VehicleDocumentForm.jsx';

const emptyDocumentForm = {
  vehicleId: '',
  insurance: '',
  inspection: '',
  registration: '',
  expiryDate: '',
};

const toDateTimeLocal = (value) => {
  if (!value) {
    return '';
  }

  const date = new Date(value);
  const offset = date.getTimezoneOffset();
  const normalizedDate = new Date(date.getTime() - offset * 60 * 1000);
  return normalizedDate.toISOString().slice(0, 16);
};

export const VehicleDocumentsPage = () => {
  const [documents, setDocuments] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [form, setForm] = useState(emptyDocumentForm);
  const [editingDocumentId, setEditingDocumentId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        const [documentsData, vehiclesData] = await Promise.all([getVehicleDocumentsRequest(), getVehiclesRequest()]);
        setDocuments(documentsData.documents);
        setVehicles(vehiclesData.vehicles);
      } catch (requestError) {
        setError(requestError.response?.data?.message || 'Unable to load fleet documents');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const resetForm = () => {
    setForm(emptyDocumentForm);
    setEditingDocumentId(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      if (editingDocumentId) {
        const { document } = await updateVehicleDocumentRequest(editingDocumentId, {
          insurance: form.insurance,
          inspection: form.inspection,
          registration: form.registration,
          expiryDate: new Date(form.expiryDate).toISOString(),
        });

        setDocuments((current) => current.map((item) => (item.id === editingDocumentId ? document : item)));
      } else {
        const { document } = await createVehicleDocumentRequest({
          ...form,
          expiryDate: new Date(form.expiryDate).toISOString(),
        });

        setDocuments((current) => [...current, document].sort((a, b) => new Date(a.expiryDate) - new Date(b.expiryDate)));
      }

      resetForm();
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to save vehicle document');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (document) => {
    setEditingDocumentId(document.id);
    setForm({
      vehicleId: document.vehicleId,
      insurance: document.insurance,
      inspection: document.inspection,
      registration: document.registration,
      expiryDate: toDateTimeLocal(document.expiryDate),
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (documentId) => {
    try {
      await deleteVehicleDocumentRequest(documentId);
      setDocuments((current) => current.filter((document) => document.id !== documentId));
      if (editingDocumentId === documentId) {
        resetForm();
      }
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to delete vehicle document');
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
              <h1>Vehicle documents</h1>
              <p>Track insurance, inspection, registration, and expiry dates across the fleet.</p>
            </div>
            <Link className="secondary-button" to="/fleet">
              Back to vehicles
            </Link>
          </div>

          {error ? <div className="alert error">{error}</div> : null}

          <VehicleDocumentForm
            form={form}
            vehicles={vehicles}
            onChange={handleChange}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            isEditing={Boolean(editingDocumentId)}
            onCancel={resetForm}
          />

          <section className="resource-section">
            <div className="resource-section-header">
              <h2>Compliance records</h2>
              <span>{documents.length} documents</span>
            </div>

            {isLoading ? (
              <div className="screen-inline">Loading documents...</div>
            ) : (
              <div className="resource-grid">
                {documents.map((document) => (
                  <article key={document.id} className="resource-card">
                    <div className="resource-card-header">
                      <div>
                        <span className="auth-badge">Document</span>
                        <h3>{document.vehicleVin || 'Vehicle record'}</h3>
                      </div>
                      <strong>{new Date(document.expiryDate).toLocaleDateString()}</strong>
                    </div>
                    <div className="resource-meta">
                      <span>Insurance: {document.insurance}</span>
                      <span>Inspection: {document.inspection}</span>
                      <span>Registration: {document.registration}</span>
                    </div>
                    <div className="resource-actions">
                      <button type="button" className="secondary-button" onClick={() => handleEdit(document)}>
                        Edit
                      </button>
                      <button type="button" className="danger-button" onClick={() => handleDelete(document.id)}>
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
