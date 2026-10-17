const { z } = require('zod');

const coercedNumber = (schema) =>
  z.preprocess((val) => (val === '' || val === undefined || val === null ? undefined : Number(val)), schema);

const artisanSchema = z.object({
  name: z.string().trim().min(1, 'Name is required'),
  village: z.string().optional().default(''),
  state: z.string().optional().default(''),
  experienceYears: coercedNumber(z.number().min(0)).optional().default(0),
  story: z.string().optional().default(''),
  quote: z.string().optional().default(''),
  craftSpecialty: z.string().optional().default(''),
  latitude: coercedNumber(z.number()).optional().nullable(),
  longitude: coercedNumber(z.number()).optional().nullable(),
  videoUrl: z.string().optional().default(''),
  status: z.enum(['active', 'inactive']).optional().default('active'),
});

const updateArtisanSchema = artisanSchema.partial();

const sustainabilityStatSchema = z.object({
  label: z.string().trim().min(1).optional(),
  value: coercedNumber(z.number().min(0)),
  icon: z.string().optional().default(''),
});

const bambooSpeciesSchema = z.object({
  name: z.string().trim().min(1, 'Name is required'),
  scientificName: z.string().optional().default(''),
  description: z.string().optional().default(''),
  growthRegion: z.string().optional().default(''),
  usedFor: z
    .preprocess((v) => {
      if (Array.isArray(v)) return v;
      if (typeof v === 'string') return v.split(',').map((s) => s.trim());
      return v;
    }, z.array(z.string()))
    .optional()
    .default([]),
  sustainabilityNotes: z.string().optional().default(''),
  status: z.enum(['active', 'inactive']).optional().default('active'),
});

const updateBambooSpeciesSchema = bambooSpeciesSchema.partial();

const certificateSchema = z.object({
  title: z.string().trim().min(1, 'Title is required'),
  type: z.enum(['msme', 'gst', 'trademark', 'fssai', 'quality', 'eco_certification', 'other']),
  issuedBy: z.string().optional().default(''),
  issuedDate: z.preprocess((v) => (v === '' ? undefined : v), z.coerce.date()).optional(),
  isPublic: z
    .preprocess((v) => (v === 'true' ? true : v === 'false' ? false : v), z.boolean())
    .optional()
    .default(true),
});

module.exports = {
  artisanSchema,
  updateArtisanSchema,
  sustainabilityStatSchema,
  bambooSpeciesSchema,
  updateBambooSpeciesSchema,
  certificateSchema,
};
