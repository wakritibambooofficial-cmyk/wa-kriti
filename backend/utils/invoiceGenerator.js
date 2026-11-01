// const PDFDocument = require('pdfkit');

// /**
//  * Streams a professional invoice PDF for the given order to the provided
//  * writable stream (typically the Express response object).
//  * @param {import('stream').Writable} outputStream
//  * @param {object} order Populated order document (with .customer)
//  */
// const generateInvoicePdf = (outputStream, order) => {
//   const doc = new PDFDocument({ size: 'A4', margin: 50 });
//   doc.pipe(outputStream);

//   const green = '#3F5B3E';
//   const gray = '#6B6B6B';

//   // Header
//   doc.fillColor(green).fontSize(22).font('Helvetica-Bold').text('WA-KRITI', 50, 50);
//   doc.fillColor(gray).fontSize(10).font('Helvetica').text('Premium Bamboo Living', 50, 78);
//   doc.fillColor(gray).text('www.wakriti.com  |  support@wakriti.com', 50, 92);

//   doc.fillColor('#000000').fontSize(16).font('Helvetica-Bold').text('TAX INVOICE', 400, 50, { align: 'right' });
//   doc.fontSize(10).font('Helvetica').fillColor(gray);
//   doc.text(`Invoice #: ${order.orderNumber}`, 400, 78, { align: 'right' });
//   doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString('en-IN')}`, 400, 92, { align: 'right' });

//   doc.moveTo(50, 115).lineTo(545, 115).strokeColor('#E0D5BC').stroke();

//   // Billing / Shipping
//   const addr = order.shippingAddress || {};
//   doc.fillColor('#000000').fontSize(11).font('Helvetica-Bold').text('Ship To:', 50, 130);
//   doc
//     .font('Helvetica')
//     .fontSize(10)
//     .fillColor(gray)
//     .text(addr.fullName || '', 50, 146)
//     .text(addr.addressLine1 || '', 50, 160)
//     .text(addr.addressLine2 || '', 50, 174)
//     .text(`${addr.city || ''}, ${addr.state || ''} - ${addr.pincode || ''}`, 50, 188)
//     .text(`Phone: ${addr.phone || ''}`, 50, 202);

//   doc.font('Helvetica-Bold').fillColor('#000000').fontSize(11).text('Payment:', 350, 130);
//   doc
//     .font('Helvetica')
//     .fontSize(10)
//     .fillColor(gray)
//     .text(`Method: ${(order.paymentMethod || '').toUpperCase()}`, 350, 146)
//     .text(`Status: ${(order.paymentStatus || '').toUpperCase()}`, 350, 160)
//     .text(order.razorpayPaymentId ? `Txn ID: ${order.razorpayPaymentId}` : '', 350, 174);

//   // Table header
//   let y = 240;
//   doc.rect(50, y, 495, 24).fill('#F3F6EE');
//   doc
//     .fillColor(green)
//     .font('Helvetica-Bold')
//     .fontSize(10)
//     .text('Item', 58, y + 7)
//     .text('Qty', 330, y + 7, { width: 40, align: 'right' })
//     .text('Price', 380, y + 7, { width: 70, align: 'right' })
//     .text('Subtotal', 460, y + 7, { width: 75, align: 'right' });

//   y += 24;
//   doc.font('Helvetica').fillColor('#000000');
//   order.items.forEach((item) => {
//     doc
//       .fontSize(9.5)
//       .text(item.name, 58, y + 8, { width: 260 })
//       .text(String(item.quantity), 330, y + 8, { width: 40, align: 'right' })
//       .text(`Rs. ${item.price}`, 380, y + 8, { width: 70, align: 'right' })
//       .text(`Rs. ${item.subtotal}`, 460, y + 8, { width: 75, align: 'right' });
//     y += 26;
//     doc.moveTo(50, y).lineTo(545, y).strokeColor('#EDE6D6').stroke();
//   });

