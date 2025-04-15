import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

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
