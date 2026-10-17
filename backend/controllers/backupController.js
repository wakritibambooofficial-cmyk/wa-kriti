const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const { sendSuccess } = require('../utils/apiResponse');
const { createBackup, restoreBackup, BACKUP_MODELS } = require('../utils/backupHelper');
const logger = require('../utils/logger');

/**
 * @route GET /api/v1/admin/backups/export
 * Streams a downloadable JSON backup of core collections.
 */
const exportBackup = asyncHandler(async (req, res) => {
  const snapshot = await createBackup();
  const filename = `wakriti-backup-${new Date().toISOString().slice(0, 10)}.json`;

  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
  res.send(JSON.stringify(snapshot, null, 2));

  logger.info(`Database backup exported by admin ${req.user._id}`);
});

/**
 * @route POST /api/v1/admin/backups/restore
 * Accepts an uploaded JSON backup file ('backup' field) and restores it.
 * Body (form field): wipeExisting=true|false
 */
const importBackup = asyncHandler(async (req, res) => {
  if (!req.file) throw ApiError.badRequest('Backup JSON file is required');

  let snapshot;
  try {
    snapshot = JSON.parse(req.file.buffer.toString('utf-8'));
  } catch {
    throw ApiError.badRequest('Invalid backup file format');
  }

  const wipeExisting = req.body.wipeExisting === 'true';
  const results = await restoreBackup(snapshot, wipeExisting);

  logger.info(`Database backup restored by admin ${req.user._id}: ${JSON.stringify(results)}`);
  return sendSuccess(res, 200, 'Backup restored successfully', { results });
});

/**
 * @route GET /api/v1/admin/backups/collections
 * Lists which collections are included in backups.
 */
const listBackupCollections = asyncHandler(async (req, res) => {
  return sendSuccess(res, 200, 'Backup collections listed', { collections: BACKUP_MODELS });
});

module.exports = { exportBackup, importBackup, listBackupCollections };
