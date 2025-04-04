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
