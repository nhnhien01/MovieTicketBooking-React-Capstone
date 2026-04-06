import express from 'express';
import Movie from '../models/Movie.js';
import { protectRoute, verifyAdmin } from '../middlewares/authMiddleware.js'; 

const router = express.Router();

// Hàm hỗ trợ làm sạch ID đề phòng trường hợp URL bị lỗi dính dấu ":"
const cleanId = (id) => id ? id.replace(/:/g, "").trim() : id;

// --- PUBLIC ROUTES ---
router.get('/', async (req, res) => {
  try {
    const movies = await Movie.find().sort({ createdAt: -1 });
    res.status(200).json(movies);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi lấy danh sách phim", error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const id = cleanId(req.params.id);
    const movie = await Movie.findById(id);
    if (!movie) return res.status(404).json({ message: "Không tìm thấy phim" });
    res.status(200).json(movie);
  } catch (error) {
    res.status(400).json({ message: "ID không hợp lệ", error: error.message });
  }
});

// --- ADMIN ROUTES ---

router.post('/', protectRoute, verifyAdmin, async (req, res) => {
  try {
    const newMovie = new Movie(req.body);
    const savedMovie = await newMovie.save();
    res.status(201).json(savedMovie);
  } catch (error) {
    res.status(400).json({ message: "Không thể thêm phim", error: error.message });
  }
});

router.put('/:id', protectRoute, verifyAdmin, async (req, res) => {
  try {
    // FIX CỨNG: Cắt bỏ mọi thứ từ dấu ":" trở đi
    const rawId = req.params.id;
    const cleanId = rawId.split(':')[0].trim(); 

    const updatedMovie = await Movie.findByIdAndUpdate(
      cleanId, 
      { $set: req.body }, 
      { new: true, runValidators: true }
    );

    if (!updatedMovie) return res.status(404).json({ message: "Không tìm thấy phim" });
    res.status(200).json(updatedMovie);
  } catch (error) {
    console.error("Lỗi cập nhật:", error.message);
    res.status(400).json({ message: "Dữ liệu hoặc ID không hợp lệ", error: error.message });
  }
});

router.delete('/:id', protectRoute, verifyAdmin, async (req, res) => {
  try {
    const id = cleanId(req.params.id);
    const movie = await Movie.findByIdAndDelete(id);
    if (!movie) return res.status(404).json({ message: "Không tìm thấy phim để xóa" });
    res.status(200).json({ message: "Đã xóa phim thành công!" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi xóa phim", error: error.message });
  }
});

export default router;