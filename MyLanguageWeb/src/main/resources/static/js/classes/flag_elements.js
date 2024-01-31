import {
    CssElementWithFlag
} from "./css/css_element_with_flag.js";

const _CSS_ELEMENT_WITH_LANG_FLAG = new CssElementWithFlag();

export class FlagElements {
    SPAN = new SpanFlagElement();
    DIV = new DivFlagElement();
}

class SpanFlagElement {
    #FLAG_ELEMENT = new FlagElement();
    create(countryCode, isSquared) {
        let span = document.createElement("span");
        this.setStyles(span, countryCode, isSquared);

        return span;
    }

    setStyles(spanFlagElement, countryCode, isSquared) {
        this.#FLAG_ELEMENT.setStyles(spanFlagElement, countryCode, isSquared);

        if (isSquared === true) {
            if (countryCode) {
                spanFlagElement.classList.add(_CSS_ELEMENT_WITH_LANG_FLAG.SPAN_FIS_FLAG_STYLE_ID);
            } else {
                spanFlagElement.classList.add(_CSS_ELEMENT_WITH_LANG_FLAG.SPAN_FIS_EMPTY_FLAG_STYLE_ID);
            }
        } else if (!countryCode) {
            spanFlagElement.classList.add(_CSS_ELEMENT_WITH_LANG_FLAG.SPAN_EMPTY_FLAG_STYLE_ID);
        }
    }
}

class DivFlagElement {
    #FLAG_ELEMENT = new FlagElement();
    create(countryCode, isSquared) {
        let div = document.createElement("div");
        this.setStyles(div, countryCode, isSquared);

        return div;
    }

    setStyles(divFlagElement, countryCode, isSquared) {
        this.#FLAG_ELEMENT.setStyles(divFlagElement, countryCode, isSquared);

        if (isSquared === true) {
            if (countryCode) {
                divFlagElement.classList.add(_CSS_ELEMENT_WITH_LANG_FLAG.DIV_FIS_FLAG_STYLE_ID);
            } else {
                divFlagElement.classList.add(_CSS_ELEMENT_WITH_LANG_FLAG.DIV_FIS_EMPTY_FLAG_STYLE_ID);
            }
        } else if (!countryCode) {
            divFlagElement.classList.add(_CSS_ELEMENT_WITH_LANG_FLAG.DIV_EMPTY_FLAG_STYLE_ID);
        }
    }
}

class FlagElement {
    setStyles(differentElement, countryCode, isSquared) {
        differentElement.className = "";
        differentElement.style.cssText = null;

        differentElement.classList.add("fi");
        if (countryCode) {
            differentElement.classList.add(`fi-${countryCode}`);
        }

        if (isSquared === true) {
            differentElement.classList.add("fis");
        }
    }
}