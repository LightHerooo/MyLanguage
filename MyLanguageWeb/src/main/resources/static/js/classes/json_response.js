export class JSONResponse {
    status;
    json;
    constructor(status, json) {
        this.status = status;
        this.json = json;
    }
}