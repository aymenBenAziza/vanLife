import mongoose from 'mongoose';

const vehicleDocumentSchema = new mongoose.Schema(
  {
    vehicleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vehicle',
      required: true,
      index: true,
    },
    insurance: {
      type: String,
      required: true,
      trim: true,
    },
    inspection: {
      type: String,
      required: true,
      trim: true,
    },
    registration: {
      type: String,
      required: true,
      trim: true,
    },
    expiryDate: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const VehicleDocument = mongoose.model('VehicleDocument', vehicleDocumentSchema);
