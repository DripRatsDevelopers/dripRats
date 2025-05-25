import OrderConfirmationEmail from "@/components/mails/OrderConfirmationMail";
import { OrderConfirmation } from "@/types/Mail";
import { Resend } from "resend";

export const resend = new Resend(process.env.RESEND_API_KEY);

export const sendOrderConfirmationEmail = async (
  orderDetails: OrderConfirmation
) => {
  try {
    await resend.emails.send({
      from: "Driprats <orders@driprats.com>",
      to: [orderDetails.Email],
      subject: "Your Driprats Order is Confirmed!",
      react: <OrderConfirmationEmail {...orderDetails} />,
    });
  } catch (error) {
    console.error("❌ Failed to send confirmation email:", error);
  }
};
