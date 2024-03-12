import {
    XmlUtils
} from "../utils/json/xml_utils.js";

import {
    UrlToAPI
} from "./url_to_api.js";

const _XML_UTILS = new XmlUtils();

const URL_TO_API_CUSTOMER_ROLES = new UrlToAPI().VALUE + "/customer_roles";
export class CustomerRolesAPI {
    GET = new CustomerRolesGETRequests();
}

class CustomerRolesGETRequests {
    async getAll() {
        let requestUrl = new URL(URL_TO_API_CUSTOMER_ROLES);

        return await _XML_UTILS.getJSONResponseByGETXml(requestUrl);
    }
}