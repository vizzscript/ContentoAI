import dbConnect from "@/app/lib/db";
import { authMiddleware } from "@/app/middleware/auth";
import Article from "@/app/models/Article";
import { NextResponse } from "next/server";

// GET: List all articles with pagination and filtering
export async function GET(req: Request) {
    try {
        await dbConnect();
        const { searchParams } = new URL(req.url);

        // Pagination
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "10");
        const skip = (page - 1) * limit;

        // Filtering
        const query: any = {};
        const status = searchParams.get("status");
        const tag = searchParams.get("tag");
        const category = searchParams.get("category");

        if (status) query.status = status;
        if (tag) query.tags = { $in: [tag] };
        if (category) query.category = category;

        const articles = await Article.find(query)
            .populate("author", "name email")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await Article.countDocuments(query);

        return NextResponse.json({
            articles,
            pagination: {
                total,
                page,
                limit,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error: any) {
        console.error("List articles error:", error);
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}

// POST: Create a new article
export async function POST(req: Request) {
    try {
        const auth = authMiddleware(req);
        if (!auth.authenticated) {
            return NextResponse.json({ error: auth.error }, { status: 401 });
        }

        const { title, content, status, tags, category } = await req.json();

        if (!title || !content) {
            return NextResponse.json({ error: "Title and Content are required" }, { status: 400 });
        }

        await dbConnect();

        const article = await Article.create({
            title,
            content,
            author: (auth.user as any).id,
            status: status || "draft",
            tags: tags || [],
            category: category || "General",
        });

        return NextResponse.json(article, { status: 201 });
    } catch (error: any) {
        console.error("Create article error:", error);
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}
