"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function NewArticle() {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [status, setStatus] = useState("draft");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            router.push("/auth/login");
        }
    }, [router]);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!title.trim() || !content.trim()) {
            setError("Title and content cannot be empty.");
            return;
        }

        setLoading(true);
        setError("");

        const token = localStorage.getItem("token");

        try {
            const res = await fetch("/api/articles", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ title, content, status }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Failed to create article");
            }

            router.push("/dashboard");
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-blue-500/30">
            {/* Navbar (Editor mode) */}
            <nav className="border-b border-white/10 bg-black/50 backdrop-blur-xl sticky top-0 z-50">
                <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/dashboard" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors flex items-center gap-2">
                            &larr; <span className="hidden sm:inline">Back to Dashboard</span>
                        </Link>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="hidden sm:flex items-center gap-2 text-xs font-mono bg-blue-500/10 text-blue-400 px-3 py-1.5 rounded-full border border-blue-500/20">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                            AI connection active
                        </div>
                        <button
                            onClick={handleCreate}
                            disabled={loading}
                            className="h-10 px-5 inline-flex items-center justify-center bg-white text-black font-semibold text-sm rounded-xl hover:bg-zinc-200 transition-all disabled:opacity-50 shadow-[0_0_20px_rgba(255,255,255,0.1)] active:scale-[0.98]"
                        >
                            {loading ? "Saving..." : "Save Draft"}
                        </button>
                    </div>
                </div>
            </nav>

            <main className="max-w-3xl mx-auto px-6 py-12 animate-fade-up">
                <div className="mb-8 flex gap-4 items-center">
                    <label className="text-sm text-zinc-400 font-medium whitespace-nowrap">Status:</label>
                    <div className="relative">
                        <button
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className="flex items-center gap-2 bg-white/[0.03] border border-white/10 rounded-xl px-4 py-2 text-sm font-medium text-zinc-300 hover:bg-white/5 hover:border-white/20 transition-all focus:outline-none w-40 justify-between"
                        >
                            <div className="flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full ${status === 'published' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]'}`} />
                                <span className="capitalize">{status}</span>
                            </div>
                            <span className={`text-[10px] transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}>▼</span>
                        </button>

                        {isDropdownOpen && (
                            <>
                                <div className="fixed inset-0 z-40" onClick={() => setIsDropdownOpen(false)} />
                                <div className="absolute left-0 mt-2 w-40 glass-card rounded-xl border border-white/10 overflow-hidden z-50 animate-fade-up-1 shadow-2xl">
                                    <button
                                        onClick={() => { setStatus('draft'); setIsDropdownOpen(false); }}
                                        className="w-full text-left px-4 py-3 text-sm hover:bg-white/5 transition-colors flex items-center gap-3"
                                    >
                                        <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                                        Draft
                                    </button>
                                    <button
                                        onClick={() => { setStatus('published'); setIsDropdownOpen(false); }}
                                        className="w-full text-left px-4 py-3 text-sm hover:bg-white/5 transition-colors flex items-center gap-3 border-t border-white/5"
                                    >
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                        Published
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                <div className="space-y-6">
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Article Title"
                        className="w-full text-4xl sm:text-5xl font-bold bg-gradient-to-br from-white/[0.04] to-transparent border border-white/5 rounded-[2.5rem] p-8 outline-none placeholder:text-zinc-700 transition-all focus:from-white/[0.06] focus:border-white/10 shadow-[inset_0_2px_20px_rgba(0,0,0,0.4)]"
                        autoFocus
                    />

                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Start writing your story..."
                        className="w-full min-h-[60vh] bg-gradient-to-b from-white/[0.02] to-transparent border border-white/5 rounded-[2.5rem] p-10 outline-none text-lg text-zinc-300 leading-relaxed resize-none placeholder:text-zinc-700 transition-all focus:from-white/[0.04] focus:border-white/10 [field-sizing:content]"
                    />
                </div>
            </main>

            {/* Toasts */}
            <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 pointer-events-none">
                {error && (
                    <div className="pointer-events-auto p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-start gap-3 shadow-lg shadow-black/50 animate-fade-up min-w-[300px]">
                        <span className="text-base mt-0.5">⚠️</span>
                        <div>
                            <p className="font-medium text-red-400">Error</p>
                            <p className="text-red-400/80 text-xs mt-0.5">{error}</p>
                        </div>
                        <button onClick={() => setError("")} className="ml-auto pl-4 text-red-400/50 hover:text-red-400 transition-colors text-lg leading-none">&times;</button>
                    </div>
                )}
            </div>
        </div>
    );
}
