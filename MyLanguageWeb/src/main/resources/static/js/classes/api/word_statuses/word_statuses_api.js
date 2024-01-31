import {
    UrlToAPI
} from "../url_to_api.js";

import {
    XmlUtils
} from "../../utils/json/xml_utils.js";

const _XML_UTILS = new XmlUtils();

const URL_TO_API_WORD_STATUSES = new UrlToAPI().VALUE + "/word_statuses";

export class WordStatusesAPI {
    GET = new WordStatusesGETRequests();
}

class WordStatusesGETRequests {
    async getAll() {
        let requestURL = new URL(URL_TO_API_WORD_STATUSES);

        return await _XML_UTILS.getJSONResponseByGETXml(requestURL);
    }
}