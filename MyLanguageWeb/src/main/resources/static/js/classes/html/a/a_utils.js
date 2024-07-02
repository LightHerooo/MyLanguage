import {
    HrefTypes
} from "./href_types.js";

const _HREF_TYPES = new HrefTypes();

export class AUtils {
    changeHrefType(a, hrefType) {
        if (a && hrefType) {
            if (hrefType === _HREF_TYPES.OPEN_IN_NEW_PAGE) {
                a.target = hrefType;
                a.rel = "noopener noreferrer";
            } else {
                a.removeAttribute("target");
                a.removeAttribute("rel");
            }
        }
    }
}