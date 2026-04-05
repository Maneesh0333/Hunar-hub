import { asyncHandler } from "./async.middleware.js";

export const validate = (schema) =>
  asyncHandler(async (req, res, next) => {
    try {
      const validatedData = await schema.validate(req.body, {
        abortEarly: false,
        stripUnknown: true,
      });

      req.body = validatedData;
      next();
    } catch (err) {
      return res.status(400).json({
        success: false,
        message: err.errors
      })
    }
  });
