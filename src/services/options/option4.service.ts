import { getSessions } from './../../models/redisDB';
import { validateOption } from '../../helpers/inputValidation';
import {
	pushSession,
	getLastSession,
	clearSession,
} from '../../models/redisDB';
import Menu from '../../Menu.json';
import { ISession } from '../../interfaces/IUssd';
import { validateMsisdn } from '../../helpers/inputValidation';
import getPairingDevices from '../../api/getPairingDevices.api';
import UssdError from '../../utils/errors/UssdError';
import messages from '../../utils/messages/app.messages';

const OPTION_MENU = Menu['4'];

export default async (request: ISession) => {
	request.menu = OPTION_MENU['1'];
	let flag = 1;

	try {
		const sessions = await getSessions(request.sessionID);
		const lastSession = await getLastSession(request.sessionID);

		// ? No page, initiate session
		if (lastSession?.page === null) {
			request.page = '1';
			const aPartyNumber = validateMsisdn(request.msisdn);
			request.menu = await getPairingDevices(aPartyNumber);
		}

		// ? Page 1
		if (lastSession?.page === '1') {
			const aPartyNumber = validateMsisdn(request.msisdn);
			const option = validateOption(request.userdata as string);

			request.menu = OPTION_MENU['confirm'];
			flag = 1;
		}

		// * Confirm
		if (lastSession?.page === 'confirm') {
			// check userdata
			if (!['1', '2'].includes(lastSession?.userdata || '')) {
				throw new UssdError(messages.INVALID_INPUT, 2);
			}

			// ! cancel
			if (lastSession?.userdata === '2') {
				throw new UssdError(messages.SESSION_CANCELLED, 2);
			}

			// * user confirmed
			if (lastSession?.userdata === '1') {
				// ! validate MSISDN
				const bPartyNumber = validateMsisdn(sessions[1].userdata as string);
				const aPartyNumber = validateMsisdn(request.msisdn);

				request.menu = '';
				flag = 2;
			}
		}

		await pushSession(request);

		return {
			menu: request.menu,
			flag,
		};
	} catch (error: any) {
		await clearSession(request.sessionID);
		return {
			menu: error.message,
			flag: error.flag,
		};
	}
};
