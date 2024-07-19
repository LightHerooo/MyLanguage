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

const _URL_TO_API_WORKOUT_TYPES = `${new UrlPaths().API.createFullPath()}/workout_types`;
const _URL_TO_API_WORKOUT_TYPES_GET = `${_URL_TO_API_WORKOUT_TYPES}/get`;
const _URL_TO_API_WORKOUT_TYPES_FIND = `${_URL_TO_API_WORKOUT_TYPES}/find`;
const _URL_TO_API_WORKOUT_TYPES_EDIT = `${_URL_TO_API_WORKOUT_TYPES}/edit`;

export class WorkoutTypesAPI {
    GET = new WorkoutTypesGETRequests();
    PATCH = new WorkoutTypesPATCHRequests();
}

class WorkoutTypesGETRequests {
    async getAll(title, isPrepared, isActive, numberOfItems, lastWorkoutTypeIdOnPreviousPage) {
        let requestURL = new URL(_URL_TO_API_WORKOUT_TYPES_GET);
        if (title) {
            requestURL.searchParams.set("title", title);
        }
        if (isPrepared !== null && isPrepared !== undefined) {
            requestURL.searchParams.set("is_prepared", isPrepared);
        }
        if (isActive !== null && isActive !== undefined) {
            requestURL.searchParams.set("is_active", isActive);
        }
        if (numberOfItems) {
            requestURL.searchParams.set("number_of_items", numberOfItems);
        }
        if (lastWorkoutTypeIdOnPreviousPage) {
            requestURL.searchParams.set("last_workout_type_id_on_previous_page", lastWorkoutTypeIdOnPreviousPage);
        }

        return await _XML_UTILS.sendGET(requestURL);
    }
    
    async findByCode(code) {
        let requestURL = new URL(`${_URL_TO_API_WORKOUT_TYPES_FIND}/by_code`);
        requestURL.searchParams.set("code", code);

        return await _XML_UTILS.sendGET(requestURL);
    }
}

class WorkoutTypesPATCHRequests {
    #currentHttpMethod = _HTTP_METHODS.PATCH;
    async editIsActive(entityEditValueByCodeRequestDTOObj) {
        let requestURL = new URL(`${_URL_TO_API_WORKOUT_TYPES_EDIT}/is_active`);
        let jsonStr = _JSON_UTILS.stringify({
            'code': entityEditValueByCodeRequestDTOObj.getCode(),
            'value': entityEditValueByCodeRequestDTOObj.getValue()
        });

        return await _XML_UTILS.sendJson(requestURL, this.#currentHttpMethod, jsonStr);
    }

    async switchAll(entityValueRequestDTOObj) {
        let requestURL = new URL(`${_URL_TO_API_WORKOUT_TYPES}/switch/all`);
        let jsonStr = _JSON_UTILS.stringify({
            'value': entityValueRequestDTOObj.getValue()
        });

        return await _XML_UTILS.sendJson(requestURL, this.#currentHttpMethod, jsonStr);
    }
}