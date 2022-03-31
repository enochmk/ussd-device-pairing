import { NextFunction, Request, Response } from 'express';
import moment from 'moment';

import HttpError from '../utils/errors/HttpError';
import messages from '../utils/messages/app.messages';
import logger from '../utils/loggers/logger';
import deserialize from '../helpers/deserialize';
import sendUssdResponse, { UssdMenuParams } from '../helpers/sendUssdResponse';
import UssdError from '../utils/errors/UssdError';

// eslint-disable-next-line
const errorHandler = (
	error: any,
	req: Request,
	res: Response,
	_next: NextFunction
) => {
	const { ussddynmenurequest } = req.body;
	const { msisdn, sessionID, starcode, timestamp } =
		deserialize(ussddynmenurequest);

	const params: UssdMenuParams = {
		menu: error.message,
		flag: 2,
		msisdn,
		sessionID,
		starcode,
		timestamp,
	};

	const context = {
		user: 'ErrorHandler',
		label: error.system,
		requestID: sessionID,
		endpoint: req.originalUrl,
		request: {
			data: params,
		},
		error: { ...error },
	};

	const response = {
		timestamp: moment(),
		requestID: sessionID,
		message: error.message,
	};

	// HTTP Handler
	if (error instanceof UssdError) {
		logger.warn(error.message, { context });
		params.flag = error.flag;
		return res.send(sendUssdResponse(params));
	}

	// ! Generic Error handler
	response.message = messages.TECHNICAL_ISSUE;
	error.statusCode = 500;
	logger.error(error.message, { context });

	return res.status(error.statusCode).json(response);
};

export default errorHandler;
