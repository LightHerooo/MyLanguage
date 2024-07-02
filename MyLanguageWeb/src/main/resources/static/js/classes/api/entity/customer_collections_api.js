import {
    UrlToAPI
} from "../url_to_api.js";

import {
    XmlUtils
} from "../utils/xml_utils.js";

import {
    JSONUtils
} from "../utils/json_utils.js";

import {
    HttpMethods
} from "../classes/http/http_methods.js";

const _JSON_UTILS = new JSONUtils();
const _XML_UTILS = new XmlUtils();
const _HTTP_METHODS = new HttpMethods();

const _URL_TO_API_CUSTOMER_COLLECTIONS = `${new UrlToAPI().VALUE}/customer_collections`;
const _URL_TO_API_CUSTOMER_COLLECTIONS_GET = `${_URL_TO_API_CUSTOMER_COLLECTIONS}/get`;
const _URL_TO_API_CUSTOMER_COLLECTIONS_COUNT = `${_URL_TO_API_CUSTOMER_COLLECTIONS}/count`;
const _URL_TO_API_CUSTOMER_COLLECTIONS_FIND = `${_URL_TO_API_CUSTOMER_COLLECTIONS}/find`;
const _URL_TO_API_CUSTOMER_COLLECTIONS_VALIDATE = `${_URL_TO_API_CUSTOMER_COLLECTIONS}/validate`;
const _URL_TO_API_CUSTOMER_COLLECTIONS_ADD = `${_URL_TO_API_CUSTOMER_COLLECTIONS}/add`;
const _URL_TO_API_CUSTOMER_COLLECTIONS_EDIT = `${_URL_TO_API_CUSTOMER_COLLECTIONS}/edit`;
const _URL_TO_API_CUSTOMER_COLLECTIONS_DELETE = `${_URL_TO_API_CUSTOMER_COLLECTIONS}/delete`;

export class CustomerCollectionsAPI {
    GET = new CustomerCollectionsGETRequests();
    POST = new CustomerCollectionsPOSTRequests();
    PATCH = new CustomerCollectionsPATCHRequests();
    DELETE = new CustomerCollectionsDELETERequests();
}

class CustomerCollectionsGETRequests {
    async getAll(title, langCode, isActiveForAuthor, customerId,
                 numberOfItems, lastCustomerCollectionIdOnPreviousPage) {
        let requestURL = new URL(_URL_TO_API_CUSTOMER_COLLECTIONS_GET);

        if (title) {
            requestURL.searchParams.set("title", title);
        }
        if (langCode) {
            requestURL.searchParams.set("lang_code", langCode);
        }
        if (isActiveForAuthor !== null && isActiveForAuthor !== undefined) {
            requestURL.searchParams.set("is_active_for_author", isActiveForAuthor);
        }
        if (customerId) {
            requestURL.searchParams.set("customer_id", customerId);
        }
        if (numberOfItems) {
            requestURL.searchParams.set("number_of_items", numberOfItems);
        }
        if (lastCustomerCollectionIdOnPreviousPage) {
            requestURL.searchParams.set("last_customer_collection_id_on_previous_page",
                lastCustomerCollectionIdOnPreviousPage);
        }

        return await _XML_UTILS.sendGET(requestURL);
    }

    async getAllForAuthorByLangOutCode(langOutCode, customerId) {
        let requestURL = new URL(`${_URL_TO_API_CUSTOMER_COLLECTIONS_GET}/for_author/by_lang_out_code`);
        requestURL.searchParams.set("lang_out_code", langOutCode);
        requestURL.searchParams.set("customer_id", customerId);

        return await _XML_UTILS.sendGET(requestURL);
    }

    async getCustomerStatistic(customerId) {
        let requestURL = new URL(`${_URL_TO_API_CUSTOMER_COLLECTIONS}/customer_statistic`);
        requestURL.searchParams.set("customer_id", customerId);

        return await _XML_UTILS.sendGET(requestURL);
    }

    async getCountForAuthor(isActiveForAuthor, customerId) {
        let requestURL = new URL(`${_URL_TO_API_CUSTOMER_COLLECTIONS_COUNT}/for_author`);
        requestURL.searchParams.set("is_active_for_author", isActiveForAuthor);
        requestURL.searchParams.set("customer_id", customerId);

        return await _XML_UTILS.sendGET(requestURL);
    }

