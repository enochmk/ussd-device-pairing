import axios from 'axios';
import config from 'config';

import UssdError from '../utils/errors/UssdError';

const HOST = config.get('api.host');

const initiatePairing = async (aPartyNumber: string, bPartyNumber: string) => {
	const URL = `${HOST}/api/devicepairing/initiatepairing?initiator=${aPartyNumber}&aPartyNumber=${aPartyNumber}&bPartyNumber=${bPartyNumber}&channel=ussd`;

	try {
		const response = await axios.get(URL);
		return response.data;
	} catch (error: any) {
		throw new UssdError(error.message, 2);
	}
};

export default initiatePairing;
