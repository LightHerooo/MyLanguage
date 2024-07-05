import {
    UrlToAPI
} from "../url_to_api.js";

import {
    XmlUtils
} from "../utils/xml_utils.js";

import {
    JSONUtils
} from "../utils/json_utils.js";

import {
    HttpMethods
} from "../classes/http/http_methods.js";

import {
    DateParts
} from "../../html/date_parts.js";

const _JSON_UTILS = new JSONUtils();
const _XML_UTILS = new XmlUtils();
const _HTTP_METHODS = new HttpMethods();

const _URL_TO_API_WORKOUTS = `${new UrlToAPI().VALUE}/workouts`;
const _URL_TO_API_WORKOUTS_GET = `${_URL_TO_API_WORKOUTS}/get`;
const _URL_TO_API_WORKOUTS_FIND = `${_URL_TO_API_WORKOUTS}/find`;
const _URL_TO_API_WORKOUTS_VALIDATE = `${_URL_TO_API_WORKOUTS}/validate`;
const _URL_TO_API_WORKOUTS_ADD = `${_URL_TO_API_WORKOUTS}/add`;
const _URL_TO_API_WORKOUTS_EDIT = `${_URL_TO_API_WORKOUTS}/edit`;
const _URL_TO_API_WORKOUTS_DELETE = `${_URL_TO_API_WORKOUTS}/delete`;


export class WorkoutsAPI {
    GET = new WorkoutsGETRequests();
    POST = new WorkoutsPOSTRequests();
    PATCH = new WorkoutsPATCHRequests();
    DELETE = new WorkoutsDELETERequests();
}

class WorkoutsGETRequests {
    async getAllOver(workoutTypeCode, dateOfEnd, customerId) {
        let requestURL = new URL(`${_URL_TO_API_WORKOUTS_GET}/over`);

        if (workoutTypeCode) {
            requestURL.searchParams.set("workout_type_code", workoutTypeCode);
        }
        if (dateOfEnd) {
            requestURL.searchParams.set("date_of_end_str", new DateParts(dateOfEnd).getDatabaseDateStr());
        }
        if (customerId) {
            requestURL.searchParams.set("customer_id", customerId);
        }

        return await _XML_UTILS.sendGET(requestURL);
    }

    async getAllNotOver(workoutTypeCode, customerId){
        let requestURL = new URL(`${_URL_TO_API_WORKOUTS_GET}/not_over`);
        if (workoutTypeCode) {
            requestURL.searchParams.set("workout_type_code", workoutTypeCode);
        }
        if (customerId) {
            requestURL.searchParams.set("customer_id", customerId);
        }

        return await _XML_UTILS.sendGET(requestURL);
    }

    async findLast(workoutTypeCode, customerId) {
        let requestURL = new URL(`${_URL_TO_API_WORKOUTS_FIND}/last`);
        if (workoutTypeCode) {
            requestURL.searchParams.set("workout_type_code", workoutTypeCode);
        }
        if (customerId) {
            requestURL.searchParams.set("customer_id", customerId);
        }

        return await _XML_UTILS.sendGET(requestURL);
    }

    async findCurrentRoundNumber(id) {
        let requestURL = new URL(`${_URL_TO_API_WORKOUTS_FIND}/current_round_number`);
        requestURL.searchParams.set("id", id);

        return await _XML_UTILS.sendGET(requestURL);
    }

    async findMaxDateOfEnd(workoutTypeCode, customerId) {
        let requestURL = new URL(`${_URL_TO_API_WORKOUTS_FIND}/max_date_of_end`);
        if (workoutTypeCode) {
            requestURL.searchParams.set("workout_type_code", workoutTypeCode);
        }
        if (customerId) {
            requestURL.searchParams.set("customer_id", customerId);
        }

        return await _XML_UTILS.sendGET(requestURL);
    }

    async findNextDateOfEnd(previousDateOfEnd, workoutTypeCode, customerId) {
        let requestURL = new URL(`${_URL_TO_API_WORKOUTS_FIND}/next_date_of_end`);

        requestURL.searchParams.set("previous_date_of_end_str", new DateParts(previousDateOfEnd).getDatabaseDateStr());
        if (workoutTypeCode) {
            requestURL.searchParams.set("workout_type_code", workoutTypeCode);
        }
        if (customerId) {
            requestURL.searchParams.set("customer_id", customerId);
        }

        return await _XML_UTILS.sendGET(requestURL);
    }

    async findStatistic(id) {
        let requestURL = new URL(`${_URL_TO_API_WORKOUTS_FIND}/statistic`);
        requestURL.searchParams.set("id", id);

        return await _XML_UTILS.sendGET(requestURL);
    }

    async findCustomerStatistic(customerId, workoutTypeCode, days) {
        let requestURL = new URL(`${_URL_TO_API_WORKOUTS_FIND}/customer_statistic`);

        requestURL.searchParams.set("customer_id", customerId);
        if (workoutTypeCode) {
            requestURL.searchParams.set("workout_type_code", workoutTypeCode);
        }
        if (days) {
            requestURL.searchParams.set("days", days);
        }

        return await _XML_UTILS.sendGET(requestURL);
    }

    async findRoundStatistic(id, roundNumber) {
        let requestURL = new URL(`${_URL_TO_API_WORKOUTS_FIND}/round_statistic`);
        requestURL.searchParams.set("id", id);
        requestURL.searchParams.set("round_number", roundNumber);

        return await _XML_UTILS.sendGET(requestURL);
    }

