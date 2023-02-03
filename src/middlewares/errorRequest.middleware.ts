import { NextFunction, Request, Response } from 'express';
import { ValidationError } from 'express-validation';
import { RequestErrors } from '../constants';
import { ApiError } from '../libs/error.lib';
import { isDevMode } from '../utils/env.utils';

/**
 * Global express error request handler
 *
 * this is a global error handler to catch all request errors, format and respond to request
 * to pass a custom error to this handler from any route call next(error)
 */
export default (err: any, req: Request, res: Response, next: NextFunction) => {
	let finalError = err;

	/* Validation Error */
	if (finalError instanceof ValidationError) {
		/**
		 * Handling on flattened validation error
		 * make sure to use custom validation middleware in middleware dir
		 * or to set keyByField to true if using validate middleware directly
		 * or change this handling to handle detailed Validation error
		 * See: https://www.npmjs.com/package/express-validation
		 */
		// deep clone whole error
		finalError = new ApiError({ ...RequestErrors.ROUTE_VALIDATION_FAILED, meta: finalError.details });
	}

	/* Unexpected Error */
	if (finalError.name !== 'APIError') {
		// creating API error with no params create unkown error and hides the details
		finalError = new ApiError({});
	}

	// log this error since this is an unexpected error that we didn't created ourself
	console.error(`[ErrorRequest][Middleware] API error: `, finalError);

	/**
	 * Send error
	 *
	 * stack trace is sent only when the system is running in development mode
	 */
	res.status(finalError.statusCode).json({
		// error message
		error: finalError.message,
		errorKey: finalError.errorKey,
		meta: finalError.meta,
		stack: isDevMode() ? finalError.stack : {},
	});
};
