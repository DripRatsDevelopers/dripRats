import { cartKey, wishlistKey } from "@/constants/UserConstants";
import { UpdateItemCommand } from "@aws-sdk/client-dynamodb";
import { db } from "./dynamoClient";

export async function updateWishlistInDynamo(
  userId: string,
  wishlist: string[]
) {
  await db.send(
    new UpdateItemCommand({
      TableName: "Users",
      Key: { UserId: { S: userId } },
      UpdateExpression: "SET Wishlist = :w",
      ExpressionAttributeValues: {
        ":w": {
          L: wishlist.map((id) => ({ S: id })),
        },
      },
    })
  );
}

export async function updateCartInDynamo(
  userId: string,
  cart: { ProductId: string; quantity: number }[]
) {
  await db.send(
    new UpdateItemCommand({
      TableName: "Users",
      Key: { UserId: { S: userId } },
      UpdateExpression: "SET Cart = :c",
      ExpressionAttributeValues: {
        ":c": {
          L: cart.map((item) => ({
            M: {
              ProductId: { S: item.ProductId },
              quantity: { N: item.quantity.toString() },
            },
          })),
        },
      },
    })
  );
}

export const getLocalCart = () => {
  return JSON.parse(localStorage.getItem(cartKey) || "[]");
};

export const getLocalWishlist = () => {
  return JSON.parse(localStorage.getItem(wishlistKey) || "[]");
};

export const clearLocalCart = () => {
  localStorage.removeItem(cartKey);
};

export const clearLocalWishlist = () => {
  localStorage.removeItem(wishlistKey);
};
