import * as db from '../models/redisDB';
import optionHandler from './optionHandler.service';
import { ISession } from './../interfaces/IUssd';
import { featuresHandler } from './feature.service';

const ussdService = async (request: ISession) => {
	const sessions: Array<ISession> = await db.getSessions(request.sessionID);

	// initiate session
	if (!sessions?.length) {
		const initSessions = await db.initSession(request);
		const lastSession = initSessions[initSessions.length - 1];
		const menu = lastSession.menu;
		const flag = lastSession.flag;

		return { menu, flag };
	}

	// read and handle user data
	await featuresHandler(request);

	// update previous session
	await db.updateSession(request);

	// option handler
	const response = await optionHandler(request.sessionID);

	// clear session if flag is 2
	if (response.flag === 2) {
		await db.clearSession(request.sessionID);
	}

	return { menu: response.menu, flag: response.flag };
};

export default ussdService;
