import { ShiprocketOrderInput } from "@/types/Order";

export const notifyTelegram = async (orderItem: ShiprocketOrderInput) => {
  const { OrderId, TotalAmount, Items, ShippingAddress, ShippingCharge } =
    orderItem;
  const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN!;
  const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID!;
  const address = ShippingAddress ? JSON.parse(ShippingAddress) : {};

  // Calculate total savings
  const totalSavings = Items.reduce((total, item) => {
    return total + item.DiscountPerItem * item.Quantity;
  }, 0);

  const itemList = Items.map((item, i) => {
    const discountPerItem = item.DiscountPerItem || 0;
    const discountedPrice = item.Price - discountPerItem;
    const totalPrice = discountedPrice * item.Quantity;

    return `*${i + 1}. ${item.Name}*\nQty: ${item.Quantity} | ₹${totalPrice}`;
  }).join("\n\n");

  const savingsText =
    totalSavings > 0 ? `\n🎉 *Total Savings:* ₹${totalSavings.toFixed(2)}` : "";
  const deliveryText =
    ShippingCharge > 0
      ? `\n🚚 *Delivery Charge:* ₹${ShippingCharge.toFixed(2)}`
      : "";

  const message = `🚨Hurray! *New Order Received!*\n\n🆔 *Order ID:* ${OrderId}\n👤 *Customer:* ${address?.fullName}\n📍 *Location:* ${address?.city}, ${address?.state} -
              ${address?.pincode}\n\n🛍️ *Items:*\n${itemList}${savingsText}${deliveryText}\n\n💰 *Total:* ₹${TotalAmount}`;

  await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: TELEGRAM_CHAT_ID,
      text: message,
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "🔎 View Full Order",
              url: `https://admin.driprats.com/admin/orders/${OrderId}`,
            },
          ],
        ],
      },
    }),
  });
};
