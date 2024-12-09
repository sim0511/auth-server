import { ITimeSlot } from './ITimeSlot.js';

export interface IDayAvailability {
  available: boolean;
  timeSlots: ITimeSlot[];
}
