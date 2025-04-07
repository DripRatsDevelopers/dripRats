"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const protectedRoutes = ["/checkout"];

const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = window.location.pathname;
  const isProtectedPath = protectedRoutes.some((path) =>
    pathname.startsWith(path)
  );
  useEffect(() => {
    if (isProtectedPath)
      if (!loading && !user) {
        router.push(
          `/auth/login?redirect=${pathname}${window.location.search}`
        );
      }
  }, [user, loading, router, pathname, isProtectedPath]);

  if ((loading || !user) && isProtectedPath) {
    return <div className="text-center p-4">Loading...</div>;
  }

  return <>{children}</>;
};

export default AuthGuard;
