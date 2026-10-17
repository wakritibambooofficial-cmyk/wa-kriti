const Testimonial = require('../models/Testimonial');

const MAX_TESTIMONIALS_PER_USER = 2;

// ─────────────────────────────────────────────
// PUBLIC
// ─────────────────────────────────────────────

// GET /api/testimonials
// Only ever returns admin-approved testimonials.
exports.getTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find({ status: 'approved' })
      .sort({ displayOrder: 1, createdAt: -1 })
      .limit(20);

    res.status(200).json({
      status: 'success',
      data: { testimonials },
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Could not fetch testimonials' });
  }
};

// ─────────────────────────────────────────────
// CUSTOMER (logged in)
// ─────────────────────────────────────────────

// GET /api/testimonials/mine
// The requesting user's own testimonials, any status, so they can see
// what's pending / approved / rejected.
exports.getMyTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find({ submittedBy: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({
      status: 'success',
      data: { testimonials },
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Could not fetch your testimonials' });
  }
};

// POST /api/testimonials
// Create a new testimonial. Capped at MAX_TESTIMONIALS_PER_USER — rejected
// ones don't count against the cap, so a declined attempt doesn't burn a slot.
exports.submitTestimonial = async (req, res) => {
  try {
    const { rating, text, location } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({ status: 'error', message: 'Please write your review before submitting.' });
    }

    const activeCount = await Testimonial.countDocuments({
      submittedBy: req.user._id,
      status: { $ne: 'rejected' },
    });

    if (activeCount >= MAX_TESTIMONIALS_PER_USER) {
      return res.status(400).json({
        status: 'error',
        message: `You can only have ${MAX_TESTIMONIALS_PER_USER} reviews at a time. Please edit or delete an existing one.`,
      });
    }

    const testimonial = await Testimonial.create({
      name: `${req.user.firstName || ''} ${req.user.lastName || ''}`.trim() || req.user.name || 'Customer',
      location: location?.trim() || '',
      rating: rating || 5,
      text: text.trim(),
      submittedBy: req.user._id,
      status: 'pending',
    });

    res.status(201).json({
      status: 'success',
      message: 'Thanks! Your review will appear after our team reviews it.',
      data: { testimonial },
    });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message || 'Could not submit review' });
  }
};

// PUT /api/testimonials/:id
// Owner-only edit. Editing sends it back to "pending" since the content changed.
exports.updateMyTestimonial = async (req, res) => {
  try {
    const { rating, text, location } = req.body;

    const testimonial = await Testimonial.findOne({ _id: req.params.id, submittedBy: req.user._id });
    if (!testimonial) {
      return res.status(404).json({ status: 'error', message: 'Review not found' });
    }

    if (text !== undefined) {
      if (!text.trim()) {
        return res.status(400).json({ status: 'error', message: 'Review text cannot be empty.' });
      }
      testimonial.text = text.trim();
    }
    if (rating !== undefined) testimonial.rating = rating;
    if (location !== undefined) testimonial.location = location.trim();
    testimonial.status = 'pending'; // re-review after any edit

    await testimonial.save();

    res.status(200).json({
      status: 'success',
      message: 'Review updated and sent for re-approval.',
      data: { testimonial },
    });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message || 'Could not update review' });
  }
};

// DELETE /api/testimonials/:id
// Owner-only delete.
exports.deleteMyTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.findOneAndDelete({ _id: req.params.id, submittedBy: req.user._id });
    if (!testimonial) {
      return res.status(404).json({ status: 'error', message: 'Review not found' });
    }
    res.status(200).json({ status: 'success', data: null });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Could not delete review' });
  }
};

// ─────────────────────────────────────────────
// ADMIN
// ─────────────────────────────────────────────

// GET /api/testimonials/admin/all?status=pending|approved|rejected (optional filter)
exports.getAllTestimonialsAdmin = async (req, res) => {
  try {
    const filter = {};
    if (req.query.status) filter.status = req.query.status;

    const testimonials = await Testimonial.find(filter)
      .populate('submittedBy', 'firstName lastName email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      status: 'success',
      data: { testimonials },
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Could not fetch testimonials' });
  }
};

// PATCH /api/testimonials/:id/approve
exports.approveTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.findByIdAndUpdate(
      req.params.id,
      { status: 'approved' },
      { new: true }
    );
    if (!testimonial) {
      return res.status(404).json({ status: 'error', message: 'Testimonial not found' });
    }
    res.status(200).json({ status: 'success', data: { testimonial } });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Could not approve testimonial' });
  }
};

// PATCH /api/testimonials/:id/reject
exports.rejectTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.findByIdAndUpdate(
      req.params.id,
      { status: 'rejected' },
      { new: true }
    );
    if (!testimonial) {
      return res.status(404).json({ status: 'error', message: 'Testimonial not found' });
    }
    res.status(200).json({ status: 'success', data: { testimonial } });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Could not reject testimonial' });
  }
};

// POST /api/testimonials/admin
// Admin creates one directly (curated / imported), pre-approved.
exports.createTestimonialAdmin = async (req, res) => {
  try {
    const testimonial = await Testimonial.create({
      ...req.body,
      submittedBy: null,
      status: 'approved',
    });
    res.status(201).json({ status: 'success', data: { testimonial } });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message || 'Could not create testimonial' });
  }
};

// DELETE /api/testimonials/admin/:id
// Admin can delete any testimonial, regardless of owner.
exports.deleteTestimonialAdmin = async (req, res) => {
  try {
    const testimonial = await Testimonial.findByIdAndDelete(req.params.id);
    if (!testimonial) {
      return res.status(404).json({ status: 'error', message: 'Testimonial not found' });
    }
    res.status(200).json({ status: 'success', data: null });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Could not delete testimonial' });
  }
};