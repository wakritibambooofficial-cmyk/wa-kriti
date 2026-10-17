const AuditLog = require('../models/AuditLog');
const logger = require('../utils/logger');

/**
 * Returns a middleware that logs an admin action AFTER the response has been
 * sent successfully (2xx/3xx). Attach it before the route handler; it patches
 * res.json to detect success and fire-and-forget the audit write.
 *
 * @param {string} module e.g. 'products'
 * @param {(req) => string} actionResolver returns action name, e.g. () => 'product.create'
 * @param {(req) => string} [descriptionResolver] optional human-readable description
 */
const auditLog = (module, actionResolver, descriptionResolver) => (req, res, next) => {
  const originalJson = res.json.bind(res);

  res.json = (body) => {
    if (res.statusCode >= 200 && res.statusCode < 400 && body?.success !== false) {
      const targetId = req.params.id || body?.data?.product?._id || body?.data?._id || null;
      AuditLog.create({
        admin: req.user?._id,
        action: typeof actionResolver === 'function' ? actionResolver(req) : actionResolver,
        module,
        targetId,
        description: descriptionResolver ? descriptionResolver(req) : '',
        ip: req.ip,
      }).catch((err) => logger.error(`Audit log write failed: ${err.message}`));
    }
    return originalJson(body);
  };

  next();
};

module.exports = auditLog;
