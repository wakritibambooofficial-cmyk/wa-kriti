const PDFDocument = require('pdfkit');

/**
 * Streams a professional invoice PDF for the given order to the provided
 * writable stream (typically the Express response object).
 * @param {import('stream').Writable} outputStream
 * @param {object} order Populated order document (with .customer)
 */
const generateInvoicePdf = (outputStream, order) => {
  const doc = new PDFDocument({ size: 'A4', margin: 50 });
  doc.pipe(outputStream);

  const green = '#3F5B3E';
  const gray = '#6B6B6B';

  // Header
  doc.fillColor(green).fontSize(22).font('Helvetica-Bold').text('WA-KRITI', 50, 50);
  doc.fillColor(gray).fontSize(10).font('Helvetica').text('Premium Bamboo Living', 50, 78);
  doc.fillColor(gray).text('www.wakriti.com  |  support@wakriti.com', 50, 92);

  doc.fillColor('#000000').fontSize(16).font('Helvetica-Bold').text('TAX INVOICE', 400, 50, { align: 'right' });
  doc.fontSize(10).font('Helvetica').fillColor(gray);
  doc.text(`Invoice #: ${order.orderNumber}`, 400, 78, { align: 'right' });
  doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString('en-IN')}`, 400, 92, { align: 'right' });

  doc.moveTo(50, 115).lineTo(545, 115).strokeColor('#E0D5BC').stroke();

  // Billing / Shipping
  const addr = order.shippingAddress || {};
  doc.fillColor('#000000').fontSize(11).font('Helvetica-Bold').text('Ship To:', 50, 130);
  doc
    .font('Helvetica')
    .fontSize(10)
    .fillColor(gray)
    .text(addr.fullName || '', 50, 146)
    .text(addr.addressLine1 || '', 50, 160)
    .text(addr.addressLine2 || '', 50, 174)
    .text(`${addr.city || ''}, ${addr.state || ''} - ${addr.pincode || ''}`, 50, 188)
    .text(`Phone: ${addr.phone || ''}`, 50, 202);

  doc.font('Helvetica-Bold').fillColor('#000000').fontSize(11).text('Payment:', 350, 130);
  doc
    .font('Helvetica')
    .fontSize(10)
    .fillColor(gray)
    .text(`Method: ${(order.paymentMethod || '').toUpperCase()}`, 350, 146)
    .text(`Status: ${(order.paymentStatus || '').toUpperCase()}`, 350, 160)
    .text(order.razorpayPaymentId ? `Txn ID: ${order.razorpayPaymentId}` : '', 350, 174);

  // Table header
  let y = 240;
  doc.rect(50, y, 495, 24).fill('#F3F6EE');
  doc
    .fillColor(green)
    .font('Helvetica-Bold')
    .fontSize(10)
    .text('Item', 58, y + 7)
    .text('Qty', 330, y + 7, { width: 40, align: 'right' })
    .text('Price', 380, y + 7, { width: 70, align: 'right' })
    .text('Subtotal', 460, y + 7, { width: 75, align: 'right' });

  y += 24;
  doc.font('Helvetica').fillColor('#000000');
  order.items.forEach((item) => {
    doc
      .fontSize(9.5)
      .text(item.name, 58, y + 8, { width: 260 })
      .text(String(item.quantity), 330, y + 8, { width: 40, align: 'right' })
      .text(`Rs. ${item.price}`, 380, y + 8, { width: 70, align: 'right' })
      .text(`Rs. ${item.subtotal}`, 460, y + 8, { width: 75, align: 'right' });
    y += 26;
    doc.moveTo(50, y).lineTo(545, y).strokeColor('#EDE6D6').stroke();
  });

  // Totals
  y += 15;
  const totalsX = 380;
  const addTotalRow = (label, value, bold = false) => {
    doc
      .font(bold ? 'Helvetica-Bold' : 'Helvetica')
      .fontSize(10)
      .fillColor(bold ? green : gray)
      .text(label, totalsX, y, { width: 80 })
      .text(`Rs. ${value}`, 460, y, { width: 75, align: 'right' });
    y += 18;
  };

  addTotalRow('Subtotal', order.subtotal);
  if (order.discount) addTotalRow('Discount', `- ${order.discount}`);
  if (order.tax) addTotalRow('Tax', order.tax);
  addTotalRow('Shipping', order.shippingCost || 0);
  doc.moveTo(totalsX, y).lineTo(545, y).strokeColor('#E0D5BC').stroke();
  y += 8;
  addTotalRow('Grand Total', order.grandTotal, true);

  // Footer
  doc
    .fontSize(9)
    .fillColor(gray)
    .text(
      'Thank you for choosing Wa-Kriti. This is a computer-generated invoice and does not require a signature.',
      50,
      750,
      { width: 495, align: 'center' }
    );

  doc.end();
};

module.exports = { generateInvoicePdf };
