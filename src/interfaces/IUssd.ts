export interface ISession {
	msisdn: string;
	sessionID: string;
	flag?: number | null;
	userdata?: string | null;
	menu?: string;
	option?: string | null;
	page?: string | null;
}
