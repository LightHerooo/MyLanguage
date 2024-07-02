import {
    MIMEType
} from "../mime_type.js";

export class FileMimeTypes {
    #TYPE = "*";

    ALL = new MIMEType(`${this.#TYPE}/*`, "*");
}