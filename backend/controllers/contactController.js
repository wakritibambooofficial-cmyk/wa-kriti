// const { ContactQuery, NewsletterSubscriber } = require('../models/Contact');
// const asyncHandler = require('../utils/asyncHandler');
// const ApiError = require('../utils/ApiError');
// const { sendSuccess } = require('../utils/apiResponse');
// const { sendEmail } = require('../services/emailService');
// const { notifyAdmins } = require('../services/notificationService');
// const logger = require('../utils/logger');

// /**
//  * @route POST /api/v1/contact
//  * Public.
//  */
// const submitContactQuery = asyncHandler(async (req, res) => {
//   const { name, email, phone = '', subject = 'General Inquiry', message } = req.body;

//   const query = await ContactQuery.create({ name, email, phone, subject, message });

//   await notifyAdmins({
//     type: 'system',
//     title: 'New Contact Query',
//     message: `${name} sent a message: "${subject}"`,
//     link: `/admin/contact-queries/${query._id}`,
//   });

//   return sendSuccess(res, 201, 'Your message has been received. We will get back to you shortly.', { query });
// });

// /**
//  * @route GET /api/v1/admin/contact
//  */
// const getAllContactQueries = asyncHandler(async (req, res) => {
//   const { status } = req.query;
//   const filter = {};
//   if (status) filter.status = status;

//   const queries = await ContactQuery.find(filter).sort({ createdAt: -1 });
//   return sendSuccess(res, 200, 'Contact queries fetched', { queries });
// });

// /**
//  * @route PATCH /api/v1/admin/contact/:id/reply
//  */
// const replyToContactQuery = asyncHandler(async (req, res) => {
//   const query = await ContactQuery.findById(req.params.id);
//   if (!query) throw ApiError.notFound('Contact query not found');

//   query.adminReply = req.body.reply;
//   query.repliedAt = new Date();
//   query.status = 'resolved';
//   await query.save();

//   sendEmail({
//     to: query.email,
//     subject: `Re: ${query.subject}`,
//     html: `<p>Hi ${query.name},</p><p>${req.body.reply}</p>`,
//   }).catch((e) => logger.error(e.message));

//   return sendSuccess(res, 200, 'Reply sent successfully', { query });
// });

// /**
//  * @route PATCH /api/v1/admin/contact/:id/status
//  */
// const updateContactStatus = asyncHandler(async (req, res) => {
//   const query = await ContactQuery.findById(req.params.id);
//   if (!query) throw ApiError.notFound('Contact query not found');

//   query.status = req.body.status;
//   await query.save();

//   return sendSuccess(res, 200, 'Status updated', { query });
// });

// /* ---------------------------- Newsletter ---------------------------- */

// /**
//  * @route POST /api/v1/newsletter/subscribe
//  * Public.
//  */
// const subscribeNewsletter = asyncHandler(async (req, res) => {
//   const { email } = req.body;

//   const existing = await NewsletterSubscriber.findOne({ email });
//   if (existing) {
//     if (existing.status === 'subscribed') {
//       return sendSuccess(res, 200, 'You are already subscribed!');
//     }
//     existing.status = 'subscribed';
//     existing.subscribedAt = new Date();
//     existing.unsubscribedAt = null;
//     await existing.save();
//     return sendSuccess(res, 200, 'Welcome back! You have been re-subscribed.');
//   }

//   await NewsletterSubscriber.create({ email });

//   sendEmail({
//     to: email,
//     subject: 'Welcome to the Wa-Kriti Newsletter 🌱',
//     html: `<p>Thank you for subscribing! You'll now receive bamboo tips, offers, and new launches straight to your inbox.</p>`,
//   }).catch((e) => logger.error(e.message));

//   return sendSuccess(res, 201, 'Subscribed successfully!');
// });

// /**
//  * @route POST /api/v1/newsletter/unsubscribe
//  * Public.
//  */
// const unsubscribeNewsletter = asyncHandler(async (req, res) => {
//   const { email } = req.body;
//   const subscriber = await NewsletterSubscriber.findOne({ email });
//   if (!subscriber) throw ApiError.notFound('Subscriber not found');

//   subscriber.status = 'unsubscribed';
//   subscriber.unsubscribedAt = new Date();
//   await subscriber.save();

