import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "./prisma";
import { emailOTP } from "better-auth/plugins";
import { resend } from "./resend";
import { verificationEmailTemplate, passwordResetEmailTemplate } from "./email-templates";

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),
    emailAndPassword: {
        enabled: true,
        requireEmailVerification: true,
    },
    plugins: [
        emailOTP({
            async sendVerificationOTP({ email, otp, type }) {
                const template = type === "forget-password" 
                    ? passwordResetEmailTemplate(otp)
                    : verificationEmailTemplate(otp);
                
                const subject = type === "forget-password"
                    ? "Reset your password"
                    : "Verify your email";

                await resend.emails.send({
                    from: "LearnSth <onboarding@resend.dev>",
                    to: email,
                    subject: subject,
                    html: template,
                });
            },
            otpLength: 6,
            sendVerificationOnSignUp: true,
        })
    ],
});
