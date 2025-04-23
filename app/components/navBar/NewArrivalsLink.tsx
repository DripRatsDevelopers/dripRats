import Link from "next/link";

export function NewArrivalsLink() {
  return (
    <Link
      href="/new-arrivals"
      className="relative text-base font-medium text-primary hover:text-foreground transition"
    >
      New Arrivals
      <span className="absolute -top-1 -right-2 h-2 w-2 rounded-full bg-orange-400 animate-ping" />
      <span className="absolute -top-1 -right-2 h-2 w-2 rounded-full bg-orange-400" />
    </Link>
  );
}
