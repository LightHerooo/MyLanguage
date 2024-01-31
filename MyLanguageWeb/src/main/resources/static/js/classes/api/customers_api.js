import {
    UrlToAPI
} from "./url_to_api.js";

import {
    XmlUtils
} from "../utils/json/xml_utils.js";

const _XML_UTILS = new XmlUtils();

const URL_TO_API_CUSTOMERS = new UrlToAPI().VALUE + "/customers";
const URL_TO_API_CUSTOMERS_FIND = URL_TO_API_CUSTOMERS + "/find";
const URL_TO_API_CUSTOMERS_FIND_EXISTS = URL_TO_API_CUSTOMERS_FIND + "/exists";

export class CustomersAPI {
    GET = new CustomersGETRequests();
}

class CustomersGETRequests {
    async findExistsByLogin(login) {
        let requestURL = new URL(URL_TO_API_CUSTOMERS_FIND_EXISTS + "/by_login");
        requestURL.searchParams.set("login", login);

        return await _XML_UTILS.getJSONResponseByGETXml(requestURL);
    }

    async findExistsByEmail(email) {
        let requestURL = new URL(URL_TO_API_CUSTOMERS_FIND_EXISTS + "/by_email");
        requestURL.searchParams.set("email", email);

        return await _XML_UTILS.getJSONResponseByGETXml(requestURL);
    }

    async findExistsByNickname(nickname) {
        let requestURL = new URL(URL_TO_API_CUSTOMERS_FIND_EXISTS + "/by_nickname");
        requestURL.searchParams.set("nickname", nickname);

        return await _XML_UTILS.getJSONResponseByGETXml(requestURL);
    }
}
