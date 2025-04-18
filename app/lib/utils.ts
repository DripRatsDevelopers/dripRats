import { clsx, type ClassValue } from "clsx";
import { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";
import { apiFetch } from "./apiClient";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const isPinCodeValid = (pincode: string) => {
  return pincode?.length === 6;
};

export const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((part) => part[0]?.toUpperCase())
    .join("");
};

export const formatDate = (timestamp: number | string | Date) => {
  const date = new Date(timestamp);
  return `${date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  })} at ${date.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  })}`;
};

export const getSavedAddress = async () => {
  try {
    const response = await apiFetch("/api/user/get-saved-address");
    const {
      body: {
        data: { savedAddress },
        success,
      },
    } = response;
    if (success) {
      return savedAddress || [];
    }
  } catch (error) {
    console.error("SOmething went wrong when fetching saved address", error);
  }
};

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }

    const listener = () => setMatches(media.matches);
    media.addEventListener("change", listener);

    return () => media.removeEventListener("change", listener);
  }, [matches, query]);

  return matches;
}
