import {
    XmlUtils
} from "../utils/xml_utils.js";

import {
    UrlToAPI
} from "../url_to_api.js";

const _XML_UTILS = new XmlUtils();

const _URL_TO_API_COUNTRIES = `${new UrlToAPI().VALUE}/countries`;
const _URL_TO_API_COUNTRIES_GET = `${_URL_TO_API_COUNTRIES}/get`;
const _URL_TO_API_COUNTRIES_FIND = `${_URL_TO_API_COUNTRIES}/find`;

export class CountriesAPI {
    GET = new CountriesGETRequests();
}

class CountriesGETRequests {
    async getAll() {
        let requestUrl = new URL(_URL_TO_API_COUNTRIES_GET);

        return await _XML_UTILS.sendGET(requestUrl);
    }

    async findByCode(code) {
        let requestUrl = new URL(`${_URL_TO_API_COUNTRIES_FIND}/by_code`);
        requestUrl.searchParams.set("code", code);

        return await _XML_UTILS.sendGET(requestUrl);
    }
}