import {
    jsonReviver
} from "./json_utils.js";

import {
    JSONResponse
} from "../classes/json_response.js";

export function buildJSONResponseByXml(xml) {
    let jsonStringify = JSON.stringify(xml.response);
    let json = JSON.parse(jsonStringify, jsonReviver);
    if (typeof json === 'string') {
        json = JSON.parse(json);
    }

    return new JSONResponse(xml.status, json);
}