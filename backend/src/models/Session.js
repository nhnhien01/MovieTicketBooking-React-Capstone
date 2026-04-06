import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    refreshToken: {
        type: String,
        required: true,
        unique: true
    },
    expiresAt: {
        type: Date,
        required: true
    }
}, {
    timestamps: true,
});

// Tự động xóa khi hết hạn (TTL Index)
sessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Gán vào biến Session trước khi export để Node.js nhận diện được default export
const Session = mongoose.model('Session', sessionSchema);

export default Session;