import dotenv from 'dotenv';

dotenv.config();

const config = {
	port: process.env.PORT,
	env: process.env.NODE_ENV,
	logger: {
		console: true,
		path: '',
	},
	sms: {
		host: `${process.env.SMS_HOST}:${process.env.SMS_PORT}`,
		username: process.env.SMS_USERNAME,
		password: process.env.SMS_PASSWORD,
	},
	redis: {
		expiry: 600000,
	},
};

export default config;
