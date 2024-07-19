import {
    XmlUtils
} from "../utils/xml_utils.js";

import {
    JSONUtils
} from "../utils/json_utils.js";

import {
    FormDataUtils
} from "../utils/form_data_utils.js";

import {
    HttpMethods
} from "../classes/http/http_methods.js";

import {
    UrlPaths
} from "../../url/path/url_paths.js";

const _XML_UTILS = new XmlUtils();
const _JSON_UTILS = new JSONUtils();
const _HTTP_METHODS = new HttpMethods();
const _FORM_DATA_UTILS = new FormDataUtils();

const _URL_TO_API_CUSTOMERS = `${new UrlPaths().API.createFullPath()}/customers`;
const _URL_TO_API_CUSTOMERS_GET = `${_URL_TO_API_CUSTOMERS}/get`;
const _URL_TO_API_CUSTOMERS_FIND = `${_URL_TO_API_CUSTOMERS}/find`;
const _URL_TO_API_CUSTOMERS_EXISTS = `${_URL_TO_API_CUSTOMERS}/exists`;
const _URL_TO_API_CUSTOMERS_VALIDATE = `${_URL_TO_API_CUSTOMERS}/validate`;
const _URL_TO_API_CUSTOMERS_EDIT = `${_URL_TO_API_CUSTOMERS}/edit`;

export class CustomersAPI {
    GET = new CustomersGETRequests();
    POST = new CustomersPOSTRequests();
    PATCH = new CustomersPATCHRequests();
}

class CustomersGETRequests {
    async getAll(nickname, customerRoleCode, numberOfItems, lastCustomerIdOnPreviousPage) {
        let requestURL = new URL(_URL_TO_API_CUSTOMERS_GET);
        if (nickname) {
            requestURL.searchParams.set("nickname", nickname);
        }
        if (customerRoleCode) {
            requestURL.searchParams.set("customer_role_code", customerRoleCode);
        }
        if (numberOfItems) {
            requestURL.searchParams.set("number_of_items", numberOfItems);
        }
        if (lastCustomerIdOnPreviousPage) {
            requestURL.searchParams.set("last_customer_id_on_previous_page", lastCustomerIdOnPreviousPage);
        }

        return await _XML_UTILS.sendGET(requestURL);
    }

    async findById(id) {
        let requestURL = new URL(`${_URL_TO_API_CUSTOMERS_FIND}/by_id`);
        requestURL.searchParams.set("id", id);

        return await _XML_UTILS.sendGET(requestURL);
    }

    async findByNickname(nickname) {
        let requestURL = new URL(`${_URL_TO_API_CUSTOMERS_FIND}/by_nickname`);
        requestURL.searchParams.set("nickname", nickname);

        return await _XML_UTILS.sendGET(requestURL);
    }

    async isExistsByNickname(nickname) {
        let requestURL = new URL(`${_URL_TO_API_CUSTOMERS_EXISTS}/by_nickname`);
        requestURL.searchParams.set("nickname", nickname);

        return await _XML_UTILS.sendGET(requestURL);
    }

    async isExistsByLogin(login) {
        let requestURL = new URL(`${_URL_TO_API_CUSTOMERS_EXISTS}/by_login`);
        requestURL.searchParams.set("login", login);

        return await _XML_UTILS.sendGET(requestURL);
    }

    async isExistsByEmail(email) {
        let requestURL = new URL(`${_URL_TO_API_CUSTOMERS_EXISTS}/by_email`);
        requestURL.searchParams.set("email", email);

        return await _XML_UTILS.sendGET(requestURL);
    }

    async validateIsSuperUser(id) {
        let requestURL = new URL(`${_URL_TO_API_CUSTOMERS_VALIDATE}/is_super_user`);
        requestURL.searchParams.set("id", id);

        return await _XML_UTILS.sendGET(requestURL);
    }
}

class CustomersPOSTRequests {
    #currentHttpMethod = _HTTP_METHODS.POST;
    async register(customerAddRequestDTOObj) {
        let requestURL = new URL(`${_URL_TO_API_CUSTOMERS}/register`);
        let jsonStr = _JSON_UTILS.stringify({
            'nickname': customerAddRequestDTOObj.getNickname(),
            'email': customerAddRequestDTOObj.getEmail(),
            'login': customerAddRequestDTOObj.getLogin(),
            'password': customerAddRequestDTOObj.getPassword(),
            'country_code': customerAddRequestDTOObj.getCountryCode()
        });

        return await _XML_UTILS.sendJson(requestURL, this.#currentHttpMethod, jsonStr);
    }
}

class CustomersPATCHRequests {
    #currentHttpMethod = _HTTP_METHODS.PATCH;

    async edit(fileObjAvatar, customerEditRequestDTOObj) {
        let requestURL = new URL(_URL_TO_API_CUSTOMERS_EDIT);

        let jsonStr = _JSON_UTILS.stringify({
            'nickname': customerEditRequestDTOObj.getNickname(),
            'country_code': customerEditRequestDTOObj.getCountryCode(),
            'description': customerEditRequestDTOObj.getDescription()
        });

        let formData = new FormData();
        if (fileObjAvatar) {
            formData.set("avatar", fileObjAvatar);
        }
        formData.set("customer", _FORM_DATA_UTILS.createBlobByJsonStr(jsonStr));

        return await _XML_UTILS.sendFormData(requestURL, this.#currentHttpMethod, formData);
    }

    async editPassword(customerEditPasswordRequestDTOObj) {
        let requestURL = new URL(`${_URL_TO_API_CUSTOMERS_EDIT}/password`);

        let jsonStr = _JSON_UTILS.stringify({
            'old_password': customerEditPasswordRequestDTOObj.getOldPassword(),
            'new_password': customerEditPasswordRequestDTOObj.getNewPassword()
        });

        return await _XML_UTILS.sendJson(requestURL, this.#currentHttpMethod, jsonStr);
    }

    async editRole(entityEditValueByIdRequestDTOObj) {
        let requestURL = new URL(`${_URL_TO_API_CUSTOMERS_EDIT}/role`);
        let jsonStr = _JSON_UTILS.stringify({
            'id': entityEditValueByIdRequestDTOObj.getId(),
            'value': entityEditValueByIdRequestDTOObj.getValue()
        })

        return await _XML_UTILS.sendJson(requestURL, this.#currentHttpMethod, jsonStr);
    }
}
