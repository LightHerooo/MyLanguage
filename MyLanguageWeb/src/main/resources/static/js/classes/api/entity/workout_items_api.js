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
    UrlPaths
} from "../../url/path/url_paths.js";

const _XML_UTILS = new XmlUtils();
const _JSON_UTILS = new JSONUtils();
const _HTTP_METHODS = new HttpMethods();

const _URL_TO_API_WORKOUT_ITEMS = `${new UrlPaths().API.createFullPath()}/workout_items`;
const _URL_TO_API_WORKOUT_ITEMS_GET = `${_URL_TO_API_WORKOUT_ITEMS}/get`;
const _URL_TO_API_WORKOUT_ITEMS_COUNT = `${_URL_TO_API_WORKOUT_ITEMS}/count`;
const _URL_TO_API_WORKOUT_ITEMS_FIND = `${_URL_TO_API_WORKOUT_ITEMS}/find`;
const _URL_TO_API_WORKOUT_ITEMS_EDIT = `${_URL_TO_API_WORKOUT_ITEMS}/edit`;

export class WorkoutItemsAPI {
    GET = new WorkoutItemsGETRequests();
    PATCH = new WorkoutItemsPATCHRequests();
}

class WorkoutItemsGETRequests {
    async getAll(workoutId, isQuestionWithAnswer, roundNumber) {
        let requestURL = new URL(_URL_TO_API_WORKOUT_ITEMS_GET);

        requestURL.searchParams.set("workout_id", workoutId);
        if (isQuestionWithAnswer !== null && isQuestionWithAnswer !== undefined) {
            requestURL.searchParams.set("is_question_with_answer", isQuestionWithAnswer);
        }
        if (roundNumber) {
            requestURL.searchParams.set("round_number", roundNumber);
        }

        return await _XML_UTILS.sendGET(requestURL);
    }

    async getCount(workoutId, isQuestionWithAnswer, roundNumber) {
        let requestURL = new URL(_URL_TO_API_WORKOUT_ITEMS_COUNT);

        requestURL.searchParams.set("workout_id", workoutId);
        if (isQuestionWithAnswer !== null && isQuestionWithAnswer !== undefined) {
            requestURL.searchParams.set("is_question_with_answer", isQuestionWithAnswer);
        }
        if (roundNumber) {
            requestURL.searchParams.set("round_number", roundNumber);
        }

        return await _XML_UTILS.sendGET(requestURL);
    }

    async findRandomWithoutAnswer(workoutId, roundNumber){
        let requestURL = new URL(`${_URL_TO_API_WORKOUT_ITEMS_FIND}/random_without_answer`);
        requestURL.searchParams.set("workout_id", workoutId);
        requestURL.searchParams.set("round_number", roundNumber);

        return await _XML_UTILS.sendGET(requestURL);
    }
}

class WorkoutItemsPATCHRequests {
    #currentHttpMethod = _HTTP_METHODS.PATCH;
    async editAnswer(workoutItemEditAnswerRequestDTOObj) {
        let requestURL = new URL(`${_URL_TO_API_WORKOUT_ITEMS_EDIT}/answer`);
        let jsonStr = _JSON_UTILS.stringify({
            'id': workoutItemEditAnswerRequestDTOObj.getId(),
            'answer': workoutItemEditAnswerRequestDTOObj.getAnswer()
        });

        return await _XML_UTILS.sendJson(requestURL, this.#currentHttpMethod, jsonStr);
    }
}