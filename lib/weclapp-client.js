const axios = require("axios");

const CONTACT_ENDPOINT = "/contact";
const API_BASE_PATH = "/webapp/api/v1/";

function sanitizePhoneNumber(number) {
  return number.replace(/[ ]/g);
}

class WeclappClient {
  constructor(apiUrl, apiKey) {
    this.apiKey = apiKey;
    this.fetcher = axios.create({
      baseURL: `${apiUrl}${API_BASE_PATH}`,
      headers: { AuthenticationToken: apiKey },
    });
    this.getContacts = this.getContacts.bind(this);
    this.mapContacts = this.mapContacts.bind(this);
  }

  async getContacts(page = 1, pageSize = 1000, acc = []) {
    try {
      const result = await this.fetcher.get(CONTACT_ENDPOINT, {
        params: { page, pageSize },
      });

      const contacts = this.mapContacts(result.data.result);
      const mergedContacts = [...acc, ...contacts];

      if (result.data.result.length >= pageSize) {
        return this.getContacts(page + 1, pageSize, mergedContacts);
      }

      return mergedContacts;
    } catch (e) {
      console.warn("Failed to fetch contacts", e);
      throw e;
    }
  }

  mapContacts(input) {
    var data = [];
    input.forEach((contact) => {
      if (contact.phone || contact.mobilePhone1) {
        var phoneNumbers = [];
        if (contact.phone) {
          phoneNumbers.push({
            label: "Landline",
            phoneNumber: sanitizePhoneNumber(contact.phone),
          });
        }
        if (contact.mobilePhone1) {
          phoneNumbers.push({
            label: "Mobile",
            phoneNumber: sanitizePhoneNumber(contact.mobilePhone1),
          });
        }
        const mapped = {
          id: contact.id,
          email: contact.email || null,
          organization: contact.personCompany || null,
          name:
            contact.firstName && contact.lastName
              ? `${contact.firstName} ${contact.lastName}`
              : null,
          firstName: contact.firstName || null,
          lastName: contact.lastName || null,
          contactUrl: null,
          avatarUrl: null,
          phoneNumbers: phoneNumbers,
        };
        data.push(mapped);
      }
    });
    return data;
  }
}

module.exports = WeclappClient;
