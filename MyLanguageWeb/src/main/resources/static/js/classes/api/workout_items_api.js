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

const URL_TO_API_WORKOUT_ITEMS = new UrlToAPI().VALUE + "/workout_items";
const URL_TO_API_WORKOUT_ITEMS_FIND = URL_TO_API_WORKOUT_ITEMS + "/find";

export class WorkoutItemsAPI {
    GET = new WorkoutItemsGETRequests();
    POST = new WorkoutItemsPOSTRequests();
    PATCH = new WorkoutItemsPATCHRequests();
}

class WorkoutItemsGETRequests {
    async getWithAnswerByWorkoutIdAndRoundNumber(workoutId, roundNumber) {
        let requestURL = new URL(URL_TO_API_WORKOUT_ITEMS + "/with_answer_by_workout_id_and_round_number");
        requestURL.searchParams.set("workout_id", workoutId);
        requestURL.searchParams.set("round_number", roundNumber);

        return await _XML_UTILS.getJSONResponseByGETXml(requestURL);
    }
    async getCountWithAnswerByWorkoutIdAndRoundNumber(workoutId, roundNumber) {
        let requestURL = new URL(URL_TO_API_WORKOUT_ITEMS + "/count_with_answer_by_workout_id_and_round_number");
        requestURL.searchParams.set("workout_id", workoutId);
        requestURL.searchParams.set("round_number", roundNumber);

        return await _XML_UTILS.getJSONResponseByGETXml(requestURL);
    }

    async getRandomWithoutAnswerByWorkoutIdAndRoundNumber(workoutId, roundNumber){
        let requestURL = new URL(URL_TO_API_WORKOUT_ITEMS_FIND
            + "/random_without_answer_by_workout_id_and_round_number");
        requestURL.searchParams.set("workout_id", workoutId);
        requestURL.searchParams.set("round_number", roundNumber);

        return await _XML_UTILS.getJSONResponseByGETXml(requestURL);
    }
}

class WorkoutItemsPOSTRequests {
    async addToNextRound(workoutItemRequestDTO){
        let requestURL = new URL(URL_TO_API_WORKOUT_ITEMS + "/add_to_next_round");
        let jsonStr = _JSON_UTILS.stringify({
            'id': workoutItemRequestDTO.id
        });

        return await _XML_UTILS.getJSONResponseByPOSTXml(requestURL, jsonStr);
    }
}

class WorkoutItemsPATCHRequests {
    async setAnswer(workoutItemRequestDTO) {
        let requestURL = new URL(URL_TO_API_WORKOUT_ITEMS + "/set_answer");
        let jsonStr = _JSON_UTILS.stringify({
            'id': workoutItemRequestDTO.id,
            'word_title_answer': workoutItemRequestDTO.wordTitleAnswer
        });

        return await _XML_UTILS.getJSONResponseByPATCHXml(requestURL, jsonStr);
    }
}