//   return sendSuccess(res, 200, 'You have been unsubscribed');
// });

// /**
//  * @route GET /api/v1/admin/newsletter/subscribers
//  */
// const getSubscribers = asyncHandler(async (req, res) => {
//   const subscribers = await NewsletterSubscriber.find({ status: 'subscribed' }).sort({ subscribedAt: -1 });
//   return sendSuccess(res, 200, 'Subscribers fetched', { subscribers, count: subscribers.length });
// });

// /**
//  * @route DELETE /api/v1/admin/newsletter/subscribers/:id
//  */
// const deleteSubscriber = asyncHandler(async (req, res) => {
//   const subscriber = await NewsletterSubscriber.findByIdAndDelete(req.params.id);
//   if (!subscriber) throw ApiError.notFound('Subscriber not found');
//   return sendSuccess(res, 200, 'Subscriber removed');
// });


// /**
//  * @route POST /api/v1/admin/newsletter/send
//  * Admin only.
//  */
// const sendNewsletterToSubscribers = asyncHandler(async (req, res) => {
//   const { subject, html, message } = req.body;

//   if (!subject?.trim()) {
//     throw ApiError.badRequest('Email subject is required');
//   }

//   if (!html?.trim() && !message?.trim()) {
//     throw ApiError.badRequest('Email content is required');
//   }

//   // Get all active subscribers
//   const subscribers = await NewsletterSubscriber.find({
//     status: 'subscribed',
//   }).select('email');

//   if (!subscribers.length) {
//     throw ApiError.notFound('No subscribed users found');
//   }

//   const emailContent = html?.trim() || `<p>${message.trim()}</p>`;

//   let sent = 0;
//   let failed = 0;

//   // Send emails
//   for (const subscriber of subscribers) {
//     try {
//       await sendEmail({
//         to: subscriber.email,
//         subject: subject.trim(),
//         html: emailContent,
//       });

//       sent++;
//     } catch (error) {
//       failed++;
//       logger.error(
//         `Newsletter failed for ${subscriber.email}: ${error.message}`
//       );
//     }
//   }

//   return sendSuccess(res, 200, 'Newsletter sending completed', {
//     totalSubscribers: subscribers.length,
//     sent,
//     failed,
//   });
// });

// module.exports = {
//   submitContactQuery,
//   getAllContactQueries,
//   replyToContactQuery,
//   updateContactStatus,
//   subscribeNewsletter,
//   unsubscribeNewsletter,
//   getSubscribers,
//   deleteSubscriber,
//   sendNewsletterToSubscribers
// };




const { ContactQuery, NewsletterSubscriber } = require('../models/Contact');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const { sendSuccess } = require('../utils/apiResponse');
const { sendEmail } = require('../services/emailService');
const { notifyAdmins } = require('../services/notificationService');
const logger = require('../utils/logger');

// Anti-spam: cap on submissions allowed from the same email address
// within a rolling window, whether the submitter is logged in or not.
// Applies to both the plain Contact Us form and the Bulk Order Enquiry
// form, since both post to this same endpoint. Email is the identifier
// used (rather than a user ID) so the limit applies identically to
// guests and logged-in users alike — a guest has no account to key on.
//
// This is a ROLLING window, not a lifetime cap: submissions older than
// COOLDOWN_MS stop counting automatically, so a legitimate customer who
// used up their 2 slots isn't blocked forever — just for 24 hours from
// their most recent submission.
const MAX_SUBMISSIONS_PER_WINDOW = 2;
const COOLDOWN_MS = 24 * 60 * 60 * 1000; // 24 hours

const getClientIp = (req) =>
  req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
  req.socket?.remoteAddress ||
  '';

