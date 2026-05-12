"use client";

import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LogOut, Flame, Star } from "lucide-react";

interface AuthNavButtonsProps {
    isAuthenticated: boolean;
    userName?: string | null;
    level?: number;
    streak?: number;
}

export default function AuthNavButtons({ isAuthenticated, userName, level, streak }: AuthNavButtonsProps) {
    const router = useRouter();

    const handleSignOut = async () => {
        await authClient.signOut();
        router.push("/welcome");
        router.refresh();
    };

    if (isAuthenticated) {
        return (
            <div className="flex items-center gap-6 ml-4">
                <div className="flex items-center gap-4 border-r border-brown-light/30 pr-6">
                    {streak !== undefined && streak > 0 && (
                        <div className="flex items-center gap-1.5" title="Daily Streak">
                            <Flame size={16} className="text-orange-500" fill="currentColor" />
                            <span className="text-sm font-bold text-orange-500">{streak}</span>
                        </div>
                    )}
                    {level !== undefined && (
                        <div className="flex items-center gap-1.5" title="User Level">
                            <Star size={16} className="text-gold" fill="currentColor" />
                            <span className="text-sm font-bold text-gold">Lvl {level}</span>
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-4">
                    {userName && <span className="text-sm font-medium text-foreground/80">{userName}</span>}
                    <button 
                        onClick={handleSignOut}
                        className="flex items-center gap-2 text-sm font-medium text-foreground/40 hover:text-red-400 transition-colors"
                    >
                        <LogOut size={16} />
                        Sign Out
                    </button>
                </div>
            </div>
        );
    }

    return (
        <Link href="/auth/signup" className="gold-button ml-4">
            Sign Up
        </Link>
    );
}
