const { z } = require('zod');

const addressSchema = z.object({
  fullName: z.string().trim().min(1, 'Full name is required'),
  phone: z.string().trim().min(10, 'Enter a valid phone number').max(15),
  addressLine1: z.string().trim().min(1, 'Address line 1 is required'),
  addressLine2: z.string().trim().optional().default(''),
  landmark: z.string().trim().optional().default(''),
  city: z.string().trim().min(1, 'City is required'),
  district: z.string().trim().optional().default(''),
  state: z.string().trim().min(1, 'State is required'),
  country: z.string().trim().optional().default('India'),
  pincode: z.string().regex(/^[1-9][0-9]{5}$/, 'Invalid Indian PIN code'),
  label: z.enum(['home', 'office', 'other']).optional().default('home'),
  isDefault: z.boolean().optional().default(false),
  latitude: z.number().optional().nullable(),
  longitude: z.number().optional().nullable(),
});

const updateAddressSchema = addressSchema.partial();

module.exports = { addressSchema, updateAddressSchema };
