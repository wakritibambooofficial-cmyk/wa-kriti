// const SibApiV3Sdk = require('sib-api-v3-sdk');
// const logger = require('../utils/logger');

// const defaultClient = SibApiV3Sdk.ApiClient.instance;
// const apiKey = defaultClient.authentications['api-key'];
// apiKey.apiKey = process.env.BREVO_API_KEY;

// const transactionalEmailsApi = new SibApiV3Sdk.TransactionalEmailsApi();

// const baseWrapper = (title, bodyHtml) => `
// <!DOCTYPE html>
// <html>
//   <head><meta charset="utf-8" /><title>${title}</title></head>
//   <body style="margin:0;padding:0;background-color:#F5F0E6;font-family:Arial, sans-serif;">
//     <table width="100%" cellpadding="0" cellspacing="0" style="padding:32px 0;">
//       <tr>
//         <td align="center">
//           <table width="480" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 16px rgba(0,0,0,0.06);">
//             <tr>
//               <td style="background:#3F5B3E;padding:24px;text-align:center;">
//                 <h1 style="color:#F5F0E6;margin:0;font-size:22px;letter-spacing:1px;">WA-KRITI</h1>
//                 <p style="color:#D8CBA9;margin:4px 0 0;font-size:12px;">Premium Bamboo Living</p>
//               </td>
//             </tr>
//             <tr>
//               <td style="padding:32px;color:#33301F;font-size:15px;line-height:1.6;">
//                 ${bodyHtml}
//               </td>
//             </tr>
//             <tr>
//               <td style="background:#FAF7F0;padding:16px;text-align:center;font-size:12px;color:#8A8570;">
//                 &copy; ${new Date().getFullYear()} Wa-Kriti. All rights reserved.
//               </td>
//             </tr>
//           </table>
//         </td>
//       </tr>
//     </table>
//   </body>
// </html>
// `;

// /**
//  * Sends a transactional email through Brevo. Logs failures instead of
//  * throwing so that auth flows don't hard-fail solely due to email issues,
//  * but the caller can still decide to surface an error if delivery is critical.
//  */
// const sendEmail = async ({ to, subject, html }) => {
//   try {
//      console.log("========== BREVO DEBUG ==========");
//     console.log("API KEY:", process.env.BREVO_API_KEY);
//     console.log("API KEY LENGTH:", process.env.BREVO_API_KEY?.length);
//     console.log("SENDER EMAIL:", process.env.BREVO_SENDER_EMAIL);
//     console.log("SENDER NAME:", process.env.BREVO_SENDER_NAME);
//     console.log("TO:", to);
//     console.log("SUBJECT:", subject);
//     console.log("=================================");
//     const response = await transactionalEmailsApi.sendTransacEmail({
//       sender: {
//         email: process.env.BREVO_SENDER_EMAIL,
//         name: process.env.BREVO_SENDER_NAME || 'Wa-Kriti',
//       },
//       to: [{ email: to }],
//       subject,
//       htmlContent: html,
//     });
//        console.log("BREVO RESPONSE:", response);
//     logger.info(`Email sent to ${to} | Subject: ${subject}`);
//     return true;
//   } catch (error) {
//      console.log("=========== BREVO ERROR ===========");
//     console.log("MESSAGE:", error.message);
//     console.log("STATUS:", error.status);
//     console.log("CODE:", error.code);
//     console.log("BODY:", error.response?.body);
//     console.log("RESPONSE:", error.response);
//     console.log("FULL ERROR:", error);
//     console.log("===================================");
//     logger.error(`Failed to send email to ${to}: ${error.message}`);
//     return false;
//   }
// };

// const sendOtpEmail = async (to, otp, purpose) => {
//   const purposeText =
//     purpose === 'password_reset'
//       ? 'reset your password'
//       : purpose === 'email_change'
//       ? 'verify your new email address'
//       : 'verify your account';

//   const html = baseWrapper(
//     'Your OTP Code',
//     `
//     <p>Hello,</p>
//     <p>Use the OTP below to ${purposeText}. This code expires in ${process.env.OTP_EXPIRY_MINUTES || 10} minutes.</p>
//     <div style="text-align:center;margin:24px 0;">
//       <span style="display:inline-block;background:#EDE6D6;color:#3F5B3E;font-size:28px;letter-spacing:8px;font-weight:bold;padding:16px 24px;border-radius:8px;">${otp}</span>
//     </div>
//     <p>If you did not request this, you can safely ignore this email.</p>
//     `
//   );
//   return sendEmail({ to, subject: 'Wa-Kriti OTP Verification', html });
// };

