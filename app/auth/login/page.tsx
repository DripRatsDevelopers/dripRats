"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuthRedirect } from "@/hooks/useAuthRedirect";
import { auth } from "@/lib/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function Login() {
  useAuthRedirect();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
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
      await signInWithEmailAndPassword(auth, email, password);
      toast.success("Login Successful", { description: "Welcome back!" });
      router.push("/");
    } catch (error) {
      console.error(error);
      toast.error("Login Failed", {
        description: "Invalid credentials, please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-800 to-black p-6">
      <h2 className="text-3xl font-semibold text-white mb-6">
        Login to DripRats
      </h2>
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-lg w-96 space-y-4"
      >
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700"
        >
          {loading ? "Loading..." : "Login"}
        </Button>
      </form>
      <p className="text-white mt-4">
        New here?{" "}
        <a href="/auth/signup" className="text-blue-400 underline">
          Sign up
        </a>
      </p>
    </div>
  );
}
