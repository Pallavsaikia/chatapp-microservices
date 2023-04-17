import { OtpMeta } from "./otp-meta";

export class OTPServices {
    static OTP_LENGTH = 6
    static generateOTP(): string {
        var digits = '0123456789';
        let OTP = '';
        for (let i = 0; i <= OtpMeta.OTP_LENGTH; i++) {
            OTP += digits[Math.floor(Math.random() * 10)];
        }
        return OTP
    }



}