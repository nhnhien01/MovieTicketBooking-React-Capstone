import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  movieId: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie', required: true },
  seats: [{ type: String, required: true }], // Ví dụ: ["A1", "A2"]
  totalAmount: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'confirmed', 'cancelled'], default: 'confirmed' },
  bookingDate: { type: Date, default: Date.now }
}, { timestamps: true });

const Booking = mongoose.model('Booking', bookingSchema);
export default Booking;