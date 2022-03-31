import { getLastSession } from './../models/redisDB';
import messages from '../utils/messages/app.messages';
import option1 from './options/option1.service';

const optionHandler = async (sessionID: string) => {
	const request = await getLastSession(sessionID);

	switch (request.option) {
		case '1':
			return await option1(request);
		default:
			return { menu: messages.INVALID_OPTION, flag: 2 };
	}
};

export default optionHandler;
