"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function PublicArticlePage() {
    const [article, setArticle] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const params = useParams();

    useEffect(() => {
        const fetchArticle = async () => {
            try {
                const res = await fetch(`/api/articles/${params.id}`);
                if (!res.ok) throw new Error("Article not found or not published");
                const data = await res.json();

                // Security: Only show if published
                if (data.status !== "published") {
                    throw new Error("This article is still a work in progress.");
                }

                setArticle(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchArticle();
    }, [params.id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
                <div className="w-8 h-8 rounded-full border-t-2 border-blue-500 animate-spin" />
            </div>
        );
    }

    if (error || !article) {
        return (
            <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col items-center justify-center p-6 text-center">
                <h1 className="text-4xl font-bold mb-4 gradient-text">404</h1>
                <p className="text-zinc-400 mb-8 max-w-md">{error || "Article not found"}</p>
                <Link href="/" className="px-6 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-sm">
                    Back to Home
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-zinc-300 selection:bg-blue-500/30">
            {/* Simple Public Nav */}
            <nav className="border-b border-white/5 bg-black/50 backdrop-blur-xl sticky top-0 z-50">
                <div className="max-w-3xl mx-auto px-6 h-16 flex items-center justify-between">
                    <Link href="/" className="font-bold gradient-text text-xl">ContentoAI</Link>
                    <div className="text-xs font-mono text-zinc-500 uppercase tracking-widest">
                        Published Article
                    </div>
                </div>
            </nav>

            <main className="max-w-3xl mx-auto px-6 py-20 animate-fade-up">
                {/* Meta Information */}
                <div className="flex items-center gap-3 mb-10">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-white/10 flex items-center justify-center text-sm font-bold text-white">
                        {article.author?.name?.charAt(0) || "A"}
                    </div>
                    <div>
                        <div className="text-sm font-medium text-white">{article.author?.name || "Anonymous"}</div>
                        <div className="text-xs text-zinc-500">
                            {new Date(article.createdAt).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                            })} • {Math.ceil(article.content.length / 1000)} min read
                        </div>
                    </div>
                </div>

                <article>
                    <h1 className="text-4xl sm:text-6xl font-bold text-white mb-10 leading-tight">
                        {article.title}
                    </h1>

                    {article.summary && (
                        <div className="p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/5 mb-12 italic text-zinc-400 leading-relaxed">
                            "{article.summary}"
                        </div>
                    )}

                    <div className="prose prose-invert prose-zinc max-w-none">
                        <div className="text-lg leading-relaxed space-y-6 whitespace-pre-wrap font-serif font-light">
                            {article.content}
                        </div>
                    </div>
                </article>

                {/* Footer Decor */}
                <div className="mt-32 pt-10 border-t border-white/5 flex flex-col items-center gap-6">
                    <div className="text-zinc-600 text-sm italic">Thanks for reading this AI-enhanced story.</div>
                    <div className="flex gap-4">
                        <div className="w-1.5 h-1.5 rounded-full bg-white/10" />
                        <div className="w-1.5 h-1.5 rounded-full bg-white/10" />
                        <div className="w-1.5 h-1.5 rounded-full bg-white/10" />
                    </div>
                    <Link href="/auth/signup" className="mt-4 px-8 py-3 rounded-2xl bg-white text-black font-bold hover:bg-zinc-200 transition-all shadow-[0_0_30px_rgba(255,255,255,0.1)]">
                        Create Your Own AI Article
                    </Link>
                </div>
            </main>
        </div>
    );
}
