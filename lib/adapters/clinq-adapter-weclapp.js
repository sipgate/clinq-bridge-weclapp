const ClinqPhonenumber = require("../clinq-phonenumber");
const axios = require("axios");

const CONTACT_ENDPOINT = "/contact";
const API_BASE_PATH = "/webapp/api/v1/";

class WeclappAdapter {
	constructor(apiUrl, apiKey) {
		this.apiKey = apiKey;
		this.fetcher = axios.create({
			baseURL: `${apiUrl}${API_BASE_PATH}`,
			headers: { AuthenticationToken: apiKey }
		});
		this.getContacts = this.getContacts.bind(this);
		this.mapContacts = this.mapContacts.bind(this);
	}

	async getContacts() {
		const result = await this.fetcher(CONTACT_ENDPOINT, { get: "GET" });
		return this.mapContacts(result.data.result);
	}

	mapContacts(input) {
		var data = [];
		console.log(input);
		input.forEach(contact => {
			if (contact.phone || contact.mobilePhone1) {
				var phoneNumbers = [];
				if (contact.phone) {
					var number = new ClinqPhonenumber(contact.phone);
					phoneNumbers.push({ label: "Landline", phoneNumber: number.e123Number() });
				}
				if (contact.mobilePhone1) {
					var number = new ClinqPhonenumber(contact.mobilePhone1);
					phoneNumbers.push({ label: "Mobile", phoneNumber: number.e123Number() });
				}
				const mapped = {
					id: contact.id,
					email: contact.email || null,
					company: contact.personCompany || null,
					name: `${contact.firstName} ${contact.lastName}`,
					phoneNumbers: phoneNumbers
				};
				data.push(mapped);
			}
		});
		return data;
	}
}

module.exports = WeclappAdapter;
