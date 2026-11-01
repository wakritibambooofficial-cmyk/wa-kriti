


// const SibApiV3Sdk = require('sib-api-v3-sdk');
// const logger = require('../utils/logger');
// const WebsiteSettings = require('../models/WebsiteSettings');

// const defaultClient = SibApiV3Sdk.ApiClient.instance;
// const apiKey = defaultClient.authentications['api-key'];
// apiKey.apiKey = process.env.BREVO_API_KEY;

// const transactionalEmailsApi = new SibApiV3Sdk.TransactionalEmailsApi();

// /* ------------------------------------------------------------------ */
// /* Brand + settings                                                    */
// /* ------------------------------------------------------------------ */
// const SITE_URL = (process.env.CLIENT_URL || 'https://wa-kriti.vercel.app').replace(/\/$/, '');
// // Must be a public https URL. The file lives in frontend/public.
// const LOGO_URL = `${SITE_URL}/logo.png`;

// // Used only if the admin has not filled these in under Admin > Settings.
// const FALLBACK = {
//   whatsapp: '9366431377',
//   email: 'wakriti.bambooofficial@gmail.com',
//   address: '',
// };

// const SOCIAL_PLATFORMS = [
//   { key: 'instagram', label: 'Instagram' },
//   { key: 'facebook', label: 'Facebook' },
//   { key: 'youtube', label: 'YouTube' },
//   // { key: 'twitter', label: 'X / Twitter' },
//   // { key: 'linkedin', label: 'LinkedIn' },
//   // { key: 'pinterest', label: 'Pinterest' },
// ];

// const esc = (value = '') =>
//   String(value)
//     .replace(/&/g, '&amp;')
//     .replace(/</g, '&lt;')
//     .replace(/>/g, '&gt;')
//     .replace(/"/g, '&quot;');

// // Settings rarely change, so cache them for 5 minutes instead of hitting
// // the database for every email.
// let settingsCache = { at: 0, data: null };
// const SETTINGS_TTL_MS = 5 * 60 * 1000;

// const getSiteSettings = async () => {
//   if (settingsCache.data && Date.now() - settingsCache.at < SETTINGS_TTL_MS) {
//     return settingsCache.data;
//   }
//   try {
//     const doc = await WebsiteSettings.findOne().lean();
//     settingsCache = { at: Date.now(), data: doc || {} };
//     return settingsCache.data;
//   } catch (err) {
//     logger.error(`Could not load website settings for email: ${err.message}`);
//     return settingsCache.data || {};
//   }
// };

// // Supports: settings.socialLinks = { instagram: '...' }
// //           settings.socialLinks = [{ platform: 'instagram', url: '...' }]
// //           settings.instagram / settings.instagramUrl / settings.instagramLink
// const extractSocialLinks = (s = {}) => {
//   const links = [];
//   SOCIAL_PLATFORMS.forEach(({ key, label }) => {
//     let url = '';
//     const nested = s.socialLinks || s.socials || s.social;

//     if (Array.isArray(nested)) {
//       const hit = nested.find((n) => String(n.platform || n.name || '').toLowerCase().includes(key));
//       url = hit?.url || hit?.link || '';
//     } else if (nested && typeof nested === 'object') {
//       url = nested[key] || nested[`${key}Url`] || (key === 'twitter' ? nested.x : '') || '';
//     }

//     if (!url) {
//       url = s[key] || s[`${key}Url`] || s[`${key}Link`] || (key === 'twitter' ? s.x || s.xUrl : '') || '';
//     }

//     if (typeof url === 'string' && /^https?:\/\//i.test(url.trim())) {
//       links.push({ label, url: url.trim() });
//     }
//   });
//   return links;
// };

// const digitsForWhatsapp = (phone = '') => {
//   const d = String(phone).replace(/\D/g, '');
//   return d.length === 10 ? `91${d}` : d;
// };

// /* ------------------------------------------------------------------ */
// /* Layout                                                              */
// /* ------------------------------------------------------------------ */
// const button = (label, href) => `
//   <table role="presentation" cellpadding="0" cellspacing="0" style="margin:24px auto 8px;">
//     <tr>
//       <td style="background:#3F5B3E;border-radius:999px;">
//         <a href="${href}" style="display:inline-block;padding:13px 30px;color:#F5F0E6;font-size:14px;font-weight:bold;letter-spacing:0.4px;text-decoration:none;">${label}</a>
//       </td>
//     </tr>
//   </table>`;

