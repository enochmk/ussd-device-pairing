import Menu from '../Menu.json';

interface IRequest {
	msisdn: string;
	userdata: string;
	sessionID: string;
}

const ussdService = async (request: IRequest) => {
	return {
		menu: Menu['0'],
		flag: 2,
	};
};

export default ussdService;
