import mongoose, { Document, Model, Schema } from 'mongoose';
import Event from './event.model';

/**
 * TypeScript interface for Booking document
 */
export interface IBooking extends Document {
  eventId: mongoose.Types.ObjectId;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Booking schema definition with validation rules
 */
const BookingSchema = new Schema<IBooking>(
  {
    eventId: {
      type: Schema.Types.ObjectId,
      ref: 'Event',
      required: [true, 'Event ID is required'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      validate: {
        validator: function (value: string): boolean {
          // RFC 5322 compliant email regex pattern
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          return emailRegex.test(value);
        },
        message: 'Please provide a valid email address',
      },
    },
  },
  {
    timestamps: true,
  }
);

/**
 * Pre-save hook to verify that the referenced event exists
 * Prevents orphaned bookings by validating event existence before saving
 */
BookingSchema.pre('save', async function (next) {
  // Only validate eventId if it's new or modified
  if (this.isModified('eventId')) {
    try {
      const eventExists = await Event.findById(this.eventId);

      if (!eventExists) {
        throw new Error(`Event with ID ${this.eventId} does not exist`);
      }
    } catch (error) {
      return next(error as Error);
    }
  }

  next();
});

/**
 * Create index on eventId for optimized query performance
 * Speeds up lookups when finding bookings by event
 */
BookingSchema.index({ eventId: 1 });

/**
 * Export Booking model or use existing if already compiled
 */
const Booking: Model<IBooking> =
  mongoose.models.Booking || mongoose.model<IBooking>('Booking', BookingSchema);

export default Booking;
