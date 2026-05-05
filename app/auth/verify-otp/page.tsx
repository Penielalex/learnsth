"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { verifyEmailAction, sendVerificationOtpAction } from "@/app/actions/auth-actions";

function VerifyOtpContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const email = searchParams.get("email") || "";
    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);
    const [resending, setResending] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        if (otp.length !== 6) {
            setError("Please enter a 6-digit OTP.");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const result = await verifyEmailAction(email, otp);
            if (result.success) {
                setSuccess(true);
                setTimeout(() => {
                    router.push("/auth/signin");
                }, 2000);
            } else {
                setError(result.error || "Invalid OTP. Please try again.");
                setLoading(false);
            }
        } catch (err) {
            setError("An unexpected error occurred.");
            setLoading(false);
        }
    };

    const handleResend = async () => {
        setResending(true);
        setError("");
        try {
            const result = await sendVerificationOtpAction(email);
            if (result.success) {
                alert("OTP resent successfully!");
            } else {
                setError(result.error || "Failed to resend OTP.");
            }
        } catch (err) {
            setError("Failed to resend OTP.");
        } finally {
            setResending(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[85vh] px-4">
            <div className="w-full max-w-md bg-brown-dark/40 border border-brown-light/30 rounded-3xl p-8 shadow-2xl backdrop-blur-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex flex-col items-center mb-8">
                    <Link href="/welcome">
                        <Image unoptimized src="/logo.png" alt="LearnSth Logo" width={64} height={64} className="object-contain hover:scale-105 transition-transform" />
                    </Link>
                    <h2 className="text-3xl font-bold text-white mt-6">Verify OTP</h2>
                    <p className="text-foreground/60 text-sm mt-2 text-center">
                        We've sent a 6-digit code to <br />
                        <span className="text-foreground font-medium">{email}</span>
                    </p>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-lg text-sm mb-6 flex items-start gap-2">
                        <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
                        <span>{error}</span>
                    </div>
                )}

                {success && (
                    <div className="bg-green-500/10 border border-green-500/30 text-green-400 p-3 rounded-lg text-sm mb-6 flex items-start gap-2">
                        <CheckCircle2 size={16} className="mt-0.5 flex-shrink-0" />
                        <span>Email verified successfully! Redirecting...</span>
                    </div>
                )}

                <form onSubmit={handleVerify} className="space-y-6">
                    <div className="flex justify-center">
                        <input
                            type="text"
                            maxLength={6}
                            value={otp}
                            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                            required
                            className="w-full max-w-[200px] text-center text-3xl tracking-[0.5em] font-bold bg-background/50 border border-brown-light/50 focus:border-gold rounded-xl px-4 py-4 outline-none transition-colors"
                            placeholder="000000"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading || success}
                        className="gold-button w-full flex items-center justify-center gap-2 py-3.5 shadow-lg shadow-gold/10"
                    >
                        {loading && <Loader2 size={18} className="animate-spin" />}
                        {loading ? "Verifying..." : "Verify Email"}
                    </button>
                </form>

                <div className="mt-8 text-center text-sm text-foreground/60 border-t border-brown-light/20 pt-6">
                    Didn't receive the code?{" "}
                    <button 
                        onClick={handleResend}
                        disabled={resending || success}
                        className="text-gold font-semibold hover:underline disabled:opacity-50"
                    >
                        {resending ? "Sending..." : "Resend OTP"}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function VerifyOtpPage() {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="animate-spin text-gold" size={48} />
            </div>
        }>
            <VerifyOtpContent />
        </Suspense>
    );
}
