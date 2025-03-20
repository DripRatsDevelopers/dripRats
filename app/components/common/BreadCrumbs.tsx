import { ChevronRight, Home } from "lucide-react";
import Link from "next/link";

const Breadcrumbs = ({ productName }: { productName: string }) => {
  return (
    <nav className="text-sm mb-4 flex items-center space-x-2 text-muted-foreground">
      <Link href="/" className="hover:underline">
        <Home />
      </Link>
      <ChevronRight className="w-4 h-4" />
      <Link href="/products" className="hover:underline">
        Products
      </Link>
      <ChevronRight className="w-4 h-4" />
      <span className="text-foreground font-medium">{productName}</span>
    </nav>
  );
};

export default Breadcrumbs;
