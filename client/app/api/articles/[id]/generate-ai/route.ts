import { generateContentSummary, generateSEOTitle } from "@/app/lib/ai";
import dbConnect from "@/app/lib/db";
import { authMiddleware } from "@/app/middleware/auth";
import Article from "@/app/models/Article";
import { NextResponse } from "next/server";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const auth = authMiddleware(req);
        if (!auth.authenticated) {
            return NextResponse.json({ error: auth.error }, { status: 401 });
        }

        await dbConnect();
        const article = await Article.findById(id);

        if (!article) {
            return NextResponse.json({ error: "Article not found" }, { status: 404 });
        }

        // Role check: Only admin/author can use AI generation
        if (article.author.toString() !== (auth.user as any).id && (auth.user as any).role !== "admin") {
            return NextResponse.json({ error: "Not authorized" }, { status: 403 });
        }

        // Simulate AI generation
        const summary = await generateContentSummary(article.content);
        const seoTitle = await generateSEOTitle(article.title);

        // Update article with AI results
        article.summary = summary;
        article.seoTitle = seoTitle;
        await article.save();

        return NextResponse.json({ message: "AI generation complete", article });
    } catch (error: any) {
        console.error("AI Generation error:", error);
        return NextResponse.json({ error: error.message || "AI service is unavailable. Please wait and try again." }, { status: 500 });
    }
}
