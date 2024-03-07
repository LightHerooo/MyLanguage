import {
    UrlToAPI
} from "./url_to_api.js";

import {
    XmlUtils
} from "../utils/json/xml_utils.js";

const _XML_UTILS = new XmlUtils();

const URL_TO_API_WORKOUT_TYPES = new UrlToAPI().VALUE + "/workout_types";

export class WorkoutTypesAPI {
    GET = new WorkoutTypesGETRequests();
}

class WorkoutTypesGETRequests {
    async getAll() {
        let requestURL = new URL(URL_TO_API_WORKOUT_TYPES);

        return await _XML_UTILS.getJSONResponseByGETXml(requestURL);
    }
}