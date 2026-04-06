const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const axios = require('axios');

router.post('/momo', async (req, res) => {
    const { amount, orderInfo } = req.body;

    // Các thông số này lấy từ trang dành cho nhà phát triển của MoMo (Sandbox)
    const partnerCode = "MOMOBKUN20180810"; // Mã test mặc định
    const accessKey = "klm05OTp8nm0136n";
    const secretkey = "at67qH6v0LnS7pC0h0SAsg15pbg6099p";
    const requestId = partnerCode + new Date().getTime();
    const orderId = requestId;
    const redirectUrl = "http://localhost:3000/success"; // Trang quay về sau khi thanh toán
    const ipnUrl = "http://localhost:5000/api/payment/callback"; // Webhook để cập nhật DB
    const requestType = "captureWallet";
    const extraData = ""; // Có thể dùng để lưu ID người dùng hoặc ID ghế

    // Tạo chữ ký (Signature) theo chuẩn MoMo
    const rawSignature = `accessKey=${accessKey}&amount=${amount}&extraData=${extraData}&ipnUrl=${ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${partnerCode}&redirectUrl=${redirectUrl}&requestId=${requestId}&requestType=${requestType}`;
    
    const signature = crypto
        .createHmac('sha256', secretkey)
        .update(rawSignature)
        .digest('hex');

    const requestBody = {
        partnerCode, accessKey, requestId, amount, orderId, orderInfo,
        redirectUrl, ipnUrl, extraData, requestType, signature,
        lang: 'vi'
    };

    try {
        const response = await axios.post('https://test-payment.momo.vn/v2/gateway/api/create', requestBody);
        res.status(200).json(response.data); // Trả về payUrl cho Frontend
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;