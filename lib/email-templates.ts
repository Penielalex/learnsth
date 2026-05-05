export const verificationEmailTemplate = (otp: string) => `
<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e1e1e1; border-radius: 8px;">
  <h2 style="color: #333;">Verify your email</h2>
  <p style="color: #555; line-height: 1.5;">Thank you for signing up. Please use the following One-Time Password (OTP) to verify your email address:</p>
  <div style="background-color: #f4f4f4; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px; margin: 20px 0; border-radius: 4px; color: #000;">
    ${otp}
  </div>
  <p style="color: #555; line-height: 1.5;">This OTP will expire shortly. If you did not request this, please ignore this email.</p>
  <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
  <p style="color: #888; font-size: 12px;">© ${new Date().getFullYear()} LearnSth. All rights reserved.</p>
</div>
`;

export const passwordResetEmailTemplate = (otp: string) => `
<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e1e1e1; border-radius: 8px;">
  <h2 style="color: #333;">Reset your password</h2>
  <p style="color: #555; line-height: 1.5;">We received a request to reset your password. Use the following One-Time Password (OTP) to proceed with the reset:</p>
  <div style="background-color: #f4f4f4; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px; margin: 20px 0; border-radius: 4px; color: #000;">
    ${otp}
  </div>
  <p style="color: #555; line-height: 1.5;">This OTP will expire shortly. If you did not request this, please ignore this email and your password will remain unchanged.</p>
  <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
  <p style="color: #888; font-size: 12px;">© ${new Date().getFullYear()} LearnSth. All rights reserved.</p>
</div>
`;
