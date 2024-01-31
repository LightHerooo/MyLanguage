import {
    JSONUtils
} from "./json_utils.js";

const _JSON_UTILS = new JSONUtils();

export class JSONResponse {
    status;
    json;
    constructor(xml) {
        let jsonStr = JSON.stringify(xml.response);
        let json = _JSON_UTILS.parse(jsonStr);
        if (typeof json === 'string') {
            json = JSON.parse(json);
        }

        this.status = xml.status;
        this.json = json;
    }
}