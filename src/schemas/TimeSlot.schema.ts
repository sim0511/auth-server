import mongoose, { Schema } from 'mongoose';
import { ITimeSlot } from '../shared/interfaces/ITimeSlot.js';

export const TimeSlotSchema = new Schema<ITimeSlot>({
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
});
