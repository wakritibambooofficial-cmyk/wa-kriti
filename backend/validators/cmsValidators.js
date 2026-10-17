// const { z } = require('zod');

// const coercedNumber = (schema) =>
//   z.preprocess((val) => (val === '' || val === undefined || val === null ? undefined : Number(val)), schema);
// const coercedDate = (schema) =>
//   z.preprocess((val) => (val === '' || val === undefined || val === null ? undefined : val), schema);

// const bannerSchema = z.object({
//   title: z.string().trim().min(1, 'Title is required'),
//   subtitle: z.string().optional().default(''),
//   description: z.string().optional().default(''),
//   ctaPrimaryLabel: z.string().optional().default(''),
//   ctaPrimaryLink: z.string().optional().default(''),
//   ctaSecondaryLabel: z.string().optional().default(''),
//   ctaSecondaryLink: z.string().optional().default(''),
//   placement: z.enum(['hero_slider', 'festival_offer', 'limited_edition', 'announcement_popup', 'category_banner']),
//   sortOrder: coercedNumber(z.number().int()).optional().default(0),
//   startDate: coercedDate(z.coerce.date()).optional(),
//   endDate: coercedDate(z.coerce.date()).optional().nullable(),
//   status: z.enum(['active', 'inactive']).optional().default('active'),
// });

// const updateBannerSchema = bannerSchema.partial();

// const homepageSectionSchema = z.object({
//   title: z.string().optional().default(''),
//   subtitle: z.string().optional().default(''),
//   content: z.string().optional().default(''),
//   isVisible: z
//     .preprocess((v) => (v === 'true' ? true : v === 'false' ? false : v), z.boolean())
//     .optional()
//     .default(true),
//   sortOrder: coercedNumber(z.number().int()).optional().default(0),
//   items: z
//     .preprocess((val) => {
//       if (typeof val === 'string') {
//         try {
//           return JSON.parse(val);
//         } catch {
//           return [];
//         }
//       }
//       return val;
//     }, z.array(z.object({ label: z.string().optional(), value: z.string().optional(), description: z.string().optional(), icon: z.string().optional() })))
//     .optional()
//     .default([]),
// });

// const cmsPageSchema = z.object({
//   title: z.string().trim().min(1, 'Title is required'),
//   content: z.string().optional().default(''),
//   metaTitle: z.string().optional().default(''),
//   metaDescription: z.string().optional().default(''),
// });

// // const websiteSettingsSchema = z.object({
// //   websiteName: z.string().optional(),
// //   tagline: z.string().optional(),
// //   contactEmail: z.string().email().optional(),
// //   contactPhone: z.string().optional(),
// //   whatsappNumber: z.string().optional(),
// //   address: z.string().optional(),
// //   googleMapEmbedUrl: z.string().optional(),
// //   freeShippingThreshold: coercedNumber(z.number().min(0)).optional(),
// //   flatShippingCost: coercedNumber(z.number().min(0)).optional(),
// //   taxPercentage: coercedNumber(z.number().min(0).max(100)).optional(),
// // });

// const websiteSettingsSchema = z.object({
//   // Basic
//   websiteName: z.string().optional(),
//   tagline: z.string().optional(),

//   // Contact
//   contactEmail: z
//     .string()
//     .email('Invalid email')
//     .optional()
//     .or(z.literal('')),

//   contactPhone: z.string().optional(),
//   whatsappNumber: z.string().optional(),
//   address: z.string().optional(),
//   googleMapEmbedUrl: z.string().optional(),

//   // Pricing
//   freeShippingThreshold: coercedNumber(z.number().min(0)),
//   flatShippingCost: coercedNumber(z.number().min(0)),
//   taxPercentage: coercedNumber(z.number().min(0).max(100)),

//   // Social Links
//   'socialLinks.instagram': z.string().optional(),
//   'socialLinks.facebook': z.string().optional(),
//   'socialLinks.youtube': z.string().optional(),
//   'socialLinks.linkedin': z.string().optional(),
//   'socialLinks.pinterest': z.string().optional(),

//   // SEO
//   'seo.defaultMetaTitle': z.string().optional(),
//   'seo.defaultMetaDescription': z.string().optional(),

//   // Announcement Bar
//   'announcementBar.isEnabled': z
//     .enum(['true', 'false'])
//     .optional(),

//   'announcementBar.messages': z.string().optional(),

//   'announcementBar.autoRotateSeconds': coercedNumber(
//     z.number().min(1)
//   ),
// });




// const blogSchema = z.object({
//   title: z.string().trim().min(1, 'Title is required'),
//   excerpt: z.string().optional().default(''),
//   content: z.string().min(1, 'Content is required'),
//   category: z.string().optional().nullable(),
//   tags: z
//     .preprocess((val) => {
//       if (Array.isArray(val)) return val;
//       if (typeof val === 'string') return val.split(',').map((s) => s.trim());
//       return val;
//     }, z.array(z.string()))
//     .optional()
//     .default([]),
//   status: z.enum(['published', 'draft']).optional().default('draft'),
//   metaTitle: z.string().optional().default(''),
//   metaDescription: z.string().optional().default(''),
// });

// const updateBlogSchema = blogSchema.partial();

// const contactFormSchema = z.object({
//   name: z.string().trim().min(1, 'Name is required'),
//   email: z.string().trim().email('Enter a valid email'),
//   phone: z.string().optional().default(''),
//   subject: z.string().optional().default('General Inquiry'),
//   message: z.string().trim().min(5, 'Message must be at least 5 characters'),
// });

// const newsletterSchema = z.object({
//   email: z.string().trim().email('Enter a valid email'),
// });




