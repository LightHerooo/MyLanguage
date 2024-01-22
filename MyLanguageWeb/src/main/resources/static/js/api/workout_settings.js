import {
    URL_TO_API
} from "./variables.js";

import {
    buildJSONResponseByXml
} from "../utils/json_response_utils.js";

import {
    jsonReplacer
} from "../utils/json_utils.js";

const URL_TO_API_WORKOUT_SETTINGS = URL_TO_API + "/workout_settings";

const URL_TO_API_WORKOUT_SETTINGS_FIND = URL_TO_API_WORKOUT_SETTINGS + "/find";
const URL_TO_API_WORKOUT_SETTINGS_FIND_BY_WORKOUT_TYPE_CODE_AND_CUSTOMER_ID =
    URL_TO_API_WORKOUT_SETTINGS_FIND + "/by_workout_type_code_and_customer_id"

const URL_TO_API_WORKOUT_SETTINGS_ADD = URL_TO_API_WORKOUT_SETTINGS + "/add";
const URL_TO_API_WORKOUT_SETTINGS_ADD_RANDOM_WORDS = URL_TO_API_WORKOUT_SETTINGS_ADD + "/random_words";

const URL_TO_API_WORKOUT_SETTINGS_EDIT = URL_TO_API_WORKOUT_SETTINGS + "/edit";
const URL_TO_API_WORKOUT_SETTINGS_EDIT_RANDOM_WORDS = URL_TO_API_WORKOUT_SETTINGS_EDIT + "/random_words";

export async function getJSONResponseFindWorkoutSettingByWorkoutTypeCodeAndCustomerId(workoutTypeCode, customerId) {
    return new Promise(resolve => {
        let requestURL = new URL(URL_TO_API_WORKOUT_SETTINGS_FIND_BY_WORKOUT_TYPE_CODE_AND_CUSTOMER_ID);
        requestURL.searchParams.set("workout_type_code", workoutTypeCode);
        requestURL.searchParams.set("customer_id", customerId);

        let xml = new XMLHttpRequest();
        xml.open("GET", requestURL);
        xml.responseType = "json";

        xml.onload = function () {
            resolve(buildJSONResponseByXml(xml));
        }

        xml.send();
    })
}

export async function postJSONResponseAddSettingInRandomWords(workoutSettingRequestDTO) {
    return new Promise(resolve => {
        let requestURL = new URL(URL_TO_API_WORKOUT_SETTINGS_ADD_RANDOM_WORDS);
        let jsonStr = JSON.stringify({
            'number_of_words': workoutSettingRequestDTO.numberOfWords,
            'lang_out_code': workoutSettingRequestDTO.langOutCode,
            'lang_in_code': workoutSettingRequestDTO.langInCode,
        }, jsonReplacer);

        let xml = new XMLHttpRequest();
        xml.open("POST", requestURL);
        xml.setRequestHeader('Content-type', 'application/json; charset=utf-8');
        xml.responseType = "json";

        xml.onload = function () {
            resolve(buildJSONResponseByXml(xml));
        }

        xml.send(jsonStr);
    })
}

export async function patchJSONResponseEditSettingInRandomWords(workoutSettingRequestDTO){
    return new Promise(resolve => {
        let requestURL = new URL(URL_TO_API_WORKOUT_SETTINGS_EDIT_RANDOM_WORDS);
        let jsonStr = JSON.stringify({
            'id': workoutSettingRequestDTO.id,
            'number_of_words': workoutSettingRequestDTO.numberOfWords,
            'lang_out_code': workoutSettingRequestDTO.langOutCode,
            'lang_in_code': workoutSettingRequestDTO.langInCode,
        }, jsonReplacer);

        let xml = new XMLHttpRequest();
        xml.open("PATCH", requestURL);
        xml.setRequestHeader('Content-type', 'application/json; charset=utf-8');
        xml.responseType = "json";

        xml.onload = function () {
            resolve(buildJSONResponseByXml(xml));
        }

        xml.send(jsonStr);
    })
}