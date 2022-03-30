import { Request, Response } from 'express';

import asyncHandler from '../middlewares/async.middleware';
import UssdResponse, { UssdMenuParams } from '../helpers/UssdResponse';
import Menu from '../Menu.json';

const ussdController = asyncHandler(async (req: Request, res: Response) => {
	const body = req.body.ussddynmenurequest;
	const msisdn = body.msisdn[0];
	const sessionID = body.requestid[0];
	const starcode = body.starcode[0];
	const timestamp = body.timestamp[0];
	const cellID = body.dataset[0]['param'][1]['value'][0];
	const userdata = body.userdata[0].trim();

	const params: UssdMenuParams = {
		menu: Menu['0'],
		flag: 2,
		msisdn,
		sessionID,
		starcode,
		timestamp,
	};

	return res.status(200).send(UssdResponse(params));
});

export default ussdController;
