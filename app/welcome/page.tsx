"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight, ChevronLeft, Sparkles, BrainCircuit, ShieldCheck } from "lucide-react";

const slides = [
  {
    title: "Master Anything with AI",
    description: "LearnSth breaks down complex subjects into bite-sized, 5-minute daily learning paths tailored exactly to your schedule.",
    icon: <Sparkles size={64} className="text-gold mx-auto mb-6" />
  },
  {
    title: "The Brain: Your Knowledge Base",
    description: "Store your own personalized notes, thoughts, and ideas. AI will automatically scan and structure them into categorized topics.",
    icon: <BrainCircuit size={64} className="text-gold mx-auto mb-6" />
  },
  {
    title: "Secure & Built for Growth",
    description: "Sign in securely across all your devices and keep a persistent track record of your lifelong learning journey.",
    icon: <ShieldCheck size={64} className="text-gold mx-auto mb-6" />
  }
];

export default function WelcomePage() {
    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
    const prevSlide = () => setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));

    return (
        <div className="flex flex-col items-center justify-center min-h-[85vh] text-center px-4 max-w-4xl mx-auto space-y-12">
            
            <div className="flex flex-col items-center space-y-4 animate-in fade-in slide-in-from-bottom-6 duration-700">
                <Image unoptimized src="/logo.png" alt="LearnSth Logo" width={120} height={120} className="object-contain" />
                <h1 className="text-5xl md:text-7xl font-bold text-gold gold-glow tracking-tight mt-4">LearnSth</h1>
                <p className="text-xl md:text-2xl text-foreground/70 font-light mt-2 max-w-2xl">
                    Your personal AI tutor and second brain.
                </p>
            </div>

            <div className="relative w-full max-w-2xl bg-brown-dark/30 border border-brown-light/30 rounded-3xl p-8 md:p-12 shadow-2xl backdrop-blur-sm h-[320px] flex flex-col justify-center overflow-hidden">
                <div 
                    className="flex transition-transform duration-500 ease-out h-full"
                    style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                >
                    {slides.map((slide, index) => (
                        <div key={index} className="w-full h-full flex-shrink-0 px-4 flex flex-col justify-center items-center">
                            {slide.icon}
                            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">{slide.title}</h2>
                            <p className="text-foreground/70 text-lg">{slide.description}</p>
                        </div>
                    ))}
                </div>

                <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2">
                    {slides.map((_, index) => (
                        <button 
                            key={index}
                            onClick={() => setCurrentSlide(index)}
                            className={`w-2.5 h-2.5 rounded-full transition-all ${currentSlide === index ? "bg-gold w-6" : "bg-gold/30 hover:bg-gold/50"}`}
                        />
                    ))}
                </div>
                
                <button onClick={prevSlide} className="absolute left-4 top-1/2 -translate-y-1/2 p-2 text-foreground/40 hover:text-gold hidden md:block">
                    <ChevronLeft size={32} />
                </button>
                <button onClick={nextSlide} className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-foreground/40 hover:text-gold hidden md:block">
                    <ChevronRight size={32} />
                </button>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 w-full max-w-md animate-in fade-in zoom-in duration-500 delay-300 fill-mode-both">
                <Link href="/auth/signup" className="flex-1 flex items-center justify-center gold-button py-4 text-center text-lg shadow-gold/20 shadow-lg">
                    Get Started for Free
                </Link>
                <Link href="/auth/signin" className="flex-1 flex items-center justify-center py-4 text-center text-lg text-foreground bg-brown-dark/50 hover:bg-brown-light/30 border border-brown-light/50 hover:border-gold/30 rounded-full transition-all font-semibold">
                    Sign In
                </Link>
            </div>
            
        </div>
    );
}
