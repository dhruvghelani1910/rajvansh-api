const sendSuccess = (res, message = 'Success', data = null, statusCode = 200) => {
  return res.status(statusCode).json({
    IsSuccess: true,
    Message: message,
    Data: data,
    Status: statusCode
  });
};

const sendError = (res, message = 'Internal Server Error', error = null, statusCode = 500) => {
  return res.status(statusCode).json({
    IsSuccess: false,
    Message: message,
    Data: 0,
    Status: statusCode,
    error: error ? error.message || error : null
  });
};

export default {
  sendSuccess,
  sendError
};
