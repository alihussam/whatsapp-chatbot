import {
	signalInterruptHandler,
	uncaughtExceptionHandler,
	unhandledRejectionHandler,
} from './utils/errorHandlers.utils';
import { getEnvConfig } from './utils/env.utils';
import { getExpressApp } from './app';

// get env config
const { PORT } = getEnvConfig();

/**
 * Get express app and start server
 */
getExpressApp().then((app) => {
	// start the app
	app.listen(PORT, () => {
		console.log(`Service listening on port ${PORT}!`);
	});
});

/**
 * Bind uncaught exception handler
 */
process.on('uncaughtException', uncaughtExceptionHandler);

/**
 * Bind un-handled promise rejection handler
 */
process.on('unhandledRejection', unhandledRejectionHandler);

/**
 * Bind interrupt signal handler for graceful termination
 */
process.on('SIGINT', signalInterruptHandler);
