import {
    XmlUtils
} from "../utils/xml_utils.js";

import {
    UrlToAPI
} from "../url_to_api.js";

const _XML_UTILS = new XmlUtils();

const _URL_TO_API_CUSTOMER_ROLES = `${new UrlToAPI().VALUE}/customer_roles`;
const _URL_TO_API_CUSTOMER_ROLES_GET = `${_URL_TO_API_CUSTOMER_ROLES}/get`;
const _URL_TO_API_CUSTOMER_ROLES_FIND = `${_URL_TO_API_CUSTOMER_ROLES}/find`;

export class CustomerRolesAPI {
    GET = new CustomerRolesGETRequests();
}

class CustomerRolesGETRequests {
    async getAll() {
        let requestUrl = new URL(_URL_TO_API_CUSTOMER_ROLES_GET);

        return await _XML_UTILS.sendGET(requestUrl);
    }

    async findByCode(code) {
        let requestUrl = new URL(`${_URL_TO_API_CUSTOMER_ROLES_FIND}/by_code`);
        requestUrl.searchParams.set("code", code);

        return await _XML_UTILS.sendGET(requestUrl);
    }
}