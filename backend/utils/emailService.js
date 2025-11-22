const nodemailer = require('nodemailer');

// Email configuration
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: process.env.SMTP_PORT || 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER, // your email
        pass: process.env.SMTP_PASS  // your email password or app password
    }
});

const emailService = {
    /**
     * Send booking confirmation email
     */
    async sendBookingConfirmation(bookingData) {
        try {
            const { contact_email, contact_name, booking_reference, tour_title, final_price, departure_date } = bookingData;

            const mailOptions = {
                from: `"DuLịchVN" <${process.env.SMTP_USER}>`,
                to: contact_email,
                subject: `Xác nhận đặt tour #${booking_reference}`,
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <h2 style="color: #ff6b35;">🎉 Đặt tour thành công!</h2>
                        <p>Xin chào <strong>${contact_name}</strong>,</p>
                        <p>Cảm ơn bạn đã đặt tour tại DuLịchVN. Dưới đây là thông tin chi tiết:</p>
                        
                        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                            <p><strong>Mã đặt chỗ:</strong> ${booking_reference}</p>
                            <p><strong>Tour:</strong> ${tour_title}</p>
                            <p><strong>Ngày khởi hành:</strong> ${departure_date || 'Sẽ được thông báo'}</p>
                            <p><strong>Tổng tiền:</strong> ${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(final_price)}</p>
                        </div>
                        
                        <p>Chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất để xác nhận và hướng dẫn thanh toán.</p>
                        
                        <p>Nếu có bất kỳ thắc mắc nào, vui lòng liên hệ:</p>
                        <p>📞 Hotline: 1900 1234<br>
                        📧 Email: info@dulichvn.com</p>
                        
                        <p>Trân trọng,<br><strong>Đội ngũ DuLịchVN</strong></p>
                    </div>
                `
            };

            const info = await transporter.sendMail(mailOptions);
            console.log('Booking confirmation email sent:', info.messageId);
            return { success: true, messageId: info.messageId };
        } catch (error) {
            console.error('Send booking email error:', error);
            return { success: false, error: error.message };
        }
    },

    /**
     * Send payment confirmation email
     */
    async sendPaymentConfirmation(bookingData) {
        try {
            const { contact_email, contact_name, booking_reference, tour_title, paid_amount, payment_method } = bookingData;

            const mailOptions = {
                from: `"DuLịchVN" <${process.env.SMTP_USER}>`,
                to: contact_email,
                subject: `Thanh toán thành công #${booking_reference}`,
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <h2 style="color: #2ecc71;">✅ Thanh toán thành công!</h2>
                        <p>Xin chào <strong>${contact_name}</strong>,</p>
                        <p>Chúng tôi đã nhận được thanh toán của bạn.</p>
                        
                        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                            <p><strong>Mã đặt chỗ:</strong> ${booking_reference}</p>
                            <p><strong>Tour:</strong> ${tour_title}</p>
                            <p><strong>Số tiền:</strong> ${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(paid_amount)}</p>
                            <p><strong>Phương thức:</strong> ${payment_method}</p>
                        </div>
                        
                        <p>Vé của bạn đã được xác nhận. Chúng tôi sẽ gửi thông tin chi tiết và hướng dẫn tập trung qua email này trước ngày khởi hành.</p>
                        
                        <p>Cảm ơn bạn đã tin tưởng DuLịchVN!</p>
                        
                        <p>Trân trọng,<br><strong>Đội ngũ DuLịchVN</strong></p>
                    </div>
                `
            };

            const info = await transporter.sendMail(mailOptions);
            console.log('Payment confirmation email sent:', info.messageId);
            return { success: true, messageId: info.messageId };
        } catch (error) {
            console.error('Send payment email error:', error);
            return { success: false, error: error.message };
        }
    },

    /**
     * Send cancellation email
     */
    async sendCancellationEmail(bookingData) {
        try {
            const { contact_email, contact_name, booking_reference, tour_title } = bookingData;

            const mailOptions = {
                from: `"DuLịchVN" <${process.env.SMTP_USER}>`,
                to: contact_email,
                subject: `Hủy đặt tour #${booking_reference}`,
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <h2 style="color: #e74c3c;">Thông báo hủy đặt tour</h2>
                        <p>Xin chào <strong>${contact_name}</strong>,</p>
                        <p>Đặt tour của bạn đã được hủy thành công.</p>
                        
                        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                            <p><strong>Mã đặt chỗ:</strong> ${booking_reference}</p>
                            <p><strong>Tour:</strong> ${tour_title}</p>
                        </div>
                        
                        <p>Nếu bạn đã thanh toán, chúng tôi sẽ hoàn tiền theo chính sách hoàn hủy trong vòng 7-10 ngày làm việc.</p>
                        
                        <p>Rất tiếc vì chuyến đi lần này không thành. Hy vọng có dịp phục vụ bạn trong tương lai!</p>
                        
                        <p>Liên hệ: 1900 1234 hoặc info@dulichvn.com</p>
                        
                        <p>Trân trọng,<br><strong>Đội ngũ DuLịchVN</strong></p>
                    </div>
                `
            };

            const info = await transporter.sendMail(mailOptions);
            console.log('Cancellation email sent:', info.messageId);
            return { success: true, messageId: info.messageId };
        } catch (error) {
            console.error('Send cancellation email error:', error);
            return { success: false, error: error.message };
        }
    },

    /**
     * Test email configuration
     */
    async testConnection() {
        try {
            await transporter.verify();
            console.log('✅ Email service ready');
            return true;
        } catch (error) {
            console.error('❌ Email service error:', error.message);
            return false;
        }
    }
};

module.exports = emailService;