//   // Totals
//   y += 15;
//   const totalsX = 380;
//   const addTotalRow = (label, value, bold = false) => {
//     doc
//       .font(bold ? 'Helvetica-Bold' : 'Helvetica')
//       .fontSize(10)
//       .fillColor(bold ? green : gray)
//       .text(label, totalsX, y, { width: 80 })
//       .text(`Rs. ${value}`, 460, y, { width: 75, align: 'right' });
//     y += 18;
//   };

//   addTotalRow('Subtotal', order.subtotal);
//   if (order.discount) addTotalRow('Discount', `- ${order.discount}`);
//   if (order.tax) addTotalRow('Tax', order.tax);
//   addTotalRow('Shipping', order.shippingCost || 0);
//   doc.moveTo(totalsX, y).lineTo(545, y).strokeColor('#E0D5BC').stroke();
//   y += 8;
//   addTotalRow('Grand Total', order.grandTotal, true);

//   // Footer
//   doc
//     .fontSize(9)
//     .fillColor(gray)
//     .text(
//       'Thank you for choosing Wa-Kriti. This is a computer-generated invoice and does not require a signature.',
//       50,
//       750,
//       { width: 495, align: 'center' }
//     );
 
//   doc.end();
// };

// module.exports = { generateInvoicePdf };




const fs = require('fs');
const PDFDocument = require('pdfkit');
const logger = require('./logger');
const WebsiteSettings = require('../models/WebsiteSettings');

/* ------------------------------------------------------------------ */
/* Config                                                              */
/* ------------------------------------------------------------------ */
const SITE_URL = (process.env.CLIENT_URL || 'https://wa-kriti.vercel.app').replace(/\/$/, '');
// Public logo (frontend/public/logo.png). Optionally set INVOICE_LOGO_PATH
// in .env to read a local PNG/JPG from the backend instead of fetching it.
const LOGO_URL = `${SITE_URL}/logo.png`;
const LOGO_TTL_MS = 6 * 60 * 60 * 1000;

// Used only if the admin has not filled these in under Admin > Settings.
const FALLBACK = {
  phone: '9366431377',
  email: 'wakriti.bambooofficial@gmail.com',
};

const DARK = '#2d3327';
const MUTED = '#6b7263';
const LABEL = '#8a917f';
const LINE = '#dddddd';
const LINE_SOFT = '#eeeeee';

const PAGE_LEFT = 40;
const PAGE_RIGHT = 555;
const CONTENT_W = PAGE_RIGHT - PAGE_LEFT;
const PAGE_BREAK_Y = 740; // start a new page when content would go below this

const PAYMENT_LABELS = {
  razorpay: 'Online (Razorpay)',
  upi_qr: 'UPI QR',
  wallet: 'Wallet',
  cod: 'Cash on Delivery',
};

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */
// Built-in PDF fonts can't draw the ₹ glyph, so "Rs." is used.
const money = (n = 0) =>
  `Rs. ${Number(n || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const formatDateTime = (d) =>
  new Date(d).toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });

const titleCase = (s = '') =>
  String(s)
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());

let logoCache = { at: 0, buf: null };

const getLogo = async () => {
  if (logoCache.buf && Date.now() - logoCache.at < LOGO_TTL_MS) return logoCache.buf;

  try {
    if (process.env.INVOICE_LOGO_PATH) {
      logoCache = { at: Date.now(), buf: fs.readFileSync(process.env.INVOICE_LOGO_PATH) };
      return logoCache.buf;
    }

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 4000);
    const res = await fetch(LOGO_URL, { signal: controller.signal });
    clearTimeout(timer);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    logoCache = { at: Date.now(), buf: Buffer.from(await res.arrayBuffer()) };
    return logoCache.buf;
  } catch (err) {
    logger.error(`Invoice logo could not be loaded (${err.message}); continuing without it`);
    return logoCache.buf; // stale copy if we have one, otherwise null
  }
};

const getSupport = async () => {
  try {
    const s = (await WebsiteSettings.findOne().lean()) || {};
    return {
      phone: s.whatsappNumber || s.contactPhone || FALLBACK.phone,
      email: s.contactEmail || FALLBACK.email,
    };
  } catch (err) {
    logger.error(`Invoice: could not load website settings: ${err.message}`);
    return { phone: FALLBACK.phone, email: FALLBACK.email };
  }
};

const waLink = (phone) => {
  const d = String(phone).replace(/\D/g, '');
  return `https://wa.me/${d.length === 10 ? `91${d}` : d}`;
};

