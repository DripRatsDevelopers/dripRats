import "@/lib/firebaseAdmin";
import { getAuth } from "firebase-admin/auth";

export async function verifyUser(req: Request): Promise<string> {
  const authHeader = req.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new Error("Unauthorized");
  }

  const token = authHeader.split("Bearer ")[1];

  try {
    const decoded = await getAuth().verifyIdToken(token);
    return decoded.uid;
  } catch (err) {
    console.error("Token verification failed", err);
    throw new Error("Invalid token");
  }
}
