const mongoose = require('mongoose');

// Collections included in manual backups. Sensitive fields (password,
// tokens) are excluded at the schema level already (select: false) so a
// standard .find() will not leak them.
const BACKUP_MODELS = [
  'User', 'Address', 'Category', 'Product', 'Order', 'Coupon', 'Review',
  'Banner', 'HomepageSection', 'CMSPage', 'WebsiteSettings', 'Blog', 'BlogCategory',
];

/**
 * Exports the given collections (or all BACKUP_MODELS) as a single JSON
 * snapshot object: { [modelName]: [...documents] }.
 */
const createBackup = async (modelNames = BACKUP_MODELS) => {
  const snapshot = { generatedAt: new Date().toISOString(), collections: {} };

  for (const name of modelNames) {
    if (!mongoose.models[name]) continue;
    // eslint-disable-next-line no-await-in-loop
    const docs = await mongoose.models[name].find().lean();
    snapshot.collections[name] = docs;
  }

  return snapshot;
};

/**
 * Restores a previously exported snapshot. By default this is additive
 * (upserts by _id) rather than destructive, to avoid accidental data loss.
 * @param {object} snapshot as produced by createBackup()
 * @param {boolean} wipeExisting if true, clears each target collection first
 */
const restoreBackup = async (snapshot, wipeExisting = false) => {
  const results = {};

  for (const [modelName, docs] of Object.entries(snapshot.collections || {})) {
    const Model = mongoose.models[modelName];
    if (!Model || !Array.isArray(docs)) continue;

    if (wipeExisting) {
      // eslint-disable-next-line no-await-in-loop
      await Model.deleteMany({});
    }

    let restored = 0;
    for (const doc of docs) {
      const { _id, ...rest } = doc;
      // eslint-disable-next-line no-await-in-loop
      await Model.findByIdAndUpdate(_id, rest, { upsert: true, setDefaultsOnInsert: true });
      restored += 1;
    }
    results[modelName] = restored;
  }

  return results;
};

module.exports = { createBackup, restoreBackup, BACKUP_MODELS };
