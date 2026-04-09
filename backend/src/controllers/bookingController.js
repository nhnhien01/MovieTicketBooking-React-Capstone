const Booking = require('../models/Booking');

// Lấy tất cả danh sách đặt vé (Dành cho Admin)
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('userId', 'displayName email phone') // Lấy thông tin user
      .populate('movieId', 'title posterUrl')       // Lấy thông tin phim
      .sort({ createdAt: -1 });                     // Vé mới nhất lên đầu
    res.status(200).json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Cập nhật trạng thái vé (Ví dụ: từ pending sang confirmed)
exports.updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const updatedBooking = await Booking.findByIdAndUpdate(id, { status }, { new: true });
    res.json(updatedBooking);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};