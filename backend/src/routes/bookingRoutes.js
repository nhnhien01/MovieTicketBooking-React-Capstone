import express from 'express';
const router = express.Router();

// Route đặt vé
router.post('/', (req, res) => {
    res.json({ message: "Đặt vé thành công!" });
});

export default router;