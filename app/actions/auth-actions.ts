"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

/**
 * Send a verification OTP to the user's email.
 * This is useful for resending the OTP.
 */
export async function sendVerificationOtpAction(email: string) {
    try {
        await auth.api.sendVerificationOTP({
            body: {
                email,
                type: "email-verification",
            },
        });
        return { success: true };
    } catch (error: any) {
        return { error: error.message || "Failed to send OTP" };
    }
}

/**
 * Verify the user's email using the provided OTP.
 */
export async function verifyEmailAction(email: string, otp: string) {
    try {
        const result = await auth.api.verifyEmailOTP({
            body: {
                email,
                otp,
            },
        });
        
        if (result.status) {
            return { success: true };
        }
        return { error: "Invalid OTP" };
    } catch (error: any) {
        return { error: error.message || "Verification failed" };
    }
}

/**
 * Request a password reset OTP.
 */
export async function requestPasswordResetAction(email: string) {
    try {
        await auth.api.requestPasswordResetEmailOTP({
            body: {
                email,
            },
        });
        return { success: true };
    } catch (error: any) {
        return { error: error.message || "Failed to request password reset" };
    }
}

/**
 * Reset the password using the OTP and new password.
 */
export async function resetPasswordAction(email: string, otp: string, password: string) {
    try {
        await auth.api.resetPasswordEmailOTP({
            body: {
                email,
                otp,
                password,
            },
        });
        return { success: true };
    } catch (error: any) {
        return { error: error.message || "Failed to reset password" };
    }
}
