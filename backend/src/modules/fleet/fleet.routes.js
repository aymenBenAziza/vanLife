import { Router } from 'express';

import { authenticate, authorize, validateRequest } from '../users/auth.middleware.js';
import {
  getDocuments,
  getVehicle,
  getVehicles,
  patchDocument,
  patchVehicle,
  postDocument,
  postVehicle,
  removeDocument,
  removeVehicle,
} from './fleet.controller.js';
import {
  createVehicleDocumentSchema,
  createVehicleSchema,
  updateVehicleDocumentSchema,
  updateVehicleSchema,
} from './fleet.validation.js';

export const fleetRouter = Router();

fleetRouter.use(authenticate, authorize('admin', 'staff'));

fleetRouter.get('/vehicles', getVehicles);
fleetRouter.get('/vehicles/:vehicleId', getVehicle);
fleetRouter.post('/vehicles', validateRequest(createVehicleSchema), postVehicle);
fleetRouter.patch('/vehicles/:vehicleId', validateRequest(updateVehicleSchema), patchVehicle);
fleetRouter.delete('/vehicles/:vehicleId', removeVehicle);

fleetRouter.get('/documents', getDocuments);
fleetRouter.post('/documents', validateRequest(createVehicleDocumentSchema), postDocument);
fleetRouter.patch('/documents/:documentId', validateRequest(updateVehicleDocumentSchema), patchDocument);
fleetRouter.delete('/documents/:documentId', removeDocument);
