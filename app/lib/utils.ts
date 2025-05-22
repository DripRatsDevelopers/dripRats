import { OrderEnum } from "@/types/Order";
import { clsx, type ClassValue } from "clsx";
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

export function capitalize(str: string): string {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}

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
    console.error("Something went wrong when fetching saved address", error);
  }
};

export const getOrderStatusLabel = (orderStatus: OrderEnum): string => {
  switch (orderStatus) {
    case OrderEnum.CONFIRMED: {
      return "Confirmed";
    }
    case OrderEnum.PENDING: {
      return "Pending";
    }
    case OrderEnum.PAID: {
      return "Paid";
    }
    case OrderEnum.SHIPPED: {
      return "Shipped";
    }
    case OrderEnum.OUTFORDELIVERY: {
      return "Out for Delivery";
    }
    case OrderEnum.DELIVERED: {
      return "Delivered";
    }
    default: {
      return "";
    }
  }
};

// const products = [
//   {
//     ProductId: "gold-plated-ring",
//     Name: "Gold Plated Ring",
//     Category: "Rings",
//     Price: 1999,
//     DiscountedPrice: 1599,
//     Description: "Elegant gold plated ring perfect for special occasions.",
//     ImageUrls: ["products/ring-001"],
//     InStock: true,
//     DetailedDescription: {
//       Material: "High-quality stainless steel",
//       Color: "Available in black and white",
//       Dimensions: "2.5cm x 1.5cm x 0.5cm",
//       Weight: "20 grams",
//       Care: "Keep away from moisture for longevity",
//     },
//   },
//   {
//     ProductId: "silver-classic-ring",
//     Name: "Silver Classic Ring",
//     Category: "Rings",
//     Price: 1599,
//     DiscountedPrice: 1299,
//     Description: "Timeless silver ring with intricate craftsmanship.",
//     ImageUrls: ["products/ring-002"],
//     InStock: true,
//     DetailedDescription: {
//       Material: "High-quality stainless steel",
//       Color: "Available in black and white",
//       Dimensions: "2.5cm x 1.5cm x 0.5cm",
//       Weight: "20 grams",
//       Care: "Keep away from moisture for longevity",
//     },
//   },
//   {
//     ProductId: "vintage-diamond-ring",
//     Name: "Vintage Diamond Ring",
//     Category: "Rings",
//     Price: 2999,
//     DiscountedPrice: 2499,
//     Description: "Sparkling vintage diamond ring with unique design.",
//     ImageUrls: ["products/ring-003"],
//     InStock: true,
//     DetailedDescription: {
//       Material: "High-quality stainless steel",
//       Color: "Available in black and white",
//       Dimensions: "2.5cm x 1.5cm x 0.5cm",
//       Weight: "20 grams",
//       Care: "Keep away from moisture for longevity",
//     },
//   },
//   {
//     ProductId: "bold-chain-necklace",
//     Name: "Bold Chain Necklace",
//     Category: "Chains",
//     Price: 2299,
//     DiscountedPrice: 1899,
//     Description: "Sturdy and stylish chain necklace with modern touch.",
//     ImageUrls: ["products/chain-001"],
//     InStock: true,
//     DetailedDescription: {
//       Material: "High-quality stainless steel",
//       Color: "Available in black and white",
//       Dimensions: "2.5cm x 1.5cm x 0.5cm",
//       Weight: "20 grams",
//       Care: "Keep away from moisture for longevity",
//     },
//   },
//   {
//     ProductId: "elegant-chain",
//     Name: "Elegant Chain",
//     Category: "Chains",
//     Price: 1899,
//     DiscountedPrice: 1499,
//     Description: "Sleek and simple chain for everyday wear.",
//     ImageUrls: ["products/chain-002"],
//     InStock: true,
//     DetailedDescription: {
//       Material: "High-quality stainless steel",
//       Color: "Available in black and white",
//       Dimensions: "2.5cm x 1.5cm x 0.5cm",
//       Weight: "20 grams",
//       Care: "Keep away from moisture for longevity",
//     },
//   },
//   {
//     ProductId: "textured-chain",
//     Name: "Textured Chain",
//     Category: "Chains",
//     Price: 2199,
//     DiscountedPrice: 1799,
//     Description: "Textured finish chain for a bold look.",
//     ImageUrls: ["products/chain-003"],
//     InStock: true,
//     DetailedDescription: {
//       Material: "High-quality stainless steel",
//       Color: "Available in black and white",
//       Dimensions: "2.5cm x 1.5cm x 0.5cm",
//       Weight: "20 grams",
//       Care: "Keep away from moisture for longevity",
//     },
//   },
//   {
//     ProductId: "gold-cuban-bracelet",
//     Name: "Gold Cuban Bracelet",
//     Category: "Bracelets",
//     Price: 2599,
//     DiscountedPrice: 1999,
//     Description: "Cuban style gold bracelet with strong links.",
//     ImageUrls: ["products/bracelet-001"],
//     InStock: true,
//     DetailedDescription: {
//       Material: "High-quality stainless steel",
//       Color: "Available in black and white",
//       Dimensions: "2.5cm x 1.5cm x 0.5cm",
//       Weight: "20 grams",
//       Care: "Keep away from moisture for longevity",
//     },
//   },
//   {
//     ProductId: "silver-textured-bracelet",
//     Name: "Silver Textured Bracelet",
//     Category: "Bracelets",
//     Price: 1899,
//     DiscountedPrice: 1499,
//     Description: "Refined silver bracelet with textured finish.",
//     ImageUrls: ["products/bracelet-002"],
//     InStock: true,
//     DetailedDescription: {
//       Material: "High-quality stainless steel",
//       Color: "Available in black and white",
//       Dimensions: "2.5cm x 1.5cm x 0.5cm",
//       Weight: "20 grams",
//       Care: "Keep away from moisture for longevity",
//     },
//   },
// ];

