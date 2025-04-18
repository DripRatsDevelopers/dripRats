"use client";
import React from "react";
import { AuthProvider } from "./context/AuthContext";
import { UserProvider } from "./context/UserContext";

const Providers = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <AuthProvider>
      <UserProvider>{children}</UserProvider>
    </AuthProvider>
  );
};

export default Providers;
