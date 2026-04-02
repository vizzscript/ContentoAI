import dbConnect from "@/app/lib/db";
import { signToken } from "@/app/lib/jwt";
import User from "@/app/models/User";
import { comparePassword } from "@/app/utils/hash";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { email, password } = await req.json();

        if (!email || !password) {
            return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
        }

        await dbConnect();

        const user = await User.findOne({ email });
        if (!user || !user.password) {
            return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
        }

        const isMatch = await comparePassword(password, user.password);
        if (!isMatch) {
            return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
        }

        const token = signToken({ id: user._id, email: user.email, name: user.name, role: user.role || 'editor' });

        return NextResponse.json({ message: "Login successful", token, user: { id: user._id, name: user.name, email: user.email, role: user.role || 'editor' } }, { status: 200 });
    } catch (error: any) {
        console.error("Signin error:", error);
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}
