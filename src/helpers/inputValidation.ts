import UssdError from '../utils/errors/UssdError';

export const validateMsisdn = (msisdn: string) => {
	if (!msisdn) {
		throw new UssdError('Invalid MSISDN ', 2);
	}

	if (msisdn.length !== 9 && msisdn.length !== 10 && msisdn.length !== 12) {
		throw new UssdError('Invalid format. Number should be 9 digits. ', 2);
	}

	if (!msisdn.match(/^[0-9]+$/)) {
		throw new UssdError('Invalid MSISDN. MSISDN should be numeric. ', 2);
	}

	// get last 9 digits
	const last9Digits = msisdn.substr(msisdn.length - 9);

	return last9Digits;
};

export const validateCode = (code: string) => {
	if (!code) {
		throw new UssdError('Invalid Code. Please enter a valid code. ', 2);
	}

	if (code.length !== 4) {
		throw new UssdError('Invalid Code. Code should be 4 digits. ', 2);
	}

	if (!code.match(/^[0-9]+$/)) {
		throw new UssdError('Invalid Code. Code should be numeric. ', 2);
	}

	return code;
};

export const validateOption = (option: string) => {
	if (!option) {
		throw new UssdError('Invalid Option. Please enter a valid option. ', 2);
	}

	if (!option.match(/^[0-9]+$/)) {
		throw new UssdError('Invalid Option. Option should be numeric. ', 2);
	}

	return option;
};
