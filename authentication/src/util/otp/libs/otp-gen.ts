import { randomBytes } from "crypto"


export class OTP {
    static generateOTP(): string {
        return randomBytes(6).toString('hex')
    }



}