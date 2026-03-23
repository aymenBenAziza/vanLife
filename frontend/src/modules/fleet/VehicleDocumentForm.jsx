export const VehicleDocumentForm = ({
  form,
  vehicles,
  onChange,
  onSubmit,
  isSubmitting,
  isEditing,
  onCancel,
}) => (
  <form className="resource-form" onSubmit={onSubmit}>
    <div className="resource-form-header">
      <div>
        <span className="auth-badge">{isEditing ? 'Edit document' : 'New document'}</span>
        <h2>{isEditing ? 'Update compliance record' : 'Add a vehicle document'}</h2>
      </div>
      {isEditing ? (
        <button type="button" className="secondary-button" onClick={onCancel}>
          Cancel
        </button>
      ) : null}
    </div>

    <label>
      Vehicle
      <select name="vehicleId" value={form.vehicleId} onChange={onChange} required disabled={isEditing}>
        <option value="">Select vehicle</option>
        {vehicles.map((vehicle) => (
          <option key={vehicle.id} value={vehicle.id}>
            {vehicle.vin} - {vehicle.category}
          </option>
        ))}
      </select>
    </label>

    <div className="grid-2">
      <label>
        Insurance
        <input name="insurance" value={form.insurance} onChange={onChange} required />
      </label>
      <label>
        Inspection
        <input name="inspection" value={form.inspection} onChange={onChange} required />
      </label>
    </div>

    <div className="grid-2">
      <label>
        Registration
        <input name="registration" value={form.registration} onChange={onChange} required />
      </label>
      <label>
        Expiry date
        <input name="expiryDate" type="datetime-local" value={form.expiryDate} onChange={onChange} required />
      </label>
    </div>

    <button type="submit" disabled={isSubmitting}>
      {isSubmitting ? 'Saving...' : isEditing ? 'Update document' : 'Create document'}
    </button>
  </form>
);
