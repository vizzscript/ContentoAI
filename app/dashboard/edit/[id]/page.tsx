"use client";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function EditArticle() {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [status, setStatus] = useState("draft");
    const [summary, setSummary] = useState("");
    const [seoTitle, setSeoTitle] = useState("");

    const [isTypingSeo, setIsTypingSeo] = useState(false);
    const [isTypingSummary, setIsTypingSummary] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [initialStatus, setInitialStatus] = useState("draft");

    // Status states
    const [loading, setLoading] = useState(true);
    const [aiLoading, setAiLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [aiError, setAiError] = useState("");

    const router = useRouter();
    const params = useParams();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            router.push("/auth/login");
            return;
        }

        const fetchArticle = async () => {
            try {
                const res = await fetch(`/api/articles/${params.id}`);
                if (!res.ok) throw new Error("Article not found");
                const data = await res.json();
                setTitle(data.title);
                setContent(data.content || "");
                setStatus(data.status);
                setInitialStatus(data.status);
                setSummary(data.summary || "");
                setSeoTitle(data.seoTitle || "");
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchArticle();
    }, [params.id, router]);

    const handleAcceptAI = () => {
        if (seoTitle) setTitle(seoTitle);
        if (summary) setContent(prev => prev + (prev.trim() ? "\n\n" : "") + summary);
        // Clear AI fields after applying to make room for new ones or indicate completion
        setSeoTitle("");
        setSummary("");
    };

    const handleRejectAI = () => {
        setSeoTitle("");
        setSummary("");
    };

    const handleUpdate = async () => {
        setSaving(true);
        setError("");
        const token = localStorage.getItem("token");

        try {
            const res = await fetch(`/api/articles/${params.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ title, content, status }), // Server will auto-save the generated summary/seoTitle if previously created
            });

            if (!res.ok) throw new Error("Failed to update");

            setInitialStatus(status); // Mark as deployed successfully

            // Add a slight delay for better UX
            setTimeout(() => {
                router.push("/dashboard");
            }, 600);
        } catch (err: any) {
            setError(err.message);
            setSaving(false);
        }
    };

    const typeEffect = (text: string, setter: (val: string) => void, onComplete?: () => void, speed: number = 20) => {
        let i = 0;
        setter("");
        const interval = setInterval(() => {
            setter(text.slice(0, i + 1));
            i++;
            if (i >= text.length) {
                clearInterval(interval);
                if (onComplete) onComplete();
            }
        }, speed);
        return interval;
    };

    const generateAI = async () => {
        if (!content || content.length < 20) {
            setAiError("Please write at least 20 characters before generating AI insights.");
            setTimeout(() => setAiError(""), 5000);
            return;
        }

        setAiLoading(true);
        setAiError("");
        const token = localStorage.getItem("token");

        try {
            // Ensure any recent content changes are saved first
            await fetch(`/api/articles/${params.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ title, content, status }),
            });

            const res = await fetch(`/api/articles/${params.id}/generate-ai`, {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}));
                throw new Error(errorData.error || "AI service is busy. Please wait and try again.");
            }
            const data = await res.json();

            setAiLoading(false);

            // Start typing animations
            setIsTypingSeo(true);
            typeEffect(data.article.seoTitle, setSeoTitle, () => {
                setIsTypingSeo(false);
                setIsTypingSummary(true);
                typeEffect(data.article.summary, setSummary, () => {
                    setIsTypingSummary(false);
                }, 15);
            }, 30);

        } catch (err: any) {
            setAiError(err.message);
            setAiLoading(false);
            setTimeout(() => setAiError(""), 6000);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-8 h-8 rounded-full border-t-2 border-blue-500 animate-spin" />
                    <p className="text-zinc-500 text-sm font-medium">Loading Editor...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-blue-500/30">
            {/* Editor Navbar */}
            <nav className="border-b border-white/10 bg-black/50 backdrop-blur-xl sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/dashboard" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors flex items-center gap-2">
                            &larr; <span className="hidden sm:inline">Back to Dashboard</span>
                        </Link>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Custom Aesthetic Status Dropdown */}
                        <div className="relative">
                            <button
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                className="flex items-center gap-2 bg-white/[0.03] border border-white/10 rounded-xl px-4 py-2 text-sm font-medium text-zinc-300 hover:bg-white/5 hover:border-white/20 transition-all focus:outline-none"
                            >
                                <div className={`w-2 h-2 rounded-full ${status === 'published' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]'}`} />
                                <span className="capitalize">{status}</span>
                                <span className={`text-[10px] transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}>▼</span>
                            </button>

                            {isDropdownOpen && (
                                <>
                                    <div className="fixed inset-0 z-40" onClick={() => setIsDropdownOpen(false)} />
                                    <div className="absolute right-0 mt-2 w-40 glass-card rounded-xl border border-white/10 overflow-hidden z-50 animate-fade-up-1 shadow-2xl">
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

                        <div className="flex items-center gap-3">
                            {initialStatus === "published" && (
                                <Link
                                    href={`/articles/${params.id}`}
                                    target="_blank"
                                    className="h-10 px-5 inline-flex items-center justify-center bg-blue-600/10 border border-blue-500/30 text-blue-400 font-semibold text-sm rounded-xl hover:bg-blue-600/20 transition-all active:scale-[0.98] animate-fade-up flex gap-2"
                                >
                                    <span className="text-base">🌍</span>
                                    <span className="hidden sm:inline">View Live</span>
                                </Link>
                            )}
                            <button
                                onClick={handleUpdate}
                                disabled={saving || aiLoading}
                                className={`h-10 px-5 inline-flex items-center justify-center font-semibold text-sm rounded-xl transition-all disabled:opacity-50 active:scale-[0.98] shadow-lg ${status === 'published' && initialStatus !== 'published'
                                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-blue-500/20 hover:shadow-blue-500/40'
                                    : 'bg-white text-black hover:bg-zinc-200'
                                    }`}
                            >
                                {saving
                                    ? (status === 'published' && initialStatus !== 'published' ? 'Deploying...' : 'Updating...')
                                    : (status === 'published' && initialStatus !== 'published' ? 'Deploy Article' : (status === 'published' ? 'Update Live' : 'Update Draft'))
                                }
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-6 py-12 flex flex-col lg:flex-row gap-10">
                {/* Editor Column */}
                <div className="flex-1 animate-fade-up">

                    <div className="space-y-6">
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Article Title"
                            className="w-full text-4xl sm:text-5xl font-bold bg-gradient-to-br from-white/[0.04] to-transparent border border-white/5 rounded-[2.5rem] p-8 outline-none placeholder:text-zinc-700 transition-all focus:from-white/[0.06] focus:border-white/10 shadow-[inset_0_2px_20px_rgba(0,0,0,0.4)]"
                        />

                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Start writing..."
                            className="w-full min-h-[60vh] bg-gradient-to-b from-white/[0.02] to-transparent border border-white/5 rounded-[2.5rem] p-10 outline-none text-lg text-zinc-300 leading-relaxed resize-none placeholder:text-zinc-700 font-serif font-light transition-all focus:from-white/[0.04] focus:border-white/10 [field-sizing:content]"
                        />
                    </div>
                </div>

                {/* AI Sidebar Column */}
                <aside className="w-full lg:w-[400px] shrink-0 animate-fade-up-1">
                    <div className="sticky top-24 space-y-6 glass-card p-6 rounded-2xl">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="font-semibold text-lg flex items-center gap-2">
                                <span className="text-xl">✨</span> AI Enhancements
                            </h3>
                            {aiLoading && <div className="w-4 h-4 rounded-full border-t-2 border-purple-500 animate-spin" />}
                        </div>
                        <p className="text-zinc-400 text-sm mb-6">
                            Analyze your text to automatically generate SEO fields and structured summaries.
                        </p>

                        <button
                            onClick={generateAI}
                            disabled={aiLoading || saving}
                            className={`relative w-full h-11 rounded-xl flexitems-center justify-center font-medium transition-all group overflow-hidden ${aiLoading
                                ? "bg-white/5 border border-white/10 text-white/50 cursor-not-allowed"
                                : "bg-zinc-900 border border-purple-500/30 text-white hover:border-purple-500/80 hover:shadow-[0_0_20px_rgba(168,85,247,0.2)]"
                                }`}
                        >
                            {!aiLoading && (
                                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-emerald-600/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                            )}
                            <span className="relative z-10 flex items-center justify-center gap-2 w-full h-full">
                                {aiLoading ? "Generating Output..." : "Generate AI Insights"}
                            </span>
                        </button>

                        <div className="space-y-5 pt-4">
                            {/* SEO Title Field */}
                            <div>
                                <label className="block text-xs font-mono font-medium text-zinc-500 uppercase tracking-widest mb-2">SEO Title</label>
                                <div className={`relative rounded-xl border transition-colors ${seoTitle ? 'border-purple-500/30 bg-purple-500/5' : 'border-white/5 bg-black'}`}>
                                    <div className="relative w-full">
                                        {isTypingSeo ? (
                                            <div className="w-full text-sm p-3.5 text-zinc-200 font-medium whitespace-pre-wrap break-words">
                                                <span className="typing-cursor">{seoTitle}</span>
                                            </div>
                                        ) : (
                                            <div className="w-full text-sm p-3.5 text-zinc-200 font-medium whitespace-pre-wrap break-words min-h-[46px]">
                                                {seoTitle || (aiLoading ? "" : <span className="text-zinc-700 font-normal">Not generated yet</span>)}
                                            </div>
                                        )}
                                    </div>
                                    {aiLoading && (
                                        <div className="absolute inset-0 p-3.5 flex items-center">
                                            <div className="w-1/2 h-4 rounded bg-white/10 skeleton" />
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Summary Field */}
                            <div>
                                <label className="block text-xs font-mono font-medium text-zinc-500 uppercase tracking-widest mb-2">Generated Summary</label>
                                <div className={`relative rounded-xl border transition-colors overflow-hidden ${summary ? 'border-purple-500/30 bg-purple-500/5' : 'border-white/5 bg-black'}`}>
                                    <div className="relative w-full">
                                        {isTypingSummary ? (
                                            <div className="w-full text-sm p-3.5 text-zinc-300 min-h-[140px] leading-relaxed whitespace-pre-wrap break-words">
                                                <span className="typing-cursor">{summary}</span>
                                            </div>
                                        ) : (
                                            <div className="w-full text-sm p-3.5 text-zinc-300 min-h-[140px] leading-relaxed whitespace-pre-wrap break-words">
                                                {summary || (aiLoading ? "" : <span className="text-zinc-700">No summary available. Run AI to generate.</span>)}
                                            </div>
                                        )}
                                    </div>
                                    {aiLoading && (
                                        <div className="absolute inset-x-0 top-0 p-3.5 space-y-3">
                                            <div className="w-full h-3 rounded bg-white/10 skeleton" />
                                            <div className="w-5/6 h-3 rounded bg-white/10 skeleton" />
                                            <div className="w-4/6 h-3 rounded bg-white/10 skeleton" />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Accept/Reject Actions */}
                        {(seoTitle || summary) && !aiLoading && !isTypingSeo && !isTypingSummary && (
                            <div className="flex items-center gap-3 pt-2 animate-fade-up">
                                <button
                                    onClick={handleAcceptAI}
                                    className="flex-1 h-10 rounded-xl bg-white text-black font-semibold text-sm hover:bg-zinc-200 transition-all active:scale-[0.98]"
                                >
                                    Accept Changes
                                </button>
                                <button
                                    onClick={handleRejectAI}
                                    className="h-10 px-4 rounded-xl bg-white/5 border border-white/10 text-white font-medium text-sm hover:bg-white/10 transition-all active:scale-[0.98]"
                                >
                                    Reject
                                </button>
                            </div>
                        )}
                    </div>
                </aside>
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

                {aiError && (
                    <div className="pointer-events-auto p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm flex items-start gap-3 shadow-lg shadow-black/50 animate-fade-up min-w-[300px]">
                        <span className="text-base mt-0.5">⏳</span>
                        <div>
                            <p className="font-medium text-amber-400">Please wait</p>
                            <p className="text-amber-400/80 text-xs mt-0.5">{aiError}</p>
                        </div>
                        <button onClick={() => setAiError("")} className="ml-auto pl-4 text-amber-400/50 hover:text-amber-400 transition-colors text-lg leading-none">&times;</button>
                    </div>
                )}
            </div>
        </div>
    );
}
