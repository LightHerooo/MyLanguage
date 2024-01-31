import {
    UrlToAPI
} from "./url_to_api.js";

import {
    XmlUtils
} from "../utils/json/xml_utils.js";

const _XML_UTILS = new XmlUtils();

const URL_TO_API_PARTS_OF_SPEECH = new UrlToAPI().VALUE + "/parts_of_speech";
const URL_TO_API_PARTS_OF_SPEECH_FIND = URL_TO_API_PARTS_OF_SPEECH + "/find";

export class PartsOfSpeechAPI {
    GET = new PartsOfSpeechGETRequests();
}

class PartsOfSpeechGETRequests {
    async getAll() {
        let requestURL = new URL(URL_TO_API_PARTS_OF_SPEECH);

        return await _XML_UTILS.getJSONResponseByGETXml(requestURL);
    }

    async findByCode(code) {
        let requestURL = new URL(URL_TO_API_PARTS_OF_SPEECH_FIND + "/by_code");
        requestURL.searchParams.set("code", code);

        return await _XML_UTILS.getJSONResponseByGETXml(requestURL);
    }
}