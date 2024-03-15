import {
    XmlUtils
} from "../utils/json/xml_utils.js";

import {
    UrlToAPI
} from "./url_to_api.js";

const _XML_UTILS = new XmlUtils();

const URL_TO_API_COUNTRIES = new UrlToAPI().VALUE + "/countries";
const URL_TO_API_COUNTRIES_FIND = URL_TO_API_COUNTRIES + "/find";

export class CountriesAPI {
    GET = new CountriesGETRequests();
}

class CountriesGETRequests {
    async getAll() {
        let requestUrl = new URL(URL_TO_API_COUNTRIES);

        return await _XML_UTILS.getJSONResponseByGETXml(requestUrl);
    }

    async findByCode(code) {
        let requestUrl = new URL(URL_TO_API_COUNTRIES_FIND + "/by_code");
        requestUrl.searchParams.set("code", code);

        return await _XML_UTILS.getJSONResponseByGETXml(requestUrl);
    }
}