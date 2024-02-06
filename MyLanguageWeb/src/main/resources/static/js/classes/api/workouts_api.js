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

const URL_TO_API_WORKOUTS = new UrlToAPI().VALUE + "/workouts";
const URL_TO_API_WORKOUTS_FIND = URL_TO_API_WORKOUTS + "/find";

export class WorkoutsAPI {
    GET = new WorkoutsGETRequests();
    POST = new WorkoutsPOSTRequests();
}

class WorkoutsGETRequests {
    async findLastByCustomerIdAndWorkoutTypeCode(customerId, workoutTypeCode) {
        let requestURL = new URL(URL_TO_API_WORKOUTS_FIND + "/last_by_customer_id_and_workout_type_code");
        requestURL.searchParams.set("customer_id", customerId);
        requestURL.searchParams.set("workout_type_code", workoutTypeCode);

        return await _XML_UTILS.getJSONResponseByGETXml(requestURL);
    }
}

class WorkoutsPOSTRequests {
    async add(workoutsRequestDTO) {
        let requestURL = new URL(URL_TO_API_WORKOUTS);
        let jsonStr = _JSON_UTILS.stringify({
            'number_of_words': workoutsRequestDTO.numberOfWords,
            'workout_type_code': workoutsRequestDTO.workoutTypeCode,
            'lang_in_code': workoutsRequestDTO.langInCode,
            'lang_out_code': workoutsRequestDTO.langOutCode,
            'collection_key': workoutsRequestDTO.collectionKey
        });

        return await _XML_UTILS.getJSONResponseByPOSTXml(requestURL, jsonStr);
    }
}