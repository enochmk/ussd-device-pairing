import axios from 'axios';
import config from 'config';

import UssdError from '../utils/errors/UssdError';
import messages from '../utils/messages/app.messages';

const HOST = config.get('api.host');

const getSelectedDevice = async (aPartyNumber: string, option: string) => {
	const URL = `${HOST}/api/devicepairing/getMsisdnOfSelectedPairedDevice?initiator=${aPartyNumber}&aPartyNumber=${aPartyNumber}&option=${option}&channel=ussd`;

	try {
		const response = await axios.get(URL);
		if (!response.data) throw new UssdError(messages.INVALID_INPUT, 2);

		return response.data;
	} catch (error: any) {
		throw new UssdError(error.message, 2);
	}
};

export default getSelectedDevice;