    async findFavouriteLangIn(customerId, workoutTypeCode, days) {
        let requestURL = new URL(`${_URL_TO_API_WORKOUTS_FIND}/favourite/lang_in`);

        requestURL.searchParams.set("customer_id", customerId);
        if (workoutTypeCode) {
            requestURL.searchParams.set("workout_type_code", workoutTypeCode);
        }
        if (days) {
            requestURL.searchParams.set("days", days);
        }

        return await _XML_UTILS.sendGET(requestURL);
    }

    async findFavouriteLangOut(customerId, workoutTypeCode, days) {
        let requestURL = new URL(`${_URL_TO_API_WORKOUTS_FIND}/favourite/lang_out`);

        requestURL.searchParams.set("customer_id", customerId);
        if (workoutTypeCode) {
            requestURL.searchParams.set("workout_type_code", workoutTypeCode);
        }
        if (days) {
            requestURL.searchParams.set("days", days);
        }

        return await _XML_UTILS.sendGET(requestURL);
    }

    async findFavouriteWorkoutType(customerId, days) {
        let requestURL = new URL(`${_URL_TO_API_WORKOUTS_FIND}/favourite/workout_type`);

        requestURL.searchParams.set("customer_id", customerId);
        if (days) {
            requestURL.searchParams.set("days", days);
        }

        return await _XML_UTILS.sendGET(requestURL);
    }

    async findFavouriteCustomerCollection(customerId, workoutTypeCode, days) {
        let requestURL = new URL(`${_URL_TO_API_WORKOUTS_FIND}/favourite/customer_collection`);

        requestURL.searchParams.set("customer_id", customerId);
        if (workoutTypeCode) {
            requestURL.searchParams.set("workout_type_code", workoutTypeCode);
        }
        if (days) {
            requestURL.searchParams.set("days", days);
        }

        return await _XML_UTILS.sendGET(requestURL);
    }

    async findById(id) {
        let requestURL = new URL(`${_URL_TO_API_WORKOUTS_FIND}/by_id`);
        requestURL.searchParams.set("id", id);

        return await _XML_UTILS.sendGET(requestURL);
    }

    async findMaxRoundNumber(id) {
        let requestURL = new URL(`${_URL_TO_API_WORKOUTS_FIND}/max_round_number`);
        requestURL.searchParams.set("id", id);

        return await _XML_UTILS.sendGET(requestURL);
    }
}

class WorkoutsPOSTRequests {
    #currentHttpMethod = _HTTP_METHODS.POST;

    async addRandomWords(workoutAddRandomWordsRequestDTOObj) {
        let requestURL = new URL(`${_URL_TO_API_WORKOUTS_ADD}/random_words`);
        let jsonStr = _JSON_UTILS.stringify({
            'lang_in_code': workoutAddRandomWordsRequestDTOObj.getLangInCode(),
            'lang_out_code': workoutAddRandomWordsRequestDTOObj.getLangOutCode(),
            'number_of_words': workoutAddRandomWordsRequestDTOObj.getNumberOfWords()
        });

        return await _XML_UTILS.sendJson(requestURL, this.#currentHttpMethod, jsonStr);
    }

    async addCollectionWorkout(workoutAddCollectionWorkoutRequestDTOObj) {
        let requestURL = new URL(`${_URL_TO_API_WORKOUTS_ADD}/collection_workout`);
        let jsonStr = _JSON_UTILS.stringify({
            'customer_collection_id': workoutAddCollectionWorkoutRequestDTOObj.getCustomerCollectionId(),
            'lang_out_code': workoutAddCollectionWorkoutRequestDTOObj.getLangOutCode()
        });

        return await _XML_UTILS.sendJson(requestURL, this.#currentHttpMethod, jsonStr);
    }
}

class WorkoutsPATCHRequests {
    #currentHttpMethod = _HTTP_METHODS.PATCH;

    async editCurrentMilliseconds(entityEditValueByIdRequestDTOObj) {
        let requestURL = new URL(`${_URL_TO_API_WORKOUTS_EDIT}/current_milliseconds`);
        let jsonStr = _JSON_UTILS.stringify({
            'id': entityEditValueByIdRequestDTOObj.getId(),
            'value': entityEditValueByIdRequestDTOObj.getValue()
        });

        return await _XML_UTILS.sendJson(requestURL, this.#currentHttpMethod, jsonStr);
    }

    async close(entityIdRequestDTOObj){
        let requestURL = new URL(`${_URL_TO_API_WORKOUTS}/close`);
        let jsonStr = _JSON_UTILS.stringify({
            'id': entityIdRequestDTOObj.getId()
        });

        return await _XML_UTILS.sendJson(requestURL, this.#currentHttpMethod, jsonStr);
    }
}

class WorkoutsDELETERequests {
    #currentHttpMethod = _HTTP_METHODS.DELETE;
    async delete(entityIdRequestDTOObj) {
        let requestURL = new URL(_URL_TO_API_WORKOUTS_DELETE);
        let jsonStr = _JSON_UTILS.stringify({
            'id': entityIdRequestDTOObj.getId()
        });

        return await _XML_UTILS.sendJson(requestURL, this.#currentHttpMethod, jsonStr);
    }
}