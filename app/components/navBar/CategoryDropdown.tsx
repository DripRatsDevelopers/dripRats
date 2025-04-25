// components/ShopDropdown.tsx

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PRODUCT_CATEGORY } from "@/constants/GeneralConstants";
import { ChevronDown } from "lucide-react";
import Link from "next/link";

export function CategoryDropdown() {
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
        {PRODUCT_CATEGORY.map((cat) => (
          <DropdownMenuItem key={cat.slug} asChild>
            <Link key={cat.slug} href={`/shop/${cat.slug}`} className="w-full">
              {cat.name}
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
