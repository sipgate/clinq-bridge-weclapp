const ClinqPhonenumber = require('../clinq-phonenumber')
const axios = require('axios');

class WeclappAdapter {
    constructor(apiUrl, apiKey) {
        this.apiKey = apiKey;
        this.fetcher = axios.create({
            baseURL: apiUrl+"/webapp/api/v1/",
            headers: {'AuthenticationToken': apiKey}
        }) 
        this.getContacts = this.getContacts.bind(this)
        this.mapContacts = this.mapContacts.bind(this)
    }

    login() {
        var endpoint = "/contact"
        return this.fetcher(endpoint, {get:"GET"})
    }

    getContacts(page) {
        var endpoint = "/contact"
        return this.fetcher(endpoint, {get:"GET"}).then((data) => {
            return {"contacts":data.data.result, "more":false, "next_page":""};
        })
    }

    mapContacts(input) {
        var data =[];
        input.forEach(contact => {
            if (contact.phone || contact.mobilePhone1) {
                var nums = [];
                if (contact.phone) {
                    var number = new ClinqPhonenumber(contact.phone)
                    nums.push({"label":"Landline", "phoneNumber":number.e123Number()})
                }
                if (contact.mobilePhone1) {
                    var number = new ClinqPhonenumber(contact.mobilePhone1)
                    nums.push({"label":"Mobile", "phoneNumber":number.e123Number()})
                }
                var mapped = {
                    "name":contact.firstName+" "+contact.lastName,
                    phoneNumbers:nums
                }
                data.push(mapped);
            }
        })
        return data
    }
}

module.exports = WeclappAdapter