// const infoBox = (rowsHtml) => `
//   <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:20px 0;background:#F3F6EE;border-left:4px solid #3F5B3E;border-radius:8px;">
//     <tr><td style="padding:16px 18px;font-size:14px;color:#33301F;line-height:1.7;">${rowsHtml}</td></tr>
//   </table>`;

// const baseWrapper = async (title, bodyHtml, { preheader = '' } = {}) => {
//   const s = await getSiteSettings();

//   const phone = s.whatsappNumber || s.contactPhone || FALLBACK.whatsapp;
//   const supportEmail = s.contactEmail || FALLBACK.email;
//   const address = s.address || FALLBACK.address;
//   const waLink = `https://wa.me/${digitsForWhatsapp(phone)}?text=${encodeURIComponent('Hi, I need help with an order.')}`;
//   const socials = extractSocialLinks(s);
//   const siteName = s.websiteName || 'Wa-Kriti';

//   const socialRow = socials.length
//     ? `
//       <tr>
//         <td align="center" style="padding:6px 24px 18px;">
//           <p style="margin:0 0 10px;font-size:12px;letter-spacing:1.5px;text-transform:uppercase;color:#8A8570;">Follow us</p>
//           ${socials
//             .map(
//               (l) =>
//                 `<a href="${esc(l.url)}" style="display:inline-block;margin:3px 4px;padding:7px 14px;border:1px solid #3F5B3E;border-radius:999px;color:#3F5B3E;font-size:12px;font-weight:bold;text-decoration:none;">${l.label}</a>`
//             )
//             .join('')}
//         </td>
//       </tr>`
//     : '';

//   return `
// <!DOCTYPE html>
// <html lang="en">
//   <head>
//     <meta charset="utf-8" />
//     <meta name="viewport" content="width=device-width, initial-scale=1" />
//     <title>${esc(title)}</title>
//   </head>
//   <body style="margin:0;padding:0;background-color:#EFE9DA;font-family:Arial, Helvetica, sans-serif;">
//     <span style="display:none;max-height:0;overflow:hidden;opacity:0;">${esc(preheader)}</span>

//     <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#EFE9DA;padding:28px 12px;">
//       <tr>
//         <td align="center">
//           <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:100%;max-width:600px;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 6px 24px rgba(63,91,62,0.12);">

//             <!-- Header -->
//             <tr>
//               <td align="center" style="background:#3F5B3E;padding:30px 24px 24px;">
//                 <img src="${LOGO_URL}" alt="Wa-Kriti" width="84" height="84" style="display:block;margin:0 auto 12px;background:#ffffff;border-radius:50%;padding:5px;" />
//                 <h1 style="margin:0;color:#F5F0E6;font-size:24px;letter-spacing:3px;font-weight:bold;text-transform:uppercase;">${esc(siteName)}</h1>
//                 <p style="margin:6px 0 0;color:#D8CBA9;font-size:12px;letter-spacing:1px;">Culture &middot; Commerce &middot; Craft</p>
//               </td>
//             </tr>
//             <tr><td style="height:5px;background:#C9B27C;font-size:0;line-height:0;">&nbsp;</td></tr>

//             <!-- Title -->
//             <tr>
//               <td style="padding:30px 36px 0;">
//                 <h2 style="margin:0;color:#2E4A2D;font-size:21px;line-height:1.3;">${esc(title)}</h2>
//               </td>
//             </tr>

//             <!-- Body -->
//             <tr>
//               <td style="padding:14px 36px 28px;color:#33301F;font-size:15px;line-height:1.7;">
//                 ${bodyHtml}
//               </td>
//             </tr>

//             <!-- Help -->
//             <tr>
//               <td style="padding:0 36px 24px;">
//                 <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#FAF7F0;border:1px solid #EDE6D6;border-radius:12px;">
//                   <tr>
//                     <td style="padding:16px 20px;font-size:13px;color:#33301F;line-height:1.8;">
//                       <strong style="font-size:14px;color:#2E4A2D;">Need help?</strong><br />
//                       WhatsApp us at <a href="${waLink}" style="color:#3F5B3E;font-weight:bold;text-decoration:none;">${esc(phone)}</a><br />
//                       Write to us at <a href="mailto:${esc(supportEmail)}" style="color:#3F5B3E;font-weight:bold;text-decoration:none;">${esc(supportEmail)}</a>
//                     </td>
//                   </tr>
//                 </table>
//               </td>
//             </tr>

//             ${socialRow}

