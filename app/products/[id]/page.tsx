"use client";

import Breadcrumbs from "@/components/common/BreadCrumbs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCart } from "@/hooks/useCart";
import { useWishlist } from "@/hooks/useWishlist";
import { db } from "@/lib/firebase";
import { Product } from "@/types/Products";
import { collection, getDocs, query, where } from "firebase/firestore";
import {
  Album,
  Heart,
  Minus,
  Plus,
  Rocket,
  Share,
  Snowflake,
  Tag,
  ZoomIn,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import "./page.css";

export default function ProductDetailPage() {
  const [product, setProduct] = useState<Product | null>(null);
  const [pincode, setPincode] = useState("");
  // const [deliveryDate, setDeliveryDate] = useState<string | null>(null);
  const [currentImage, setCurrentImage] = useState<string>("");
  const [isZoomed, setIsZoomed] = useState(false);
  // const [zoomStyle, setZoomStyle] = useState<React.CSSProperties>({});
  // const [deliveryAvailable, setDeliveryAvailable] = useState<null | boolean>(
  //   null
  // );
  const [quantity, setQuantity] = useState(1);

  // const path = usePathname();
  const router = useRouter();
  const { id } = { id: 2 };

  const { addToCart, isInCart } = useCart();
  const { toggleWishlist, wishlist } = useWishlist();

  const isAddedToCart = product?.id ? isInCart(product?.id) : false;

  const isInWishlist = (productId: string) =>
    wishlist.some((item) => item.id === productId);

  // const checkDelivery = () => {
  //   if (pincode.length === 6) {
  //     const today = new Date();
  //     const deliveryDate = new Date(today.setDate(today.getDate() + 5)); // Assuming 5 days delivery
  //     setDeliveryDate(deliveryDate.toDateString());
  //   } else {
  //     setDeliveryDate(null);
  //   }
  // };

  // const shareProduct = () => {
  //   if (navigator.share) {
  //     navigator.share({
  //       title: product?.Name,
  //       text: `Check out this product: ${product?.Name}`,
  //       url: window.location.href,
  //     });
  //   } else {
  //     alert("Sharing not supported in this browser.");
  //   }
  // };

  // const handleMouseMove = (event: MouseEvent<HTMLDivElement>) => {
  //   if (!isZoomed) return;
  //   const { left, top, width, height } =
  //     event.currentTarget.getBoundingClientRect();
  //   const x = ((event.clientX - left) / width) * 100;
  //   const y = ((event.clientY - top) / height) * 100;
  //   setZoomStyle({ backgroundPosition: `${x}% ${y}%` });
  // };

  const handleBuyNow = () => {
    if (product) {
      addToCart(product);
      router.push("/checkout");
    }
  };

  const handlePincodeCheck = () => {
    // setDeliveryAvailable(pincode === "123456");
  };

  const increaseQuantity = () => setQuantity(quantity + 1);
  const decreaseQuantity = () => quantity > 1 && setQuantity(quantity - 1);

  useEffect(() => {
    if (id) {
      const fetchProduct = async () => {
        const productQuery = query(
          collection(db, "Products"),
          where("id", "==", "2")
        );
        const productDoc = (await getDocs(productQuery))?.docs?.[0];
        if (productDoc.exists()) {
          const product = productDoc.data();
          setProduct({ id: productDoc.id, ...product } as Product);
          setCurrentImage(product.ImageUrls?.[0]);
        }
      };
      fetchProduct();
    }
  }, [id]);

  if (!product) {
    return <p>Loading...</p>;
  }

  return (
    <div className="flex flex-col md:flex-row gap-8 p-6 bg-background text-foreground">
      {/* Left - Images */}
      <div className=" flex-1 flex flex-col">
        <Breadcrumbs productName={product?.Name || "Product"} />
        <div className="flex-1 flex flex-col items-center md:sticky top-0 mt-2">
          {/* Main Image - Centered */}
          <div
            className={`relative w-full max-w-[400px] lg:max-w-[500px] aspect-square border rounded-lg overflow-hidden bg-black/10 
            ${isZoomed ? "cursor-zoom-out" : "cursor-zoom-in"}`}
            onMouseEnter={() => setIsZoomed(true)}
            onMouseLeave={() => setIsZoomed(false)}
          >
            <Image
              src={currentImage}
              alt="Product Image"
              fill
              className={`object-contain transition-transform duration-300 
              ${isZoomed ? "scale-125" : "scale-100"}`}
            />
            {isZoomed && (
              <ZoomIn className="absolute top-2 right-2 text-gray-500" />
            )}
          </div>
          {/* Thumbnails - Centered */}
          <div className="flex gap-2 mt-4 justify-center">
            {product.ImageUrls.map((img, idx) => (
              <Image
                key={idx}
                src={img}
                alt="Thumbnail"
                width={60}
                height={60}
                className="cursor-pointer border rounded-md hover:border-black object-cover"
                onClick={() => setCurrentImage(img)}
              />
            ))}
          </div>
        </div>
      </div>
      {/* Right - Product Details */}
      <div className="flex-1 space-y-4">
        {/* Title and Icons */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-900">
            {product.Name}
          </h1>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              onClick={() => {
                toggleWishlist(product);
              }}
              className={`pr-5 rounded-full transition-all 
          ${
            isInWishlist(product.id)
              ? "text-red-500 hover:text-red-500"
              : "text-gray-400 hover:text-red-500"
          } hover:scale-110`}
            >
              <Heart
                fill={isInWishlist(product.id) ? "currentColor" : "none"}
                stroke="currentColor"
                className="w-6 h-6 !size-auto"
              />
            </Button>
            <Button
              variant="ghost"
              className="pr-5 rounded-full transition-all hover:scale-110"
            >
              <Share className="text-gray-700 w-6 h-6 !size-auto" />
            </Button>
          </div>
        </div>

        {/* Product Description */}

        <p className="text-gray-700">{product.Description}</p>

        {/* Price */}
        <div className="flex items-center space-x-3 mt-2">
          <span className="text-2xl font-semibold text-gray-700 relative">
            <span className="text-gray-400 strike-animation">
              ₹{product.Price}
            </span>
            <span className="ml-2 text-black font-bold discount-price">
              ₹{(product.Price * 0.9).toFixed(2)}
            </span>
          </span>
          <span className="bg-gradient-to-r from-blue-500 to-green-500 text-white text-xs font-bold px-2 py-0.5 rounded-md discount-tag">
            10% OFF
          </span>
        </div>
        <div className="space-y-2">
          <p className="text-gray-600 font-semibold">Select Quantity:</p>
          <div className="flex items-center gap-2">
            <Button
              onClick={decreaseQuantity}
              variant="outline"
              className="p-2"
            >
              <Minus size={16} />
            </Button>
            <p className="text-lg">{quantity}</p>
            <Button
              onClick={increaseQuantity}
              variant="outline"
              className="p-2"
            >
              <Plus size={16} />
            </Button>
          </div>
        </div>

        {/* Offers */}
        <div className="mt-4 space-y-2">
          <p className="text-gray-600 font-semibold flex gap-2">
            <Tag stroke="currentColor" /> Offers:
          </p>
          <div className="flex gap-2 flex-wrap">
            <Badge variant="outline" className="bg-[#4CAF50] text-white">
              10% Off on Orders Above ₹2000
            </Badge>
            <Badge variant="outline" className="bg-[#FF9800] text-white">
              Buy 2, Get 1 Free
            </Badge>
            <Badge variant="outline" className="bg-[#03A9F4] text-white">
              Free Shipping for Members
            </Badge>
          </div>
        </div>
        <Accordion type="multiple" className="my-6">
          <AccordionItem value="details">
            <AccordionTrigger className="text-lg font-medium no-underline hover:no-underline">
              <div className="text-gray-600 flex items-center gap-1">
                <Album stroke="currentColor" />
                Product Details
              </div>
            </AccordionTrigger>
            <AccordionContent className="p-4 bg-gray-50 rounded-md">
              <ul className="list-disc ml-6 space-y-2">
                <li>
                  <strong>Material:</strong> High-quality stainless steel
                </li>
                <li>
                  <strong>Color:</strong> Available in black and white
                </li>
                <li>
                  <strong>Dimensions:</strong> 2.5cm x 1.5cm x 0.5cm
                </li>
                <li>
                  <strong>Weight:</strong> 20 grams
                </li>
                <li>
                  <strong>Care:</strong> Keep away from moisture for longevity
                </li>
              </ul>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="shipping">
            <AccordionTrigger className="text-lg font-medium no-underline hover:no-underline">
              <div className="text-gray-600 flex gap-1 items-center">
                <Rocket stroke="currentColor" /> Shipping Details
              </div>
            </AccordionTrigger>
            <AccordionContent className="p-4 bg-gray-50 rounded-md">
              <p>
                Delivered in 5-7 business days. Free shipping on orders over
                ₹1000.
              </p>
              <div className="mt-2 flex gap-2">
                <Input
                  type="text"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  placeholder="Enter Pincode"
                  className="w-80 border-gray-400"
                />
                <Button
                  onClick={handlePincodeCheck}
                  className="bg-gray-600 text-white hover:bg-gray-500"
                >
                  Check
                </Button>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="suggestions">
            <AccordionTrigger className="text-lg font-medium text-gray-600 no-underline hover:no-underline">
              <div className="text-gray-600 flex gap-1 items-center">
                <Snowflake stroke="currentColor" /> Style Suggestions
              </div>
            </AccordionTrigger>
            <AccordionContent className="p-4 bg-gray-50 rounded-md">
              <p>Pair it with:</p>
              <ul className="list-disc ml-6 space-y-2">
                <li>Classic black outfit for a bold look</li>
                <li>White shirt and denim for a casual vibe</li>
                <li>Formal wear for a sophisticated touch</li>
              </ul>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {/* Buy Now & Add to Cart */}
        <div className="flex flex-col gap-2">
          <Button
            className="w-full bg-black text-white hover:bg-gray-800"
            onClick={handleBuyNow}
          >
            Buy Now
          </Button>
          <Button
            className="w-full bg-white text-black border border-gray-400 hover:bg-gray-100"
            onClick={() => addToCart(product)}
          >
            {isAddedToCart ? "Go to Cart" : "Add to Cart"}
          </Button>
        </div>
      </div>{" "}
    </div>
  );
}