// const sendWelcomeEmail = async (to, firstName) => {
//   const html = baseWrapper(
//     'Welcome to Wa-Kriti',
//     `
//     <p>Hi ${firstName},</p>
//     <p>Welcome to Wa-Kriti — premium, handcrafted bamboo products made with care by skilled artisans across India.</p>
//     <p>Your account has been created successfully. Start exploring sustainable living today.</p>
//     `
//   );
//   return sendEmail({ to, subject: 'Welcome to Wa-Kriti 🌱', html });
// };

// const sendPasswordChangedEmail = async (to, firstName) => {
//   const html = baseWrapper(
//     'Password Changed',
//     `
//     <p>Hi ${firstName},</p>
//     <p>Your Wa-Kriti account password was just changed. If this wasn't you, please contact our support team immediately.</p>
//     `
//   );
//   return sendEmail({ to, subject: 'Your Wa-Kriti password was changed', html });
// };

// const ORDER_STATUS_COPY = {
//   placed: { subject: 'Order Placed', message: 'We have received your order and it is being processed.' },
//   confirmed: { subject: 'Order Confirmed', message: 'Your order has been confirmed and will be packed shortly.' },
//   packed: { subject: 'Order Packed', message: 'Your order has been packed and is ready for dispatch.' },
//   shipped: { subject: 'Order Shipped', message: 'Your order is on its way!' },
//   out_for_delivery: { subject: 'Out For Delivery', message: 'Your order is out for delivery and will arrive soon.' },
//   delivered: { subject: 'Order Delivered', message: 'Your order has been delivered. We hope you love it!' },
//   cancelled: { subject: 'Order Cancelled', message: 'Your order has been cancelled as requested.' },
//   returned: { subject: 'Return Received', message: 'We have received your returned item.' },
//   refunded: { subject: 'Refund Processed', message: 'Your refund has been processed successfully.' },
// };

// const sendOrderStatusEmail = async (to, { firstName, orderNumber, status, trackingNumber }) => {
//   const copy = ORDER_STATUS_COPY[status] || { subject: 'Order Update', message: 'Your order status has been updated.' };
//   const html = baseWrapper(
//     copy.subject,
//     `
//     <p>Hi ${firstName},</p>
//     <p>${copy.message}</p>
//     <div style="background:#F3F6EE;border-radius:8px;padding:16px;margin:20px 0;">
//       <p style="margin:0;"><strong>Order Number:</strong> ${orderNumber}</p>
//       ${trackingNumber ? `<p style="margin:6px 0 0;"><strong>Tracking Number:</strong> ${trackingNumber}</p>` : ''}
//     </div>
//     <p>You can track your order anytime from your Wa-Kriti dashboard.</p>
//     `
//   );
//   return sendEmail({ to, subject: `Wa-Kriti — ${copy.subject} (${orderNumber})`, html });
// };

// const sendLowStockAlertEmail = async (to, { productName, sku, availableStock }) => {
//   const html = baseWrapper(
//     'Low Stock Alert',
//     `
//     <p>Hi Admin,</p>
//     <p>The following product is running low on stock:</p>
//     <div style="background:#FFF4E5;border-radius:8px;padding:16px;margin:16px 0;">
//       <p style="margin:0;"><strong>${productName}</strong> (SKU: ${sku})</p>
//       <p style="margin:6px 0 0;">Available Stock: ${availableStock}</p>
//     </div>
//     `
//   );
//   return sendEmail({ to, subject: `Low Stock Alert — ${productName}`, html });
// };

// module.exports = {
//   sendEmail,
//   sendOtpEmail,
//   sendWelcomeEmail,
//   sendPasswordChangedEmail,
//   sendOrderStatusEmail,
//   sendLowStockAlertEmail,
// };



const SibApiV3Sdk = require('sib-api-v3-sdk');
const logger = require('../utils/logger');
const WebsiteSettings = require('../models/WebsiteSettings');

const defaultClient = SibApiV3Sdk.ApiClient.instance;
const apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = process.env.BREVO_API_KEY;

const transactionalEmailsApi = new SibApiV3Sdk.TransactionalEmailsApi();

