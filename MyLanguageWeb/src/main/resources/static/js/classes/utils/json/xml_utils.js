import {
    JSONResponse
} from "./json_response.js";

export class XmlUtils {
    async getJSONResponseByGETXml(requestURL) {
        return new Promise(resolve => {
            let xml = new XMLHttpRequest();
            xml.open("GET", requestURL);
            xml.responseType = "json";

            xml.onload = function () {
                resolve(new JSONResponse(xml));
            }

            xml.send();
        })
    }

    async getJSONResponseByPOSTXml(requestURL, jsonStr) {
        return new Promise(resolve => {
            let xml = new XMLHttpRequest();
            xml.open("POST", requestURL);
            xml.setRequestHeader('Content-type', 'application/json; charset=utf-8');
            xml.responseType = "json";

            xml.onload = function () {
                resolve(new JSONResponse(xml));
            }

            xml.send(jsonStr);
        })
    }

    async getJSONResponseByPATCHXml(requestURL, jsonStr) {
        return new Promise(resolve => {
            let xml = new XMLHttpRequest();
            xml.open("PATCH", requestURL);
            xml.setRequestHeader('Content-type', 'application/json; charset=utf-8');
            xml.responseType = "json";

            xml.onload = function () {
                resolve(new JSONResponse(xml));
            }

            xml.send(jsonStr);
        })
    }

    async getJSONResponseByDELETEXml(requestURL, jsonStr) {
        return new Promise(resolve => {
            let xml = new XMLHttpRequest();
            xml.open("DELETE", requestURL);
            xml.setRequestHeader('Content-type', 'application/json; charset=utf-8');
            xml.responseType = "json";

            xml.onload = function () {
                resolve(new JSONResponse(xml));
            }

            xml.send(jsonStr);
        })
    }
}