"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Loader2, AlertCircle } from "lucide-react";

export default function SignUpPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const { error: signUpError } = await authClient.signUp.email({
                email,
                password,
                name,
            });

            if (signUpError) {
                setError(signUpError.message || "Failed to sign up.");
                setLoading(false);
            } else {
                router.push(`/auth/verify-otp?email=${encodeURIComponent(email)}`);
            }
        } catch (err: any) {
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
                    <h2 className="text-3xl font-bold text-white mt-6">Create Account</h2>
                    <p className="text-foreground/60 text-sm mt-2">Start your learning journey today</p>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-lg text-sm mb-6 flex items-start gap-2">
                        <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
                        <span>{error}</span>
                    </div>
                )}

                <form onSubmit={handleSignUp} className="space-y-4">
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-foreground/80 pl-1">Full Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="w-full bg-background/50 border border-brown-light/50 focus:border-gold rounded-xl px-4 py-3 outline-none transition-colors"
                            placeholder="John Doe"
                        />
                    </div>

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
                    
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-foreground/80 pl-1">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full bg-background/50 border border-brown-light/50 focus:border-gold rounded-xl px-4 py-3 outline-none transition-colors"
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="gold-button w-full flex items-center justify-center gap-2 py-3.5 mt-4 shadow-lg shadow-gold/10"
                    >
                        {loading && <Loader2 size={18} className="animate-spin" />}
                        {loading ? "Creating account..." : "Sign Up"}
                    </button>
                </form>

                <div className="mt-8 text-center text-sm text-foreground/60 border-t border-brown-light/20 pt-6">
                    Already have an account?{" "}
                    <Link href="/auth/signin" className="text-gold font-semibold hover:underline">
                        Sign in
                    </Link>
                </div>
            </div>
        </div>
    );
}
