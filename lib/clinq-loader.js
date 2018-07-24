const ClinqTools = require("./clinq-tools");

class ClinqLoader {
	constructor(adapter) {
		this.adapter = adapter;
		this.cache = [];
		this.fetchContacts = this.fetchContacts.bind(this);
		this.populateCache = this.populateCache.bind(this);
	}

	async populateCache(client, apiKey) {
		if (!this.cache[apiKey]) {
			this.cache[apiKey] = {
				loaded: true,
				list: []
			};
		}

		const cacheEntry = this.cache[apiKey];

		if (!cacheEntry || !cacheEntry.loaded) {
			return;
		}

		try {
			cacheEntry.loaded = false;

			const list = await client.getContacts();

			console.log(`Filled cache: ${ClinqTools.anonymizeKey(apiKey)} (${list.length} contacts)`);

			this.cache[apiKey] = {
				loaded: true,
				list
			};
		} catch (error) {
			delete this.cache[apiKey];
			throw error;
		}
	}

	async fetchContacts(apiKey, apiUrl) {
		const client = new this.adapter(apiUrl, apiKey);
		if (this.cache[apiKey]) {
			this.populateCache(client, apiKey);
		} else {
			await this.populateCache(client, apiKey);
		}
		return this.cache[apiKey].list;
	}
}

module.exports = ClinqLoader;
