import {
    UrlToAPI
} from "./url_to_api.js";

import {
    XmlUtils
} from "../utils/json/xml_utils.js";

import {
    JSONUtils
} from "../utils/json/json_utils.js";

const _XML_UTILS = new XmlUtils();
const _JSON_UTILS = new JSONUtils();

const URL_TO_API_WORKOUT_TYPES = new UrlToAPI().VALUE + "/workout_types";

export class WorkoutTypesAPI {
    GET = new WorkoutTypesGETRequests();
    PATCH = new WorkoutTypesPATCHRequests();
}

class WorkoutTypesGETRequests {
    async getAll() {
        let requestURL = new URL(URL_TO_API_WORKOUT_TYPES);

        return await _XML_UTILS.getJSONResponseByGETXml(requestURL);
    }

    async getAllFiltered(title) {
        let requestURL = new URL(URL_TO_API_WORKOUT_TYPES + "/filtered");

        if (title) {
            requestURL.searchParams.set("title", title);
        }

        return await _XML_UTILS.getJSONResponseByGETXml(requestURL);
    }
}

class WorkoutTypesPATCHRequests {
    async changeActiveStatus(workoutTypeRequestDTO) {
        let requestURL = new URL(URL_TO_API_WORKOUT_TYPES + "/change_active_status");
        let jsonStr = _JSON_UTILS.stringify({
            'code': workoutTypeRequestDTO.code,
            'is_active': workoutTypeRequestDTO.isActive
        });

        return await _XML_UTILS.getJSONResponseByPATCHXml(requestURL, jsonStr);
    }
}