const SibApiV3Sdk = require('sib-api-v3-sdk');
const logger = require('../utils/logger');

const defaultClient = SibApiV3Sdk.ApiClient.instance;
const apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = process.env.BREVO_API_KEY;

const transactionalEmailsApi = new SibApiV3Sdk.TransactionalEmailsApi();

const baseWrapper = (title, bodyHtml) => `
<!DOCTYPE html>
<html>
  <head><meta charset="utf-8" /><title>${title}</title></head>
  <body style="margin:0;padding:0;background-color:#F5F0E6;font-family:Arial, sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="padding:32px 0;">
      <tr>
        <td align="center">
          <table width="480" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 16px rgba(0,0,0,0.06);">
            <tr>
              <td style="background:#3F5B3E;padding:24px;text-align:center;">
                <h1 style="color:#F5F0E6;margin:0;font-size:22px;letter-spacing:1px;">WA-KRITI</h1>
                <p style="color:#D8CBA9;margin:4px 0 0;font-size:12px;">Premium Bamboo Living</p>
              </td>
            </tr>
            <tr>
              <td style="padding:32px;color:#33301F;font-size:15px;line-height:1.6;">
                ${bodyHtml}
              </td>
            </tr>
            <tr>
              <td style="background:#FAF7F0;padding:16px;text-align:center;font-size:12px;color:#8A8570;">
                &copy; ${new Date().getFullYear()} Wa-Kriti. All rights reserved.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`;

/**
 * Sends a transactional email through Brevo. Logs failures instead of
 * throwing so that auth flows don't hard-fail solely due to email issues,
 * but the caller can still decide to surface an error if delivery is critical.
 */
const sendEmail = async ({ to, subject, html }) => {
  try {
     console.log("========== BREVO DEBUG ==========");
    console.log("API KEY:", process.env.BREVO_API_KEY);
    console.log("API KEY LENGTH:", process.env.BREVO_API_KEY?.length);
    console.log("SENDER EMAIL:", process.env.BREVO_SENDER_EMAIL);
    console.log("SENDER NAME:", process.env.BREVO_SENDER_NAME);
    console.log("TO:", to);
    console.log("SUBJECT:", subject);
    console.log("=================================");
    const response = await transactionalEmailsApi.sendTransacEmail({
      sender: {
        email: process.env.BREVO_SENDER_EMAIL,
        name: process.env.BREVO_SENDER_NAME || 'Wa-Kriti',
      },
      to: [{ email: to }],
      subject,
      htmlContent: html,
    });
       console.log("BREVO RESPONSE:", response);
    logger.info(`Email sent to ${to} | Subject: ${subject}`);
    return true;
  } catch (error) {
     console.log("=========== BREVO ERROR ===========");
    console.log("MESSAGE:", error.message);
    console.log("STATUS:", error.status);
    console.log("CODE:", error.code);
    console.log("BODY:", error.response?.body);
    console.log("RESPONSE:", error.response);
    console.log("FULL ERROR:", error);
    console.log("===================================");
    logger.error(`Failed to send email to ${to}: ${error.message}`);
    return false;
  }
};

const sendOtpEmail = async (to, otp, purpose) => {
  const purposeText =
    purpose === 'password_reset'
      ? 'reset your password'
      : purpose === 'email_change'
      ? 'verify your new email address'
      : 'verify your account';

  const html = baseWrapper(
    'Your OTP Code',
    `
    <p>Hello,</p>
    <p>Use the OTP below to ${purposeText}. This code expires in ${process.env.OTP_EXPIRY_MINUTES || 10} minutes.</p>
    <div style="text-align:center;margin:24px 0;">
      <span style="display:inline-block;background:#EDE6D6;color:#3F5B3E;font-size:28px;letter-spacing:8px;font-weight:bold;padding:16px 24px;border-radius:8px;">${otp}</span>
    </div>
    <p>If you did not request this, you can safely ignore this email.</p>
    `
  );
  return sendEmail({ to, subject: 'Wa-Kriti OTP Verification', html });
};

const sendWelcomeEmail = async (to, firstName) => {
  const html = baseWrapper(
    'Welcome to Wa-Kriti',
    `
    <p>Hi ${firstName},</p>
    <p>Welcome to Wa-Kriti — premium, handcrafted bamboo products made with care by skilled artisans across India.</p>
    <p>Your account has been created successfully. Start exploring sustainable living today.</p>
    `
  );
  return sendEmail({ to, subject: 'Welcome to Wa-Kriti 🌱', html });
};

const sendPasswordChangedEmail = async (to, firstName) => {
  const html = baseWrapper(
    'Password Changed',
    `
    <p>Hi ${firstName},</p>
    <p>Your Wa-Kriti account password was just changed. If this wasn't you, please contact our support team immediately.</p>
    `
  );
  return sendEmail({ to, subject: 'Your Wa-Kriti password was changed', html });
};

const ORDER_STATUS_COPY = {
  placed: { subject: 'Order Placed', message: 'We have received your order and it is being processed.' },
  confirmed: { subject: 'Order Confirmed', message: 'Your order has been confirmed and will be packed shortly.' },
  packed: { subject: 'Order Packed', message: 'Your order has been packed and is ready for dispatch.' },
  shipped: { subject: 'Order Shipped', message: 'Your order is on its way!' },
  out_for_delivery: { subject: 'Out For Delivery', message: 'Your order is out for delivery and will arrive soon.' },
  delivered: { subject: 'Order Delivered', message: 'Your order has been delivered. We hope you love it!' },
  cancelled: { subject: 'Order Cancelled', message: 'Your order has been cancelled as requested.' },
  returned: { subject: 'Return Received', message: 'We have received your returned item.' },
  refunded: { subject: 'Refund Processed', message: 'Your refund has been processed successfully.' },
};

const sendOrderStatusEmail = async (to, { firstName, orderNumber, status, trackingNumber }) => {
  const copy = ORDER_STATUS_COPY[status] || { subject: 'Order Update', message: 'Your order status has been updated.' };
  const html = baseWrapper(
    copy.subject,
    `
    <p>Hi ${firstName},</p>
    <p>${copy.message}</p>
    <div style="background:#F3F6EE;border-radius:8px;padding:16px;margin:20px 0;">
      <p style="margin:0;"><strong>Order Number:</strong> ${orderNumber}</p>
      ${trackingNumber ? `<p style="margin:6px 0 0;"><strong>Tracking Number:</strong> ${trackingNumber}</p>` : ''}
    </div>
    <p>You can track your order anytime from your Wa-Kriti dashboard.</p>
    `
  );
  return sendEmail({ to, subject: `Wa-Kriti — ${copy.subject} (${orderNumber})`, html });
};

const sendLowStockAlertEmail = async (to, { productName, sku, availableStock }) => {
  const html = baseWrapper(
    'Low Stock Alert',
    `
    <p>Hi Admin,</p>
    <p>The following product is running low on stock:</p>
    <div style="background:#FFF4E5;border-radius:8px;padding:16px;margin:16px 0;">
      <p style="margin:0;"><strong>${productName}</strong> (SKU: ${sku})</p>
      <p style="margin:6px 0 0;">Available Stock: ${availableStock}</p>
    </div>
    `
  );
  return sendEmail({ to, subject: `Low Stock Alert — ${productName}`, html });
};

module.exports = {
  sendEmail,
  sendOtpEmail,
  sendWelcomeEmail,
  sendPasswordChangedEmail,
  sendOrderStatusEmail,
  sendLowStockAlertEmail,
};