// module.exports = {
//   bannerSchema,
//   updateBannerSchema,
//   homepageSectionSchema,
//   cmsPageSchema,
//   websiteSettingsSchema,
//   blogSchema,
//   updateBlogSchema,
//   contactFormSchema,
//   newsletterSchema,
// };

const { z } = require('zod');

const coercedNumber = (schema) =>
  z.preprocess((val) => (val === '' || val === undefined || val === null ? undefined : Number(val)), schema);
const coercedDate = (schema) =>
  z.preprocess((val) => (val === '' || val === undefined || val === null ? undefined : val), schema);

const bannerSchema = z.object({
  title: z.string().trim().min(1, 'Title is required'),
  subtitle: z.string().optional().default(''),
  description: z.string().optional().default(''),
  ctaPrimaryLabel: z.string().optional().default(''),
  ctaPrimaryLink: z.string().optional().default(''),
  ctaSecondaryLabel: z.string().optional().default(''),
  ctaSecondaryLink: z.string().optional().default(''),
  placement: z.enum(['hero_slider', 'festival_offer', 'limited_edition', 'announcement_popup', 'category_banner']),
  sortOrder: coercedNumber(z.number().int()).optional().default(0),
  startDate: coercedDate(z.coerce.date()).optional(),
  endDate: coercedDate(z.coerce.date()).optional().nullable(),
  status: z.enum(['active', 'inactive']).optional().default('active'),
});

const updateBannerSchema = bannerSchema.partial();

const homepageSectionSchema = z.object({
  title: z.string().optional().default(''),
  subtitle: z.string().optional().default(''),
  content: z.string().optional().default(''),
  isVisible: z
    .preprocess((v) => (v === 'true' ? true : v === 'false' ? false : v), z.boolean())
    .optional()
    .default(true),
  sortOrder: coercedNumber(z.number().int()).optional().default(0),
  items: z
    .preprocess((val) => {
      if (typeof val === 'string') {
        try {
          return JSON.parse(val);
        } catch {
          return [];
        }
      }
      return val;
    }, z.array(z.object({ label: z.string().optional(), value: z.string().optional(), description: z.string().optional(), icon: z.string().optional() })))
    .optional()
    .default([]),
});

const cmsPageSchema = z.object({
  title: z.string().trim().min(1, 'Title is required'),
  content: z.string().optional().default(''),
  metaTitle: z.string().optional().default(''),
  metaDescription: z.string().optional().default(''),
});

const websiteSettingsSchema = z.object({
  // Basic
  websiteName: z.string().optional(),
  tagline: z.string().optional(),

  // Contact
  contactEmail: z
    .string()
    .email('Invalid email')
    .optional()
    .or(z.literal('')),

  contactPhone: z.string().optional(),
  whatsappNumber: z.string().optional(),
  address: z.string().optional(),
  googleMapEmbedUrl: z.string().optional(),

  // Pricing
  freeShippingThreshold: coercedNumber(z.number().min(0)),
  flatShippingCost: coercedNumber(z.number().min(0)),
  taxPercentage: coercedNumber(z.number().min(0).max(100)),

  // Social Links
  'socialLinks.instagram': z.string().optional(),
  'socialLinks.facebook': z.string().optional(),
  'socialLinks.youtube': z.string().optional(),
  'socialLinks.linkedin': z.string().optional(),
  'socialLinks.pinterest': z.string().optional(),

  // SEO
  'seo.defaultMetaTitle': z.string().optional(),
  'seo.defaultMetaDescription': z.string().optional(),

  // Announcement Bar
  'announcementBar.isEnabled': z
    .enum(['true', 'false'])
    .optional(),

  'announcementBar.messages': z.string().optional(),

  'announcementBar.autoRotateSeconds': coercedNumber(
    z.number().min(1)
  ),
});




const blogSchema = z.object({
  title: z.string().trim().min(1, 'Title is required'),
  excerpt: z.string().optional().default(''),
  content: z.string().min(1, 'Content is required'),
  category: z.string().optional().nullable(),
  tags: z
    .preprocess((val) => {
      if (Array.isArray(val)) return val;
      if (typeof val === 'string') return val.split(',').map((s) => s.trim());
      return val;
    }, z.array(z.string()))
    .optional()
    .default([]),
  status: z.enum(['published', 'draft']).optional().default('draft'),
  metaTitle: z.string().optional().default(''),
  metaDescription: z.string().optional().default(''),
});

const updateBlogSchema = blogSchema.partial();

// Handles both the plain "Contact Us" form and the "Bulk Order Enquiry"
// form (Festive Gifting page). The bulk-order fields are optional here
// so the plain contact form — which never sends them — is unaffected;
// the frontend's own bulkOrderSchema already enforces them as required
// before the request is sent. This is what fixes them from being
// stripped: Zod drops any key not declared in the schema by default,
// which is why they weren't reaching the controller before.
const contactFormSchema = z.object({
  name: z.string().trim().min(1, 'Name is required'),
  email: z.string().trim().email('Enter a valid email'),
  phone: z.string().optional().default(''),
  subject: z.string().optional().default('General Inquiry'),
  message: z.string().trim().optional().default(''),

  type: z.enum(['contact', 'bulk-order']).optional().default('contact'),
  companyName: z.string().trim().optional().default(''),
  productInterest: z.string().trim().optional().default(''),
  quantity: z.string().trim().optional().default(''),
  destination: z.string().trim().optional().default(''),
});

const newsletterSchema = z.object({
  email: z.string().trim().email('Enter a valid email'),
});




module.exports = {
  bannerSchema,
  updateBannerSchema,
  homepageSectionSchema,
  cmsPageSchema,
  websiteSettingsSchema,
  blogSchema,
  updateBlogSchema,
  contactFormSchema,
  newsletterSchema,
};
