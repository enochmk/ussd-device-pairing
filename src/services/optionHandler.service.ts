import { getLastSession } from './../models/redisDB';
import messages from '../utils/messages/app.messages';
import option1 from './options/option1.service';
import option2 from './options/option2.service';
import option3 from './options/option3.service';
import option4 from './options/option4.service';

const optionHandler = async (sessionID: string) => {
	const request = await getLastSession(sessionID);

	switch (request.option) {
		case '1':
			return await option1(request);
		case '2':
			return await option2(request);
		case '3':
			return await option3(request);
		case '4':
			return await option4(request);
		default:
			return { menu: messages.INVALID_OPTION, flag: 2 };
	}
};

export default optionHandler;
