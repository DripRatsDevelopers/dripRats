import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";

type CheckoutProduct = {
  productId: string;
  quantity: number;
};

type CheckoutSessionData = {
  sessionId: string;
  startedAt: number;
  products: CheckoutProduct[];
  type: "product" | "cart";
};

const STORAGE_KEY = "_cxs";
const EXPIRATION_TIME_MS = 20 * 60 * 1000; // 20 minutes

export function useCheckoutSession() {
  const searchParams = useSearchParams();
  const [session, setSession] = useState<CheckoutSessionData | null>(null);
  const [isExpired, setIsExpired] = useState(false);
  const [isSessionInvalid, setIsSessionInvalid] = useState(false);

  const hasChecked = useRef(false);

  useEffect(() => {
    if (hasChecked.current) return;
    hasChecked.current = true;

    const stored = localStorage.getItem(STORAGE_KEY);
    const sessionIdFromUrl = searchParams.get("sessionId");

    if (!stored || !sessionIdFromUrl) {
      setIsSessionInvalid(true);
      return;
    }

    try {
      const sessions: CheckoutSessionData[] = JSON.parse(stored);

      const currentSession = sessions.find(
        (session) => session.sessionId === sessionIdFromUrl
      );

      if (!currentSession) {
        setIsSessionInvalid(true);
        return;
      }

      if (Date.now() - currentSession.startedAt > EXPIRATION_TIME_MS) {
        localStorage.removeItem(STORAGE_KEY);
        setIsExpired(true);
        return;
      }

      setSession(currentSession);
    } catch {
      setIsSessionInvalid(true);
    }
  }, [searchParams]);

  const initSession = (
    products: CheckoutProduct[],
    type: "product" | "cart"
  ): string => {
    const sessionId = uuidv4();
    const data: CheckoutSessionData = {
      sessionId,
      startedAt: Date.now(),
      products,
      type,
    };

    const currentSessions: CheckoutSessionData[] = JSON.parse(
      localStorage.getItem(STORAGE_KEY) || "[]"
    );
    currentSessions.push(data);

    localStorage.setItem(STORAGE_KEY, JSON.stringify(currentSessions));
    setSession(data);
    return sessionId;
  };

  const clearCheckoutSession = () => {
    const currentSessions: CheckoutSessionData[] = JSON.parse(
      localStorage.getItem(STORAGE_KEY) || "[]"
    );
    const updatedSessions = currentSessions.filter(
      (session) => session.sessionId !== session?.sessionId
    );

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedSessions));
    setSession(null);
    setIsExpired(true);
  };

  return {
    session,
    isSessionInvalid,
    isExpired,
    initSession,
    clearCheckoutSession,
  };
}
