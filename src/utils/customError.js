const customError = (statusCode, message) => {
  // Validate status code
  if (!isValidStatusCode(statusCode)) {
    throw new Error("Invalid status code");
  }

  // Validate message
  if (!isValidMessage(message)) {
    throw new Error("Message must be a non-empty string");
  }

  // Create error object
  const error = new Error(message);
  error.name = `CustomError [Status ${statusCode}]`;
  error.statusCode = statusCode;

  // Capture stack trace
  Error.captureStackTrace(error, customError);

  return error;
};

// Helper function to validate status code
const isValidStatusCode = (statusCode) => {
  return Number.isInteger(statusCode) && statusCode >= 400 && statusCode < 600;
};

// Helper function to validate message
const isValidMessage = (message) => {
  return typeof message === "string" && message.trim() !== "";
};

export default customError;
