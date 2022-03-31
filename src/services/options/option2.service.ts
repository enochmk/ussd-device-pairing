import {
	pushSession,
	getSessions,
	getLastSession,
	clearSession,
} from '../../models/redisDB';
import Menu from '../../Menu.json';
import { ISession } from '../../interfaces/IUssd';
import messages from '../../utils/messages/app.messages';
import UssdError from '../../utils/errors/UssdError';
import { validateMsisdn, validateCode } from '../../helpers/inputValidation';
import confirmPairing from '../../api/confirmPairing.api';

const OPTION_MENU = Menu['2'];

export default async (request: ISession) => {
	request.menu = OPTION_MENU['1'];
	let flag = 1;

	try {
		const sessions = await getSessions(request.sessionID);
		const lastSession = await getLastSession(request.sessionID);

		// ? No page, initiate session
		if (lastSession?.page === null) {
			request.menu = OPTION_MENU['1'];
			request.page = '1';
		}

		// ? Page 1
		if (lastSession?.page === '1') {
			validateMsisdn(request.userdata as string);

			request.page = '2';
			request.menu = OPTION_MENU['2'];
		}

		// ? Page 2
		if (lastSession?.page === '2') {
			const bPartyNumber = validateMsisdn(sessions[1].userdata as string);
			const code = validateCode(request.userdata as string);

			request.page = 'confirm';
			request.menu = OPTION_MENU['confirm']
				.replace('(B_PARTY_NUMBER)', bPartyNumber)
				.replace('(CODE)', code);
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
				const aPartyNumber = validateMsisdn(request.msisdn as string);
				const code = validateCode(sessions[2].userdata as string);

				request.menu = await confirmPairing(aPartyNumber, bPartyNumber, code);
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
