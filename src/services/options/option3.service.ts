import Menu from '../../Menu.json';
import checkBalance from '../../api/checkBalance.api';
import { ISession } from '../../interfaces/IUssd';
import { getPairedDevices } from '../../api/getPairingDevices.api';
import { pushSession, getLastSession, clearSession } from '../../models/redisDB';
import { validateOption, validateMsisdn } from '../../helpers/inputValidation';

const OPTION_MENU = Menu['3'];

export default async (request: ISession) => {
	request.menu = OPTION_MENU['1'];
	let flag = 1;

	try {
		const lastSession = await getLastSession(request.sessionID);

		// ? No page, initiate session
		if (lastSession?.page === null) {
			request.page = '1';
			const aPartyNumber = validateMsisdn(request.msisdn);
			request.menu = await getPairedDevices(aPartyNumber);

			if (!request.menu) {
				request.menu = OPTION_MENU.NO_PAIRED_DEVICE;
				flag = 2;
			} else {
				request.menu = `${OPTION_MENU.NO_PAIRED_DEVICE}\n${request.menu}`;
			}
		}

		// * Get Balance
		if (lastSession?.page === '1') {
			const aPartyNumber = validateMsisdn(request.msisdn);
			const option = validateOption(request.userdata as string);
			request.menu = await checkBalance(aPartyNumber, option);
			flag = 2;
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
