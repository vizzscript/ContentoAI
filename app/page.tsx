import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen selection:bg-purple-500/30 selection:text-purple-200">
      {/* Navigation */}
      <nav className="border-b border-white/5 bg-black/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center font-bold text-lg">C</div>
            <span className="text-xl font-bold tracking-tight">ContentoAI</span>
          </div>
          <div className="flex items-center gap-4 text-sm font-medium">
            <Link href="/auth/login" className="text-zinc-400 hover:text-white transition-colors">
              Log in
            </Link>
            <Link
              href="/auth/signup"
              className="px-4 py-2 bg-white text-black rounded-lg hover:bg-zinc-200 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_0_15px_rgba(255,255,255,0.1)]"
            >
              Sign up
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 relative py-24 sm:py-32 lg:py-40 overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-purple-500/20 rounded-[100%] blur-[120px] mix-blend-screen pointer-events-none -z-10" />
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-500/20 rounded-full blur-[100px] mix-blend-screen pointer-events-none -z-10" />

        <div className="flex w-full max-w-4xl flex-col items-center text-center animate-fade-up">
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-8 rounded-full border border-white/10 bg-white/5 text-xs font-medium text-zinc-300">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
            </span>
            Introducing Contento AI Next-Gen Editor
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight mb-8 leading-[1.1]">
            Scale your content with <br className="hidden sm:block" />
            <span className="gradient-text">Intelligent Automation</span>
          </h1>

          <p className="max-w-2xl text-lg sm:text-xl text-zinc-400 mb-10 leading-relaxed font-light">
            A modern headless CMS tailored for fast-moving teams. Automatically generate summaries, optimize SEO, and write better content — without leaving your editor.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Link
              href="/auth/signup"
              className="flex h-12 w-full sm:w-[160px] items-center justify-center rounded-xl bg-white text-black font-semibold text-[15px] transition-all hover:bg-zinc-200 hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_20px_rgba(255,255,255,0.15)]"
            >
              Start Writing
            </Link>
            <a
              href="https://github.com/contento-ai"
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-12 w-full sm:w-[160px] items-center justify-center gap-2 rounded-xl bg-white/5 border border-white/10 text-[15px] transition-all hover:bg-white/10 hover:border-white/20"
            >
              Documentation
            </a>
          </div>
        </div>
      </main>

      {/* Feature grid */}
      <section className="border-t border-white/10 bg-black py-24 pl-6 pr-6 animate-fade-up-2">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="glass-card p-8 rounded-3xl border-t border-white/10">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-400 mb-6 border border-blue-500/20">
              📝
            </div>
            <h3 className="text-xl font-bold mb-3">Distraction-free</h3>
            <p className="text-zinc-400 leading-relaxed">
              Write seamlessly in an aesthetic, minimalist interface engineered to keep you focused on your words.
            </p>
          </div>
          <div className="glass-card p-8 rounded-3xl border-t border-purple-500/30 shadow-[0_0_30px_rgba(168,85,247,0.05)]">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-400 mb-6 border border-purple-500/20">
              ✨
            </div>
            <h3 className="text-xl font-bold mb-3">AI Powered Insights</h3>
            <p className="text-zinc-400 leading-relaxed">
              Automatically generate concise article summaries and highly-optimized SEO titles with one click.
            </p>
          </div>
          <div className="glass-card p-8 rounded-3xl border-t border-white/10">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-6 border border-emerald-500/20">
              ⚡
            </div>
            <h3 className="text-xl font-bold mb-3">Developer Ready</h3>
            <p className="text-zinc-400 leading-relaxed">
              A robust headless backend built with Next.js App Router, fully typed, ready for global delivery.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-white/10 text-center text-sm text-zinc-500">
        <p>© {new Date().getFullYear()} ContentoAI. All rights reserved.</p>
      </footer>
    </div>
  );
}