// const searchIndex = [
//   {
//     ProductId: "gold-plated-ring",
//     Name: "Gold Plated Ring",
//     Category: "Rings",
//     Tags: ["gold", "ring", "plated", "wedding"],
//     Price: 1999,
//     DiscountedPrice: 1599,
//     ImageUrls: ["products/ring-001"],
//     InStock: true,
//   },
//   {
//     ProductId: "silver-classic-ring",
//     Name: "Silver Classic Ring",
//     Category: "Rings",
//     Tags: ["silver", "ring", "classic", "casual"],
//     Price: 1599,
//     DiscountedPrice: 1299,
//     ImageUrls: ["products/ring-002"],
//     InStock: true,
//   },
//   {
//     ProductId: "vintage-diamond-ring",
//     Name: "Vintage Diamond Ring",
//     Category: "Rings",
//     Tags: ["vintage", "diamond", "ring", "elegant"],
//     Price: 2999,
//     DiscountedPrice: 2499,
//     ImageUrls: ["products/ring-003"],
//     InStock: true,
//   },
//   {
//     ProductId: "bold-chain-necklace",
//     Name: "Bold Chain Necklace",
//     Category: "Chains",
//     Tags: ["bold", "chain", "necklace", "modern"],
//     Price: 2299,
//     DiscountedPrice: 1899,
//     ImageUrls: ["products/chain-001"],
//     InStock: true,
//   },
//   {
//     ProductId: "elegant-chain",
//     Name: "Elegant Chain",
//     Category: "Chains",
//     Tags: ["elegant", "chain", "minimal", "daily"],
//     Price: 1899,
//     DiscountedPrice: 1499,
//     ImageUrls: ["products/chain-002"],
//     InStock: true,
//   },
//   {
//     ProductId: "textured-chain",
//     Name: "Textured Chain",
//     Category: "Chains",
//     Tags: ["chain", "textured", "bold"],
//     Price: 2199,
//     DiscountedPrice: 1799,
//     ImageUrls: ["products/chain-003"],
//     InStock: true,
//   },
//   {
//     ProductId: "gold-cuban-bracelet",
//     Name: "Gold Cuban Bracelet",
//     Category: "Bracelets",
//     Tags: ["gold", "cuban", "bracelet"],
//     Price: 2599,
//     DiscountedPrice: 1999,
//     ImageUrls: ["products/bracelet-001"],
//     InStock: true,
//   },
//   {
//     ProductId: "silver-textured-bracelet",
//     Name: "Silver Textured Bracelet",
//     Category: "Bracelets",
//     Tags: ["silver", "bracelet", "textured"],
//     Price: 1899,
//     DiscountedPrice: 1499,
//     ImageUrls: ["products/bracelet-002"],
//     InStock: true,
//   },
// ];

// Add products and search index to Firestore
// async function addData() {
//   // const productCollection = collection(db, "Products");
//   // const searchIndexCollection = collection(db, "SearchIndex");

//   // // Add products
//   for (const product of products) {
//     await setDoc(doc(db, "Products", product.ProductId), product);
//     // await addDoc(productCollection, product);
//   }

//   // Add search index
//   for (const index of searchIndex) {
//     await setDoc(doc(db, "SearchIndex", index.ProductId), index);

//     // await addDoc(searchIndexCollection, index);
//   }

//   console.log("Data added successfully");
// }

// Run the function to add data
// addData().catch(console.error);

// async function deleteAllProducts() {
//   const productsCollection = collection(db, "SearchIndex");
//   const productsSnapshot = await getDocs(productsCollection);

//   const batch = writeBatch(db);

//   productsSnapshot.forEach((docSnap) => {
//     batch.delete(doc(db, "SearchIndex", docSnap.id));
//   });

//   await batch.commit();
//   console.log("All products deleted");
// }

// deleteAllProducts();

// const productSummary = [
//   {
//     ProductId: "gold-plated-ring",
//     Price: 1599,
//   },
//   {
//     ProductId: "silver-classic-ring",
//     Price: 1299,
//   },
//   {
//     ProductId: "vintage-diamond-ring",
//     Price: 2499,
//   },
//   {
//     ProductId: "bold-chain-necklace",
//     Price: 1899,
//   },
//   {
//     ProductId: "elegant-chain",
//     Price: 1499,
//   },
//   {
//     ProductId: "textured-chain",
//     Price: 1799,
//   },
//   {
//     ProductId: "gold-cuban-bracelet",
//     Price: 1999,
//   },
//   {
//     ProductId: "silver-textured-bracelet",
//     Price: 1499,
//   },
// ];

// async function addProductSummaryData() {
//   const productSummaryCollection = collection(db, "ProductSummary");

//   // Add search index
//   for (const index of productSummary) {
//     await setDoc(doc(db, "ProductSummary", index.ProductId), index);

//     // await addDoc(productSummaryCollection, index);
//   }

//   console.log("Data added successfully");
// }

// Run the function to add data
// addProductSummaryData().catch(console.error);
