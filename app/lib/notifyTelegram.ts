import { ShiprocketOrderInput } from "@/types/Order";

export const notifyTelegram = async (orderItem: ShiprocketOrderInput) => {
  const { OrderId, TotalAmount, Items, ShippingAddress } = orderItem;
  const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN!;
  const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID!;
  const address = ShippingAddress ? JSON.parse(ShippingAddress) : {};

  const itemList = Items.map(
    (item, i) =>
      `*${i + 1}. ${item.Name}*\nQty: ${item.Quantity} | ₹${item.Price * item.Quantity}`
  ).join("\n\n");

  const message = `🚨Hurray! *New Order Received!*\n\n🆔 *Order ID:* ${OrderId}\n👤 *Customer:* ${address?.fullName}\n\n🛍️ *Items:*\n${itemList}\n\n💰 *Total:* ₹${TotalAmount}`;

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
