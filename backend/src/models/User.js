import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    hashedPassword: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    // THÊM TRƯỜNG ROLE Ở ĐÂY
    role: {
        type: String,
        enum: ["user", "admin"], // Chỉ cho phép 1 trong 2 giá trị này
        default: "user" // Mặc định là người dùng bình thường
    },
    displayName: {
        type: String,
        required: true,
        trim: true
    },
    avatarUrl: {
        type: String,
    },
    avatarId: {
        type: String,
    },
    bio: {
        type: String,
        maxlength: 500,
    },
    phone: {
        type: String,
        sparse: true,
    },
}, {
    timestamps: true,
});

const User = mongoose.model("User", userSchema);
export default User;