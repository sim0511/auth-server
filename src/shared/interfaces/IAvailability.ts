import { IDayAvailability } from './IDayAvailability.js';

export interface IAvailability {
  weekStartDate: Date;
  days: {
    monday: IDayAvailability;
    tuesday: IDayAvailability;
    wednesday: IDayAvailability;
    thursday: IDayAvailability;
    friday: IDayAvailability;
    saturday: IDayAvailability;
    sunday: IDayAvailability;
  };
  submittedAt: Date;
}
