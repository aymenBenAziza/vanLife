import mongoose from 'mongoose';
import { StatusCodes } from 'http-status-codes';

import { VehicleDocument } from './vehicle-document.model.js';
import { Vehicle } from './vehicle.model.js';

class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

const formatVehicle = (vehicle) => ({
  id: vehicle.id,
  vin: vehicle.vin,
  category: vehicle.category,
  status: vehicle.status,
  mileage: vehicle.mileage,
  location: vehicle.location,
  fuelType: vehicle.fuelType,
  capacity: vehicle.capacity,
  createdAt: vehicle.createdAt,
  updatedAt: vehicle.updatedAt,
});

const formatVehicleDocument = (document) => ({
  id: document.id,
  vehicleId: document.vehicleId?._id ? document.vehicleId._id.toString() : document.vehicleId.toString(),
  vehicleVin: document.vehicleId?.vin,
  insurance: document.insurance,
  inspection: document.inspection,
  registration: document.registration,
  expiryDate: document.expiryDate,
  createdAt: document.createdAt,
  updatedAt: document.updatedAt,
});

export const listVehicles = async () => {
  const vehicles = await Vehicle.find().sort({ createdAt: -1 });
  return vehicles.map(formatVehicle);
};

export const getVehicleById = async (vehicleId) => {
  const vehicle = await Vehicle.findById(vehicleId);

  if (!vehicle) {
    throw new AppError('Vehicle not found', StatusCodes.NOT_FOUND);
  }

  return formatVehicle(vehicle);
};

export const createVehicle = async (payload) => {
  const existingVehicle = await Vehicle.findOne({ vin: payload.vin.toUpperCase() });

  if (existingVehicle) {
    throw new AppError('Vehicle VIN already exists', StatusCodes.CONFLICT);
  }

  const vehicle = await Vehicle.create({
    ...payload,
    vin: payload.vin.toUpperCase(),
  });

  return formatVehicle(vehicle);
};

export const updateVehicle = async (vehicleId, payload) => {
  const vehicle = await Vehicle.findByIdAndUpdate(vehicleId, payload, {
    new: true,
    runValidators: true,
  });

  if (!vehicle) {
    throw new AppError('Vehicle not found', StatusCodes.NOT_FOUND);
  }

  return formatVehicle(vehicle);
};

export const deleteVehicle = async (vehicleId) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const vehicle = await Vehicle.findByIdAndDelete(vehicleId, { session });

    if (!vehicle) {
      throw new AppError('Vehicle not found', StatusCodes.NOT_FOUND);
    }

    await VehicleDocument.deleteMany({ vehicleId }, { session });
    await session.commitTransaction();
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

export const listVehicleDocuments = async () => {
  const documents = await VehicleDocument.find()
    .populate('vehicleId', 'vin')
    .sort({ expiryDate: 1 });

  return documents.map(formatVehicleDocument);
};

export const createVehicleDocument = async (payload) => {
  const vehicle = await Vehicle.findById(payload.vehicleId);

  if (!vehicle) {
    throw new AppError('Vehicle not found for document assignment', StatusCodes.NOT_FOUND);
  }

  const document = await VehicleDocument.create({
    ...payload,
    expiryDate: new Date(payload.expiryDate),
  });

  const populatedDocument = await VehicleDocument.findById(document.id).populate('vehicleId', 'vin');
  return formatVehicleDocument(populatedDocument);
};

export const updateVehicleDocument = async (documentId, payload) => {
  const nextPayload = {
    ...payload,
    ...(payload.expiryDate ? { expiryDate: new Date(payload.expiryDate) } : {}),
  };

  const document = await VehicleDocument.findByIdAndUpdate(documentId, nextPayload, {
    new: true,
    runValidators: true,
  }).populate('vehicleId', 'vin');

  if (!document) {
    throw new AppError('Vehicle document not found', StatusCodes.NOT_FOUND);
  }

  return formatVehicleDocument(document);
};

export const deleteVehicleDocument = async (documentId) => {
  const document = await VehicleDocument.findByIdAndDelete(documentId);

  if (!document) {
    throw new AppError('Vehicle document not found', StatusCodes.NOT_FOUND);
  }
};
