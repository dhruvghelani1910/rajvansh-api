export const onSuccess = (message, result, res) => {
	res.status(200).json({
		Message: message,
		Data: result,
		Status: 200,
		IsSuccess: true
	});
};

export const onError = (error, res) => {
	res.status(500).json({
		Message: error.message,
		Data: 0,
		Status: 500,
		IsSuccess: false
	});
};

export const sendSuccess = (res, message = 'Success', data = null, statusCode = 200) => {
	return res.status(statusCode).json({
		IsSuccess: true,
		Message: message,
		Data: data,
		Status: statusCode
	});
};

export const sendError = (res, message = 'Internal Server Error', error = null, statusCode = 500) => {
	return res.status(statusCode).json({
		IsSuccess: false,
		Message: message,
		Data: 0,
		Status: statusCode,
		error: error ? error.message || error : null
	});
};

export const unauthorisedRequest = (res) => {
	res.status(401).json({
		Message: "Unauthorized Request!",
		Data: 0,
		Status: 401,
		IsSuccess: false
	});
};

export const forbiddenRequest = (res) => {
	res.status(403).json({
		Message: "Access to the requested resource is forbidden! Contact Administrator.",
		Data: 0,
		Status: 403,
		IsSuccess: false
	});
};

export const badrequest = (error, res) => {
	res.status(400).json({
		Message: error.message || error,
		Data: 0,
		Status: 400,
		IsSuccess: false
	});
};

export const joiBadRequest = (err, res) => {
	res.status(400).json({
		Message: err.message,
		Data: 0,
		Status: 400,
		IsSuccess: false
	});
};

export const responseValidation = (responseStatusCode, responseStatusMsg, responseErrors) => {
	const responseValidationJson = {};
	responseValidationJson.status_code = responseStatusCode;
	responseValidationJson.status_message = responseStatusMsg;
	// errors
	if (responseErrors === undefined) {
		responseValidationJson.response_error = [];
	} else {
		responseValidationJson.response_error = responseErrors;
	}
	return responseValidationJson;
};

export default {
    onSuccess,
    onError,
    sendSuccess,
    sendError,
    unauthorisedRequest,
    forbiddenRequest,
    badrequest,
    joiBadRequest,
    responseValidation
};
