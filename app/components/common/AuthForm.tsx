"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuthRedirect } from "@/hooks/useAuthRedirect";
import { auth, googleProvider } from "@/lib/firebase";
import { setCookie } from "cookies-next";
import { FirebaseError } from "firebase/app";
import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { GalleryHorizontal } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function AuthForm({ isSignUp = false }: { isSignUp?: boolean }) {
  useAuthRedirect();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get("redirect");

  const parsedRedirectpath = redirectPath
    ? decodeURIComponent(redirectPath)
    : "/";

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      return toast.error("Invalid Email", {
        description: "Please enter a valid email address",
      });
    }

    if (password.length < 6) {
      return toast.error("Invalid Password", {
        description: "Password must be at least 6 characters",
      });
    }
    try {
      setLoading(true);
      let userCredential;
      if (isSignUp) {
        userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        toast.success("Account created successfully!");
      } else {
        userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );
        toast.success("Logged in successfully!");
      }
      const token = await userCredential.user.getIdToken();

      setCookie("authToken", token);

      router.push(parsedRedirectpath);
    } catch (error: unknown) {
      toast.error((error as FirebaseError).message || "Authentication failed!");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const userCredential = await signInWithPopup(auth, googleProvider);
      toast.success(`Welcome, ${userCredential.user.displayName || "User"}!`);
      const token = await userCredential.user.getIdToken();

      setCookie("authToken", token);
      router.push(parsedRedirectpath);
    } catch (error) {
      console.error(error);

      toast.error("Google login failed!");
    }
  };

  const handleResetPassword = async () => {
    if (!email) {
      toast.error("Please enter your email to reset password.");
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      toast.success("Password reset email sent!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to send reset email!");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-800 to-black p-6">
      <h2 className="text-3xl font-semibold text-white mb-6">
        {isSignUp ? "Sign Up" : "Login"} to DripRats
      </h2>
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <Input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="mb-3"
        />
        <Input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="mb-3"
        />

        {!isSignUp && (
          <button
            onClick={handleResetPassword}
            className="text-blue-500 text-sm mb-3 hover:underline"
          >
            Forgot Password?
          </button>
        )}

        <Button
          onClick={handleAuth}
          className="w-full mb-3 bg-green-600 hover:bg-green-700"
        >
          {loading ? "Loading..." : isSignUp ? "Sign Up" : "Login"}
        </Button>

        <Button
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-2 mb-4  bg-blue-600 hover:bg-blue-700"
        >
          <GalleryHorizontal size={20} /> Sign in with Google
        </Button>

        <p className="text-center">
          {isSignUp ? "Already have an account?" : "Don't have an account?"}
          <span
            onClick={() => {
              setEmail("");
              setPassword("");
              if (isSignUp) {
                router.push(`/auth/login${window.location.search}`);
              } else router.push(`/auth/signup${window.location.search}`);
            }}
            className="text-blue-500 cursor-pointer hover:underline ml-2"
          >
            {isSignUp ? "Login" : "Sign Up"}
          </span>
        </p>
      </div>
    </div>
  );
}