const buildConfirmationEmail = ({ name, type, message, companyName, productInterest, quantity, destination }) => {
  if (type === 'bulk-order') {
    return {
      subject: 'We received your bulk order enquiry — Wa-Kriti',
      html: `
        <p>Hi ${name},</p>
        <p>Thank you for your bulk order enquiry with Wa-Kriti. Here's a copy of what you sent us:</p>
        <ul>
          ${companyName ? `<li><strong>Company:</strong> ${companyName}</li>` : ''}
          <li><strong>Product(s) of interest:</strong> ${productInterest}</li>
          <li><strong>Estimated quantity:</strong> ${quantity}</li>
          <li><strong>Delivery destination:</strong> ${destination}</li>
          ${message ? `<li><strong>Additional details:</strong> ${message}</li>` : ''}
        </ul>
        <p>Our team will review your requirements and get back to you with a tailored quote shortly.</p>
        <p>— Team Wa-Kriti</p>
      `,
    };
  }

  return {
    subject: 'We received your message — Wa-Kriti',
    html: `
      <p>Hi ${name},</p>
      <p>Thanks for reaching out to Wa-Kriti. Here's a copy of your message:</p>
      <blockquote style="margin:0;padding-left:12px;border-left:3px solid #3F5B3E;color:#555;">
        ${message || '(no message provided)'}
      </blockquote>
      <p>Our team will get back to you shortly.</p>
      <p>— Team Wa-Kriti</p>
    `,
  };
};

/**
 * @route POST /api/v1/contact
 * Public. Handles both the plain "Contact Us" form and the "Bulk Order
 * Enquiry" form on Festive Gifting.
 *
 * Anti-spam: caps submissions per email address at
 * MAX_SUBMISSIONS_PER_WINDOW within a rolling COOLDOWN_MS window,
 * applied the same way whether the person is logged in or browsing as
 * a guest. Also sends the submitter a confirmation email — logged in
 * or not, the form always has their email address to send it to.
 */
const submitContactQuery = asyncHandler(async (req, res) => {
  const {
    name,
    email,
    phone = '',
    subject = 'General Inquiry',
    message = '',
    type = 'contact',
    companyName = '',
    productInterest = '',
    quantity = '',
    destination = '',
  } = req.body;

  const normalizedEmail = email.toLowerCase().trim();

  const windowStart = new Date(Date.now() - COOLDOWN_MS);
  const recentCount = await ContactQuery.countDocuments({
    email: normalizedEmail,
    createdAt: { $gte: windowStart },
  });

  if (recentCount >= MAX_SUBMISSIONS_PER_WINDOW) {
    throw ApiError.badRequest(
      `You've reached the maximum of ${MAX_SUBMISSIONS_PER_WINDOW} submissions allowed within 24 hours for this email address. Please try again later, or wait for a reply to your earlier message.`
    );
  }

  const ipAddress = getClientIp(req);

  const query = await ContactQuery.create({
    name,
    email: normalizedEmail,
    phone,
    subject,
    message,
    type,
    companyName,
    productInterest,
    quantity,
    destination,
    ipAddress,
  });

  await notifyAdmins({
    type: 'system',
    title: type === 'bulk-order' ? 'New Bulk Order Enquiry' : 'New Contact Query',
    message: `${name} sent a message: "${subject}"`,
    link: `/admin/contact-queries/${query._id}`,
  });

  // Confirmation email to whoever submitted, regardless of login state —
  // failure here never blocks the response, since the query itself has
  // already been saved successfully.
  const confirmation = buildConfirmationEmail({
    name, type, message, companyName, productInterest, quantity, destination,
  });
  sendEmail({
    to: normalizedEmail,
    subject: confirmation.subject,
    html: confirmation.html,
  }).catch((e) => logger.error(`Confirmation email failed for ${normalizedEmail}: ${e.message}`));

  return sendSuccess(res, 201, 'Your message has been received. We will get back to you shortly.', { query });
});

/**
 * @route GET /api/v1/admin/contact
 */
const getAllContactQueries = asyncHandler(async (req, res) => {
  const { status } = req.query;
  const filter = {};
  if (status) filter.status = status;

  const queries = await ContactQuery.find(filter).sort({ createdAt: -1 });
  return sendSuccess(res, 200, 'Contact queries fetched', { queries });
});

/**
 * @route PATCH /api/v1/admin/contact/:id/reply
 */
const replyToContactQuery = asyncHandler(async (req, res) => {
  const query = await ContactQuery.findById(req.params.id);
  if (!query) throw ApiError.notFound('Contact query not found');

  query.adminReply = req.body.reply;
  query.repliedAt = new Date();
  query.status = 'resolved';
  await query.save();

  sendEmail({
    to: query.email,
    subject: `Re: ${query.subject}`,
    html: `<p>Hi ${query.name},</p><p>${req.body.reply}</p>`,
  }).catch((e) => logger.error(e.message));

  return sendSuccess(res, 200, 'Reply sent successfully', { query });
});

