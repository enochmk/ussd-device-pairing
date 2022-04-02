import Menu from '../../Menu.json';
import UssdError from '../../utils/errors/UssdError';
import initiatePairing from '../../api/initiatePairing.api';
import messages from '../../utils/messages/app.messages';
import { ISession } from '../../interfaces/IUssd';
import { pushSession, getSessions, getLastSession, clearSession } from '../../models/redisDB';
import { validateMsisdn } from '../../helpers/inputValidation';

const OPTION_MENU = Menu['1'];

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
			const bPartyNumber = validateMsisdn(request.userdata as string);
			const aPartyNumber = validateMsisdn(request.msisdn);

			request.page = 'confirm';
			request.menu = OPTION_MENU.confirm
				.replace('(A_PARTY_NUMBER)', aPartyNumber)
				.replace('(B_PARTY_NUMBER)', bPartyNumber);
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

				request.menu = await initiatePairing(aPartyNumber, bPartyNumber);
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
