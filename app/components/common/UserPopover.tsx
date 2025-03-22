"use client";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { auth } from "@/lib/firebase";
import {
  User as FirebaseUser,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import { LogIn, LogOut, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function UserPopover() {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success("Logged out successfully");
      router.push("/auth/login");
    } catch (error) {
      toast.error("Logout failed", {
        description: `Something went wrong!, ${error}`,
      });
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <User className="w-6 h-6 cursor-pointer hover:text-gray-400" />
      </PopoverTrigger>

      <PopoverContent className="w-56 p-4 bg-white rounded-md shadow-md text-gray-700">
        {user ? (
          <>
            <div className="flex flex-col items-center mb-3">
              <p className="font-semibold">
                Hello, {user.displayName || user.email}
              </p>
              <p className="text-sm text-gray-500">{user.email}</p>
            </div>
            <Button
              variant="outline"
              className="w-full mt-2"
              onClick={handleLogout}
            >
              <LogOut size={18} className="mr-2" /> Logout
            </Button>
          </>
        ) : (
          <>
            <div className="flex flex-col items-center mb-3">
              <p className="font-semibold">Hello, Guest</p>
              <p className="text-sm text-gray-500">
                Sign in to access more features
              </p>
            </div>
            <Button
              variant="outline"
              className="w-full mt-2"
              onClick={() => router.push("/auth/login")}
            >
              <LogIn size={18} className="mr-2" /> Login
            </Button>
          </>
        )}
      </PopoverContent>
    </Popover>
  );
}
