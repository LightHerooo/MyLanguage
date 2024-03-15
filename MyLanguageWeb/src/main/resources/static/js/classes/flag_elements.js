import {
    CssElementWithFlag
} from "./css/other/css_element_with_flag.js";

const _CSS_ELEMENT_WITH_LANG_FLAG = new CssElementWithFlag();

export class FlagElements {
    SPAN = new SpanFlagElement();
    DIV = new DivFlagElement();
}

class SpanFlagElement {
    #FLAG_ELEMENT = new FlagElement();
    create(countryObj, isSquared) {
        let span = document.createElement("span");
        this.setStyles(span, countryObj, isSquared);

        return span;
    }

    setStyles(spanFlagElement, countryObj, isSquared) {
        this.#FLAG_ELEMENT.setStyles(spanFlagElement, countryObj, isSquared);

        if (isSquared === true) {
            if (countryObj) {
                spanFlagElement.classList.add(_CSS_ELEMENT_WITH_LANG_FLAG.SPAN_FIS_FLAG_STYLE_ID);
            } else {
                spanFlagElement.classList.add(_CSS_ELEMENT_WITH_LANG_FLAG.SPAN_FIS_EMPTY_FLAG_STYLE_ID);
            }
        } else if (!countryObj) {
            spanFlagElement.classList.add(_CSS_ELEMENT_WITH_LANG_FLAG.SPAN_EMPTY_FLAG_STYLE_ID);
        }
    }
}

class DivFlagElement {
    #FLAG_ELEMENT = new FlagElement();
    create(countryObj, isSquared) {
        let div = document.createElement("div");
        this.setStyles(div, countryObj, isSquared);

        return div;
    }

    setStyles(divFlagElement, countryObj, isSquared) {
        this.#FLAG_ELEMENT.setStyles(divFlagElement, countryObj, isSquared);

        if (isSquared === true) {
            if (countryObj) {
                divFlagElement.classList.add(_CSS_ELEMENT_WITH_LANG_FLAG.DIV_FIS_FLAG_STYLE_ID);
            } else {
                divFlagElement.classList.add(_CSS_ELEMENT_WITH_LANG_FLAG.DIV_FIS_EMPTY_FLAG_STYLE_ID);
            }
        } else if (!countryObj) {
            divFlagElement.classList.add(_CSS_ELEMENT_WITH_LANG_FLAG.DIV_EMPTY_FLAG_STYLE_ID);
        }
    }
}

class FlagElement {
    setStyles(differentElement, countryObj, isSquared) {
        differentElement.className = "";
        differentElement.style.cssText = null;

        differentElement.classList.add("fi");
        if (countryObj) {
            differentElement.classList.add(`fi-${countryObj.code}`);
            differentElement.title = countryObj.title;
        }

        if (isSquared === true) {
            differentElement.classList.add("fis");
        }
    }
}