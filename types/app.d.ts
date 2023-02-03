/**
 * customized the 'Request' interface to define the below attributes on middleware
 */

declare namespace Express {
	export interface Request {
		rawBody: string | undefined;
	}
}
