// backend/errors/apiError.js
class APIError extends Error {
  /**
   * Create custom API Error
   * @param {string} message - Error message
   * @param {number} statusCode - HTTP status code
   * @param {Array} errors - Array of validation errors (optional)
   * @param {string} stack - Error stack trace (optional)
   */
  constructor(message, statusCode = 500, errors = [], stack = '') {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.errors = errors;
    this.isOperational = true;
    this.timestamp = new Date().toISOString();

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  /**
   * Format error for API response
   * @returns {Object} - Formatted error response
   */
  toJSON() {
    return {
      error: {
        name: this.name,
        message: this.message,
        statusCode: this.statusCode,
        timestamp: this.timestamp,
        ...(this.errors.length > 0 && { errors: this.errors }),
        ...(process.env.NODE_ENV === 'development' && { stack: this.stack })
      }
    };
  }
}

module.exports = { APIError };