    async findById(id) {
        let requestURL = new URL(`${_URL_TO_API_CUSTOMER_COLLECTIONS_FIND}/by_id`);
        requestURL.searchParams.set("id", id);

        return await _XML_UTILS.sendGET(requestURL);
    }

    async validateIsAuthor(customerId, customerCollectionId) {
        let requestURL = new URL(`${_URL_TO_API_CUSTOMER_COLLECTIONS_VALIDATE}/is_author`);
        requestURL.searchParams.set("customer_id", customerId);
        requestURL.searchParams.set("customer_collection_id", customerCollectionId);

        return await _XML_UTILS.sendGET(requestURL);
    }

    async validateIsLangActive(id) {
        let requestURL = new URL(`${_URL_TO_API_CUSTOMER_COLLECTIONS_VALIDATE}/is_lang_active`);
        requestURL.searchParams.set("id", id);

        return await _XML_UTILS.sendGET(requestURL);
    }

    async validateIsActiveForAuthor(id) {
        let requestURL = new URL(`${_URL_TO_API_CUSTOMER_COLLECTIONS_VALIDATE}/is_active_for_author`);
        requestURL.searchParams.set("id", id);

        return await _XML_UTILS.sendGET(requestURL);
    }
}

class CustomerCollectionsPOSTRequests {
    #currentHttpMethod = _HTTP_METHODS.POST;

    async add(customerCollectionAddRequestDTOObj) {
        let requestURL = new URL(_URL_TO_API_CUSTOMER_COLLECTIONS_ADD);
        let jsonStr = _JSON_UTILS.stringify({
            'title': customerCollectionAddRequestDTOObj.getTitle(),
            'lang_code': customerCollectionAddRequestDTOObj.getLangCode()
        });

        return await _XML_UTILS.sendJson(requestURL, this.#currentHttpMethod, jsonStr);
    }

    async addByWorkout(entityIdRequestDTOObj){
        let requestURL = new URL(`${_URL_TO_API_CUSTOMER_COLLECTIONS_ADD}/by_workout`);
        let jsonStr = _JSON_UTILS.stringify({
            'id': entityIdRequestDTOObj.getId()
        });

        return await _XML_UTILS.sendJson(requestURL, this.#currentHttpMethod, jsonStr);
    }

    async validateBeforeAdd(customerCollectionAddRequestDTOObj) {
        let requestURL = new URL(`${_URL_TO_API_CUSTOMER_COLLECTIONS_VALIDATE}/before_add`);
        let jsonStr = _JSON_UTILS.stringify({
            'title': customerCollectionAddRequestDTOObj.getTitle(),
            'lang_code': customerCollectionAddRequestDTOObj.getLangCode()
        });

        return await _XML_UTILS.sendJson(requestURL, this.#currentHttpMethod, jsonStr);
    }
}

class CustomerCollectionsPATCHRequests {
    #currentHttpMethod = _HTTP_METHODS.PATCH;

    async editIsActiveForAuthor(entityEditValueByIdRequestDTOObj) {
        let requestURL = new URL(`${_URL_TO_API_CUSTOMER_COLLECTIONS_EDIT}/is_active_for_author`);
        let jsonStr = _JSON_UTILS.stringify({
            'id': entityEditValueByIdRequestDTOObj.getId(),
            'value': entityEditValueByIdRequestDTOObj.getValue()
        });

        return await _XML_UTILS.sendJson(requestURL, this.#currentHttpMethod, jsonStr);
    }
}

class CustomerCollectionsDELETERequests {
    #currentHttpMethod = _HTTP_METHODS.DELETE;
    async delete(entityIdRequestDTOObj) {
        let requestURL = new URL(_URL_TO_API_CUSTOMER_COLLECTIONS_DELETE);
        let jsonStr = _JSON_UTILS.stringify({
            'id': entityIdRequestDTOObj.getId()
        });

        return await _XML_UTILS.sendJson(requestURL, this.#currentHttpMethod, jsonStr);
    }
}