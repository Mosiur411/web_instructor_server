
const errorMessageFormatter = (err) => {
  console.log(err)
  let code, message;
  if (err.code == 11000) {
    code = 400; // Bad Request
    message = 'Duplicate key error: The data already exists.';
  } else {
    // Handle HTTP status codes
    switch (err.statusCode) {
      case 400:
        code = 400;
        message = 'Bad Request: The request could not be understood or was missing required parameters.';
        break;
      case 401:
        code = 401;
        message = 'Unauthorized: Authentication failed or user does not have permissions for the desired action.';
        break;
      case 403:
        code = 403;
        message = 'Forbidden: Authentication succeeded but the authenticated user does not have access to the resource.';
        break;
      case 404:
        code = 404;
        message = 'Not Found: The requested resource could not be found.';
        break;
      case 500:
        code = 500;
        message = 'Internal Server Error: An error occurred on the server side.';
        break;
      default:
        code = 500; // Default to Internal Server Error
        message = 'An unknown error occurred.';
    }
  }
  return { code, error: message };
};

const getRandomString = () => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}


module.exports = {
  errorMessageFormatter,
  getRandomString
}