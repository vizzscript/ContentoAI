import { verifyToken } from "@/app/lib/jwt";

export function authMiddleware(req: Request) {
    const token = req.headers.get("authorization")?.split(" ")[1];

    if (!token) {
        return { authenticated: false, error: "No token provided" };
    }

    try {
        const decoded = verifyToken(token);
        return { authenticated: true, user: decoded };
    } catch (error) {
        return { authenticated: false, error: "Invalid or expired token" };
    }
}
