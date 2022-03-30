import Messages from '../messages/app.messages';

class GeneralError extends Error {
	statusCode: number;

	constructor(system: string | null) {
		super(Messages.TECHNICAL_ISSUE);
		this.name = this.constructor.name;
		this.statusCode = 500;
	}
}

export default GeneralError;
