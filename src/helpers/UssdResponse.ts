export interface UssdMenuParams {
	msisdn: string;
	sessionID: string;
	starcode: string;
	flag: 1 | 2;
	menu: string;
	timestamp: string;
}

const UssdResponse = (params: UssdMenuParams): string => {
	if (params.msisdn.length === 9) {
		params.msisdn = `233${params.msisdn}`;
	}

	const xmlResponse = `
		<?xml version="1.0" encoding="utf-8"?>
		<USSDDynMenuResponse>
			<requestId>${params.sessionID}</requestId>
			<sessionId>${params.sessionID}</sessionId>
			<msisdn>${params.msisdn}</msisdn>
			<starCode>${params.starcode}</starCode>
			<langId>null</langId>
			<encodingScheme>0</encodingScheme>
			<dataSet>
				<param>
					<id>1</id>
					<value>\n${params.menu}\n</value>
					<rspFlag>${params.flag}</rspFlag>
					<default>1</default>
				</param>
			</dataSet>
			<ErrCode>1</ErrCode>
			<timeStamp>${params.timestamp}</timeStamp>
		</USSDDynMenuResponse>
	`;

	return xmlResponse;
};

export default UssdResponse;
