"use client";

import { useAuth } from "@/context/AuthContext";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

const protectedRoutes = ["/order-success", "/orders"];

const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const search = useSearchParams();
  const isProtectedPath = protectedRoutes.some((path) =>
    pathname.startsWith(path)
  );
  const updatedSearch = search.size ? encodeURIComponent(`?${search}`) : "";

  useEffect(() => {
    if (isProtectedPath)
      if (!loading && !user) {
        router.push(`/auth/login?redirect=${pathname}${updatedSearch}`);
      }
  }, [isProtectedPath, loading, pathname, router, updatedSearch, user]);

  if ((loading || !user) && isProtectedPath) {
    return <div className="text-center p-4">Loading...</div>;
  }

  return <>{children}</>;
};

export default AuthGuard;
