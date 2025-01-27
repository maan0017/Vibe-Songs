import chalk from 'chalk';
class apiResponse {
  constructor(statusCode, data, message = 'Success') {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
    this.success = statusCode < 400;
    console.log(`${chalk.green(message)}`);
  }
}

export { apiResponse };
