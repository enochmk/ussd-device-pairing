import axios from 'axios';
import config from 'config';

import UssdError from '../utils/errors/UssdError';

const HOST = config.get('api.host');

const removePairing = async (aPartyNumber: string, option: string) => {
	const URL = `${HOST}/api/devicepairing/removePairingWithOption?initiator=${aPartyNumber}&aPartyNumber=${aPartyNumber}&option=${option}&channel=ussd`;

	try {
		const response = await axios.get(URL);
		return response.data;
	} catch (error: any) {
		throw new UssdError(error.message, 2);
	}
};

export default removePairing;
