/**
 * Uncaught exception handler
 *
 * @todo handle trusted errors, the ones which shouldn't terminate the process
 * Unkown/untrusted errors should terminate the server
 *
 * @param error - Uncaught error
 */
export function uncaughtExceptionHandler(error: Error) {
	console.error(`Uncaught exception`, error);
}

/**
 * Un-handled promise rejection handler
 *
 * @todo cleanup open db connections here
 *
 * Most of the time the unhandledRejection will be an Error, but this should not be relied upon
 * as *anything* can be thrown/rejected, it is therefore unsafe to assume the the value is an Error.
 *
 * @param reason - Reason
 * @param promise - Promise that was rejected
 */
export function unhandledRejectionHandler(reason: unknown, promise: Promise<unknown>) {
	console.error(`Unhandled promise rejection`, reason);
}

/**
 * Signal interrupt handler
 *
 * @todo cleanup open db connections here
 *
 * Used to handle graceful termination of app
 */
export function signalInterruptHandler() {
	console.log(`Service gracefully terminated`);
	process.exit(0);
}
