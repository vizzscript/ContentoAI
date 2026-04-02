import dbConnect from "@/app/lib/db";
import User from "@/app/models/User";
import { hashPassword } from "@/app/utils/hash";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { name, email, password } = await req.json();

        if (!name || !email || !password) {
            return NextResponse.json({ error: "All fields are required" }, { status: 400 });
        }

        await dbConnect();

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json({ error: "User already exists" }, { status: 400 });
        }

        const hashed = await hashPassword(password);
        const user = await User.create({
            name,
            email,
            password: hashed,
        });

        return NextResponse.json({ message: "User registered successfully", user: { id: user._id, name: user.name, email: user.email, role: user.role } }, { status: 201 });
    } catch (error: any) {
        console.error("Signup error:", error);
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}
