import { RequestErrors } from '../constants';

export const API_ERROR_NAME = 'APIError';

/**
 * Custom Error to send as APIResponse
 * @extends Error
 */
export class ApiError extends Error {
	/**
	 * Error key
	 */
	errorKey: string;

	/**
	 * Http status code
	 */
	statusCode: number;

	/**
	 * Error additional meta
	 */
	meta: any;

	/**
	 * API error constructor
	 *
	 * @param message - Custom error message
	 * @param errorKey - Error key
	 * @param statusCode - Status code
	 * @param meta - Additional meta for error
	 */
	constructor({
		message = RequestErrors.UNKOWN_PROBLEM.message,
		errorKey = RequestErrors.UNKOWN_PROBLEM.errorKey,
		statusCode = RequestErrors.UNKOWN_PROBLEM.statusCode,
		meta = {},
	}: {
		message?: string;
		errorKey?: string;
		statusCode?: number;
		meta?: any;
	}) {
		super(message);
		this.name = API_ERROR_NAME;
		this.errorKey = errorKey;
		this.statusCode = statusCode;
		this.meta = meta;
		// capture current stack trace
		Error.captureStackTrace(this, this.constructor);
	}
}
