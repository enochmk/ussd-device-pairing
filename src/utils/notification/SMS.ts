import axios from 'axios';
import config from 'config';

const HOST = config.get('sms.host');
const USERNAME = config.get('sms.username');
const PASSWORD = config.get('sms.password');

const SMS = async (requestID: string, msisdn: string, text: string) => {
	// Replace # with %23
	text = text.replace('#', '%23');

	const URL = `http://${HOST}/send?username=${USERNAME}&password=${PASSWORD}&to=233${msisdn}&content=${text}`;

	try {
		const response = await axios.post(URL);

		return response;
	} catch (error: any) {
		return error.message;
	}
};

export default SMS;