/* ------------------------------------------------------------------ */
/* Brand + settings                                                    */
/* ------------------------------------------------------------------ */
const SITE_URL = (process.env.CLIENT_URL || 'https://wa-kriti.vercel.app').replace(/\/$/, '');
// Must be a public https URL. The file lives in frontend/public.
const LOGO_URL = `${SITE_URL}/logo.png`;

// Used only if the admin has not filled these in under Admin > Settings.
const FALLBACK = {
  whatsapp: '9366431377',
  email: 'wakriti.bambooofficial@gmail.com',
  address: '',
};

const SOCIAL_PLATFORMS = [
  { key: 'instagram', label: 'Instagram' },
  { key: 'facebook', label: 'Facebook' },
  { key: 'youtube', label: 'YouTube' },
  // { key: 'twitter', label: 'X / Twitter' },
  // { key: 'linkedin', label: 'LinkedIn' },
  // { key: 'pinterest', label: 'Pinterest' },
];

const esc = (value = '') =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

// Settings rarely change, so cache them for 5 minutes instead of hitting
// the database for every email.
let settingsCache = { at: 0, data: null };
const SETTINGS_TTL_MS = 5 * 60 * 1000;

const getSiteSettings = async () => {
  if (settingsCache.data && Date.now() - settingsCache.at < SETTINGS_TTL_MS) {
    return settingsCache.data;
  }
  try {
    const doc = await WebsiteSettings.findOne().lean();
    settingsCache = { at: Date.now(), data: doc || {} };
    return settingsCache.data;
  } catch (err) {
    logger.error(`Could not load website settings for email: ${err.message}`);
    return settingsCache.data || {};
  }
};

// Supports: settings.socialLinks = { instagram: '...' }
//           settings.socialLinks = [{ platform: 'instagram', url: '...' }]
//           settings.instagram / settings.instagramUrl / settings.instagramLink
const extractSocialLinks = (s = {}) => {
  const links = [];
  SOCIAL_PLATFORMS.forEach(({ key, label }) => {
    let url = '';
    const nested = s.socialLinks || s.socials || s.social;

    if (Array.isArray(nested)) {
      const hit = nested.find((n) => String(n.platform || n.name || '').toLowerCase().includes(key));
      url = hit?.url || hit?.link || '';
    } else if (nested && typeof nested === 'object') {
      url = nested[key] || nested[`${key}Url`] || (key === 'twitter' ? nested.x : '') || '';
    }

    if (!url) {
      url = s[key] || s[`${key}Url`] || s[`${key}Link`] || (key === 'twitter' ? s.x || s.xUrl : '') || '';
    }

    if (typeof url === 'string' && /^https?:\/\//i.test(url.trim())) {
      links.push({ label, url: url.trim() });
    }
  });
  return links;
};

const digitsForWhatsapp = (phone = '') => {
  const d = String(phone).replace(/\D/g, '');
  return d.length === 10 ? `91${d}` : d;
};

/* ------------------------------------------------------------------ */
/* Layout                                                              */
/* ------------------------------------------------------------------ */
const button = (label, href) => `
  <table role="presentation" cellpadding="0" cellspacing="0" style="margin:24px auto 8px;">
    <tr>
      <td style="background:#3F5B3E;border-radius:999px;">
        <a href="${href}" style="display:inline-block;padding:13px 30px;color:#F5F0E6;font-size:14px;font-weight:bold;letter-spacing:0.4px;text-decoration:none;">${label}</a>
      </td>
    </tr>
  </table>`;

const infoBox = (rowsHtml) => `
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:20px 0;background:#F3F6EE;border-left:4px solid #3F5B3E;border-radius:8px;">
    <tr><td style="padding:16px 18px;font-size:14px;color:#33301F;line-height:1.7;">${rowsHtml}</td></tr>
  </table>`;

