import express, { Express } from 'express';
import compress from 'compression';
import helmet from 'helmet';
import router from './routes';
import notFoundMiddleware from './middlewares/notFound.middleware';
import errorRequestMiddleware from './middlewares/errorRequest.middleware';
import { getEnvConfig } from './utils/env.utils';

/**
 * Get express app
 *
 * Since app creation relies on config which is async, this function is a wrapper to allow this
 */
export async function getExpressApp(): Promise<Express> {
	// destruct env variables and secrets to use
	const { ROUTE_PREFIX } = getEnvConfig();

	// create express app
	const app = express();

	app.use(express.json({ limit: '2mb' }));
	app.use(express.urlencoded({ extended: true }));

	// use gzip to compress re
	app.use(compress());
	// secure apps by setting various HTTP headers
	app.use(helmet());

	// routes
	app.use(ROUTE_PREFIX, router);

	/**
	 * Bind route not found error
	 */
	app.use(notFoundMiddleware);

	/**
	 * Bind global error request handler
	 */
	app.use(errorRequestMiddleware);

	return app;
}
