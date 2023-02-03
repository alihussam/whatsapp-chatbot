import { Response } from 'express';

interface SuccessResponse {
	res: Response;
	data: unknown;
	meta?: unknown;
}

interface RedirectResponse {
	res: Response;
	url: string;
}

/**
 * Send success API response
 *
 * @param param0 - Function params
 * @param param0.res - Express response object
 * @param param0.data - Data
 * @param param0.meta - Meta data
 */
export function sendSuccessResponse({ res, data, meta }: SuccessResponse) {
	res.send({
		meta,
		data,
	});
}

/**
 * Send redirect response
 *
 * @param param0 - Function params
 * @param param0.res - Express response object
 * @param param0.url - Redirect URL
 */
export function redirectResponse({ res, url }: RedirectResponse) {
	res.redirect(url);
}
