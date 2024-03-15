import {
    UrlToAPI
} from "./url_to_api.js";

import {
    XmlUtils
} from "../utils/json/xml_utils.js";

import {
    JSONUtils
} from "../utils/json/json_utils.js";

const _XML_UTILS = new XmlUtils();
const _JSON_UTILS = new JSONUtils();

const URL_TO_API_CUSTOMERS = new UrlToAPI().VALUE + "/customers";
const URL_TO_API_CUSTOMERS_FIND = URL_TO_API_CUSTOMERS + "/find";
const URL_TO_API_CUSTOMERS_FIND_EXISTS = URL_TO_API_CUSTOMERS_FIND + "/exists";

export class CustomersAPI {
    GET = new CustomersGETRequests();
    POST = new CustomersPOSTRequests();
    PATCH = new CustomersPATCHRequests();
}

class CustomersGETRequests {
    async getAllFilteredPagination(nickname, customerRoleCode, numberOfItems, lastCustomerIdOnPreviousPage) {
        let requestURL = new URL(URL_TO_API_CUSTOMERS + "/filtered_pagination");
        requestURL.searchParams.set("number_of_items", numberOfItems);

        if (nickname) {
            requestURL.searchParams.set("nickname", nickname);
        }
        if (customerRoleCode) {
            requestURL.searchParams.set("customer_role_code", customerRoleCode);
        }
        if (lastCustomerIdOnPreviousPage) {
            requestURL.searchParams.set("last_customer_id_on_previous_page", lastCustomerIdOnPreviousPage);
        }

        return await _XML_UTILS.getJSONResponseByGETXml(requestURL);
    }

    async findById(id) {
        let requestURL = new URL(URL_TO_API_CUSTOMERS_FIND + "/by_id");
        requestURL.searchParams.set("id", id);

        return await _XML_UTILS.getJSONResponseByGETXml(requestURL);
    }

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

class CustomersPOSTRequests {
    async register(customerRequestDTO) {
        let requestURL = new URL(URL_TO_API_CUSTOMERS + "/register");
        let jsonStr = _JSON_UTILS.stringify({
            'nickname': customerRequestDTO.nickname,
            'email': customerRequestDTO.email,
            'login': customerRequestDTO.login,
            'password': customerRequestDTO.password,
            'country_code': customerRequestDTO.countryCode
        });

        return await _XML_UTILS.getJSONResponseByPOSTXml(requestURL, jsonStr);
    }
}

class CustomersPATCHRequests {
    async changeRole(customerRequestDTO) {
        let requestURL = new URL(URL_TO_API_CUSTOMERS + "/change_role");
        let jsonStr = _JSON_UTILS.stringify({
            'id': customerRequestDTO.id,
            'role_code': customerRequestDTO.roleCode
        })

        return await _XML_UTILS.getJSONResponseByPATCHXml(requestURL, jsonStr);
    }
}
