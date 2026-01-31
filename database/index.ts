/**
 * Central export file for all database models
 * Allows importing models from a single source throughout the application
 * 
 * Usage:
 * import { Event, Booking } from '@/database';
 */

export { default as Event } from './event.model';
export { default as Booking } from './booking.model';
export type { IEvent } from './event.model';
export type { IBooking } from './booking.model';
