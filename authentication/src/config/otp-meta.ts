export enum OtpMetaData {
    MaxOTPAttempts = 5,
    OTPValidityInMilli = 900000,//15 minutes
    // OTPTimeoutInMilli = 900000 //15 minutes
    OTPTimeoutInMilli = 10000 //10 seconds
}