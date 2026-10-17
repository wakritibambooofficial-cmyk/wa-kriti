// const cloudinary = require('cloudinary').v2;
// const multer = require('multer');
// const { Readable } = require('stream');

// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// // Store the uploaded file in memory; we stream the buffer to Cloudinary
// // ourselves. This avoids relying on third-party storage-engine packages
// // that lag behind Cloudinary SDK v2 releases.
// const memoryUpload = multer({
//   storage: multer.memoryStorage(),
//   limits: { fileSize: 5 * 1024 * 1024 }, // 5MB per file
//   fileFilter: (req, file, cb) => {
//     const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
//     if (!allowed.includes(file.mimetype)) {
//       return cb(new Error('Only JPG, PNG, and WEBP images are allowed'));
//     }
//     cb(null, true);
//   },
// });

// /**
//  * Streams a buffer (from multer memoryStorage) to a Cloudinary folder.
//  * @param {Buffer} buffer
//  * @param {string} folder e.g. 'products', 'avatars', 'banners'
//  * @returns {Promise<{url: string, publicId: string, width: number, height: number, format: string}>}
//  */
// const uploadBufferToCloudinary = (buffer, folder) =>
//   new Promise((resolve, reject) => {
//     const uploadStream = cloudinary.uploader.upload_stream(
//       {
//         folder: `wakriti/${folder}`,
//         resource_type: 'image',
//         transformation: [{ quality: 'auto', fetch_format: 'auto' }],
//       },
//       (error, result) => {
//         if (error) return reject(error);
//         resolve({
//           url: result.secure_url,
//           publicId: result.public_id,
//           width: result.width,
//           height: result.height,
//           format: result.format,
//         });
//       }
//     );
//     Readable.from(buffer).pipe(uploadStream);
//   });

// const deleteFromCloudinary = (publicId) => cloudinary.uploader.destroy(publicId);




// /* ============================================================
//    VIDEOS
 
//    Same memory-buffer -> stream approach as images, but with
//    resource_type: 'video'. Cloudinary's free/paid tiers cap
//    video uploads at 100MB by default; we keep multer's limit a
//    bit under that so the failure happens fast with a clear
//    message instead of timing out mid-stream.
 
//    NOTE: buffering the whole file in memory is fine for short
//    clips (the ~15-40s reel-style videos this feature is meant
//    for). If you start accepting long-form video, switch this to
//    a disk-storage multer + upload_large_stream instead.
// ============================================================ */
 
// const videoUpload = multer({
//   storage: multer.memoryStorage(),
//   limits: { fileSize: 50 * 1024 * 1024 }, // 50MB per file
//   fileFilter: (req, file, cb) => {
//     const allowed = ['video/mp4', 'video/webm', 'video/quicktime'];
//     if (!allowed.includes(file.mimetype)) {
//       return cb(new Error('Only MP4, WEBM, and MOV videos are allowed'));
//     }
//     cb(null, true);
//   },
// });
 
// /**
//  * Streams a video buffer to Cloudinary.
//  * @param {Buffer} buffer
//  * @param {string} folder e.g. 'videos'
//  * @returns {Promise<{url, publicId, duration, format, width, height}>}
//  */
// const uploadVideoBufferToCloudinary = (buffer, folder) =>
//   new Promise((resolve, reject) => {
//     const uploadStream = cloudinary.uploader.upload_stream(
//       {
//         folder: `wakriti/${folder}`,
//         resource_type: 'video',
//         // eager transcode to a web-friendly mp4 so playback is consistent
//         // regardless of what codec the customer/admin uploaded
//         eager: [{ format: 'mp4', quality: 'auto' }],
//         eager_async: false,
//       },
//       (error, result) => {
//         if (error) return reject(error);
 
//         const eagerResult = result.eager && result.eager[0];
 
//         resolve({
//           url: (eagerResult && eagerResult.secure_url) || result.secure_url,
//           publicId: result.public_id,
//           duration: result.duration || 0,
//           format: (eagerResult && eagerResult.format) || result.format,
//           width: result.width,
//           height: result.height,
//           thumbnailUrl: buildVideoThumbnailUrl(result.public_id),
//         });
//       }
//     );
//     Readable.from(buffer).pipe(uploadStream);
//   });
 
// /**
//  * Builds a poster-frame JPG URL for a stored video without another
//  * upload — Cloudinary generates it on the fly from the same publicId.
//  */
// const buildVideoThumbnailUrl = (publicId) =>
//   cloudinary.url(publicId, {
//     resource_type: 'video',
//     format: 'jpg',
//     transformation: [{ width: 500, height: 890, crop: 'fill', gravity: 'auto', quality: 'auto' }],
//   });
 
// const deleteVideoFromCloudinary = (publicId) =>
//   cloudinary.uploader.destroy(publicId, { resource_type: 'video' });
 


// module.exports = { cloudinary, memoryUpload, uploadBufferToCloudinary, deleteFromCloudinary,videoUpload,
//   uploadVideoBufferToCloudinary,
//   deleteVideoFromCloudinary,
//   buildVideoThumbnailUrl, };


