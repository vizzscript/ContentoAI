"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Article {
    _id: string;
    title: string;
    content: string;
    status: string;
    author: { name: string };
    createdAt: string;
}

export default function Dashboard() {
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<{ name: string, email: string } | null>(null);
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem("token");
        const userDataString = localStorage.getItem("user");

        if (!token) {
            router.push("/auth/login");
            return;
        }

        if (userDataString) {
            try {
                setUser(JSON.parse(userDataString));
            } catch (e) { }
        }

        const fetchArticles = async () => {
            try {
                const res = await fetch("/api/articles");
                if (!res.ok) throw new Error("Failed to fetch");
                const data = await res.json();
                setArticles(data.articles || []);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchArticles();
    }, [router]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        router.push("/auth/login");
    };

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white">
            {/* Navbar */}
            <nav className="border-b border-white/10 bg-black/50 backdrop-blur-xl sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/dashboard" className="text-lg font-bold tracking-tight bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
                            ContentoAI
                        </Link>
                        <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-xs font-mono text-zinc-400">Beta</span>
                    </div>

                    <div className="flex items-center gap-6 text-sm">
                        {user && <div className="hidden sm:block text-zinc-400">Hello, {user.name}</div>}
                        <button
                            onClick={handleLogout}
                            className="text-zinc-400 hover:text-white transition-colors"
                        >
                            Log out
                        </button>
                        <Link
                            href="/dashboard/new"
                            className="h-9 px-4 inline-flex items-center justify-center bg-white text-black font-medium rounded-lg hover:bg-zinc-200 transition-colors shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:scale-[1.02] active:scale-[0.98]"
                        >
                            + Write
                        </Link>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-6 py-12 animate-fade-up">
                <header className="mb-12 flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-6 border-b border-white/5">
                    <div>
                        <h1 className="text-3xl font-semibold tracking-tight mb-2">Your Content</h1>
                        <p className="text-zinc-400 w-full max-w-xl">
                            Create, edit, and optimize your articles with built-in AI intelligence.
                        </p>
                    </div>
                </header>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-64 rounded-2xl glass-card skeleton border border-white/5" />
                        ))}
                    </div>
                ) : articles.length === 0 ? (
                    <div className="w-full py-32 flex flex-col items-center justify-center rounded-3xl border border-dashed border-white/10 bg-white/[0.01]">
                        <div className="w-16 h-16 mb-4 rounded-2xl bg-white/5 flex items-center justify-center text-2xl">📝</div>
                        <h3 className="text-xl font-medium mb-2">No articles found</h3>
                        <p className="text-zinc-500 mb-6 max-w-sm text-center">It looks a little empty here. Draft your first high-performing article now.</p>
                        <Link
                            href="/dashboard/new"
                            className="h-10 px-5 inline-flex items-center justify-center bg-white/10 text-white border border-white/10 rounded-lg hover:bg-white/15 transition-colors"
                        >
                            Create Article
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {articles.map((article, index) => (
                            <Link
                                href={`/dashboard/edit/${article._id}`}
                                key={article._id}
                                className={`group p-6 rounded-2xl glass-card hover:border-blue-500/30 transition-all flex flex-col justify-between hover:-translate-y-1 hover:shadow-[0_10px_40px_-10px_rgba(59,130,246,0.15)] animate-fade-up-${Math.min(index + 1, 3)}`}
                            >
                                <div>
                                    <div className="flex justify-between items-center mb-5">
                                        <div className="flex items-center gap-2">
                                            {article.status === 'published' ? (
                                                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                                                    Published
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-medium">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                                                    Draft
                                                </div>
                                            )}
                                        </div>
                                        <span className="text-xs text-zinc-500 font-medium">
                                            {new Date(article.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                        </span>
                                    </div>
                                    <h2 className="text-xl font-semibold group-hover:text-blue-400 transition-colors line-clamp-2 mb-3">
                                        {article.title}
                                    </h2>
                                    <p className="text-zinc-400 text-sm line-clamp-3 leading-relaxed">
                                        {article.content || "Empty content..."}
                                    </p>
                                </div>
                                <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-sm">
                                    <span className="text-zinc-500">{article.author?.name}</span>
                                    <span className="text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                                        Edit <span className="text-base">&rarr;</span>
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
