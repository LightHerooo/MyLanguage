import {
    JsonResponse
} from "../classes/json_response.js";

import {
    HttpMethods
} from "../classes/http/http_methods.js";

const _HTTP_METHODS = new HttpMethods();
export class XmlUtils {
    async sendGET(requestURL) {
        return new Promise(resolve => {
            let xml = new XMLHttpRequest();
            xml.open(_HTTP_METHODS.GET, requestURL);
            xml.responseType = "json";

            xml.onload = function () {
                resolve(new JsonResponse(xml));
            }

            xml.send();
        })
    }

    async sendJson(requestURL, httpMethod, jsonStr) {
        return new Promise(resolve => {
            let xml = new XMLHttpRequest();
            xml.open(httpMethod, requestURL);
            xml.setRequestHeader('Content-type', 'application/json; charset=utf-8');
            xml.responseType = "json";

            xml.onload = function () {
                resolve(new JsonResponse(xml));
            }

            xml.send(jsonStr);
        })
    }

    async sendFormData(requestURL, httpMethod, formData) {
        return new Promise(resolve => {
            let xml = new XMLHttpRequest();
            xml.open(httpMethod, requestURL);
            xml.responseType = "json";

            xml.onload = function () {
                resolve(new JsonResponse(xml));
            }

            xml.send(formData);
        })
    }
}