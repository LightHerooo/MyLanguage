import {
    UrlToAPI
} from "./url_to_api.js";

import {
    XmlUtils
} from "../utils/json/xml_utils.js";

const _XML_UTILS = new XmlUtils();

const URL_TO_API_LANGS = new UrlToAPI().VALUE + "/langs";
const URL_TO_API_LANGS_FIND = URL_TO_API_LANGS + "/find";

export class LangsAPI {
    GET = new LangsGETRequests();
}

class LangsGETRequests {
    async getAll() {
        let requestURL = new URL(URL_TO_API_LANGS);

        return await _XML_UTILS.getJSONResponseByGETXml(requestURL);
    }

    async findByCode(code) {
        let requestURL = new URL(URL_TO_API_LANGS_FIND + "/by_code");
        requestURL.searchParams.set("code", code);

        return await _XML_UTILS.getJSONResponseByGETXml(requestURL);
    }
}