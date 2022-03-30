const deserialize = (body: any) => {
	const msisdn = body.msisdn[0] as string;
	const sessionID = body.requestid[0] as string;
	const starcode = body.starcode[0] as string;
	const timestamp = body.timestamp[0] as string;
	const userdata = body.userdata[0].trim() as string;

	return {
		msisdn,
		sessionID,
		starcode,
		timestamp,
		userdata,
	};
};

export default deserialize;
