import {
    UrlToAPI
} from "./url_to_api.js";

import {
    XmlUtils
} from "../utils/json/xml_utils.js";

import {
    JSONUtils
} from "../utils/json/json_utils.js";

const _JSON_UTILS = new JSONUtils();
const _XML_UTILS = new XmlUtils();

const URL_TO_API_CUSTOMER_COLLECTIONS = new UrlToAPI().VALUE + "/customer_collections";
const URL_TO_API_CUSTOMER_COLLECTIONS_FIND = URL_TO_API_CUSTOMER_COLLECTIONS + "/find";
const URL_TO_API_CUSTOMER_COLLECTIONS_VALIDATE = URL_TO_API_CUSTOMER_COLLECTIONS + "/validate";

export class CustomerCollectionsAPI {
    GET = new CustomerCollectionsGETRequests();
    POST = new CustomerCollectionsPOSTRequests();
}

class CustomerCollectionsGETRequests {
    async getAllByCustomerId(customerId) {
        let requestURL = new URL(URL_TO_API_CUSTOMER_COLLECTIONS + "/by_customer_id");
        requestURL.searchParams.set("customer_id", customerId);

        return await _XML_UTILS.getJSONResponseByGETXml(requestURL);
    }

    async findByKey(collectionKey) {
        let requestURL = new URL(URL_TO_API_CUSTOMER_COLLECTIONS_FIND + "/by_key");
        requestURL.searchParams.set("key", collectionKey);

        return await _XML_UTILS.getJSONResponseByGETXml(requestURL);
    }

    async getCountByCustomerIdAndLangCode(customerId, langCode) {
        let requestURL = new URL(URL_TO_API_CUSTOMER_COLLECTIONS + "/count_by_customer_id_and_lang_code");
        requestURL.searchParams.set("customer_id", customerId);

        if (langCode) {
            requestURL.searchParams.set("lang_code", langCode);
        }

        return await _XML_UTILS.getJSONResponseByGETXml(requestURL);
    }

    async findByCustomerIdAndKey(customerId, key) {
        let requestURL = new URL(URL_TO_API_CUSTOMER_COLLECTIONS_FIND + "/by_customer_id_and_key");
        requestURL.searchParams.set("customer_id", customerId);
        requestURL.searchParams.set("key", key);

        return await _XML_UTILS.getJSONResponseByGETXml(requestURL);
    }

    async validateIsLangActiveInCollectionByKey(key) {
        let requestURL = new URL(
            URL_TO_API_CUSTOMER_COLLECTIONS_VALIDATE + "/is_lang_active_in_collection_by_key");
        requestURL.searchParams.set("key", key);

        return await _XML_UTILS.getJSONResponseByGETXml(requestURL);
    }
}

class CustomerCollectionsPOSTRequests {
    async add(customerCollectionRequestDTO) {
        let requestURL = new URL(URL_TO_API_CUSTOMER_COLLECTIONS);
        let jsonStr = _JSON_UTILS.stringify({
            'title': customerCollectionRequestDTO.title,
            'customer_id': customerCollectionRequestDTO.customerId,
            'lang_code': customerCollectionRequestDTO.langCode
        });

        return await _XML_UTILS.getJSONResponseByPOSTXml(requestURL, jsonStr);
    }

    async copyByKey(customerCollectionRequestDTO) {
        let requestURL = new URL(URL_TO_API_CUSTOMER_COLLECTIONS + "/copy_by_key");
        let jsonStr = _JSON_UTILS.stringify({
            'title': customerCollectionRequestDTO.title,
            'customer_id': customerCollectionRequestDTO.customerId,
            'key': customerCollectionRequestDTO.key
        });

        return await _XML_UTILS.getJSONResponseByPOSTXml(requestURL, jsonStr);
    }

    async validateBeforeCrud(customerCollectionRequestDTO) {
        let requestURL = new URL(URL_TO_API_CUSTOMER_COLLECTIONS_VALIDATE + "/before_crud");
        let jsonStr = _JSON_UTILS.stringify({
            'id': customerCollectionRequestDTO.id,
            'title': customerCollectionRequestDTO.title,
            'customer_id': customerCollectionRequestDTO.customerId,
            'lang_code': customerCollectionRequestDTO.langCode,
            'key': customerCollectionRequestDTO.key
        });

        return await _XML_UTILS.getJSONResponseByPOSTXml(requestURL, jsonStr);
    }
}