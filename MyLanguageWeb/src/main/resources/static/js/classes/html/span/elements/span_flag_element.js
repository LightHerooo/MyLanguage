import {
    CssSpanFlagElement
} from "../../../css/span/css_span_flag_element.js";

const _CSS_SPAN_FLAG_ELEMENT = new CssSpanFlagElement();

export class SpanFlagElement {
    #span;

    constructor(span) {
        this.#span = span;

        this.#tryToSetDefaultValues();
    }

    getSpan() {
        return this.#span;
    }

    #tryToSetDefaultValues() {
        let span = this.#span;
        if (!span) {
            span = document.createElement("span");
        }

        this.#span = span;
    }


    changeFlag(countryName, countryCode, isSquared) {
        let span = this.#span;
        if (span) {
            span.className = "";
            span.style.cssText = "";

            // Устанавливаем стиль флага на основе кода страны ---
            span.classList.add("fi");
            if (countryCode) {
                span.classList.add(`fi-${countryCode}`);
            }
            //---

            // Применяем дополнительные стили (если нужен квадратный/не квадратный флаг)
            if (isSquared) {
                span.classList.add("fis");
                if (countryCode) {
                    span.classList.add(_CSS_SPAN_FLAG_ELEMENT.SPAN_FLAG_ELEMENT_SQUARED_CLASS_ID);
                } else {
                    span.classList.add(_CSS_SPAN_FLAG_ELEMENT.SPAN_FLAG_ELEMENT_SQUARED_EMPTY_CLASS_ID);
                }
            } else if (!countryCode) {
                span.classList.add(_CSS_SPAN_FLAG_ELEMENT.SPAN_FLAG_ELEMENT_EMPTY_CLASS_ID);
            }
            //---

            // Устанавливаем подсказку при наведении ---
            if (countryName) {
                span.title = countryName;
            } else {
                span.title = "";
            }
            //---
        }
    }
}