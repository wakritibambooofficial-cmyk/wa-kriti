const { z } = require('zod');

const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain an uppercase letter')
  .regex(/[a-z]/, 'Password must contain a lowercase letter')
  .regex(/[0-9]/, 'Password must contain a number')
  .regex(/[^A-Za-z0-9]/, 'Password must contain a special character');

const signupSchema = z.object({
  firstName: z.string().trim().min(1, 'First name is required').max(50),
  lastName: z.string().trim().min(1, 'Last name is required').max(50),
  email: z.string().trim().email('Invalid email address'),
  password: passwordSchema,
  phone: z.string().trim().optional(),
});

const verifyOtpSchema = z.object({
  email: z.string().trim().email(),
  otp: z.string().length(6, 'OTP must be 6 digits'),
  purpose: z.enum(['signup_verification', 'password_reset', 'email_change']),
});

const resendOtpSchema = z.object({
  email: z.string().trim().email(),
  purpose: z.enum(['signup_verification', 'password_reset', 'email_change']),
});

const loginSchema = z.object({
  email: z.string().trim().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
  captchaToken: z.string().optional(),
});

const forgotPasswordSchema = z.object({
  email: z.string().trim().email(),
});

const resetPasswordSchema = z.object({
  email: z.string().trim().email(),
  otp: z.string().length(6, 'OTP must be 6 digits'),
  newPassword: passwordSchema,
});

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: passwordSchema,
});
const updateProfileSchema = z
  .object({
    firstName: z.string().trim().min(1).max(50).optional(),
    lastName: z.string().trim().min(1).max(50).optional(),
    phone: z.string().trim().optional().nullable(),
    preferredTheme: z.enum(['light', 'dark', 'system']).optional(),
    language: z.string().trim().optional(),
    currency: z.string().trim().optional(),
    marketingConsent: z.boolean().optional(),
    notificationPreferences: z
      .object({
        email: z.boolean().optional(),
        inApp: z.boolean().optional(),
      })
      .optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field is required',
  });

module.exports = {
  signupSchema,
  verifyOtpSchema,
  resendOtpSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  changePasswordSchema,
  updateProfileSchema
};
