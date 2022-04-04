import config from 'config';

import Menu from '../Menu.json';
import client from '../databases/redis';
import { ISession } from '../interfaces/IUssd';

const TIMER = config.get('redis.expiry') as number;

export const initSession = async (session: ISession) => {
	const sessions: Array<ISession> = [];

	session.menu = Menu.INIT;
	session.userdata = null;
	session.option = null;
	session.page = null;
	session.flag = 1;
	sessions.push(session);

	await client.set(session.sessionID, JSON.stringify(sessions), {
		EX: TIMER,
	});

	return sessions;
};

export const getSessions = async (sessionID: string) => {
	const sessionsInString = <string>await client.get(sessionID);
	const sessions: Array<ISession> = JSON.parse(sessionsInString);
	return sessions;
};

export const getLastSession = async (sessionID: string) => {
	const sessions = await getSessions(sessionID);
	const lastSession = sessions[sessions.length - 1];
	return lastSession;
};

export const pushSession = async (session: ISession) => {
	const sessions = await getSessions(session.sessionID);
	session.userdata = null;
	sessions.push(session);

	await client.set(session.sessionID, JSON.stringify(sessions), {
		EX: TIMER,
	});

	return sessions;
};

export const popSession = async (sessionID: string) => {
	const sessions = await getSessions(sessionID);
	if (sessions.length > 1) {
		sessions.pop();
		await client.set(sessionID, JSON.stringify(sessions), {
			EX: TIMER,
		});
	}

	// restart session
	if (sessions.length === 1) {
		await initSession(sessions[0]);
	}

	return sessions;
};

export const clearSession = async (sessionID: string) => {
	await client.del(sessionID);
};

export const updateSession = async (session: ISession) => {
	const sessions = await getSessions(session.sessionID);
	const lastSession = sessions[sessions.length - 1];

	// empty session data, do nothing
	if (!lastSession) return null;

	lastSession.option = lastSession?.option || session.userdata;
	lastSession.userdata = session.userdata;

	sessions.pop();
	sessions.push(lastSession);
	await client.set(session.sessionID, JSON.stringify(sessions), {
		EX: TIMER,
	});

	return sessions;
};
