import {
    XmlUtils
} from "../utils/xml_utils.js";

import {
    UrlPaths
} from "../../url/path/url_paths.js";

const _XML_UTILS = new XmlUtils();

const _URL_TO_API_WORD_STATUSES = `${new UrlPaths().API.createFullPath()}/word_statuses`;
const _URL_TO_API_WORD_STATUSES_GET = `${_URL_TO_API_WORD_STATUSES}/get`;
const _URL_TO_API_WORD_STATUSES_FIND = `${_URL_TO_API_WORD_STATUSES}/find`;

export class WordStatusesAPI {
    GET = new WordStatusesGETRequests();
}

class WordStatusesGETRequests {
    async getAll() {
        let requestURL = new URL(_URL_TO_API_WORD_STATUSES_GET);

        return await _XML_UTILS.sendGET(requestURL);
    }

    async findByCode(code) {
        let requestURL = new URL(`${_URL_TO_API_WORD_STATUSES_FIND}/by_code`);
        requestURL.searchParams.set("code", code);

        return await _XML_UTILS.sendGET(requestURL);
    }
}