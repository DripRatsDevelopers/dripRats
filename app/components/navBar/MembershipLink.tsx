import Link from "next/link";

export function MembershipLink() {
  return (
    <Link
      href="/membership"
      className="text-base font-medium text-muted-foreground hover:text-foreground transition px-4 py-2"
    >
      Membership
    </Link>
  );
}
