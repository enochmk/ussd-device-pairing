import axios from 'axios';
import config from 'config';

import UssdError from '../utils/errors/UssdError';

const HOST = config.get('api.host');

const confirmPairing = async (
	aPartyNumber: string,
	bPartyNumber: string,
	code: string
) => {
	const URL = `${HOST}/api/devicepairing/confirmPairing?initiator=${aPartyNumber}&aPartyNumber=${aPartyNumber}&bPartyNumber=${bPartyNumber}&pin=${code}&channel=ussd`;

	try {
		const response = await axios.get(URL);
		return response.data;
	} catch (error: any) {
		throw new UssdError(error.message, 2);
	}
};

export default confirmPairing;
