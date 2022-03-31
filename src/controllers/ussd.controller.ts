import { Request, Response } from 'express';

import asyncHandler from '../middlewares/async.middleware';
import deserialize from '../helpers/deserialize';
import messages from '../utils/messages/app.messages';
import sendUssdResponse from '../helpers/sendUssdResponse';
import ussdService from '../services/ussd.service';

const ussdController = asyncHandler(async (req: Request, res: Response) => {
	const { msisdn, sessionID, starcode, timestamp, userdata } = deserialize(
		req.body.ussddynmenurequest
	);

	const { menu, flag } = await ussdService({
		msisdn,
		sessionID,
		userdata,
	});

	return res.status(200).send(
		sendUssdResponse({
			menu: menu || messages.TECHNICAL_ISSUE,
			flag: flag || 2,
			msisdn,
			sessionID,
			starcode,
			timestamp,
		})
	);
});

export default ussdController;