const baseWrapper = async (title, bodyHtml, { preheader = '' } = {}) => {
  const s = await getSiteSettings();

  const phone = s.whatsappNumber || s.contactPhone || FALLBACK.whatsapp;
  const supportEmail = s.contactEmail || FALLBACK.email;
  const address = s.address || FALLBACK.address;
  const waLink = `https://wa.me/${digitsForWhatsapp(phone)}?text=${encodeURIComponent('Hi, I need help with an order.')}`;
  const socials = extractSocialLinks(s);
  const siteName = s.websiteName || 'Wa-Kriti';

  const socialRow = socials.length
    ? `
      <tr>
        <td align="center" style="padding:6px 24px 18px;">
          <p style="margin:0 0 10px;font-size:12px;letter-spacing:1.5px;text-transform:uppercase;color:#8A8570;">Follow us</p>
          ${socials
            .map(
              (l) =>
                `<a href="${esc(l.url)}" style="display:inline-block;margin:3px 4px;padding:7px 14px;border:1px solid #3F5B3E;border-radius:999px;color:#3F5B3E;font-size:12px;font-weight:bold;text-decoration:none;">${l.label}</a>`
            )
            .join('')}
        </td>
      </tr>`
    : '';

  return `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${esc(title)}</title>
  </head>
  <body style="margin:0;padding:0;background-color:#EFE9DA;font-family:Arial, Helvetica, sans-serif;">
    <span style="display:none;max-height:0;overflow:hidden;opacity:0;">${esc(preheader)}</span>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#EFE9DA;padding:28px 12px;">
      <tr>
        <td align="center">
          <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:100%;max-width:600px;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 6px 24px rgba(63,91,62,0.12);">

            <!-- Header -->
            <tr>
              <td align="center" style="background:#3F5B3E;padding:30px 24px 24px;">
                <img src="${LOGO_URL}" alt="Wa-Kriti" width="84" height="84" style="display:block;margin:0 auto 12px;background:#ffffff;border-radius:50%;padding:5px;" />
                <h1 style="margin:0;color:#F5F0E6;font-size:24px;letter-spacing:3px;font-weight:bold;text-transform:uppercase;">${esc(siteName)}</h1>
                <p style="margin:6px 0 0;color:#D8CBA9;font-size:12px;letter-spacing:1px;">Culture &middot; Commerce &middot; Craft</p>
              </td>
            </tr>
            <tr><td style="height:5px;background:#C9B27C;font-size:0;line-height:0;">&nbsp;</td></tr>

            <!-- Title -->
            <tr>
              <td style="padding:30px 36px 0;">
                <h2 style="margin:0;color:#2E4A2D;font-size:21px;line-height:1.3;">${esc(title)}</h2>
              </td>
            </tr>

            <!-- Body -->
            <tr>
              <td style="padding:14px 36px 28px;color:#33301F;font-size:15px;line-height:1.7;">
                ${bodyHtml}
              </td>
            </tr>

            <!-- Help -->
            <tr>
              <td style="padding:0 36px 24px;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#FAF7F0;border:1px solid #EDE6D6;border-radius:12px;">
                  <tr>
                    <td style="padding:16px 20px;font-size:13px;color:#33301F;line-height:1.8;">
                      <strong style="font-size:14px;color:#2E4A2D;">Need help?</strong><br />
                      WhatsApp us at <a href="${waLink}" style="color:#3F5B3E;font-weight:bold;text-decoration:none;">${esc(phone)}</a><br />
                      Write to us at <a href="mailto:${esc(supportEmail)}" style="color:#3F5B3E;font-weight:bold;text-decoration:none;">${esc(supportEmail)}</a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            ${socialRow}

            <!-- Footer -->
            <tr>
              <td align="center" style="background:#FAF7F0;padding:18px 24px;font-size:12px;color:#8A8570;line-height:1.7;border-top:1px solid #EDE6D6;">
                ${address ? `${esc(address)}<br />` : ''}
                Handcrafted bamboo products, made with care by skilled artisans.<br />
                &copy; ${new Date().getFullYear()} ${esc(siteName)}. All rights reserved.
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
};

/* ------------------------------------------------------------------ */
/* Sending                                                             */
/* ------------------------------------------------------------------ */
/**
 * Sends a transactional email through Brevo. Logs failures instead of
 * throwing so that auth flows don't hard-fail solely due to email issues.
 * The API key is never logged.
 */
const sendEmail = async ({ to, subject, html }) => {
  try {
    await transactionalEmailsApi.sendTransacEmail({
      sender: {
        email: process.env.BREVO_SENDER_EMAIL,
        name: process.env.BREVO_SENDER_NAME || 'Wa-Kriti',
      },
      to: [{ email: to }],
      subject,
      htmlContent: html,
    });
    logger.info(`Email sent to ${to} | Subject: ${subject}`);
    return true;
  } catch (error) {
    logger.error(
      `Failed to send email to ${to}: ${error.message} | status=${error.status || ''} | body=${JSON.stringify(
        error.response?.body || {}
      )}`
    );
    return false;
  }
};

/* ------------------------------------------------------------------ */
/* Templates                                                           */
/* ------------------------------------------------------------------ */
const sendOtpEmail = async (to, otp, purpose) => {
  const purposeText =
    purpose === 'password_reset'
      ? 'reset your password'
      : purpose === 'email_change'
      ? 'verify your new email address'
      : 'verify your account';

  const html = await baseWrapper(
    'Your verification code',
    `
    <p style="margin:0 0 12px;">Hello,</p>
    <p style="margin:0;">Use the code below to ${purposeText}. It expires in <strong>${process.env.OTP_EXPIRY_MINUTES || 10} minutes</strong>.</p>
    <div style="text-align:center;margin:26px 0;">
      <span style="display:inline-block;background:#F3F6EE;border:2px dashed #3F5B3E;color:#3F5B3E;font-size:32px;letter-spacing:10px;font-weight:bold;padding:16px 26px 16px 36px;border-radius:12px;">${esc(otp)}</span>
    </div>
    <p style="margin:0;font-size:13px;color:#8A8570;">Never share this code with anyone. If you did not request it, you can safely ignore this email.</p>
    `,
    { preheader: `Your Wa-Kriti code is ${otp}` }
  );
  return sendEmail({ to, subject: 'Wa-Kriti OTP Verification', html });
};

const sendWelcomeEmail = async (to, firstName) => {
  const html = await baseWrapper(
    `Welcome to Wa-Kriti, ${firstName}!`,
    `
    <p style="margin:0 0 12px;">Hi ${esc(firstName)},</p>
    <p style="margin:0 0 12px;">Thank you for joining us. Wa-Kriti brings you premium, handcrafted bamboo products made with care by skilled artisans across India.</p>
    <p style="margin:0;">Your account is ready. Start exploring sustainable living today, and enjoy your welcome reward points.</p>
    ${button('Start Shopping', `${SITE_URL}/shop`)}
    `,
    { preheader: 'Your Wa-Kriti account is ready.' }
  );
  return sendEmail({ to, subject: 'Welcome to Wa-Kriti 🌱', html });
};

const sendPasswordChangedEmail = async (to, firstName) => {
  const html = await baseWrapper(
    'Your password was changed',
    `
    <p style="margin:0 0 12px;">Hi ${esc(firstName)},</p>
    <p style="margin:0 0 12px;">The password on your Wa-Kriti account was just changed.</p>
    ${infoBox('<strong>Wasn\'t you?</strong><br />Please contact our support team immediately using the details below so we can secure your account.')}
    `,
    { preheader: 'Your Wa-Kriti password was changed.' }
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
  const html = await baseWrapper(
    copy.subject,
    `
    <p style="margin:0 0 12px;">Hi ${esc(firstName)},</p>
    <p style="margin:0;">${copy.message}</p>
    ${infoBox(`
      <strong>Order Number:</strong> ${esc(orderNumber)}<br />
      <strong>Status:</strong> ${copy.subject}
      ${trackingNumber ? `<br /><strong>Tracking Number:</strong> ${esc(trackingNumber)}` : ''}
    `)}
    <p style="margin:0;">You can track your order anytime from your Wa-Kriti dashboard.</p>
    ${button('View My Order', `${SITE_URL}/dashboard`)}
    `,
    { preheader: `${copy.subject} — order ${orderNumber}` }
  );
  return sendEmail({ to, subject: `Wa-Kriti — ${copy.subject} (${orderNumber})`, html });
};

const sendLowStockAlertEmail = async (to, { productName, sku, availableStock }) => {
  const html = await baseWrapper(
    'Low stock alert',
    `
    <p style="margin:0 0 12px;">Hi Admin,</p>
    <p style="margin:0;">The following product is running low on stock:</p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:20px 0;background:#FFF4E5;border-left:4px solid #E08A00;border-radius:8px;">
      <tr><td style="padding:16px 18px;font-size:14px;color:#33301F;line-height:1.7;">
        <strong>${esc(productName)}</strong><br />
        SKU: ${esc(sku)}<br />
        Available stock: <strong style="color:#B45F00;">${esc(availableStock)}</strong>
      </td></tr>
    </table>
    ${button('Open Admin Panel', `${SITE_URL}/admin/products`)}
    `,
    { preheader: `${productName} is running low on stock.` }
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