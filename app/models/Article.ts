import mongoose, { Document, Model, Schema } from "mongoose";

export interface IArticle extends Document {
    title: string;
    content: string;
    author: mongoose.Types.ObjectId;
    status: "draft" | "published";
    tags: string[];
    category: string;
    summary?: string;
    seoTitle?: string;
    createdAt: Date;
    updatedAt: Date;
}

const ArticleSchema: Schema = new Schema(
    {
        title: { type: String, required: true },
        content: { type: String, required: true },
        author: { type: Schema.Types.ObjectId, ref: "User", required: true },
        status: { type: String, enum: ["draft", "published"], default: "draft" },
        tags: [{ type: String }],
        category: { type: String, default: "General" },
        summary: { type: String },
        seoTitle: { type: String },
    },
    { timestamps: true }
);

const Article: Model<IArticle> = mongoose.models.Article || mongoose.model<IArticle>("Article", ArticleSchema);

export default Article;
