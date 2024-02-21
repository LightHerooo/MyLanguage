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
    PATCH = new WorkoutsPATCHRequests();
    DELETE = new WorkoutsDELETERequests();
}

class WorkoutsGETRequests {
    async getNotOverByCustomerIdAndWorkoutTypeCode(customerId, workoutTypeCode){
        let requestURL = new URL(URL_TO_API_WORKOUTS + "/not_over");
        requestURL.searchParams.set("customer_id", customerId);
        requestURL.searchParams.set("workout_type_code", workoutTypeCode);
        requestURL.searchParams.set("is_active", "true");

        return await _XML_UTILS.getJSONResponseByGETXml(requestURL);
    }

    async findLastByCustomerIdAndWorkoutTypeCode(customerId, workoutTypeCode) {
        let requestURL = new URL(URL_TO_API_WORKOUTS_FIND + "/last_by_customer_id_and_workout_type_code");
        requestURL.searchParams.set("customer_id", customerId);
        requestURL.searchParams.set("workout_type_code", workoutTypeCode);

        return await _XML_UTILS.getJSONResponseByGETXml(requestURL);
    }

    async findLastInactiveByCustomerId(customerId) {
        let requestURL = new URL(URL_TO_API_WORKOUTS_FIND + "/last_inactive_by_customer_id");
        requestURL.searchParams.set("customer_id", customerId);

        return await _XML_UTILS.getJSONResponseByGETXml(requestURL);
    }

    async findCurrentRoundNumberByWorkoutId(workoutId) {
        let requestURL = new URL(URL_TO_API_WORKOUTS_FIND + "/current_round_number_by_workout_id");
        requestURL.searchParams.set("workout_id", workoutId);

        return await _XML_UTILS.getJSONResponseByGETXml(requestURL);
    }

    async findRoundStatisticByWorkoutIdAndRoundNumber(workoutId, roundNumber) {
        let requestURL = new URL(URL_TO_API_WORKOUTS_FIND + "/round_statistic_by_workout_id_and_round_number");
        requestURL.searchParams.set("workout_id", workoutId);
        requestURL.searchParams.set("round_number", roundNumber);

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

class WorkoutsPATCHRequests {
    async changeActivity(workoutRequestDTO) {
        let requestURL = new URL(URL_TO_API_WORKOUTS + "/change_activity");
        let jsonStr = _JSON_UTILS.stringify({
            'id': workoutRequestDTO.id
        });

        return await _XML_UTILS.getJSONResponseByPATCHXml(requestURL, jsonStr);
    }

    async setCurrentMilliseconds(workoutRequestDTO) {
        let requestURL = new URL(URL_TO_API_WORKOUTS + "/set_current_milliseconds");
        let jsonStr = _JSON_UTILS.stringify({
            'id': workoutRequestDTO.id,
            'current_milliseconds': workoutRequestDTO.currentMilliseconds
        });

        return await _XML_UTILS.getJSONResponseByPATCHXml(requestURL, jsonStr);
    }

    async close(workoutRequestDTO){
        let requestURL = new URL(URL_TO_API_WORKOUTS + "/close");
        let jsonStr = _JSON_UTILS.stringify({
            'id': workoutRequestDTO.id
        });

        return await _XML_UTILS.getJSONResponseByPATCHXml(requestURL, jsonStr);
    }

    async repairNotOver(workoutRequestDTO){
        let requestURL = new URL(URL_TO_API_WORKOUTS + "/repair_not_over");
        let jsonStr = _JSON_UTILS.stringify({
            'workout_type_code': workoutRequestDTO.workoutTypeCode
        });

        return await _XML_UTILS.getJSONResponseByPATCHXml(requestURL, jsonStr);
    }
}

class WorkoutsDELETERequests {
    async delete(workoutRequestDTO) {
        let requestURL = new URL(URL_TO_API_WORKOUTS);
        let jsonStr = _JSON_UTILS.stringify({
            'id': workoutRequestDTO.id
        });

        return await _XML_UTILS.getJSONResponseByDELETEXml(requestURL, jsonStr);
    }
}