const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const { Readable } = require('stream');
const { fileTypeFromBuffer } = require('file-type');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const ALLOWED_IMAGE_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp'];
const ALLOWED_VIDEO_EXTENSIONS = ['mp4', 'webm', 'mov'];

/**
 * Verifies a buffer's actual file signature (magic bytes), not just the
 * client-supplied Content-Type header. multer's fileFilter alone cannot
 * catch a renamed non-image/video file with a spoofed mimetype — this is
 * the server-side backstop that checks the real file content before it
 * ever reaches Cloudinary.
 */
const assertRealFileType = async (buffer, allowedExtensions, kindLabel) => {
  const detected = await fileTypeFromBuffer(buffer);
  if (!detected || !allowedExtensions.includes(detected.ext)) {
    const err = new Error(`Invalid or unrecognized ${kindLabel} file content`);
    err.statusCode = 400;
    throw err;
  }
};

// Store the uploaded file in memory; we stream the buffer to Cloudinary
// ourselves. This avoids relying on third-party storage-engine packages
// that lag behind Cloudinary SDK v2 releases.
const memoryUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB per file
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (!allowed.includes(file.mimetype)) {
      return cb(new Error('Only JPG, PNG, and WEBP images are allowed'));
    }
    cb(null, true);
  },
});

/**
 * Streams a buffer (from multer memoryStorage) to a Cloudinary folder.
 * @param {Buffer} buffer
 * @param {string} folder e.g. 'products', 'avatars', 'banners'
 * @returns {Promise<{url: string, publicId: string, width: number, height: number, format: string}>}
 */
const uploadBufferToCloudinary = async (buffer, folder) => {
  await assertRealFileType(buffer, ALLOWED_IMAGE_EXTENSIONS, 'image');

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: `wakriti/${folder}`,
        resource_type: 'image',
        transformation: [{ quality: 'auto', fetch_format: 'auto' }],
      },
      (error, result) => {
        if (error) return reject(error);
        resolve({
          url: result.secure_url,
          publicId: result.public_id,
          width: result.width,
          height: result.height,
          format: result.format,
        });
      }
    );
    Readable.from(buffer).pipe(uploadStream);
  });
};

const deleteFromCloudinary = (publicId) => cloudinary.uploader.destroy(publicId);




/* ============================================================
   VIDEOS
 
   Same memory-buffer -> stream approach as images, but with
   resource_type: 'video'. Cloudinary's free/paid tiers cap
   video uploads at 100MB by default; we keep multer's limit a
   bit under that so the failure happens fast with a clear
   message instead of timing out mid-stream.
 
   NOTE: buffering the whole file in memory is fine for short
   clips (the ~15-40s reel-style videos this feature is meant
   for). If you start accepting long-form video, switch this to
   a disk-storage multer + upload_large_stream instead.
============================================================ */
 
const videoUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB per file
  fileFilter: (req, file, cb) => {
    const allowed = ['video/mp4', 'video/webm', 'video/quicktime'];
    if (!allowed.includes(file.mimetype)) {
      return cb(new Error('Only MP4, WEBM, and MOV videos are allowed'));
    }
    cb(null, true);
  },
});
 
/**
 * Streams a video buffer to Cloudinary.
 * @param {Buffer} buffer
 * @param {string} folder e.g. 'videos'
 * @returns {Promise<{url, publicId, duration, format, width, height}>}
 */
const uploadVideoBufferToCloudinary = async (buffer, folder) => {
  await assertRealFileType(buffer, ALLOWED_VIDEO_EXTENSIONS, 'video');

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: `wakriti/${folder}`,
        resource_type: 'video',
        // eager transcode to a web-friendly mp4 so playback is consistent
        // regardless of what codec the customer/admin uploaded
        eager: [{ format: 'mp4', quality: 'auto' }],
        eager_async: false,
      },
      (error, result) => {
        if (error) return reject(error);
 
        const eagerResult = result.eager && result.eager[0];
 
        resolve({
          url: (eagerResult && eagerResult.secure_url) || result.secure_url,
          publicId: result.public_id,
          duration: result.duration || 0,
          format: (eagerResult && eagerResult.format) || result.format,
          width: result.width,
          height: result.height,
          thumbnailUrl: buildVideoThumbnailUrl(result.public_id),
        });
      }
    );
    Readable.from(buffer).pipe(uploadStream);
  });
};
 
/**
 * Builds a poster-frame JPG URL for a stored video without another
 * upload — Cloudinary generates it on the fly from the same publicId.
 */
const buildVideoThumbnailUrl = (publicId) =>
  cloudinary.url(publicId, {
    resource_type: 'video',
    format: 'jpg',
    transformation: [{ width: 500, height: 890, crop: 'fill', gravity: 'auto', quality: 'auto' }],
  });
 
const deleteVideoFromCloudinary = (publicId) =>
  cloudinary.uploader.destroy(publicId, { resource_type: 'video' });
 


module.exports = { cloudinary, memoryUpload, uploadBufferToCloudinary, deleteFromCloudinary,videoUpload,
  uploadVideoBufferToCloudinary,
  deleteVideoFromCloudinary,
  buildVideoThumbnailUrl, };