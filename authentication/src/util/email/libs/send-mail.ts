import nodemailer from 'nodemailer'

function mailGen(otp: string): string {
    return "OTP to verify your email address is : " + otp
}

export async function sendEmail(otp: string, to: string) {

    let testAccount = await nodemailer.createTestAccount();


    let transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: {
            user: testAccount.user,
            pass: testAccount.pass,
        },
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: '"chat auth 👻" <verifyemail@ethereal.com>',
        to: to,
        subject: "Verification",
        text: mailGen(otp), // plain text body
    });

    console.log("Message sent: %s", info.messageId);

    // Preview only available when sending through an Ethereal account
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
}