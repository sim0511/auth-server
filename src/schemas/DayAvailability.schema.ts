import mongoose, { Schema } from 'mongoose';
import { IDayAvailability } from '../shared/interfaces/IDayAvailability.js';
import { TimeSlotSchema } from './TimeSlot.schema.js';

export const DayAvailabilitySchema = new Schema<IDayAvailability>({
  available: { type: Boolean, required: true },
  timeSlots: { type: [TimeSlotSchema], required: true },
});
