import {
    CssDivWithDataBuilderElement
} from "../../../css/elements/div/css_div_with_data_builder_element.js";

import {
    CssDivElement
} from "../../../css/elements/div/css_div_element.js";

const _CSS_DIV_ELEMENT = new CssDivElement();
const _CSS_DIV_WITH_DATA_BUILDER_ELEMENT = new CssDivWithDataBuilderElement();

export class DivWithDataBuilderElement {
    #divContainer;

    constructor() {
        this.#tryToSetDefaultValues();
    }

    getDivContainer() {
        return this.#divContainer;
    }


    #tryToSetDefaultValues() {
        let divContainer = this.#divContainer;
        if (!divContainer) {
            divContainer = document.createElement("div");
            divContainer.classList.add(_CSS_DIV_WITH_DATA_BUILDER_ELEMENT.DIV_WITH_DATA_BUILDER_ELEMENT_CONTAINER_CLASS_ID);
        }

        this.#divContainer = divContainer;
    }


    addDataRowBySpan(leftSpan, rightSpan) {
        let div = this.#divContainer;
        if (div) {
            // Подготавливаем новую строку ---
            let divRowContainer = document.createElement("div");
            divRowContainer.classList.add(_CSS_DIV_WITH_DATA_BUILDER_ELEMENT.DIV_WITH_DATA_BUILDER_ELEMENT_ROW_CONTAINER_CLASS_ID);

            if (leftSpan) {
                leftSpan.classList.add(_CSS_DIV_WITH_DATA_BUILDER_ELEMENT.SPAN_DIV_WITH_DATA_BUILDER_ELEMENT_ROW_LEFT_CONTENT_CLASS_ID);
                divRowContainer.appendChild(leftSpan);
            }

            if (rightSpan) {
                rightSpan.classList.add(_CSS_DIV_WITH_DATA_BUILDER_ELEMENT.SPAN_DIV_WITH_DATA_BUILDER_ELEMENT_ROW_RIGHT_CONTENT_CLASS_ID);
                divRowContainer.appendChild(rightSpan);
            }
            //---

            div.appendChild(divRowContainer);
        }
    }

    addDataRowByStr(leftStr, rightStr) {
        let leftSpan = document.createElement("span");
        leftSpan.textContent = leftStr;

        let rightSpan = document.createElement("span");
        rightSpan.textContent = rightStr;

        this.addDataRowBySpan(leftSpan, rightSpan);
    }

    addExtraContentBySpan(span) {
        let div = this.#divContainer;
        if (div && span) {
            span.classList.add(_CSS_DIV_WITH_DATA_BUILDER_ELEMENT.
                SPAN_DIV_WITH_DATA_BUILDER_ELEMENT_EXTRA_CONTENT_CLASS_ID);

            div.appendChild(span);
        }
    }

    addExtraContentByStr(str) {
        let span = document.createElement("span");
        span.textContent = str;

        this.addExtraContentBySpan(span);
    }

    addBr() {
        let div = this.#divContainer;
        if (div) {
            let br = document.createElement("br");
            div.appendChild(br);
        }
    }



    addSpanShowMore(divWithTimerElementObj, spanShowMessage, spanHideMessage) {
        let div = this.getDivContainer();
        if (div && divWithTimerElementObj) {
            // Создаем дополнительный контейнер для генерации контента внутри вне зависимости от его позиции ---
            let divForSpanShowMore = document.createElement("div");
            divForSpanShowMore.style.display = "grid";
            divForSpanShowMore.style.justifyContent = "left";
            //---

            // Строка "Показать больше" ---
            let spanShowMore = document.createElement("span");
            spanShowMore.classList.add(_CSS_DIV_WITH_DATA_BUILDER_ELEMENT.SPAN_DIV_WITH_DATA_BUILDER_ELEMENT_SHOW_MORE_CLASS_ID);

            divForSpanShowMore.appendChild(spanShowMore);
            //---

            // Создаем контейнер, который будет появляться при нажатии на строку "Показать больше" ---
            let divForShowMoreContent = document.createElement("div");
            divForShowMoreContent.style.marginLeft = "15px";

            if (!spanShowMessage) {
                spanShowMessage = "Показать больше...";
            }

            if (!spanHideMessage) {
                spanHideMessage = "Скрыть..."
            }

            let showFunction = function() {
                // Генерируем выпадающий контейнер ---
                divForShowMoreContent.replaceChildren();

                let divHorizontalDelimiter = document.createElement("div");
                divHorizontalDelimiter.classList.add(_CSS_DIV_ELEMENT.DIV_ELEMENT_HORIZONTAL_DELIMITER_CLASS_ID);
                divHorizontalDelimiter.style.margin = "5px 0 5px 0";
                divForShowMoreContent.appendChild(divHorizontalDelimiter);

                let divContent = divWithTimerElementObj.getDiv();
                if (divContent) {
                    divForShowMoreContent.appendChild(divContent);
                }

                divHorizontalDelimiter = divHorizontalDelimiter.cloneNode(true);
                divForShowMoreContent.appendChild(divHorizontalDelimiter);
                //---

                // Добавляем сгенерированный контейнер к строке "Показать больше" ---
                divForSpanShowMore.appendChild(divForShowMoreContent);
                //---

                // Запускаем поиск ---
                divWithTimerElementObj.startToFill();
                //---

                spanShowMore.textContent = spanHideMessage;
                spanShowMore.onclick = hideFunction;
            }

            let hideFunction = function() {
                divWithTimerElementObj.stopToFill();

                let parentElement = divForShowMoreContent.parentElement;
                if (parentElement) {
                    parentElement.removeChild(divForShowMoreContent);
                }

                spanShowMore.textContent = spanShowMessage;
                spanShowMore.onclick = showFunction;
            }

            divForSpanShowMore.appendChild(divForShowMoreContent);
            //---

            // Вешаем события на строку "Показать больше" ---
            spanShowMore.textContent = spanShowMessage;
            spanShowMore.onclick = showFunction;
            //---

            div.appendChild(divForSpanShowMore);
        }
    }
}