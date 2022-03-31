import {
	popSession,
	clearSession,
	initSession,
	getLastSession,
} from './../models/redisDB';
import * as redisDB from '../models/redisDB';
import { ISession } from '../interfaces/IUssd';
import UssdError from '../utils/errors/UssdError';
import messages from '../utils/messages/app.messages';

const BUTTONS = {
	CANCEL: '99',
	MAIN: '00',
	BACK: '#',
};

export const emptyUserdataHandler = async (request: ISession) => {
	if (!request.userdata?.length) {
		const lastSession = await redisDB.getLastSession(request.sessionID);
		const menu = <string>lastSession.menu;
		throw new UssdError(menu, 1);
	}
};

export const backButtonHandler = async (request: ISession) => {
	if (request.userdata === BUTTONS.BACK) {
		await popSession(request.sessionID);
		const lastSession = await redisDB.getLastSession(request.sessionID);
		const menu = <string>lastSession.menu;
		throw new UssdError(menu, 1);
	}
};

export const mainButtonHandler = async (request: ISession) => {
	if (request.userdata === BUTTONS.MAIN) {
		await clearSession(request.sessionID);
		await initSession(request);
		const lastSession = await getLastSession(request.sessionID);
		const menu = <string>lastSession.menu;

		throw new UssdError(menu, 1);
	}
};

export const cancelButtonHandler = async (request: ISession) => {
	if (request.userdata === BUTTONS.CANCEL) {
		await clearSession(request.sessionID);
		const menu = messages.SESSION_CANCELLED;
		throw new UssdError(menu, 2);
	}
};

export const featuresHandler = async (request: ISession) => {
	await emptyUserdataHandler(request);
	await mainButtonHandler(request);
	await backButtonHandler(request);
	await cancelButtonHandler(request);
};
