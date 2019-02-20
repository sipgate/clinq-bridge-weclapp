const { start, ServerError } = require("@clinq/bridge");
const WeclappClient = require("./lib/weclapp-client");

const adapter = {
	getContacts: async ({ apiKey, apiUrl }) => {
		try {
			return await new WeclappClient(apiUrl, apiKey).getContacts();
		} catch (error) {
			throw new ServerError(401);
		}
	}
};

start(adapter);
