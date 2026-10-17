const AuditLog = require('../models/AuditLog');
const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess } = require('../utils/apiResponse');

/**
 * @route GET /api/v1/admin/audit-logs
 * Query: page, limit, module, admin
 */
const getAuditLogs = asyncHandler(async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const limit = Math.min(100, parseInt(req.query.limit, 10) || 50);

  const filter = {};
  if (req.query.module) filter.module = req.query.module;
  if (req.query.admin) filter.admin = req.query.admin;

  const [logs, total] = await Promise.all([
    AuditLog.find(filter)
      .populate('admin', 'firstName lastName email')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit),
    AuditLog.countDocuments(filter),
  ]);

  return sendSuccess(res, 200, 'Audit logs fetched', { logs }, { page, limit, total, totalPages: Math.ceil(total / limit) });
});

module.exports = { getAuditLogs };
