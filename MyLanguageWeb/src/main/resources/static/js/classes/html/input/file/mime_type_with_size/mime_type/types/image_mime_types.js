import {
    MIMEType
} from "../mime_type.js";

export class ImageMIMETypes {
    #TYPE = "image";

    ALL = new MIMEType(`${this.#TYPE}/*`, "*");
    PNG = new MIMEType(`${this.#TYPE}/png`, ".PNG");
    JPG = new MIMEType(`${this.#TYPE}/jpg`, ".JPG");
    JPEG = new MIMEType(`${this.#TYPE}/jpeg`,".JPEG");
    GIF = new MIMEType(`${this.#TYPE}/gif`, ".GIF");
}