import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Image from "next/image";
import "./globals.css";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import AuthNavButtons from "@/app/components/AuthNavButtons";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "LearnSth - AI Learning Paths & Knowledge Base",
    description: "Generate personalized, bite-sized learning paths using AI. Organize your knowledge and master anything with The Brain.",
    keywords: ["AI learning", "learning paths", "knowledge base", "study planner", "self-education", "AI tutor"],
    openGraph: {
        title: "LearnSth - AI Learning Paths & Knowledge Base",
        description: "Generate personalized, bite-sized learning paths using AI. Organize your knowledge and master anything with The Brain.",
        url: "https://learnsth.app",
        type: "website",
        images: [{ url: "/logo.png", width: 800, height: 600, alt: "LearnSth Logo" }],
    },
    icons: {
        icon: "/icon.png",
        shortcut: "/icon.png",
        apple: "/icon.png",
    },
};

export default async function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth.api.getSession({ headers: headers() });

    return (
        <html lang="en">
            <body className={`${inter.className} bg-background text-foreground`}>
                <header className="border-b border-brown-light p-4 bg-brown-dark/50 backdrop-blur-md sticky top-0 z-50">
                    <div className="max-w-6xl mx-auto flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <Image unoptimized src="/logo.png" alt="LearnSth Logo" width={48} height={48} className="object-contain" />
                            <h1 className="text-2xl font-bold text-gold gold-glow">LearnSth</h1>
                        </div>
                        <nav className="flex items-center gap-6">
                            <a href="/" className="text-sm font-medium hover:text-gold transition-colors">Home</a>
                            <a href="/brain" className="text-sm font-medium hover:text-gold transition-colors">The Brain</a>
                            <AuthNavButtons isAuthenticated={!!session} userName={session?.user?.name} />
                        </nav>
                    </div>
                </header>
                <main className="max-w-6xl mx-auto p-4 md:p-8">
                    {children}
                </main>
            </body>
        </html>
    );
}
