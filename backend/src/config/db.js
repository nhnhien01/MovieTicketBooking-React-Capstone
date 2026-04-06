import mongoose from 'mongoose';
export const connectDB =  async () => {
    try {
        await mongoose.connect(
            process.env.MONGODB_CONNECTONSTRING
        );
        console.log("Liên kết dữ liệu thành công!");
    } catch (error) {
        console.error("Lỗi kết nối data",error);
        process.exit(1);
    }
    
}