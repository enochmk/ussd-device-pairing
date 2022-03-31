import axios from 'axios';
import config from 'config';

import UssdError from '../utils/errors/UssdError';

const HOST = config.get('api.host');

const getPairingDevices = async (aPartyNumber: string) => {
	const URL = `${HOST}/api/devicepairing/getPairedDevices?initiator=${aPartyNumber}&aPartyNumber=${aPartyNumber}&channel=ussd`;

	try {
		const response = await axios.get(URL);
		return response.data;
	} catch (error: any) {
		throw new UssdError(error.message, 2);
	}
};

export default getPairingDevices;