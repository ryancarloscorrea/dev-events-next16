import { Schema, model, models, Document, Types } from "mongoose";
import Event from "./event.model";

// TypeScript interface for Booking document
export interface IBooking extends Document {
  eventId: Types.ObjectId;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

// Booking schema definition
const BookingSchema = new Schema<IBooking>(
  {
    eventId: {
      type: Schema.Types.ObjectId,
      ref: "Event",
      required: [true, "Event ID is required"],
      index: true, // Index for faster queries
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
      validate: {
        validator: function (v: string) {
          // RFC 5322 compliant email validation
          const emailRegex =
            /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
          return emailRegex.test(v);
        },
        message: "Please provide a valid email address",
      },
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

/**
 * Pre-save hook to validate that the referenced event exists
 * This ensures referential integrity before creating a booking
 */
BookingSchema.pre("save", async function (next) {
  // Only validate if eventId is new or modified
  if (this.isModified("eventId")) {
    try {
      const eventExists = await Event.findById(this.eventId);

      if (!eventExists) {
        return next(
          new Error(
            `Event with ID ${this.eventId} does not exist. Cannot create booking.`
          )
        );
      }
    } catch (error) {
      return next(
        new Error(`Failed to validate event: ${(error as Error).message}`)
      );
    }
  }

  next();
});

// Compound index for querying bookings by event and email
BookingSchema.index({ eventId: 1, email: 1 });

// Index on createdAt for sorting recent bookings
BookingSchema.index({ createdAt: -1 });

// Export the model, reusing existing model in development to prevent recompilation errors
const Booking = models.Booking || model<IBooking>("Booking", BookingSchema);

export default Booking;
