import { z } from 'zod';

export const createVehicleSchema = z.object({
  body: z.object({
    vin: z.string().min(8).max(32),
    category: z.string().min(2).max(50),
    status: z.enum(['available', 'reserved', 'rented', 'maintenance', 'inactive']).optional(),
    mileage: z.number().min(0),
    location: z.string().min(2).max(120),
    fuelType: z.enum(['diesel', 'gasoline', 'electric', 'hybrid']),
    capacity: z.number().int().min(1).max(12),
  }),
});

export const updateVehicleSchema = z.object({
  body: z.object({
    category: z.string().min(2).max(50).optional(),
    status: z.enum(['available', 'reserved', 'rented', 'maintenance', 'inactive']).optional(),
    mileage: z.number().min(0).optional(),
    location: z.string().min(2).max(120).optional(),
    fuelType: z.enum(['diesel', 'gasoline', 'electric', 'hybrid']).optional(),
    capacity: z.number().int().min(1).max(12).optional(),
  }),
});

export const createVehicleDocumentSchema = z.object({
  body: z.object({
    vehicleId: z.string().min(1),
    insurance: z.string().min(2).max(120),
    inspection: z.string().min(2).max(120),
    registration: z.string().min(2).max(120),
    expiryDate: z.string().datetime(),
  }),
});

export const updateVehicleDocumentSchema = z.object({
  body: z.object({
    insurance: z.string().min(2).max(120).optional(),
    inspection: z.string().min(2).max(120).optional(),
    registration: z.string().min(2).max(120).optional(),
    expiryDate: z.string().datetime().optional(),
  }),
});
