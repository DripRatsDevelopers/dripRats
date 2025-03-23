import { auth } from "@/lib/firebase"; // Adjust this import based on your setup
import { onAuthStateChanged, User } from "firebase/auth";
import { useEffect, useState } from "react";

const useAuthState = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { user, loading };
};

export default useAuthState;
