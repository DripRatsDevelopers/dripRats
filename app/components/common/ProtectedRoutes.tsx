"use client";

import { useAuth } from "@/context/AuthContext";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

const protectedRoutes = ["/checkout", "/order-success", "/orders"];

const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const search = useSearchParams();
  const isProtectedPath = protectedRoutes.some((path) =>
    pathname.startsWith(path)
  );
  useEffect(() => {
    if (isProtectedPath)
      if (!loading && !user) {
        router.push(`/auth/login?redirect=${pathname}${search}`);
      }
  }, [isProtectedPath, loading, pathname, router, search, user]);

  if ((loading || !user) && isProtectedPath) {
    return <div className="text-center p-4">Loading...</div>;
  }

  return <>{children}</>;
};

export default AuthGuard;
