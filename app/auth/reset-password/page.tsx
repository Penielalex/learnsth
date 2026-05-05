"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Loader2, AlertCircle, CheckCircle2, Eye, EyeOff } from "lucide-react";
import { resetPasswordAction } from "@/app/actions/auth-actions";

function ResetPasswordContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const email = searchParams.get("email") || "";
    const [otp, setOtp] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const handleReset = async (e: React.FormEvent) => {
        e.preventDefault();
        if (otp.length !== 6) {
            setError("Please enter a 6-digit OTP.");
            return;
        }
        if (password.length < 8) {
            setError("Password must be at least 8 characters.");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const result = await resetPasswordAction(email, otp, password);
            if (result.success) {
                setSuccess(true);
                setTimeout(() => {
                    router.push("/auth/signin");
                }, 2000);
            } else {
                setError(result.error || "Failed to reset password. Please check your OTP.");
                setLoading(false);
            }
        } catch (err) {
            setError("An unexpected error occurred.");
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[85vh] px-4">
            <div className="w-full max-w-md bg-brown-dark/40 border border-brown-light/30 rounded-3xl p-8 shadow-2xl backdrop-blur-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex flex-col items-center mb-8">
                    <Link href="/welcome">
                        <Image unoptimized src="/logo.png" alt="LearnSth Logo" width={64} height={64} className="object-contain hover:scale-105 transition-transform" />
                    </Link>
                    <h2 className="text-3xl font-bold text-white mt-6 text-center">Reset Password</h2>
                    <p className="text-foreground/60 text-sm mt-2 text-center">
                        Enter the recovery code sent to <br />
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
                        <span>Password reset successfully! Redirecting...</span>
                    </div>
                )}

                <form onSubmit={handleReset} className="space-y-4">
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-foreground/80 pl-1">OTP Code</label>
                        <input
                            type="text"
                            maxLength={6}
                            value={otp}
                            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                            required
                            className="w-full text-center text-2xl tracking-[0.3em] font-bold bg-background/50 border border-brown-light/50 focus:border-gold rounded-xl px-4 py-3 outline-none transition-colors"
                            placeholder="000000"
                        />
                    </div>

                    <div className="space-y-1 relative">
                        <label className="text-sm font-medium text-foreground/80 pl-1">New Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full bg-background/50 border border-brown-light/50 focus:border-gold rounded-xl px-4 py-3 outline-none transition-colors pr-12"
                                placeholder="••••••••"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-foreground/40 hover:text-foreground transition-colors"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading || success}
                        className="gold-button w-full flex items-center justify-center gap-2 py-3.5 mt-4 shadow-lg shadow-gold/10"
                    >
                        {loading && <Loader2 size={18} className="animate-spin" />}
                        {loading ? "Resetting..." : "Reset Password"}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="animate-spin text-gold" size={48} />
            </div>
        }>
            <ResetPasswordContent />
        </Suspense>
    );
}
