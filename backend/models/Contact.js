// const mongoose = require('mongoose');

// const contactQuerySchema = new mongoose.Schema(
//   {
//     name: { type: String, required: true, trim: true },
//     email: { type: String, required: true, trim: true, lowercase: true },
//     phone: { type: String, default: '' },
//     subject: { type: String, default: 'General Inquiry' },
//     message: { type: String, required: true },
//     status: { type: String, enum: ['new', 'in_progress', 'resolved'], default: 'new' },
//     adminReply: { type: String, default: null },
//     repliedAt: { type: Date, default: null },
//   },
//   { timestamps: true }
// );

// const newsletterSubscriberSchema = new mongoose.Schema(
//   {
//     email: { type: String, required: true, unique: true, trim: true, lowercase: true },
//     status: { type: String, enum: ['subscribed', 'unsubscribed'], default: 'subscribed' },
//     subscribedAt: { type: Date, default: Date.now },
//     unsubscribedAt: { type: Date, default: null },
//   },
//   { timestamps: true }
// );

// module.exports = {
//   ContactQuery: mongoose.model('ContactQuery', contactQuerySchema),
//   NewsletterSubscriber: mongoose.model('NewsletterSubscriber', newsletterSubscriberSchema),
// };
const mongoose = require('mongoose');

const contactQuerySchema = new mongoose.Schema(
  {
    // Present on every query, whether it's a plain "Contact Us" message
    // or a "Bulk Order Enquiry" from the Festive Gifting page.
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, default: '' },
    subject: { type: String, default: 'General Inquiry' },
    message: { type: String, default: '' },

    // Distinguishes a plain contact message from a bulk-order enquiry.
    type: { type: String, enum: ['contact', 'bulk-order'], default: 'contact' },

    // Bulk-order-only fields. Left blank on plain contact messages.
    companyName: { type: String, default: '' },
    productInterest: { type: String, default: '' },
    quantity: { type: String, default: '' },
    destination: { type: String, default: '' },

    // Spam tracking — the submitter's IP at the time of submission,
    // recorded regardless of whether they were logged in. Used
    // alongside the per-email submission cap for anti-spam checks.
    ipAddress: { type: String, default: '' },

    status: { type: String, enum: ['new', 'in_progress', 'resolved'], default: 'new' },
    adminReply: { type: String, default: null },
    repliedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

// Speeds up the per-email submission-count check on every new submission.
contactQuerySchema.index({ email: 1 });

const newsletterSubscriberSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    status: { type: String, enum: ['subscribed', 'unsubscribed'], default: 'subscribed' },
    subscribedAt: { type: Date, default: Date.now },
    unsubscribedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

module.exports = {
  ContactQuery: mongoose.model('ContactQuery', contactQuerySchema),
  NewsletterSubscriber: mongoose.model('NewsletterSubscriber', newsletterSubscriberSchema),
};