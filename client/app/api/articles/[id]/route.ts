import dbConnect from "@/app/lib/db";
import { authMiddleware } from "@/app/middleware/auth";
import Article from "@/app/models/Article";
import { NextResponse } from "next/server";

// GET: Get a single article by ID
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        await dbConnect();
        const article = await Article.findById(id).populate("author", "name email");

        if (!article) {
            return NextResponse.json({ error: "Article not found" }, { status: 404 });
        }

        return NextResponse.json(article);
    } catch (error: any) {
        console.error("Get article error:", error);
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}

// PUT: Update an article
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const auth = authMiddleware(req);
        if (!auth.authenticated) {
            return NextResponse.json({ error: auth.error }, { status: 401 });
        }

        const updates = await req.json();
        await dbConnect();

        const article = await Article.findById(id);

        if (!article) {
            return NextResponse.json({ error: "Article not found" }, { status: 404 });
        }

        // Check if the user is the author or an admin
        if (article.author.toString() !== (auth.user as any).id && (auth.user as any).role !== "admin") {
            return NextResponse.json({ error: "Not authorized to update this article" }, { status: 403 });
        }

        const updatedArticle = await Article.findByIdAndUpdate(id, updates, { returnDocument: 'after', runValidators: true });

        return NextResponse.json(updatedArticle);
    } catch (error: any) {
        console.error("Update article error:", error);
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}

// DELETE: Delete an article
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
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

        // Check if the user is the author or an admin
        if (article.author.toString() !== (auth.user as any).id && (auth.user as any).role !== "admin") {
            return NextResponse.json({ error: "Not authorized to delete this article" }, { status: 403 });
        }

        await Article.findByIdAndDelete(id);

        return NextResponse.json({ message: "Article deleted successfully" });
    } catch (error: any) {
        console.error("Delete article error:", error);
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}
