import { createClient } from 'redis';

import logger from '../utils/loggers/logger';

const client = createClient();

export const connectRedis = async () => {
	try {
		await client.connect();
		logger.info('Redis connected');
	} catch (error: any) {
		logger.error(error.message);
		process.exit(1);
	}
};

export default client;
