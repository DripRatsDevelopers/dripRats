// components/ShopDropdown.tsx

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import Link from "next/link";

export function CategoryDropdown() {
  const categories = ["Earrings", "Necklaces", "Rings", "Bracelets", "Sets"];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="text-base font-medium">
          Shop <ChevronDown />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        className="w-50 rounded-xl mt-2 shadow-md"
      >
        {categories.map((cat) => (
          <DropdownMenuItem key={cat} asChild>
            <Link href={`/products/${cat.toLowerCase()}`} className="w-full">
              {cat}
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
