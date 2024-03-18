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
    PATCH = new CustomerCollectionsPATCHRequests();
    DELETE = new CustomerCollectionsDELETERequests();
}

class CustomerCollectionsGETRequests {
    async getAllForAuthorFiltered(title, langCode, customerId, isActiveForAuthor) {
        let requestURL = new URL(URL_TO_API_CUSTOMER_COLLECTIONS + "/for_author_filtered");
        requestURL.searchParams.set("customer_id", customerId);
        requestURL.searchParams.set("is_active_for_author", isActiveForAuthor);

        if (title) {
            requestURL.searchParams.set("title", title);
        }
        if (langCode) {
            requestURL.searchParams.set("lang_code", langCode);
        }

        return await _XML_UTILS.getJSONResponseByGETXml(requestURL);
    }

    async getCountForAuthor(customerId, isActiveForAuthor) {
        let requestURL = new URL(URL_TO_API_CUSTOMER_COLLECTIONS + "/count_for_author");
        requestURL.searchParams.set("customer_id", customerId);
        requestURL.searchParams.set("is_active_for_author", isActiveForAuthor);

        return await _XML_UTILS.getJSONResponseByGETXml(requestURL);
    }

    async getAllForAuthorFilteredPagination(title, langCode, customerId, isActiveForAuthor,
                                            numberOfItems, lastCollectionIdOnPreviousPage) {
        let requestURL = new URL(URL_TO_API_CUSTOMER_COLLECTIONS + "/for_author_filtered_pagination");
        requestURL.searchParams.set("customer_id", customerId);
        requestURL.searchParams.set("is_active_for_author", isActiveForAuthor);
        requestURL.searchParams.set("number_of_items", numberOfItems);

        if (title) {
            requestURL.searchParams.set("title", title);
        }
        if (langCode) {
            requestURL.searchParams.set("lang_code", langCode);
        }
        if (lastCollectionIdOnPreviousPage) {
            requestURL.searchParams.set("last_collection_id_on_previous_page",
                lastCollectionIdOnPreviousPage);
        }

        return await _XML_UTILS.getJSONResponseByGETXml(requestURL);
    }

    async getAllForAuthorByCustomerIdAndLangOutCode(customerId, langOutCode) {
        let requestURL = new URL(URL_TO_API_CUSTOMER_COLLECTIONS + "/for_author_by_customer_id_and_lang_out_code");
        requestURL.searchParams.set("customer_id", customerId);
        requestURL.searchParams.set("lang_out_code", langOutCode);

        return await _XML_UTILS.getJSONResponseByGETXml(requestURL);
    }

    async getCustomerCollectionsWithLangStatisticsByCustomerId(customerId) {
        let requestURL = new URL(URL_TO_API_CUSTOMER_COLLECTIONS +
            "/customer_collections_with_lang_statistics_by_customer_id");
        requestURL.searchParams.set("customer_id", customerId);

        return await _XML_UTILS.getJSONResponseByGETXml(requestURL);
    }

    async findById(collectionId) {
        let requestURL = new URL(URL_TO_API_CUSTOMER_COLLECTIONS_FIND + "/by_id");
        requestURL.searchParams.set("id", collectionId);

        return await _XML_UTILS.getJSONResponseByGETXml(requestURL);
    }

    async validateIsCustomerCollectionAuthor(customerId, collectionId) {
        let requestURL = new URL(URL_TO_API_CUSTOMER_COLLECTIONS_VALIDATE + "/is_customer_collection_author");
        requestURL.searchParams.set("customer_id", customerId);
        requestURL.searchParams.set("collection_id", collectionId);

        return await _XML_UTILS.getJSONResponseByGETXml(requestURL);
    }

    async validateIsLangActiveInCollectionByCollectionId(collectionId) {
        let requestURL = new URL(
            URL_TO_API_CUSTOMER_COLLECTIONS_VALIDATE + "/is_lang_active_in_collection_by_id");
        requestURL.searchParams.set("id", collectionId);

        return await _XML_UTILS.getJSONResponseByGETXml(requestURL);
    }

    async validateIsActiveForAuthorByCollectionId(collectionId) {
        let requestURL = new URL(
            URL_TO_API_CUSTOMER_COLLECTIONS_VALIDATE + "/is_active_for_author_by_id");
        requestURL.searchParams.set("id", collectionId);

        return await _XML_UTILS.getJSONResponseByGETXml(requestURL);
    }

    async validateMinNumberOfWordsForWorkoutByCollectionId(collectionId) {
        let requestURL = new URL(
            URL_TO_API_CUSTOMER_COLLECTIONS_VALIDATE + "/min_number_of_words_for_workout_by_id");
        requestURL.searchParams.set("id", collectionId);

        return await _XML_UTILS.getJSONResponseByGETXml(requestURL);
    }
}

class CustomerCollectionsPOSTRequests {
    async add(customerCollectionRequestDTO) {
        let requestURL = new URL(URL_TO_API_CUSTOMER_COLLECTIONS);
        let jsonStr = _JSON_UTILS.stringify({
            'title': customerCollectionRequestDTO.title,
            'lang_code': customerCollectionRequestDTO.langCode
        });

        return await _XML_UTILS.getJSONResponseByPOSTXml(requestURL, jsonStr);
    }

    async createByWorkoutId(customerCollectionRequestDTO){
        let requestURL = new URL(URL_TO_API_CUSTOMER_COLLECTIONS + "/create_by_workout_id");
        let jsonStr = _JSON_UTILS.stringify({
            'workout_id': customerCollectionRequestDTO.workoutId
        });

        return await _XML_UTILS.getJSONResponseByPOSTXml(requestURL, jsonStr);
    }

    async validateBeforeAdd(customerCollectionRequestDTO) {
        let requestURL = new URL(URL_TO_API_CUSTOMER_COLLECTIONS_VALIDATE + "/before_add");
        let jsonStr = _JSON_UTILS.stringify({
            'id': customerCollectionRequestDTO.id,
            'title': customerCollectionRequestDTO.title,
            'lang_code': customerCollectionRequestDTO.langCode
        });

        return await _XML_UTILS.getJSONResponseByPOSTXml(requestURL, jsonStr);
    }
}

class CustomerCollectionsPATCHRequests {
    async changeActivityForAuthor(customerCollectionRequestDTO) {
        let requestURL = new URL(URL_TO_API_CUSTOMER_COLLECTIONS + "/change_activity_for_author");
        let jsonStr = _JSON_UTILS.stringify({
            'id': customerCollectionRequestDTO.id,
            'is_active_for_author': customerCollectionRequestDTO.isActiveForAuthor
        });

        return await _XML_UTILS.getJSONResponseByPATCHXml(requestURL, jsonStr);
    }
}

class CustomerCollectionsDELETERequests {
    async delete(customerCollectionRequestDTO) {
        let requestURL = new URL(URL_TO_API_CUSTOMER_COLLECTIONS);
        let jsonStr = _JSON_UTILS.stringify({
            'id': customerCollectionRequestDTO.id,
        });

        return await _XML_UTILS.getJSONResponseByDELETEXml(requestURL, jsonStr);
    }
}