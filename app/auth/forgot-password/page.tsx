"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Loader2, AlertCircle, ArrowLeft } from "lucide-react";
import { requestPasswordResetAction } from "@/app/actions/auth-actions";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    const handleRequestReset = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const result = await requestPasswordResetAction(email);
            if (result.success) {
                router.push(`/auth/reset-password?email=${encodeURIComponent(email)}`);
            } else {
                setError(result.error || "Failed to request password reset.");
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
                    <Link href="/welcome" className="mb-6 self-start flex items-center gap-2 text-gold hover:underline">
                        <ArrowLeft size={16} />
                        Back to Welcome
                    </Link>
                    <Image unoptimized src="/logo.png" alt="LearnSth Logo" width={64} height={64} className="object-contain hover:scale-105 transition-transform" />
                    <h2 className="text-3xl font-bold text-white mt-6 text-center">Forgot Password?</h2>
                    <p className="text-foreground/60 text-sm mt-2 text-center">Enter your email and we'll send you an OTP to reset your password.</p>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-lg text-sm mb-6 flex items-start gap-2">
                        <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
                        <span>{error}</span>
                    </div>
                )}

                <form onSubmit={handleRequestReset} className="space-y-4">
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-foreground/80 pl-1">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full bg-background/50 border border-brown-light/50 focus:border-gold rounded-xl px-4 py-3 outline-none transition-colors"
                            placeholder="you@example.com"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="gold-button w-full flex items-center justify-center gap-2 py-3.5 mt-4 shadow-lg shadow-gold/10"
                    >
                        {loading && <Loader2 size={18} className="animate-spin" />}
                        {loading ? "Sending..." : "Send OTP"}
                    </button>
                    
                    <div className="text-center mt-4">
                        <Link href="/auth/signin" className="text-gold text-sm hover:underline font-medium">
                            Return to Sign In
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
