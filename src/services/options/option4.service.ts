import { getPairedDevices } from './../../api/getPairingDevices.api';
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
import { getRemovePairDevices } from '../../api/getPairingDevices.api';
import UssdError from '../../utils/errors/UssdError';
import messages from '../../utils/messages/app.messages';
import getSelectedDevice from '../../api/getSelectedDevice.api';
import removePairing from '../../api/removePairing.api';

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
			request.menu = await getPairedDevices(aPartyNumber);

			if (!request.menu) {
				request.menu = OPTION_MENU['NO_PAIRED_DEVICE'];
				flag = 2;
			} else {
				request.menu =
					OPTION_MENU['UNPAIR_DEVICE_HEADER'] + '\n' + request.menu;
			}
		}

		// ? Page 1
		if (lastSession?.page === '1') {
			const aPartyNumber = validateMsisdn(request.msisdn);
			const option = validateOption(request.userdata as string);

			const bPartyNumber = await getSelectedDevice(aPartyNumber, option);

			request.page = 'confirm';
			request.menu = OPTION_MENU['confirm']
				.replace('(A_PARTY_NUMBER)', aPartyNumber)
				.replace('(B_PARTY_NUMBER)', bPartyNumber);
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
				const aPartyNumber = validateMsisdn(request.msisdn);
				const option = validateOption(sessions[1].userdata as string);
				request.menu = await removePairing(aPartyNumber, option);
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
