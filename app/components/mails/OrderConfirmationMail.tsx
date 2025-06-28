// components/emails/OrderConfirmationEmail.tsx
import cloudinaryLoader from "@/lib/cloudinaryUtils";
import { OrderConfirmation } from "@/types/Mail";
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Preview,
  Section,
  Text,
} from "@react-email/components";

export const OrderConfirmationEmail = (OrderDetails: OrderConfirmation) => {
  const {
    OrderId,
    Items,
    TotalAmount,
    ShippingAddress: address,
    FirstItemImage,
  } = OrderDetails;
  const ShippingAddress = JSON.parse(address);
  const supportMail = process.env.NEXT_PUBLIC_CONTACT_EMAIL;

  const totalSavings = Items.reduce((total, item) => {
    return total + item.DiscountPerItem * item.Quantity;
  }, 0);
  console.log({ totalSavings });
  return (
    <Html>
      <Preview>
        Your Driprats order is confirmed. We’ll notify you when it ships!
      </Preview>
      <Head />

      <Body>
        <Container
          style={{
            padding: "24px",
            fontFamily: "Arial, sans-serif",
            backgroundColor: "#ffffff",
            color: "#000000",
          }}
        >
          <Img
            src="https://res.cloudinary.com/driprats/image/upload/v1748247550/logo.png"
            alt="Drip Rats"
            width={120}
            height={120}
            className="w-120 h-120"
            style={{ marginBottom: "24px" }}
          />
          <Heading as="h2" style={{ fontSize: "24px", marginBottom: "16px" }}>
            🎉 Thanks for your order, {ShippingAddress.fullName}!
          </Heading>
          <Text>
            Your Driprats order has been confirmed. We’ll notify you when it
            ships.
          </Text>
          {FirstItemImage && (
            <Img
              src={cloudinaryLoader({ src: FirstItemImage, width: 64 })}
              alt="Order Item"
              width={64}
              height={64}
              className="w-64 h-64"
              style={{ borderRadius: "8px", margin: "24px 0" }}
            />
          )}
          <Section style={{ marginBottom: "16px" }}>
            <Heading as="h3" style={{ fontSize: "18px", marginBottom: "8px" }}>
              Order Summary
            </Heading>
            <ul style={{ paddingLeft: "20px" }}>
              {Items.map((item, index) => (
                <li key={index} style={{ marginBottom: "6px" }}>
                  {item.Name} × {item.Quantity} — ₹
                  {(item.Price - item.DiscountPerItem) * item.Quantity}
                </li>
              ))}
            </ul>

            <Text style={{ fontWeight: "bold", marginTop: "8px" }}>
              Total: ₹{TotalAmount}
            </Text>
            {/* Calculate and display total savings */}
            {totalSavings > 0 ? (
              <Text
                style={{
                  color: "#16a34a",
                  fontWeight: "bold",
                  marginTop: "8px",
                  fontSize: "14px",
                }}
              >
                🎉 You saved: ₹{totalSavings}
              </Text>
            ) : null}
          </Section>
          <Section style={{ marginBottom: "24px" }}>
            <Heading as="h3" style={{ fontSize: "18px", marginBottom: "8px" }}>
              Shipping Address
            </Heading>
            <Text>
              {ShippingAddress.fullName}
              <br />
              {ShippingAddress.houseNumber}, {ShippingAddress.street},{" "}
              {ShippingAddress.area}
              <br />
              {ShippingAddress.city}, {ShippingAddress.state} -{" "}
              {ShippingAddress.pincode}
              <br />
              Phone: {ShippingAddress.phone}
            </Text>
          </Section>
          <a
            href={`https://driprats.com/order-status/${OrderId}`}
            style={{
              display: "inline-block",
              backgroundColor: "#000000",
              color: "#ffffff",
              padding: "12px 24px",
              textDecoration: "none",
              borderRadius: "6px",
              fontWeight: "bold",
              border: "1px solid #ffffff",
              textAlign: "center",
              maxWidth: "200px",
            }}
          >
            View Your Order
          </a>
          <Text style={{ fontSize: "12px", color: "#666", marginTop: "32px" }}>
            Need help? Reach out at{" "}
            <a href={`mailto:${supportMail}`}>{supportMail}</a>.
          </Text>
          <Text style={{ fontSize: "10px", color: "#999", marginTop: "16px" }}>
            Order Ref: <strong>{OrderId}</strong>
          </Text>
          <br />
          Thanks for shopping with Driprats 💎
        </Container>
      </Body>
    </Html>
  );
};

export default OrderConfirmationEmail;
