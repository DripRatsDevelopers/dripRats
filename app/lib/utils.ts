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
//     ImageUrls: [
//       "https://images.unsplash.com/photo-1603719461453-0ef44fa837aa?q=80",
//     ],
//   },
//   {
//     ProductId: "silver-classic-ring",
//     Name: "Silver Classic Ring",
//     Category: "Rings",
//     Price: 1599,
//     DiscountedPrice: 1299,
//     Description: "Timeless silver ring with intricate craftsmanship.",
//     ImageUrls: [
//       "https://images.unsplash.com/photo-1684083385930-a9e8446db558?q=80",
//     ],
//   },
//   {
//     ProductId: "vintage-diamond-ring",
//     Name: "Vintage Diamond Ring",
//     Category: "Rings",
//     Price: 2999,
//     DiscountedPrice: 2499,
//     Description: "Sparkling vintage diamond ring with unique design.",
//     ImageUrls: [
//       "https://images.unsplash.com/photo-1670954951623-82ad4881d0ed?q=80",
//     ],
//   },
//   {
//     ProductId: "bold-chain-necklace",
//     Name: "Bold Chain Necklace",
//     Category: "Chains",
//     Price: 2299,
//     DiscountedPrice: 1899,
//     Description: "Sturdy and stylish chain necklace with modern touch.",
//     ImageUrls: [
//       "https://images.unsplash.com/photo-1679973296637-1411c1d25c7e?q=80",
//     ],
//   },
//   {
//     ProductId: "elegant-chain",
//     Name: "Elegant Chain",
//     Category: "Chains",
//     Price: 1899,
//     DiscountedPrice: 1499,
//     Description: "Sleek and simple chain for everyday wear.",
//     ImageUrls: [
//       "https://images.unsplash.com/photo-1679973296602-f49b58765ad4?q=80",
//     ],
//   },
//   {
//     ProductId: "textured-chain",
//     Name: "Textured Chain",
//     Category: "Chains",
//     Price: 2199,
//     DiscountedPrice: 1799,
//     Description: "Textured finish chain for a bold look.",
//     ImageUrls: [
//       "https://images.unsplash.com/photo-1677201795049-014caaa6b1cd?q=80",
//     ],
//   },
//   {
//     ProductId: "gold-cuban-bracelet",
//     Name: "Gold Cuban Bracelet",
//     Category: "Bracelets",
//     Price: 2599,
//     DiscountedPrice: 1999,
//     Description: "Cuban style gold bracelet with strong links.",
//     ImageUrls: [
//       "https://images.unsplash.com/photo-1681091637777-7b5c49bf9691?q=80",
//     ],
//   },
//   {
//     ProductId: "silver-textured-bracelet",
//     Name: "Silver Textured Bracelet",
//     Category: "Bracelets",
//     Price: 1899,
//     DiscountedPrice: 1499,
//     Description: "Refined silver bracelet with textured finish.",
//     ImageUrls: [
//       "https://images.unsplash.com/photo-1681091638141-a87495ae612f?w=900",
//     ],
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
//   },
//   {
//     ProductId: "silver-classic-ring",
//     Name: "Silver Classic Ring",
//     Category: "Rings",
//     Tags: ["silver", "ring", "classic", "casual"],
//     Price: 1599,
//     DiscountedPrice: 1299,
//   },
//   {
//     ProductId: "vintage-diamond-ring",
//     Name: "Vintage Diamond Ring",
//     Category: "Rings",
//     Tags: ["vintage", "diamond", "ring", "elegant"],
//     Price: 2999,
//     DiscountedPrice: 2499,
//   },
//   {
//     ProductId: "bold-chain-necklace",
//     Name: "Bold Chain Necklace",
//     Category: "Chains",
//     Tags: ["bold", "chain", "necklace", "modern"],
//     Price: 2299,
//     DiscountedPrice: 1899,
//   },
//   {
//     ProductId: "elegant-chain",
//     Name: "Elegant Chain",
//     Category: "Chains",
//     Tags: ["elegant", "chain", "minimal", "daily"],
//     Price: 1899,
//     DiscountedPrice: 1499,
//   },
//   {
//     ProductId: "textured-chain",
//     Name: "Textured Chain",
//     Category: "Chains",
//     Tags: ["chain", "textured", "bold"],
//     Price: 2199,
//     DiscountedPrice: 1799,
//   },
//   {
//     ProductId: "gold-cuban-bracelet",
//     Name: "Gold Cuban Bracelet",
//     Category: "Bracelets",
//     Tags: ["gold", "cuban", "bracelet"],
//     Price: 2599,
//     DiscountedPrice: 1999,
//   },
//   {
//     ProductId: "silver-textured-bracelet",
//     Name: "Silver Textured Bracelet",
//     Category: "Bracelets",
//     Tags: ["silver", "bracelet", "textured"],
//     Price: 1899,
//     DiscountedPrice: 1499,
//   },
// ];

// Add products and search index to Firestore
// async function addData() {
//   // const productCollection = collection(db, "Products");
//   // const searchIndexCollection = collection(db, "SearchIndex");

//   // Add products
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
//   const productsCollection = collection(db, "Products");
//   const productsSnapshot = await getDocs(productsCollection);

//   const batch = writeBatch(db);

//   productsSnapshot.forEach((docSnap) => {
//     batch.delete(doc(db, "Products", docSnap.id));
//   });

//   await batch.commit();
//   console.log("All products deleted");
// }

// deleteAllProducts();
