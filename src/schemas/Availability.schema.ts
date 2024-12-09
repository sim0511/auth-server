import mongoose, { Schema } from 'mongoose';
import { IAvailability } from '../shared/interfaces/IAvailability.js';
import { DayAvailabilitySchema } from './DayAvailability.schema.js';

export const AvailabilitySchema = new Schema<IAvailability>({
  weekStartDate: { type: Date, required: true },
  days: {
    monday: { type: DayAvailabilitySchema, required: true },
    tuesday: { type: DayAvailabilitySchema, required: true },
    wednesday: { type: DayAvailabilitySchema, required: true },
    thursday: { type: DayAvailabilitySchema, required: true },
    friday: { type: DayAvailabilitySchema, required: true },
    saturday: { type: DayAvailabilitySchema, required: true },
    sunday: { type: DayAvailabilitySchema, required: true },
  },
  submittedAt: { type: Date, required: true, default: Date.now },
});
