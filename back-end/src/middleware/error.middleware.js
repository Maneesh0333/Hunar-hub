export const errorHandler = (err, req, res, next) => {
  console.error("ERROR 💥:", err);

  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  // ✅ Mongoose Validation Error
  if (err.name === "ValidationError") {
    statusCode = 400;
    const messages = Object.values(err.errors).map(val => val.message);
    message = messages.join(", ");
  }

  // ✅ Duplicate Key Error
  else if (err.code === 11000) {
    statusCode = 400;
    const field = Object.keys(err.keyValue)[0];
    message = `${field} already exists`;
  }

  // ✅ Invalid ObjectId
  else if (err.name === "CastError") {
    statusCode = 400;
    message = "Invalid ID format";
  }

  // ✅ Mongo / Network Errors (YOUR CASE)
  else if (
    err.message?.includes("ENOTFOUND") ||
    err.message?.includes("ECONNREFUSED") ||
    err.message?.includes("ETIMEDOUT")
  ) {
    statusCode = 503;
    message = "Service temporarily unavailable. Please try again later.";
  }

  // ✅ Production-safe response
  const isProduction = process.env.NODE_ENV === "production";

  return res.status(statusCode).json({
    success: false,
    message:
      isProduction && !err.isOperational
        ? "Something went wrong"
        : message,
  });
};