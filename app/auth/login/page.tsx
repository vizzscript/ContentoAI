"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/auth/signin", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Login failed");

            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));
            router.push("/dashboard");
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex text-sm sm:text-base selection:bg-blue-500/30 selection:text-blue-200">
            {/* Left standard column (Form) */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12 animate-fade-up">
                <div className="w-full max-w-[400px]">
                    <div className="mb-10 text-center lg:text-left">
                        <Link href="/" className="inline-block mb-8 hover:opacity-80 transition-opacity">
                            <h1 className="text-2xl font-bold tracking-tight gradient-text">
                                ContentoAI
                            </h1>
                        </Link>
                        <h2 className="text-3xl font-bold mb-2">Welcome back</h2>
                        <p className="text-zinc-400">Log in to manage your AI-enhanced content.</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-5 animate-fade-up-1">
                        <div>
                            <label className="block font-medium mb-2 opacity-80">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full p-3.5 rounded-xl bg-white/[0.03] border border-white/10 focus-ring hover:bg-white/[0.05] transition-all outline-none"
                                placeholder="name@example.com"
                                required
                            />
                        </div>
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <label className="block font-medium opacity-80">Password</label>
                                <a href="#" className="text-sm text-blue-400 hover:text-blue-300 transition-colors">Forgot password?</a>
                            </div>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full p-3.5 rounded-xl bg-white/[0.03] border border-white/10 focus-ring hover:bg-white/[0.05] transition-all outline-none"
                                placeholder="••••••••"
                                required
                            />
                        </div>



                        <button
                            disabled={loading}
                            className="w-full py-3.5 mt-2 rounded-xl bg-white text-black font-semibold hover:bg-zinc-200 transition-all disabled:opacity-50 disabled:scale-[0.98] active:scale-[0.98] shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_25px_rgba(255,255,255,0.2)]"
                        >
                            {loading ? "Authenticating..." : "Log In"}
                        </button>
                    </form>

                    <p className="mt-8 text-center text-zinc-400 animate-fade-up-2">
                        Don't have an account?{" "}
                        <Link href="/auth/signup" className="text-white hover:text-blue-400 font-medium transition-colors">
                            Sign up here
                        </Link>
                    </p>
                </div>
            </div>

            {/* Right aesthetic column */}
            <div className="hidden lg:flex w-1/2 p-6">
                <div className="w-full h-full rounded-[2rem] bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-emerald-600/20 border border-white/5 relative overflow-hidden backdrop-blur-3xl flex items-center justify-center p-12">
                    {/* Abstract background shapes */}
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/30 rounded-full blur-[100px] mix-blend-screen" />
                    <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/30 rounded-full blur-[100px] mix-blend-screen" />

                    <div className="relative z-10 glass-card p-10 rounded-2xl max-w-sm ml-auto mr-12 shadow-2xl animate-fade-up-2">
                        <div className="flex gap-2 mb-6">
                            <div className="w-3 h-3 rounded-full bg-red-500/80" />
                            <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                            <div className="w-3 h-3 rounded-full bg-green-500/80" />
                        </div>
                        <div className="space-y-4 font-mono text-sm opacity-80">
                            <p><span className="text-blue-400">const</span> <span className="text-yellow-200">content</span> = <span className="text-purple-400">await</span> generateAI(article);</p>
                            <p><span className="text-blue-400">if</span> (content.optimized) {'{'}</p>
                            <p className="pl-4">publish();</p>
                            <p>{'}'}</p>
                        </div>
                    </div>
                </div>
            </div>

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
