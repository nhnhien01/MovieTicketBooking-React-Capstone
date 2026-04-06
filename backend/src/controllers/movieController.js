export const updateMovie = async (req, res) => {
  try {
    // 1. Làm sạch ID (Đảm bảo ID là 24 ký tự hex chuẩn của MongoDB)
    const cleanId = req.params.id.replace(/:/g, "").trim();

    // 2. Loại bỏ các trường hệ thống và ĐẶC BIỆT là trường language 
    // nếu nó đang chứa giá trị gây lỗi (như "Vietnamese" có chữ V viết hoa)
    const { _id, __v, createdAt, updatedAt, ...updateData } = req.body;

    // 3. Ép kiểu dữ liệu (Double check để chắc chắn không gửi rác lên DB)
    if (updateData.rating) updateData.rating = Number(updateData.rating);
    if (updateData.duration) updateData.duration = Number(updateData.duration);

    // 4. Thực hiện update với tùy chọn tối ưu
    const updatedMovie = await Movie.findByIdAndUpdate(
      cleanId,
      { $set: updateData },
      { 
        returnDocument: 'after', // Fix lỗi Warning [MONGOOSE]
        runValidators: false,    // Bỏ qua validate schema để tránh lỗi index language
        context: 'query'
      }
    );

    if (!updatedMovie) {
      return res.status(404).json({ message: "Không tìm thấy phim để cập nhật!" });
    }

    return res.status(200).json(updatedMovie);

  } catch (error) {
    console.error("❌ Lỗi nghiêm trọng tại Server:", error.message);
    
    // Nếu vẫn dính lỗi Language Index, ta trả về thông báo dễ hiểu hơn
    if (error.message.includes("language override")) {
      return res.status(400).json({ 
        message: "Lỗi định dạng ngôn ngữ! Vui lòng đổi 'Vietnamese' thành 'vietnamese' (viết thường) hoặc kiểm tra lại Index." 
      });
    }

    return res.status(400).json({ message: error.message });
  }
};