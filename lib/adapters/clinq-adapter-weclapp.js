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
        return new Promise((resolve, reject) => {
            resolve()
        })
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
            var number = new ClinqPhonenumber(contact.phone)
            var mapped = {
                "name":contact.firstName+" "+contact.lastName,
                phoneNumbers:[{"label":"", "phoneNumber":number.e123Number()}]
            }
            data.push(mapped);
        })
        return data
    }
}

module.exports = WeclappAdapter