// src/errors/app-error.js
export function createAppError(code, message, statusCode, details, cause) {
  const err = new Error(message, { cause });

  err.name = "AppError";
  err.isAppError = true;

  err.code = code;
  err.statusCode = Number.isInteger(statusCode) ? statusCode : 500;

  if (details !== undefined) {
    err.details = details;
  }

  if (Error.captureStackTrace) {
    Error.captureStackTrace(err, createAppError);
  }

  return err;
}
