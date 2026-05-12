"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { AlertCircle } from "lucide-react";

export default function SignUpPage() {
    const [error, setError] = useState("");

    const handleGoogleSignUp = async () => {
        try {
            await authClient.signIn.social({
                provider: "google",
                callbackURL: "/",
            });
        } catch (err) {
            setError("Failed to sign up with Google.");
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[85vh] px-4">
            <div className="w-full max-w-md bg-brown-dark/40 border border-brown-light/30 rounded-3xl p-10 shadow-2xl backdrop-blur-sm animate-in fade-in slide-in-from-bottom-4 duration-500 text-center">
                <div className="flex flex-col items-center mb-8">
                    <Link href="/welcome">
                        <Image unoptimized src="/logo.png" alt="LearnSth Logo" width={80} height={80} className="object-contain hover:scale-105 transition-transform" />
                    </Link>
                    <h2 className="text-3xl font-bold text-white mt-6">Create Account</h2>
                    <p className="text-foreground/60 text-sm mt-2">Start your learning journey with Google</p>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-lg text-sm mb-6 flex items-start gap-2">
                        <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
                        <span>{error}</span>
                    </div>
                )}

                <button
                    onClick={handleGoogleSignUp}
                    className="w-full mt-2 flex items-center justify-center gap-3 bg-white hover:bg-white/90 text-black font-semibold py-4 px-4 rounded-2xl transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-white/5 text-lg"
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 12-4.53z" fill="#EA4335"/>
                    </svg>
                    Sign up with Google
                </button>

                <p className="mt-8 text-xs text-foreground/40 px-6 text-center">
                    By creating an account, you agree to LearnSth&apos;s Terms of Service and Privacy Policy.
                </p>

                <div className="mt-8 pt-6 border-t border-brown-light/20">
                    <p className="text-sm text-foreground/60">
                        Already have an account? <Link href="/auth/signin" className="text-gold font-semibold hover:underline">Sign in</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