//             <!-- Footer -->
//             <tr>
//               <td align="center" style="background:#FAF7F0;padding:18px 24px;font-size:12px;color:#8A8570;line-height:1.7;border-top:1px solid #EDE6D6;">
//                 ${address ? `${esc(address)}<br />` : ''}
//                 Handcrafted bamboo products, made with care by skilled artisans.<br />
//                 &copy; ${new Date().getFullYear()} ${esc(siteName)}. All rights reserved.
//               </td>
//             </tr>

//           </table>
//         </td>
//       </tr>
//     </table>
//   </body>
// </html>`;
// };

// /* ------------------------------------------------------------------ */
// /* Sending                                                             */
// /* ------------------------------------------------------------------ */
// /**
//  * Sends a transactional email through Brevo. Logs failures instead of
//  * throwing so that auth flows don't hard-fail solely due to email issues.
//  * The API key is never logged.
//  */
// const sendEmail = async ({ to, subject, html }) => {
//   try {
//     await transactionalEmailsApi.sendTransacEmail({
//       sender: {
//         email: process.env.BREVO_SENDER_EMAIL,
//         name: process.env.BREVO_SENDER_NAME || 'Wa-Kriti',
//       },
//       to: [{ email: to }],
//       subject,
//       htmlContent: html,
//     });
//     logger.info(`Email sent to ${to} | Subject: ${subject}`);
//     return true;
//   } catch (error) {
//     logger.error(
//       `Failed to send email to ${to}: ${error.message} | status=${error.status || ''} | body=${JSON.stringify(
//         error.response?.body || {}
//       )}`
//     );
//     return false;
//   }
// };

// /* ------------------------------------------------------------------ */
// /* Templates                                                           */
// /* ------------------------------------------------------------------ */
// const sendOtpEmail = async (to, otp, purpose) => {
//   const purposeText =
//     purpose === 'password_reset'
//       ? 'reset your password'
//       : purpose === 'email_change'
//       ? 'verify your new email address'
//       : 'verify your account';

//   const html = await baseWrapper(
//     'Your verification code',
//     `
//     <p style="margin:0 0 12px;">Hello,</p>
//     <p style="margin:0;">Use the code below to ${purposeText}. It expires in <strong>${process.env.OTP_EXPIRY_MINUTES || 10} minutes</strong>.</p>
//     <div style="text-align:center;margin:26px 0;">
//       <span style="display:inline-block;background:#F3F6EE;border:2px dashed #3F5B3E;color:#3F5B3E;font-size:32px;letter-spacing:10px;font-weight:bold;padding:16px 26px 16px 36px;border-radius:12px;">${esc(otp)}</span>
//     </div>
//     <p style="margin:0;font-size:13px;color:#8A8570;">Never share this code with anyone. If you did not request it, you can safely ignore this email.</p>
//     `,
//     { preheader: `Your Wa-Kriti code is ${otp}` }
//   );
//   return sendEmail({ to, subject: 'Wa-Kriti OTP Verification', html });
// };

// const sendWelcomeEmail = async (to, firstName) => {
//   const html = await baseWrapper(
//     `Welcome to Wa-Kriti, ${firstName}!`,
//     `
//     <p style="margin:0 0 12px;">Hi ${esc(firstName)},</p>
//     <p style="margin:0 0 12px;">Thank you for joining us. Wa-Kriti brings you premium, handcrafted bamboo products made with care by skilled artisans across India.</p>
//     <p style="margin:0;">Your account is ready. Start exploring sustainable living today, and enjoy your welcome reward points.</p>
//     ${button('Start Shopping', `${SITE_URL}/shop`)}
//     `,
//     { preheader: 'Your Wa-Kriti account is ready.' }
//   );
//   return sendEmail({ to, subject: 'Welcome to Wa-Kriti 🌱', html });
// };

// const sendPasswordChangedEmail = async (to, firstName) => {
//   const html = await baseWrapper(
//     'Your password was changed',
//     `
//     <p style="margin:0 0 12px;">Hi ${esc(firstName)},</p>
//     <p style="margin:0 0 12px;">The password on your Wa-Kriti account was just changed.</p>
//     ${infoBox('<strong>Wasn\'t you?</strong><br />Please contact our support team immediately using the details below so we can secure your account.')}
//     `,
//     { preheader: 'Your Wa-Kriti password was changed.' }
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
//   const html = await baseWrapper(
//     copy.subject,
//     `
//     <p style="margin:0 0 12px;">Hi ${esc(firstName)},</p>
//     <p style="margin:0;">${copy.message}</p>
//     ${infoBox(`
//       <strong>Order Number:</strong> ${esc(orderNumber)}<br />
//       <strong>Status:</strong> ${copy.subject}
//       ${trackingNumber ? `<br /><strong>Tracking Number:</strong> ${esc(trackingNumber)}` : ''}
//     `)}
//     <p style="margin:0;">You can track your order anytime from your Wa-Kriti dashboard.</p>
//     ${button('View My Order', `${SITE_URL}/dashboard`)}
//     `,
//     { preheader: `${copy.subject} — order ${orderNumber}` }
//   );
//   return sendEmail({ to, subject: `Wa-Kriti — ${copy.subject} (${orderNumber})`, html });
// };

