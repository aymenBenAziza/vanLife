import {
  createVehicle,
  createVehicleDocument,
  deleteVehicle,
  deleteVehicleDocument,
  getVehicleById,
  listVehicleDocuments,
  listVehicles,
  updateVehicle,
  updateVehicleDocument,
} from './fleet.service.js';

export const getVehicles = async (req, res, next) => {
  try {
    const vehicles = await listVehicles();
    res.json({ vehicles });
  } catch (error) {
    next(error);
  }
};

export const getVehicle = async (req, res, next) => {
  try {
    const vehicle = await getVehicleById(req.params.vehicleId);
    res.json({ vehicle });
  } catch (error) {
    next(error);
  }
};

export const postVehicle = async (req, res, next) => {
  try {
    const vehicle = await createVehicle(req.body);
    res.status(201).json({ vehicle });
  } catch (error) {
    next(error);
  }
};

export const patchVehicle = async (req, res, next) => {
  try {
    const vehicle = await updateVehicle(req.params.vehicleId, req.body);
    res.json({ vehicle });
  } catch (error) {
    next(error);
  }
};

export const removeVehicle = async (req, res, next) => {
  try {
    await deleteVehicle(req.params.vehicleId);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const getDocuments = async (req, res, next) => {
  try {
    const documents = await listVehicleDocuments();
    res.json({ documents });
  } catch (error) {
    next(error);
  }
};

export const postDocument = async (req, res, next) => {
  try {
    const document = await createVehicleDocument(req.body);
    res.status(201).json({ document });
  } catch (error) {
    next(error);
  }
};

export const patchDocument = async (req, res, next) => {
  try {
    const document = await updateVehicleDocument(req.params.documentId, req.body);
    res.json({ document });
  } catch (error) {
    next(error);
  }
};

export const removeDocument = async (req, res, next) => {
  try {
    await deleteVehicleDocument(req.params.documentId);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
