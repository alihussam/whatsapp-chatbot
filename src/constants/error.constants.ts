import httpStatus from 'http-status';

/**
 * All request errors
 */
export const RequestErrors = {
	ROUTE_NOT_FOUND: {
		errorKey: 'ROUTE_NOT_FOUND',
		statusCode: httpStatus.NOT_FOUND,
		message: 'Route your are trying to access does not exist',
	},
	FORBIDDEN_ROUTE: {
		errorKey: 'FORBIDDEN_ROUTE',
		statusCode: httpStatus.FORBIDDEN,
		message: 'You do not have sufficient permissions to access this route',
	},
	ROUTE_VALIDATION_FAILED: {
		errorKey: 'ROUTE_VALIDATION_FAILED',
		statusCode: httpStatus.BAD_REQUEST,
		message: 'Routes validation failed',
	},
	// this is used for any internal server error
	UNKOWN_PROBLEM: {
		errorKey: 'UNKOWN_PROBLEM',
		statusCode: httpStatus.INTERNAL_SERVER_ERROR,
		message: 'An unkown problem occured while processing your request',
	},
};
