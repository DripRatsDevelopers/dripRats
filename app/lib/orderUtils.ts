import { ShippingInfo, ShiprocketOrderInput } from "@/types/Order";
import { UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { toast } from "sonner";
import { apiFetch } from "./apiClient";
import { db } from "./dynamoClient";

export async function reserveItems(
  products: { ProductId: string; Quantity: number }[]
) {
  const response = await apiFetch("/api/reserve-stock-items", {
    method: "POST",
    body: { items: products },
  });

  const { body } = response;
  const success = body?.success;
  if (!success && body?.data?.unavailable?.length) {
    toast.error("Stock unavailable", {
      description:
        "Some items in your cart are out of stock. Please update and try again",
    });
  }
  return body?.data?.reservedItems;
}

export async function getShiprocketToken() {
  try {
    const res = await fetch(
      "https://apiv2.shiprocket.in/v1/external/auth/login",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: process.env.SHIPROCKET_EMAIL,
          password: process.env.SHIPROCKET_PASSWORD,
        }),
      }
    );

    const data = await res.json();

    if (!data.token) throw new Error("Failed to authenticate with Shiprocket");
    return data.token as string;
  } catch (error) {
    console.error("Failed to authenticate with Shiprocket", error);
  }
}

export async function createShiprocketOrder(order: ShiprocketOrderInput) {
  try {
    const token = await getShiprocketToken();
    const address = JSON.parse(order.ShippingAddress) as ShippingInfo;

    const payload = {
      order_id: order.OrderId,
      order_date: order.CreatedAt,
      billing_customer_name: address.fullName,
      billing_last_name: "",
      billing_address: address.street,
      billing_address_2: address.houseNumber,
      billing_city: address.city,
      billing_pincode: address.pincode,
      billing_state: address.state,
      billing_country: "India",
      length: 5,
      breadth: 5,
      height: 5,
      weight: 0.5,
      billing_email: order.Email,
      billing_phone: address.phone,
      shipping_is_billing: true,
      order_items: order.Items.map((item) => ({
        name: item.Name,
        sku: item.ProductId,
        units: item.Quantity,
        selling_price: item.Price,
      })),
      payment_method: "Prepaid",
      sub_total: order.TotalAmount,
      pickup_location: "Home",
    };

    const res = await fetch(
      "https://apiv2.shiprocket.in/v1/external/orders/create/adhoc",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    const data = await res.json();

    if (!res.ok || !data.shipment_id) {
      throw new Error("Shiprocket order creation failed");
    }

    await updateShiprocketData(order.OrderId, {
      order_id: data.order_id,
      shipment_id: data.shipment_id,
      awb_code: data.awb_code,
      courier_name: data.courier_company_id,
    });

    return data;
  } catch (error) {
    console.error("Failed to create order with Shiprocket", error);
  }
}

export async function updateShiprocketData(
  orderId: string,
  data: {
    order_id: string;
    shipment_id: string;
    awb_code?: string;
    courier_name?: string;
  }
) {
  try {
    await db.send(
      new UpdateCommand({
        TableName: "Orders",
        Key: { OrderId: orderId },
        UpdateExpression:
          "SET ShiprocketOrderId = :oid, ShiprocketShipmentId = :sid, ShiprocketAwb = :awb, CourierName = :courier",
        ExpressionAttributeValues: {
          ":oid": data.order_id,
          ":sid": data.shipment_id,
          ":awb": data.awb_code ?? "N/A",
          ":courier": data.courier_name ?? "N/A",
        },
      })
    );
  } catch (error) {
    console.error("Error updating shipment details in Orders table", error);
  }
}
