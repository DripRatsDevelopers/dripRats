import { Resend } from "resend";

export const resend = new Resend(process.env.RESEND_API_KEY);

export const sendOrderConfirmationEmail = async ({
  Name,
  Email,
  OrderId,
  Total,
}: {
  Name: string;
  Email: string;
  OrderId: string;
  Total: string;
}) => {
  try {
    await resend.emails.send({
      from: "Driprats <orders@driprats.com>",
      to: [Email],
      subject: "🧾 Your Driprats Order is Confirmed!",
      html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #ffffff; padding: 32px; color: #000; max-width: 600px; margin: auto; border: 1px solid #eee; border-radius: 12px;">
            <h2 style="margin-bottom: 16px;">Hey ${Name},</h2>
            <p style="font-size: 16px;">Thanks for your purchase at <strong>Driprats</strong> 💎</p>
            
            <div style="margin-top: 24px; padding: 16px; background-color: #f8f8f8; border-radius: 8px;">
              <p style="margin: 0;"><strong>Order ID:</strong> ${OrderId}</p>
              <p style="margin: 0;"><strong>Total:</strong> ₹${Total}</p>
            </div>
  
            <p style="margin-top: 24px;">You’ll receive another email when your order is shipped.</p>
            
            <a href="https://driprats.com/order-status/${OrderId}" style="display: inline-block; margin-top: 16px; background-color: #000; color: #fff; padding: 12px 20px; border-radius: 8px; text-decoration: none; font-weight: 500;">
              View Order Status
            </a>
  
            <p style="margin-top: 32px;">Stay stylish, <br />— The Driprats Team</p>
          </div>
        `,
    });
  } catch (error) {
    console.error("❌ Failed to send confirmation email:", error);
  }
};
