"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { useTransition, useState, useEffect } from "react";

export default function SearchInput({ placeholder }: { placeholder?: string }) {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [query, setQuery] = useState(searchParams.get("search") || "");

    useEffect(() => {
        const debounce = setTimeout(() => {
            const params = new URLSearchParams(searchParams.toString());
            if (query) {
                params.set("search", query);
            } else {
                params.delete("search");
            }
            startTransition(() => {
                router.replace(`${pathname}?${params.toString()}`, { scroll: false });
            });
        }, 300);

        return () => clearTimeout(debounce);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [query, pathname, router]);

    return (
        <div className="relative w-full max-w-md mx-auto my-6">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-foreground/40">
                <Search size={18} />
            </div>
            <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={placeholder || "Search..."}
                className="w-full bg-brown-dark/30 border border-brown-light focus:border-gold rounded-full pl-11 pr-4 py-2.5 outline-none transition-colors text-sm"
            />
            {isPending && (
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-gold">
                    <span className="animate-pulse text-xs tracking-widest">...</span>
                </div>
            )}
        </div>
    );
}
