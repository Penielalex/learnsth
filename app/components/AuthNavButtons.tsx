"use client";

import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LogOut } from "lucide-react";

export default function AuthNavButtons({ isAuthenticated, userName }: { isAuthenticated: boolean; userName?: string | null }) {
    const router = useRouter();

    const handleSignOut = async () => {
        await authClient.signOut();
        router.push("/welcome");
        router.refresh();
    };

    if (isAuthenticated) {
        return (
            <div className="flex items-center gap-4 ml-4">
                {userName && <span className="text-sm font-medium text-gold">{userName}</span>}
                <button 
                    onClick={handleSignOut}
                    className="flex items-center gap-2 text-sm font-medium text-foreground/60 hover:text-red-400 transition-colors"
                >
                    <LogOut size={16} />
                    Sign Out
                </button>
            </div>
        );
    }

    return (
        <Link href="/auth/signup" className="gold-button ml-4">
            Sign Up
        </Link>
    );
}
