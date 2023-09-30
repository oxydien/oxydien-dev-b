/**
 * Generates an "Ok" message object with optional request-specific information.
 * @param {Object} req - The request object from Express.js (optional).
 * @param {Object} data - The data to be included in the message (optional).
 * @returns {Object} - The message object containing status, message, method, path, and data.
 */
export function OkMessage(req, data = null) {
  const message = {
    status: 200,
    message: "OK",
  };

  if (req) {
    message.method = req.method;
    message.path = req.baseUrl + req.path;
  }

  if (data !== null) {
    message.data = data;
  }

  return message;
}

/**
 * Generates a "Bad Request" message object with optional request-specific information.
 * @param {Object} req - The request object from Express.js (optional).
 * @param {Object} data - The data to be included in the message (optional).
 * @returns {Object} - The message object containing status, message, method, path, and data.
 */
export function BadRequestMessage(req, data = null) {
  const message = {
    status: 400,
    message: "Bad Request",
  };

  if (req) {
    message.method = req.method;
    message.path = req.baseUrl + req.path;
  }

  if (data !== null) {
    message.data = data;
  }

  return message;
}

/**
 * Generates a "Unauthorized" message object with optional request-specific information.
 * @param {Object} req - The request object from Express.js (optional).
 * @returns {Object} - The message object containing status, message, method, path, and authorization.
 */
export function UnauthorizedMessage(req) {
  const message = {
    status: 401,
    message: "Unauthorized",
  };

  if (req) {
    message.method = req.method;
    message.path = req.baseUrl + req.path;
    message.authorization = req.headers.authorization;
  }

  return message;
}

/**
 * Generates a "Not Found" message object with optional request-specific information.
 * @param {Object} req - The request object from Express.js (optional).
 * @param {Object} data - The data to be included in the message (optional).
 * @returns {Object} - The message object containing status, message, method, path, and data.
 */
export function NotFoundMessage(req, data = null) {
  const message = {
    status: 404,
    message: "Not Found",
  };

  if (req) {
    message.method = req.method;
    message.path = req.baseUrl + req.path;
  }

  if (data !== null) {
    message.data = data;
  }

  return message;
}

/**
 * Generates a "Too Many Requests" message object with optional request-specific information.
 * @param {Object} req - The request object from Express.js (optional).
 * @returns {Object} - The message object containing status, message, method, path, notice, and rateLimit.
 */
export function TooManyRequestsMessage(req) {
  const message = {
    status: 429,
    message: "Too Many Requests",
  };

  if (req) {
    message.method = req.method;
    message.path = req.baseUrl + req.path;
    message.notice = "We apologize, but you are making requests too quickly.";
    message.rateLimit = "100 requests per 2 minutes MAX";
  } else {
    message.notice = "We apologize, but you are making requests too quickly.";
    message.rateLimit = "100 requests per 2 minutes MAX";
  }

  return message;
}

/**
 * Generates an "Internal Server Error" message object with optional request-specific information.
 * @param {Object} req - The request object from Express.js (optional).
 * @param {Object} error - The error object to be included in the message (optional).
 * @returns {Object} - The message object containing status, message, method, path, and error.
 */
export function InternalServerErrorMessage(req, error = null) {
  const message = {
    status: 500,
    message: "Internal Server Error",
  };

  if (req) {
    message.method = req.method;
    message.path = req.baseUrl + req.path;
  }

  if (error !== null) {
    message.error = error;
  }

  return message;
}
