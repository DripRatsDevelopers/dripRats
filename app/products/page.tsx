"use client";

import { Checkbox } from "@/components/ui/checkbox";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useWishlist } from "@/hooks/useWishlist";
import { db } from "@/lib/firebase";
import { Product } from "@/types/Products";
import { collection, getDocs } from "firebase/firestore";
import { ChevronLeft, ChevronRight, SlidersHorizontal } from "lucide-react";
import { useEffect, useState } from "react";
import ProductCard from "./components/ProductCard";

const categories = [
  "All",
  "Necklaces",
  "Rings",
  "Bracelets",
  "Earrings",
  "Watches",
];

const sortOptions = ["Price: Low to High", "Price: High to Low"];
const PRODUCTS_PER_PAGE = 9;

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  // const [wishlist, setWishlist] = useState<string[]>([]);
  // const [user, setUser] = useState<User | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([
    "All",
  ]);
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [sortBy, setSortBy] = useState("Price: Low to High");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const { toggleWishlist, isInWishlist } = useWishlist();
  const totalPages = Math.ceil(products.length / PRODUCTS_PER_PAGE);

  // Fetch products from Firestore
  useEffect(() => {
    async function fetchProducts() {
      const snapshot = await getDocs(collection(db, "Products"));
      setProducts(
        snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Product))
      );
    }
    fetchProducts();
  }, []);

  // // Handle user auth state change
  // useEffect(() => {
  //   const unsubscribe = onAuthStateChanged(auth, async (user) => {
  //     setUser(user);
  //     if (!user) return;

  //     // Fetch wishlist from Firestore
  //     const q = query(
  //       collection(db, "wishlist"),
  //       where("userId", "==", user.uid)
  //     );
  //     const snapshot = await getDocs(q);
  //     const userWishlist = snapshot.docs.map((doc) => ({
  //       id: doc.id,
  //       ...doc.data().productId,
  //     })) as string[];

  //     // Merge localStorage wishlist with Firestore wishlist (remove duplicates)
  //     const localWishlist: string[] = JSON.parse(
  //       localStorage.getItem("wishlist") || "[]"
  //     );

  //     const mergedWishlist = [
  //       ...userWishlist,
  //       ...localWishlist.filter(
  //         (localItem) =>
  //           !userWishlist.some((firestoreItem) => firestoreItem === localItem)
  //       ),
  //     ];

  //     // Save merged wishlist in Firestore
  //     for (const item of localWishlist) {
  //       if (!userWishlist.some((firestoreItem) => firestoreItem === item)) {
  //         await addDoc(collection(db, "wishlist"), {
  //           userId: user.uid,
  //           productId: item,
  //           productName: item,
  //           price: item,
  //           imageURL: item || "",
  //         });
  //       }
  //     }

  //     // Update wishlist state and clear localStorage
  //     setWishlist(mergedWishlist);
  //     localStorage.removeItem("wishlist");
  //   });

  //   return () => unsubscribe();
  // }, []);

  const handleCategorySelection = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  return (
    <div className="p-6 w-full md:mx-15">
      <div className="flex items-center gap-6">
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className={`mb-4 flex items-center justify-between w-1/10`}
        >
          <span className="flex items-center">
            <SlidersHorizontal />
            <span className="ml-2">Filters</span>
          </span>

          {isSidebarOpen ? <ChevronLeft /> : <ChevronRight />}
        </button>
        <h1 className="text-3xl font-bold mb-4 items-self-center text-center w-full">
          Our Products
        </h1>
      </div>
      <div className="md:flex gap-6">
        <div
          className={`${
            isSidebarOpen
              ? "md:w-1/5 w-full pr-2 shadow-lg p-3 bg-card rounded-lg mt-6 mr-6"
              : ""
          }`}
        >
          {isSidebarOpen && (
            <div>
              <p className="text-primary my-2 font-bold">Categories</p>
              <div className="space-y-2 mb-4">
                {categories.map((category) => (
                  <div key={category} className="flex items-center space-x-2">
                    <Checkbox
                      checked={selectedCategories.includes(category)}
                      onCheckedChange={() => handleCategorySelection(category)}
                    />
                    <label className="text-primary">{category}</label>
                  </div>
                ))}
              </div>

              <div className="mb-4">
                <p className="text-primary my-2 font-bold">Price Range</p>
                <Slider
                  min={0}
                  max={10000}
                  step={100}
                  value={priceRange}
                  onValueChange={setPriceRange}
                />
                <p className="text-sm text-gray-600 mt-2">
                  ₹{priceRange[0]} - ₹{priceRange[1]}
                </p>
              </div>

              <div>
                <p className="text-primary font-bold my-2">Sort By</p>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-full border-gray-600 text-primary">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    {sortOptions.map((option) => (
                      <SelectItem
                        key={option}
                        value={option}
                        className="text-gray-300 text-primary"
                      >
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </div>
        <div className={isSidebarOpen ? "md:w-4/5" : "md:w-full"}>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                isInWishlist={isInWishlist}
                toggleWishlist={toggleWishlist}
              />
            ))}
          </div>
          {totalPages > 1 && (
            <Pagination className="mt-6">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    // disabled={currentPage === 1}
                  />
                </PaginationItem>
                <PaginationItem>
                  <span className="text-muted-foreground">{`Page ${currentPage} of ${totalPages}`}</span>
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    // disabled={currentPage === totalPages}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </div>
      </div>
    </div>
  );
}
