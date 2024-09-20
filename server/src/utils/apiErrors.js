import chalk from 'chalk';
class apiErrors extends Error {
  constructor(statusCode, message = 'someting went wrong', errors = [], stack = '') {
    super(message);
    this.statusCode = statusCode;
    this.data = null;
    this.message = chalk.red(`${message}`);
    this.success = false;
    this.errors = errors;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export { apiErrors };
