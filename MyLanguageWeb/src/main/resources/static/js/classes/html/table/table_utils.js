import {
    CssDivElement
} from "../../css/elements/div/css_div_element.js";

import {
    CssTableElement
} from "../../css/elements/table/css_table_element.js";

import {
    SpanLoadingElement
} from "../span/elements/span_loading_element.js";

import {
    CssRoot
} from "../../css/css_root.js";

import {
    CssSpanElement
} from "../../css/elements/span/css_span_element.js";

import {
    EventNames
} from "../event_names.js";

const _CSS_ROOT = new CssRoot();
const _CSS_DIV_ELEMENT = new CssDivElement();
const _CSS_TABLE_ELEMENT = new CssTableElement();
const _CSS_SPAN_ELEMENT = new CssSpanElement();

const _EVENT_NAMES = new EventNames();

export class TableUtils {
    createDivWithTableBetweenTwoHorizontalDelimiters(table) {
        let div;
        if (table) {
            div = document.createElement("div");
            div.style.display = "grid";
            div.style.grid = "20px 1fr 20px / 1fr";
            div.style.marginBottom = "-5px";

            // Создаём разделитель ---
            let divDelimiter = document.createElement("div");
            divDelimiter.classList.add(_CSS_DIV_ELEMENT.DIV_ELEMENT_HORIZONTAL_DELIMITER_CLASS_ID);
            //---

            // Создаём контейнер для разделителя (чтобы разместить его по центру) ---
            let divDelimiterContainer = document.createElement("div");
            divDelimiterContainer.style.display = "grid";
            divDelimiterContainer.style.alignItems = "center";
            divDelimiterContainer.appendChild(divDelimiter);
            //---

            div.appendChild(divDelimiterContainer.cloneNode(true));
            div.appendChild(table);
            div.appendChild(divDelimiterContainer.cloneNode(true));
        }

        return div;
    }

    createTrWithAnyElement(anyElement, numberOfColumns, doNeedToClearBackground) {
        let tr;
        if (anyElement && numberOfColumns) {
            // Создаём контейнер с элементом внутри ---
            let divContainer = document.createElement("div");
            divContainer.style.display = "grid";
            divContainer.style.minHeight = "50px";

            divContainer.appendChild(anyElement);
            //---

            // Создаём колонку на всю ширину таблицы ---
            let td = document.createElement("td");
            td.colSpan = numberOfColumns;
            td.style.padding = "0px";

            td.appendChild(divContainer);
            //---

            // Создаём строку таблицы ---
            tr = document.createElement("tr");
            if (doNeedToClearBackground) {
                tr.style.background = "transparent";
            }

            tr.appendChild(td);
            //---
        }

        return tr;
    }

    createTrWithMessage(message, rootFontSize, numberOfColumns, doNeedToClearBackground) {
        let span = document.createElement("span");
        span.classList.add(_CSS_SPAN_ELEMENT.SPAN_ELEMENT_TEXT_ALIGN_CENTER_CLASS_ID);

        if (!message) {
            message = "???";
        }

        if (!rootFontSize) {
            rootFontSize = _CSS_ROOT.SMALL_FONT_SIZE_STYLE_ID;
        }

        span.style.fontSize = rootFontSize;
        span.textContent = message;

        return this.createTrWithAnyElement(span, numberOfColumns, doNeedToClearBackground);
    }

    createTrShowMore(numberOfColumns, message, showMoreFunction) {
        // Создаём кнопку "Показать больше" ---
        let button = document.createElement("button");
        button.classList.add(_CSS_TABLE_ELEMENT.BUTTON_SHOW_MORE_CLASS_ID);
        button.textContent = message;
        //---

        // Генерируем строку с кнопкой ---
        let tr = this.createTrWithAnyElement(button, numberOfColumns, false);
        //---

        if (tr) {
            // Вешаем переданную функцию на кнопку ---
            button.addEventListener(_EVENT_NAMES.BUTTON.CLICK, async function () {
                tr.replaceChildren();

                // Генерируем колонку с загрузкой ---
                let contentCenterContainer = document.createElement("div");
                contentCenterContainer.classList.add(_CSS_DIV_ELEMENT.DIV_ELEMENT_CONTENT_CENTER_CLASS_ID);
                contentCenterContainer.appendChild(new SpanLoadingElement(null).getSpan());

                let td = document.createElement("td");
                td.colSpan = numberOfColumns;

                td.appendChild(contentCenterContainer);
                tr.appendChild(td);
                //---

                await showMoreFunction();

                // Очищаем колонку, чтобы оставить полосу-разделитель ---
                td.replaceChildren();
                //---
            });
            //---
        }

        return tr;
    }
}