// const sendLowStockAlertEmail = async (to, { productName, sku, availableStock }) => {
//   const html = await baseWrapper( 
//     'Low stock alert',
//     `
//     <p style="margin:0 0 12px;">Hi Admin,</p>
//     <p style="margin:0;">The following product is running low on stock:</p>
//     <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:20px 0;background:#FFF4E5;border-left:4px solid #E08A00;border-radius:8px;">
//       <tr><td style="padding:16px 18px;font-size:14px;color:#33301F;line-height:1.7;">
//         <strong>${esc(productName)}</strong><br />
//         SKU: ${esc(sku)}<br />
//         Available stock: <strong style="color:#B45F00;">${esc(availableStock)}</strong>
//       </td></tr>
//     </table>
//     ${button('Open Admin Panel', `${SITE_URL}/admin/products`)}
//     `,
//     { preheader: `${productName} is running low on stock.` }
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
// Used to turn relative product image paths (e.g. "/uploads/x.jpg") into
// absolute URLs. Cloudinary URLs are already absolute and pass through.
const ASSET_BASE_URL = (process.env.SERVER_URL || process.env.API_URL || SITE_URL).replace(/\/$/, '');

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
/* Formatting helpers                                                  */
/* ------------------------------------------------------------------ */
const money = (n = 0) =>
  `&#8377;${Number(n || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

// Accepts a string URL/path or a { url } / { secure_url } object.
const absoluteUrl = (input = '') => {
  const raw = typeof input === 'object' && input !== null ? input.url || input.secure_url || '' : input;
  const s = String(raw || '').trim();
  if (!s) return '';
  if (/^https?:\/\//i.test(s)) return s;
  if (s.startsWith('//')) return `https:${s}`;
  return `${ASSET_BASE_URL}/${s.replace(/^\/+/, '')}`;
};

const PAYMENT_METHOD_LABELS = {
  razorpay: 'Online Payment (Razorpay)',
  upi_qr: 'UPI QR Payment',
  wallet: 'Wallet',
  cod: 'Cash on Delivery',
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
/* Order summary block (mirrors the checkout page "Order summary")     */
/* ------------------------------------------------------------------ */
const summaryRow = (label, valueHtml, { bold = false, large = false, color = '#6B6650' } = {}) => `
  <tr>
    <td style="padding:5px 0;font-size:${large ? 16 : 14}px;color:${color};${bold ? 'font-weight:bold;' : ''}">${label}</td>
    <td align="right" style="padding:5px 0;font-size:${large ? 20 : 14}px;color:${large ? '#2E4A2D' : '#33301F'};font-weight:bold;">${valueHtml}</td>
  </tr>`;

const orderItemRow = (item) => {
  const img = absoluteUrl(item.image);
  const qty = Number(item.quantity) || 1;
  const unitPrice = Number(item.price) || 0;
  const lineTotal = Number(item.subtotal) || unitPrice * qty;
  const variant = item.variantLabel || item.variantName || '';

  const imageCell = img
    ? `<img src="${esc(img)}" alt="${esc(item.name)}" width="72" height="72" style="display:block;width:72px;height:72px;object-fit:cover;border-radius:10px;border:1px solid #EDE6D6;" />`
    : `<div style="width:72px;height:72px;border-radius:10px;background:#F3F6EE;border:1px solid #EDE6D6;"></div>`;

  return `
  <tr>
    <td width="88" valign="top" style="padding:14px 0;border-bottom:1px solid #EDE6D6;">${imageCell}</td>
    <td valign="top" style="padding:14px 10px 14px 4px;border-bottom:1px solid #EDE6D6;">
      <div style="font-size:14px;font-weight:bold;color:#33301F;line-height:1.45;">${esc(item.name)} &times; ${qty}</div>
      ${variant ? `<div style="margin-top:3px;font-size:13px;color:#8A8570;">${esc(variant)}</div>` : ''}
      ${item.sku ? `<div style="margin-top:3px;font-size:12px;color:#A8A28A;">SKU: ${esc(item.sku)}</div>` : ''}
      ${qty > 1 ? `<div style="margin-top:3px;font-size:12px;color:#8A8570;">${money(unitPrice)} each</div>` : ''}
    </td>
    <td width="96" align="right" valign="top" style="padding:14px 0;border-bottom:1px solid #EDE6D6;font-size:14px;font-weight:bold;color:#33301F;white-space:nowrap;">${money(lineTotal)}</td>
  </tr>`;
};

const buildOrderSummaryHtml = (order) => {
  const items = Array.isArray(order.items) ? order.items : [];

  const discount = Number(order.discount) || 0;
  const rewardDiscount = Number(order.rewardPointsDiscount) || 0;
  const shipping = Number(order.shippingCost) || 0;
  const tax = Number(order.tax) || 0;
  const grandTotal = Number(order.grandTotal) || 0;
  const paidToday = order.paymentStatus === 'paid' ? grandTotal : 0;

  const a = order.shippingAddress || {};
  const addressLines = [
    a.fullName,
    [a.addressLine1, a.addressLine2].filter(Boolean).join(', '),
    a.landmark ? `Landmark: ${a.landmark}` : '',
    [a.city, a.state, a.pincode].filter(Boolean).join(', '),
    a.country,
    a.phone ? `Phone: ${a.phone}` : '',
  ].filter(Boolean);

  const paymentLabel = PAYMENT_METHOD_LABELS[order.paymentMethod] || order.paymentMethod || '';

  return `
    <h3 style="margin:24px 0 4px;font-size:18px;color:#2E4A2D;">Order summary</h3>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid #EDE6D6;margin-top:8px;">
      ${items.map(orderItemRow).join('')}
    </table>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:14px;">
      ${summaryRow('Subtotal', money(order.subtotal))}
      ${discount > 0 ? summaryRow(`Discount${order.couponCode ? ` (${esc(order.couponCode)})` : ''}`, `&minus;${money(discount)}`) : ''}
      ${rewardDiscount > 0 ? summaryRow(`Reward points${order.rewardPointsRedeemed ? ` (${esc(order.rewardPointsRedeemed)} pts)` : ''}`, `&minus;${money(rewardDiscount)}`) : ''}
      ${summaryRow('Shipping', shipping > 0 ? money(shipping) : 'Free')}
      ${summaryRow('Taxes', money(tax))}
      <tr><td colspan="2" style="padding:6px 0 0;"><div style="border-top:2px solid #3F5B3E;font-size:0;line-height:0;">&nbsp;</div></td></tr>
      ${summaryRow('Total', money(grandTotal), { large: true, bold: true, color: '#33301F' })}
      ${summaryRow('Total paid today', money(paidToday))}
    </table>

    ${
      paymentLabel
        ? `<p style="margin:14px 0 0;font-size:13px;color:#6B6650;"><strong>Payment method:</strong> ${esc(paymentLabel)}${
            order.paymentMethod === 'cod' ? ` &mdash; please keep ${money(grandTotal)} ready at delivery.` : ''
          }</p>`
        : ''
    }

    ${
      addressLines.length
        ? infoBox(`<strong>Shipping to</strong><br />${addressLines.map(esc).join('<br />')}`)
        : ''
    }

    ${
      order.giftWrap
        ? infoBox(
            `<strong>Gift wrap:</strong> Yes${
              order.giftMessage ? `<br /><strong>Gift message:</strong> ${esc(order.giftMessage)}` : ''
            }`
          )
        : ''
    }
  `;
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

/**
 * Sends an order status email.
 *
 * Existing callers keep working unchanged: { firstName, orderNumber, status, trackingNumber }.
 * Pass the full `order` document as well (orderController does this on
 * placement) and the email also includes product images, variants,
 * prices and the complete price breakdown. The detailed summary is
 * only added for the 'placed' / 'confirmed' emails by default; pass
 * `includeSummary: true` to force it for any other status.
 */
const sendOrderStatusEmail = async (
  to,
  { firstName, orderNumber, status, trackingNumber, order, includeSummary }
) => {
  const copy = ORDER_STATUS_COPY[status] || { subject: 'Order Update', message: 'Your order status has been updated.' };
  const showSummary = !!order && (includeSummary ?? ['placed', 'confirmed'].includes(status));
  const dashboardLink = order?._id ? `${SITE_URL}/dashboard/orders/${order._id}` : `${SITE_URL}/dashboard`;

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
    ${showSummary ? buildOrderSummaryHtml(order) : ''}
    <p style="margin:${showSummary ? '20px' : '0'} 0 0;">You can track your order anytime from your Wa-Kriti dashboard.</p>
    ${button('View My Order', dashboardLink)}
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