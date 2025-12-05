/**
 * Central export file for all database models
 * Import models from this file throughout the application
 * 
 * Usage:
 * import { Event, Booking } from "@/database";
 */

export { default as Event } from "./event.model";
export { default as Booking } from "./booking.model";

// Export types for use in other parts of the application
export type { IEvent } from "./event.model";
export type { IBooking } from "./booking.model";

