"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

export default function SignupPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/auth/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Signup failed");

            // Auto-login logic could go here; redirecting to login for now
            router.push("/auth/login");
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
                        <h2 className="text-3xl font-bold mb-2">Create an account</h2>
                        <p className="text-zinc-400">Join today to turbocharge your content flow.</p>
                    </div>

                    <form onSubmit={handleSignup} className="space-y-4 animate-fade-up-1">
                        <div>
                            <label className="block font-medium mb-1.5 opacity-80">Full Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full p-3.5 rounded-xl bg-white/[0.03] border border-white/10 focus-ring hover:bg-white/[0.05] transition-all outline-none"
                                placeholder="Jane Doe"
                                required
                            />
                        </div>
                        <div>
                            <label className="block font-medium mb-1.5 opacity-80">Email</label>
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
                            <label className="block font-medium mb-1.5 opacity-80">Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full p-3.5 rounded-xl bg-white/[0.03] border border-white/10 focus-ring hover:bg-white/[0.05] transition-all outline-none"
                                placeholder="••••••••"
                                required
                                minLength={6}
                            />
                            <p className="text-xs text-zinc-500 mt-2">Must be at least 6 characters.</p>
                        </div>



                        <button
                            disabled={loading}
                            className="w-full py-3.5 mt-4 rounded-xl bg-white text-black font-semibold hover:bg-zinc-200 transition-all disabled:opacity-50 disabled:scale-[0.98] active:scale-[0.98] shadow-[0_0_20px_rgba(255,255,255,0.1)]"
                        >
                            {loading ? "Creating Account..." : "Sign Up"}
                        </button>
                    </form>

                    <p className="mt-8 text-center text-zinc-400 animate-fade-up-2">
                        Already have an account?{" "}
                        <Link href="/auth/login" className="text-white hover:text-blue-400 font-medium transition-colors">
                            Log in here
                        </Link>
                    </p>
                </div>
            </div>

            {/* Right aesthetic column */}
            <div className="hidden lg:flex w-1/2 p-6">
                <div className="w-full h-full rounded-[2rem] bg-gradient-to-tr from-emerald-600/20 via-blue-600/20 to-purple-600/20 border border-white/5 relative overflow-hidden backdrop-blur-3xl flex items-center justify-center p-12">
                    <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-emerald-500/20 rounded-full blur-[100px] mix-blend-screen" />
                    <div className="absolute bottom-1/3 left-1/4 w-[400px] h-[400px] bg-blue-500/20 rounded-full blur-[100px] mix-blend-screen" />

                    <div className="relative z-10 w-full max-w-sm glass-card p-8 rounded-2xl animate-fade-up-2 text-center">
                        <div className="w-16 h-16 mx-auto bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(59,130,246,0.3)]">
                            <span className="text-2xl">✨</span>
                        </div>
                        <h3 className="text-xl font-bold mb-3">AI-Powered Workflows</h3>
                        <p className="text-zinc-400 text-sm leading-relaxed">
                            Generate beautiful content summaries, write stunning SEO titles, and publish up to 10x faster with integrated AI tooling.
                        </p>
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
