import { Request, Response } from 'express';

import asyncHandler from '../middlewares/async.middleware';
import deserialize from '../helpers/deserialize';
import sendUssdResponse from '../helpers/sendUssdResponse';
import ussdService from '../services/ussd.service';

const ussdController = asyncHandler(async (req: Request, res: Response) => {
	const { msisdn, sessionID, starcode, timestamp, userdata } = deserialize(
		req.body.ussddynmenurequest
	);

	const { menu, flag } = await ussdService({
		msisdn,
		userdata,
		sessionID,
	});

	return res.status(200).send(
		sendUssdResponse({
			menu,
			flag,
			msisdn,
			sessionID,
			starcode,
			timestamp,
		})
	);
});

export default ussdController;
