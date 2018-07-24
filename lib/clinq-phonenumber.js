class ClinqPhonenumber {
	constructor(number) {
		if (!number.match(/[0-9]/)) throw new Error("Not a valid phone number");
		let e164Number = number.replace(/[^0-9\+]/gi, "");
		e164Number = e164Number.replace(/^00/, "");
		e164Number = e164Number.replace(/^\+/, "");
		e164Number = e164Number.replace(/^0/, "49");
		this.e164Number = e164Number;
	}

	e164Number() {
		return this.e164Number;
	}

	e123Number() {
		return "+" + this.e164Number;
	}
}

module.exports = ClinqPhonenumber;
