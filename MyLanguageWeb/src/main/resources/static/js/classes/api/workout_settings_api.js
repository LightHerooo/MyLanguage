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

const URL_TO_API_WORKOUT_SETTINGS = new UrlToAPI().VALUE + "/workout_settings";
const URL_TO_API_WORKOUT_SETTINGS_FIND = URL_TO_API_WORKOUT_SETTINGS + "/find";

export class WorkoutSettingsAPI {
    GET = new WorkoutSettingsGETRequests();
    POST = new WorkoutSettingsPOSTRequests();
    PATCH = new WorkoutSettingsPATCHRequests();
}

class WorkoutSettingsGETRequests {
    async findByCustomerIdAndWorkoutTypeCode(customerId, workoutTypeCode) {
        let requestURL = new URL(URL_TO_API_WORKOUT_SETTINGS_FIND + "/by_customer_id_and_workout_type_code");
        requestURL.searchParams.set("customer_id", customerId);
        requestURL.searchParams.set("workout_type_code", workoutTypeCode);

        return await _XML_UTILS.getJSONResponseByGETXml(requestURL);
    }
}

class WorkoutSettingsPOSTRequests {
    async addInRandomWords(workoutSettingRequestDTO) {
        let requestURL = new URL(URL_TO_API_WORKOUT_SETTINGS + "/random_words");
        let jsonStr = _JSON_UTILS.stringify({
            'number_of_words': workoutSettingRequestDTO.numberOfWords,
            'lang_out_code': workoutSettingRequestDTO.langOutCode,
            'lang_in_code': workoutSettingRequestDTO.langInCode,
        });

        return await _XML_UTILS.getJSONResponseByPOSTXml(requestURL, jsonStr);
    }
}

class WorkoutSettingsPATCHRequests {
    async editInRandomWords(workoutSettingRequestDTO) {
        let requestURL = new URL(URL_TO_API_WORKOUT_SETTINGS + "/random_words");
        let jsonStr = _JSON_UTILS.stringify({
            'id': workoutSettingRequestDTO.id,
            'number_of_words': workoutSettingRequestDTO.numberOfWords,
            'lang_out_code': workoutSettingRequestDTO.langOutCode,
            'lang_in_code': workoutSettingRequestDTO.langInCode,
        });

        return await _XML_UTILS.getJSONResponseByPATCHXml(requestURL, jsonStr);
    }
}