/* ------------------------------------------------------------------ */
/* Generator                                                           */
/* ------------------------------------------------------------------ */
/**
 * Streams a PDF invoice for the given order to the provided writable
 * stream (typically the Express response object).
 * @param {import('stream').Writable} outputStream
 * @param {object} order Populated order document (with .customer)
 */
const generateInvoicePdf = async (outputStream, order) => {
  const doc = new PDFDocument({ size: 'A4', margin: 40 });
  doc.pipe(outputStream);

  try {
    const [logo, support] = await Promise.all([getLogo(), getSupport()]);

    const items = order.items || [];
    const addr = order.shippingAddress || {};
    const customer = order.customer || {};

    const drawLogo = (x, y, size, opacity = 1) => {
      if (!logo) return;
      try {
        doc.save();
        doc.opacity(opacity);
        doc.image(logo, x, y, { fit: [size, size], align: 'center', valign: 'center' });
        doc.restore();
      } catch (err) {
        doc.restore();
        logger.error(`Invoice: logo image invalid: ${err.message}`);
      }
    };

    /* ---------------- Header ---------------- */
    const textX = logo ? PAGE_LEFT + 72 : PAGE_LEFT;
    drawLogo(PAGE_LEFT, 40, 58);

    doc.font('Times-Bold').fontSize(22).fillColor(DARK).text('WA-KRITI', textX, 46, { characterSpacing: 1 });
    doc.font('Times-Roman').fontSize(10).fillColor(MUTED).text('Handmade & Eco-friendly Goods', textX, 74);

    doc.font('Times-Bold').fontSize(17).fillColor(DARK).text('Tax Invoice', 355, 44, { width: 200, align: 'right' });
    doc.font('Times-Roman').fontSize(10).fillColor(MUTED);
    doc.text(`Order #${order.orderNumber}`, 355, 66, { width: 200, align: 'right' });
    doc.text(formatDateTime(order.createdAt), 355, 80, { width: 200, align: 'right' });

    doc.moveTo(PAGE_LEFT, 108).lineTo(PAGE_RIGHT, 108).lineWidth(1.5).strokeColor(DARK).stroke();
    doc.lineWidth(1);

    /* ---------------- Billed To / Ship To / Payment ---------------- */
    const colTop = 124;
    const colW = 160;
    const colX = [PAGE_LEFT, PAGE_LEFT + 177, PAGE_LEFT + 354];

    const drawColumn = (x, label, lines) => {
      doc.font('Times-Roman').fontSize(8).fillColor(LABEL).text(label.toUpperCase(), x, colTop, {
        width: colW,
        characterSpacing: 0.5,
      });
      let cy = colTop + 14;
      lines.filter(Boolean).forEach((line, i) => {
        doc
          .font('Times-Roman')
          .fontSize(i === 0 && !line.muted ? 11 : 10)
          .fillColor(line.muted ? MUTED : DARK);
        const text = line.t;
        doc.text(text, x, cy, { width: colW });
        cy = doc.y + 2;
      });
      return cy;
    };

    const customerName = `${customer.firstName || ''} ${customer.lastName || ''}`.trim() || addr.fullName || '';
    const street = [addr.addressLine1, addr.addressLine2].filter(Boolean).join(', ');
    const cityLine = [addr.city, addr.state].filter(Boolean).join(', ') + (addr.pincode ? ` - ${addr.pincode}` : '');

    const billedEnd = drawColumn(colX[0], 'Billed To', [
      customerName && { t: customerName },
      customer.email && { t: customer.email, muted: true },
      addr.phone && { t: addr.phone, muted: true },
    ]);

    const shipEnd = drawColumn(colX[1], 'Ship To', [
      addr.fullName && { t: addr.fullName },
      street && { t: street, muted: true },
      addr.landmark && { t: `Landmark: ${addr.landmark}`, muted: true },
      cityLine.trim() && { t: cityLine, muted: true },
    ]);

    const paymentEnd = drawColumn(colX[2], 'Payment', [
      { t: PAYMENT_LABELS[order.paymentMethod] || titleCase(order.paymentMethod || 'N/A') },
      { t: titleCase(order.paymentStatus || 'N/A'), muted: true },
      order.razorpayPaymentId && { t: `Txn: ${order.razorpayPaymentId}`, muted: true },
      { t: `Order status: ${titleCase(order.orderStatus || '')}`, muted: true },
    ]);

    let y = Math.max(billedEnd, shipEnd, paymentEnd) + 18;

    /* ---------------- Items table ---------------- */
    const COL = {
      item: { x: PAGE_LEFT + 8, w: 270 },
      qty: { x: 325, w: 40 },
      price: { x: 375, w: 80 },
      amount: { x: 465, w: PAGE_RIGHT - 465 - 8 },
    };

    const drawTableHeader = () => {
      doc.font('Times-Bold').fontSize(8.5).fillColor(LABEL);
      doc.text('ITEM', COL.item.x, y, { width: COL.item.w });
      doc.text('QTY', COL.qty.x, y, { width: COL.qty.w, align: 'right' });
      doc.text('PRICE', COL.price.x, y, { width: COL.price.w, align: 'right' });
      doc.text('AMOUNT', COL.amount.x, y, { width: COL.amount.w, align: 'right' });
      y += 16;
      doc.moveTo(PAGE_LEFT, y).lineTo(PAGE_RIGHT, y).strokeColor(LINE).stroke();
      y += 4;
    };

    const newPage = () => {
      doc.addPage();
      y = 40;
    };

    drawTableHeader();

    items.forEach((item) => {
      const qty = Number(item.quantity) || 1;
      const price = Number(item.price) || 0;
      const lineTotal = Number(item.subtotal) || price * qty;
      const variant = item.variantLabel || item.variantName || '';

      doc.font('Times-Roman').fontSize(11);
      const nameH = doc.heightOfString(item.name || 'Item', { width: COL.item.w });
      let rowH = nameH + 14;
      if (variant) {
        doc.fontSize(9);
        rowH += doc.heightOfString(variant, { width: COL.item.w }) + 2;
      }
      if (item.sku) rowH += 12;

      if (y + rowH > PAGE_BREAK_Y) {
        newPage();
        drawTableHeader();
      }

      const rowTop = y + 7;
      doc.font('Times-Roman').fontSize(11).fillColor(DARK).text(item.name || 'Item', COL.item.x, rowTop, { width: COL.item.w });
      let subY = rowTop + nameH + 2;
      if (variant) {
        doc.font('Times-Roman').fontSize(9).fillColor(MUTED).text(variant, COL.item.x, subY, { width: COL.item.w });
        subY = doc.y + 2;
      }
      if (item.sku) {
        doc.font('Times-Roman').fontSize(8).fillColor(LABEL).text(`SKU: ${item.sku}`, COL.item.x, subY, { width: COL.item.w });
      }

      doc.font('Times-Roman').fontSize(11).fillColor(DARK);
      doc.text(String(qty), COL.qty.x, rowTop, { width: COL.qty.w, align: 'right' });
      doc.text(money(price), COL.price.x, rowTop, { width: COL.price.w, align: 'right' });
      doc.text(money(lineTotal), COL.amount.x, rowTop, { width: COL.amount.w, align: 'right' });

      y += rowH;
      doc.moveTo(PAGE_LEFT, y).lineTo(PAGE_RIGHT, y).strokeColor(LINE_SOFT).stroke();
    });

    /* ---------------- Totals (with logo watermark) ---------------- */
    const subtotal =
      order.subtotal != null ? order.subtotal : items.reduce((s, it) => s + (it.price || 0) * (it.quantity || 1), 0);

    const rows = [{ label: 'Subtotal', value: money(subtotal) }];
    if (order.discount > 0) {
      rows.push({ label: order.couponCode ? `Discount (${order.couponCode})` : 'Discount', value: `- ${money(order.discount)}` });
    }
    if (order.rewardPointsDiscount > 0) {
      rows.push({
        label: order.rewardPointsRedeemed ? `Reward points (${order.rewardPointsRedeemed})` : 'Reward points',
        value: `- ${money(order.rewardPointsDiscount)}`,
      });
    }
    rows.push({ label: 'Shipping', value: order.shippingCost > 0 ? money(order.shippingCost) : 'Free' });
    rows.push({ label: 'Tax', value: money(order.tax || 0) });

    const totalsX = 295;
    const totalsW = PAGE_RIGHT - totalsX;
    const blockH = rows.length * 20 + 44;

    y += 18;
    if (y + blockH > PAGE_BREAK_Y) newPage();

    // Faint logo behind the totals, like the HTML invoice.
    drawLogo(totalsX + totalsW / 2 - 95, y + blockH / 2 - 95, 190, 0.2);

    rows.forEach((r) => {
      doc.font('Times-Roman').fontSize(11).fillColor(MUTED).text(r.label, totalsX, y, { width: 150 });
      doc.font('Times-Roman').fontSize(11).fillColor(DARK).text(r.value, totalsX + 150, y, { width: totalsW - 150, align: 'right' });
      y += 20;
    });

    doc.moveTo(totalsX, y + 2).lineTo(PAGE_RIGHT, y + 2).lineWidth(1.5).strokeColor(DARK).stroke();
    doc.lineWidth(1);
    y += 10;
    doc.font('Times-Bold').fontSize(14).fillColor(DARK).text('Grand Total', totalsX, y, { width: 130 });
    doc.font('Times-Bold').fontSize(14).fillColor(DARK).text(money(order.grandTotal), totalsX + 130, y, {
      width: totalsW - 130,
      align: 'right',
    });
    y += 30;

    /* ---------------- Support + footer ---------------- */
    if (y + 110 > PAGE_BREAK_Y + 40) newPage();

    y += 20;
    doc.dash(3, { space: 3 }).moveTo(PAGE_LEFT, y).lineTo(PAGE_RIGHT, y).strokeColor('#bbbbbb').stroke().undash();
    y += 14;

    doc.font('Times-Roman').fontSize(8).fillColor(LABEL).text('NEED HELP?', PAGE_LEFT, y, {
      width: CONTENT_W,
      align: 'right',
      characterSpacing: 0.5,
    });
    y += 14;
    doc.font('Times-Bold').fontSize(10).fillColor(DARK);
    doc.text(`WhatsApp us at ${support.phone}`, PAGE_LEFT, y, { width: CONTENT_W, align: 'right', link: waLink(support.phone) });
    y += 15;
    doc.text(`Write to us at ${support.email}`, PAGE_LEFT, y, { width: CONTENT_W, align: 'right', link: `mailto:${support.email}` });
    y += 34;

    doc.font('Times-Roman').fontSize(9).fillColor(LABEL).text(
      'Thank you for shopping with Wa-Kriti — handcrafted with care. This is a computer-generated invoice and does not require a signature.',
      PAGE_LEFT,
      y,
      { width: CONTENT_W, align: 'center' }
    );
  } catch (err) {
    logger.error(`Invoice generation failed for order ${order?.orderNumber}: ${err.message}`);
  }

  doc.end();
};

module.exports = { generateInvoicePdf };