/**
 * @route PATCH /api/v1/admin/contact/:id/status
 */
const updateContactStatus = asyncHandler(async (req, res) => {
  const query = await ContactQuery.findById(req.params.id);
  if (!query) throw ApiError.notFound('Contact query not found');

  query.status = req.body.status;
  await query.save();

  return sendSuccess(res, 200, 'Status updated', { query });
});

/* ---------------------------- Newsletter ---------------------------- */

/**
 * @route POST /api/v1/newsletter/subscribe
 * Public.
 */
const subscribeNewsletter = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const existing = await NewsletterSubscriber.findOne({ email });
  if (existing) {
    if (existing.status === 'subscribed') {
      return sendSuccess(res, 200, 'You are already subscribed!');
    }
    existing.status = 'subscribed';
    existing.subscribedAt = new Date();
    existing.unsubscribedAt = null;
    await existing.save();
    return sendSuccess(res, 200, 'Welcome back! You have been re-subscribed.');
  }

  await NewsletterSubscriber.create({ email });

  sendEmail({
    to: email,
    subject: 'Welcome to the Wa-Kriti Newsletter 🌱',
    html: `<p>Thank you for subscribing! You'll now receive bamboo tips, offers, and new launches straight to your inbox.</p>`,
  }).catch((e) => logger.error(e.message));

  return sendSuccess(res, 201, 'Subscribed successfully!');
});

/**
 * @route POST /api/v1/newsletter/unsubscribe
 * Public.
 */
const unsubscribeNewsletter = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const subscriber = await NewsletterSubscriber.findOne({ email });
  if (!subscriber) throw ApiError.notFound('Subscriber not found');

  subscriber.status = 'unsubscribed';
  subscriber.unsubscribedAt = new Date();
  await subscriber.save();

  return sendSuccess(res, 200, 'You have been unsubscribed');
});

/**
 * @route GET /api/v1/admin/newsletter/subscribers
 */
const getSubscribers = asyncHandler(async (req, res) => {
  const subscribers = await NewsletterSubscriber.find({ status: 'subscribed' }).sort({ subscribedAt: -1 });
  return sendSuccess(res, 200, 'Subscribers fetched', { subscribers, count: subscribers.length });
});

/**
 * @route DELETE /api/v1/admin/newsletter/subscribers/:id
 */
const deleteSubscriber = asyncHandler(async (req, res) => {
  const subscriber = await NewsletterSubscriber.findByIdAndDelete(req.params.id);
  if (!subscriber) throw ApiError.notFound('Subscriber not found');
  return sendSuccess(res, 200, 'Subscriber removed');
});

/**
 * @route POST /api/v1/admin/newsletter/send
 * Admin only.
 */
const sendNewsletterToSubscribers = asyncHandler(async (req, res) => {
  const { subject, html, message } = req.body;

  if (!subject?.trim()) {
    throw ApiError.badRequest('Email subject is required');
  }

  if (!html?.trim() && !message?.trim()) {
    throw ApiError.badRequest('Email content is required');
  }

  const subscribers = await NewsletterSubscriber.find({
    status: 'subscribed',
  }).select('email');

  if (!subscribers.length) {
    throw ApiError.notFound('No subscribed users found');
  }

  const emailContent = html?.trim() || `<p>${message.trim()}</p>`;

  let sent = 0;
  let failed = 0;

  for (const subscriber of subscribers) {
    try {
      await sendEmail({
        to: subscriber.email,
        subject: subject.trim(),
        html: emailContent,
      });

      sent++;
    } catch (error) {
      failed++;
      logger.error(
        `Newsletter failed for ${subscriber.email}: ${error.message}`
      );
    }
  }

  return sendSuccess(res, 200, 'Newsletter sending completed', {
    totalSubscribers: subscribers.length,
    sent,
    failed,
  });
});

module.exports = {
  submitContactQuery,
  getAllContactQueries,
  replyToContactQuery,
  updateContactStatus,
  subscribeNewsletter,
  unsubscribeNewsletter,
  getSubscribers,
  deleteSubscriber,
  sendNewsletterToSubscribers
};