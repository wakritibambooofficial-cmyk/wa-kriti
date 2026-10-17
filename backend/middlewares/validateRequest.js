
// const ApiError = require('../utils/ApiError');

// const validateRequest = (schema) => (req, res, next) => {
//   const result = schema.safeParse(req.body);

//   if (!result.success) {
//     console.log('\n========== VALIDATION FAILED ==========');
//     console.log('Request Body:');
//     console.dir(req.body, { depth: null });

//     console.log('\nZod Errors:');
//     console.dir(result.error.errors, { depth: null });

//     console.log('=======================================\n');

//     const errors = result.error.errors.map((e) => ({
//       field: e.path.join('.'),
//       message: e.message,
//     }));

//     return next(new ApiError(422, 'Validation failed', errors));
//   }

//   req.body = result.data;
//   next();
// };

// module.exports = validateRequest;

const ApiError = require('../utils/ApiError');

/**
 * FIX: the request body was previously logged to the console in full on
 * every validation failure, unconditionally — including in production.
 * That body can contain phone numbers, addresses, and (on auth-adjacent
 * routes) raw passwords, all of which would then sit in server logs
 * indefinitely. This is now gated to non-production environments only.
 * The Zod error details (field names + messages) are still returned to
 * the client via ApiError either way, so the API's behavior is unchanged
 * — only server-side console logging is affected.
 */
const validateRequest = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);

  if (!result.success) {
    if (process.env.NODE_ENV !== 'production') {
      console.log('\n========== VALIDATION FAILED ==========');
      console.log('Request Body:');
      console.dir(req.body, { depth: null });

      console.log('\nZod Errors:');
      console.dir(result.error.errors, { depth: null });

      console.log('=======================================\n');
    }

    const errors = result.error.errors.map((e) => ({
      field: e.path.join('.'),
      message: e.message,
    }));

    return next(new ApiError(422, 'Validation failed', errors));
  }

  req.body = result.data;
  next();
};

module.exports = validateRequest;