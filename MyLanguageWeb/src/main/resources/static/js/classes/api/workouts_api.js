import {
    UrlToAPI
} from "./url_to_api.js";

import {
    XmlUtils
} from "../utils/json/xml_utils.js";

import {
    JSONUtils
} from "../utils/json/json_utils.js";

import {
    DateParts
} from "../date_parts.js";

const _JSON_UTILS = new JSONUtils();
const _XML_UTILS = new XmlUtils();

const URL_TO_API_WORKOUTS = new UrlToAPI().VALUE + "/workouts";
const URL_TO_API_WORKOUTS_FIND = URL_TO_API_WORKOUTS + "/find";
const URL_TO_API_WORKOUTS_VALIDATE = URL_TO_API_WORKOUTS + "/validate";

export class WorkoutsAPI {
    GET = new WorkoutsGETRequests();
    POST = new WorkoutsPOSTRequests();
    PATCH = new WorkoutsPATCHRequests();
    DELETE = new WorkoutsDELETERequests();
}

class WorkoutsGETRequests {
    async getAllFiltered(customerId, workoutTypeCode, dateOfEnd) {
        let requestURL = new URL(URL_TO_API_WORKOUTS + "/filtered");
        requestURL.searchParams.set("customer_id", customerId);

        if (workoutTypeCode) {
            requestURL.searchParams.set("workout_type_code", workoutTypeCode);
        }
        if (dateOfEnd) {
            requestURL.searchParams.set("date_of_end", new DateParts(dateOfEnd).getDatabaseDateStr());
        }

        return await _XML_UTILS.getJSONResponseByGETXml(requestURL);
    }

    async getNotOver(customerId, workoutTypeCode){
        let requestURL = new URL(URL_TO_API_WORKOUTS + "/not_over");
        requestURL.searchParams.set("customer_id", customerId);
        requestURL.searchParams.set("workout_type_code", workoutTypeCode);
        requestURL.searchParams.set("is_active", "true");

        return await _XML_UTILS.getJSONResponseByGETXml(requestURL);
    }

    async findLast(customerId, workoutTypeCode) {
        let requestURL = new URL(URL_TO_API_WORKOUTS_FIND + "/last");
        requestURL.searchParams.set("customer_id", customerId);
        requestURL.searchParams.set("workout_type_code", workoutTypeCode);

        return await _XML_UTILS.getJSONResponseByGETXml(requestURL);
    }

    async findLastNotOverInactiveByCustomerId(customerId) {
        let requestURL = new URL(URL_TO_API_WORKOUTS_FIND + "/last_not_over_inactive_by_customer_id");
        requestURL.searchParams.set("customer_id", customerId);

        return await _XML_UTILS.getJSONResponseByGETXml(requestURL);
    }

    async findCurrentRoundNumberByWorkoutId(workoutId) {
        let requestURL = new URL(URL_TO_API_WORKOUTS_FIND + "/current_round_number_by_workout_id");
        requestURL.searchParams.set("workout_id", workoutId);

        return await _XML_UTILS.getJSONResponseByGETXml(requestURL);
    }

    async findMaxDateOfEnd(customerId, workoutTypeCode){
        let requestURL = new URL(URL_TO_API_WORKOUTS_FIND + "/max_date_of_end");
        requestURL.searchParams.set("customer_id", customerId);
        if (workoutTypeCode) {
            requestURL.searchParams.set("workout_type_code", workoutTypeCode);
        }

        return await _XML_UTILS.getJSONResponseByGETXml(requestURL);
    }

    async findNextDateOfEnd(customerId, workoutTypeCode, dateOfEnd) {
        let requestURL = new URL(URL_TO_API_WORKOUTS_FIND + "/next_date_of_end");
        requestURL.searchParams.set("customer_id", customerId);
        requestURL.searchParams.set("date_of_end", new DateParts(dateOfEnd).getDatabaseDateStr());
        if (workoutTypeCode) {
            requestURL.searchParams.set("workout_type_code", workoutTypeCode);
        }

        return await _XML_UTILS.getJSONResponseByGETXml(requestURL);
    }

    async findCustomerExtraStatistic(customerId, workoutTypeCode, days) {
        let requestURL = new URL(URL_TO_API_WORKOUTS_FIND + "/customer_extra_statistic");
        requestURL.searchParams.set("customer_id", customerId);

        if (workoutTypeCode) {
            requestURL.searchParams.set("workout_type_code", workoutTypeCode);
        }
        if (days) {
            requestURL.searchParams.set("days", days);
        }

        return await _XML_UTILS.getJSONResponseByGETXml(requestURL);
    }

    async findStatistic(workoutId) {
        let requestURL = new URL(URL_TO_API_WORKOUTS_FIND + "/statistic");
        requestURL.searchParams.set("workout_id", workoutId);

        return await _XML_UTILS.getJSONResponseByGETXml(requestURL);
    }

    async findRoundStatistic(workoutId, roundNumber) {
        let requestURL = new URL(URL_TO_API_WORKOUTS_FIND + "/round_statistic");
        requestURL.searchParams.set("workout_id", workoutId);
        requestURL.searchParams.set("round_number", roundNumber);

        return await _XML_UTILS.getJSONResponseByGETXml(requestURL);
    }

    async findById(id) {
        let requestURL = new URL(URL_TO_API_WORKOUTS_FIND + "/by_id");
        requestURL.searchParams.set("id", id);

        return await _XML_UTILS.getJSONResponseByGETXml(requestURL);
    }

    async findMaxRoundNumberByWorkoutId(workoutId) {
        let requestURL = new URL(URL_TO_API_WORKOUTS_FIND + "/max_round_number_by_workout_id");
        requestURL.searchParams.set("workout_id", workoutId);

        return await _XML_UTILS.getJSONResponseByGETXml(requestURL);
    }

    async validateIsWorkoutEndedByWorkoutId(workoutId) {
        let requestURL = new URL(URL_TO_API_WORKOUTS_VALIDATE + "/is_workout_ended");
        requestURL.searchParams.set("workout_id", workoutId);

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
            'collection_id': workoutsRequestDTO.collectionId
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