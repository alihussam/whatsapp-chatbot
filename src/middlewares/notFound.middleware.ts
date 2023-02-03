import { NextFunction, Request, Response } from 'express';
import { RequestErrors } from '../constants';
import { ApiError } from '../libs/error.lib';

/**
 * Route not found handler
 *
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Next function handler
 */
export default (req: Request, res: Response, next: NextFunction) => {
	next(new ApiError(RequestErrors.ROUTE_NOT_FOUND));
};
