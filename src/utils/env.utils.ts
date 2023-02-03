import Joi from 'joi';

/**
 * All possible environment
 */
enum Environment {
	LOCAL = 'local',
	TEST = 'test',
	PRODUCTIONS = 'production',
}

// env interface
export interface EnvConfig {
	PORT: number;
	ROUTE_PREFIX: string;
	TWILIO_ACCOUNT_SID: string;
	TWILIO_AUTH_TOKEN: string;
	WHATSAPP_FROM_NUMBER: string;
}

// environment variable validation schema
const envConfigValidation = Joi.object({
	// by default app runs on PORT 8000
	PORT: Joi.number().default(8000),
	ROUTE_PREFIX: Joi.string().required(),
	TWILIO_ACCOUNT_SID: Joi.string().required(),
	TWILIO_AUTH_TOKEN: Joi.string().required(),
	WHATSAPP_FROM_NUMBER: Joi.string().required(),
}).unknown(true);

/**
 * To check if the current process is running in test mode
 */
export function isTestMode(): boolean {
	return [Environment.TEST].includes(process.env.NODE_ENV as Environment);
}

// validate
const { error, value } = envConfigValidation.validate(process.env);
if (error && !isTestMode()) {
	console.error(error);
	throw new Error('Environment variables validation failed');
}

// store env config and secret config
const envConfig = value as EnvConfig;

/**
 * Get env config
 */
export const getEnvConfig = (): EnvConfig => envConfig;

/**
 * Check if project is running in dev mode
 *
 * Environment that are considered dev: LOCAL, TEST
 *
 * @returns
 */
export function isDevMode(): boolean {
	return [Environment.LOCAL, Environment.TEST].includes(process.env.NODE_ENV as Environment);
}
