const initialState = {
  vin: '',
  category: '',
  status: 'available',
  mileage: 0,
  location: '',
  fuelType: 'diesel',
  capacity: 2,
};

export const VehicleForm = ({
  form,
  onChange,
  onSubmit,
  isSubmitting,
  isEditing,
  onCancel,
}) => {
  const currentForm = form || initialState;

  return (
    <form className="resource-form" onSubmit={onSubmit}>
      <div className="resource-form-header">
        <div>
          <span className="auth-badge">{isEditing ? 'Edit vehicle' : 'New vehicle'}</span>
          <h2>{isEditing ? 'Update fleet record' : 'Add a fleet vehicle'}</h2>
        </div>
        {isEditing ? (
          <button type="button" className="secondary-button" onClick={onCancel}>
            Cancel
          </button>
        ) : null}
      </div>

      <div className="grid-2">
        <label>
          VIN
          <input name="vin" value={currentForm.vin} onChange={onChange} required disabled={isEditing} />
        </label>
        <label>
          Category
          <input name="category" value={currentForm.category} onChange={onChange} required />
        </label>
      </div>

      <div className="grid-3">
        <label>
          Status
          <select name="status" value={currentForm.status} onChange={onChange}>
            <option value="available">Available</option>
            <option value="reserved">Reserved</option>
            <option value="rented">Rented</option>
            <option value="maintenance">Maintenance</option>
            <option value="inactive">Inactive</option>
          </select>
        </label>
        <label>
          Fuel type
          <select name="fuelType" value={currentForm.fuelType} onChange={onChange}>
            <option value="diesel">Diesel</option>
            <option value="gasoline">Gasoline</option>
            <option value="electric">Electric</option>
            <option value="hybrid">Hybrid</option>
          </select>
        </label>
        <label>
          Capacity
          <input name="capacity" type="number" min="1" value={currentForm.capacity} onChange={onChange} required />
        </label>
      </div>

      <div className="grid-2">
        <label>
          Mileage
          <input name="mileage" type="number" min="0" value={currentForm.mileage} onChange={onChange} required />
        </label>
        <label>
          Location
          <input name="location" value={currentForm.location} onChange={onChange} required />
        </label>
      </div>

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Saving...' : isEditing ? 'Update vehicle' : 'Create vehicle'}
      </button>
    </form>
  );
};
