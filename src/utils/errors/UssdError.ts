class UssdError extends Error {
	flag: number;

	constructor(menu: string, flag: number = 2) {
		super(menu);
		this.name = this.constructor.name;
		this.flag = flag;
	}
}

export default UssdError;
