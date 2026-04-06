const Booking = require('../models/Booking');

exports.createBooking = async (req, res) => {
  try {
    const { movieId, user, seats, totalPrice } = req.body;
    
    const newBooking = new Booking({
      movie: movieId,
      user,
      seats,
      totalPrice
    });

    const savedBooking = await newBooking.save();
    res.status(201).json(savedBooking);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};