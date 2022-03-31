import { pushSession } from './../../models/redisDB';
import Menu from '../../Menu.json';
import { ISession } from './../../interfaces/IUssd';

const OPTION_MENU = Menu['1'];

export default async (request: ISession) => {
	request.menu = OPTION_MENU['1'];
	request.page = '1';

	await pushSession(request);

	return {
		menu: request.menu,
		flag: 1,
	};
};
