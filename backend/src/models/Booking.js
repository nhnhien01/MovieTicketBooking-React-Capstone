import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  movieId: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie', required: true },
  seats: [{ type: String, required: true }],
  totalAmount: { type: Number, required: true },
  
  // --- THÊM 3 DÒNG NÀY ---
  cinemaName: { type: String, required: true }, // Lưu tên rạp đã chọn
  showDate: { type: String, required: true },   // Lưu ngày xem (VD: 2024-05-20)
  showTime: { type: String, required: true },   // Lưu suất chiếu (VD: 19:30)
  // -----------------------

  status: { type: String, enum: ['pending', 'confirmed', 'cancelled'], default: 'confirmed' },
  bookingDate: { type: Date, default: Date.now }
}, { timestamps: true });

const Booking = mongoose.model('Booking', bookingSchema);
export default Booking;