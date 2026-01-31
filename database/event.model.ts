import mongoose, { Document, Model, Schema } from 'mongoose';

/**
 * TypeScript interface for Event document
 */
export interface IEvent extends Document {
  title: string;
  slug: string;
  description: string;
  overview: string;
  image: string;
  venue: string;
  location: string;
  date: string;
  time: string;
  mode: string;
  audience: string;
  agenda: string[];
  organizer: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Event schema definition with validation rules
 */
const EventSchema = new Schema<IEvent>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },
    overview: {
      type: String,
      required: [true, 'Overview is required'],
      trim: true,
    },
    image: {
      type: String,
      required: [true, 'Image is required'],
      trim: true,
    },
    venue: {
      type: String,
      required: [true, 'Venue is required'],
      trim: true,
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
    },
    date: {
      type: String,
      required: [true, 'Date is required'],
    },
    time: {
      type: String,
      required: [true, 'Time is required'],
    },
    mode: {
      type: String,
      required: [true, 'Mode is required'],
      trim: true,
    },
    audience: {
      type: String,
      required: [true, 'Audience is required'],
      trim: true,
    },
    agenda: {
      type: [String],
      required: [true, 'Agenda is required'],
      validate: {
        validator: (value: string[]) => value.length > 0,
        message: 'Agenda must contain at least one item',
      },
    },
    organizer: {
      type: String,
      required: [true, 'Organizer is required'],
      trim: true,
    },
    tags: {
      type: [String],
      required: [true, 'Tags are required'],
      validate: {
        validator: (value: string[]) => value.length > 0,
        message: 'Tags must contain at least one item',
      },
    },
  },
  {
    timestamps: true,
  }
);

/**
 * Generate URL-friendly slug from title
 * Converts to lowercase, replaces spaces/special chars with hyphens
 */
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

/**
 * Normalize date string to ISO 8601 format (YYYY-MM-DD)
 * Accepts various formats and converts them
 */
function normalizeDate(dateStr: string): string {
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) {
    throw new Error('Invalid date format');
  }
  return date.toISOString().split('T')[0];
}

/**
 * Normalize time string to 24-hour format (HH:MM)
 * Accepts various formats including 12-hour and 24-hour
 */
function normalizeTime(timeStr: string): string {
  // Match common time formats
  const time12HourRegex = /^(\d{1,2}):(\d{2})\s*(AM|PM)$/i;
  const time24HourRegex = /^(\d{1,2}):(\d{2})$/;

  let match = timeStr.trim().match(time12HourRegex);
  if (match) {
    let hours = parseInt(match[1], 10);
    const minutes = match[2];
    const period = match[3].toUpperCase();

    if (period === 'PM' && hours !== 12) hours += 12;
    if (period === 'AM' && hours === 12) hours = 0;

    return `${hours.toString().padStart(2, '0')}:${minutes}`;
  }

  match = timeStr.trim().match(time24HourRegex);
  if (match) {
    const hours = parseInt(match[1], 10);
    const minutes = match[2];

    if (hours < 0 || hours > 23 || parseInt(minutes, 10) < 0 || parseInt(minutes, 10) > 59) {
      throw new Error('Invalid time format');
    }

    return `${hours.toString().padStart(2, '0')}:${minutes}`;
  }

  throw new Error('Invalid time format. Use HH:MM or HH:MM AM/PM');
}

/**
 * Pre-save hook to handle slug generation and date/time normalization
 * Only regenerates slug if title has changed
 */
EventSchema.pre('save', function (next) {
  // Generate slug if title is new or modified
  if (this.isModified('title')) {
    this.slug = generateSlug(this.title);
  }

  // Normalize date to ISO format
  if (this.isModified('date')) {
    try {
      this.date = normalizeDate(this.date);
    } catch (error) {
      return next(error as Error);
    }
  }

  // Normalize time to 24-hour format
  if (this.isModified('time')) {
    try {
      this.time = normalizeTime(this.time);
    } catch (error) {
      return next(error as Error);
    }
  }

  next();
});

/**
 * Create unique index on slug for faster queries and uniqueness enforcement
 */
EventSchema.index({ slug: 1 }, { unique: true });

/**
 * Export Event model or use existing if already compiled
 */
const Event: Model<IEvent> =
  mongoose.models.Event || mongoose.model<IEvent>('Event', EventSchema);

export default Event;
