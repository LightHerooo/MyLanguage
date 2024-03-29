import {
    CssMain
} from "../css/css_main.js";

import {
    LoadingElement
} from "../loading_element.js";

const _CSS_MAIN = new CssMain();

class GeneralFunctions {
    createTrWithElementInside(numberOfColumns, differentElement, doNeedToRemovePadding, doNeedToClearBackground) {
        // Создаём контейнер разделителя ---
        let divContainer = document.createElement("div");
        divContainer.style.display = "grid";
        divContainer.appendChild(differentElement);
        //---

        // Создаём колонку с длиной на все колонки ---
        let td = document.createElement("td");
        td.colSpan = numberOfColumns;
        if (doNeedToRemovePadding === true) {
            td.style.padding = "0px";
        }

        td.appendChild(divContainer);
        //---

        // Создаём строку таблицы ---
        let tr = document.createElement("tr");
        if (doNeedToClearBackground === true) {
            tr.style.background = "none";
        }

        tr.appendChild(td);
        //---

        return tr;
    }
}

export class TableUtils {
    #GENERAL_FUNCTIONS = new GeneralFunctions();
    MESSAGES_INSIDE_TABLE = new MessagesInsideTable();

    getNumberOfColumnsByTableHead(tableHeadElement) {
        let numberOfColumns = 0;
        let trTableHead = tableHeadElement.children.item(0);
        if (trTableHead) {
            for (let i = 0; i < trTableHead.childElementCount; i++) {
                let child = trTableHead.children.item(i);
                if (child.colSpan) {
                    numberOfColumns += child.colSpan;
                } else {
                    numberOfColumns++;
                }
            }
        }

        return numberOfColumns;
    }

    getNumberOfColumnsByColgroup(colgroupElement) {
        return colgroupElement.childElementCount;
    }

    createTrWithElementInside(numberOfColumns, differentElement, doNeedToRemovePadding, doNeedToClearBackground) {
        return this.#GENERAL_FUNCTIONS.createTrWithElementInside(
            numberOfColumns, differentElement, doNeedToRemovePadding, doNeedToClearBackground);
    }

    createTrShowMore(numberOfColumns, message, callback) {
        // Создаём кнопку "Показать больше" ---
        let aBtnShowMore = document.createElement("a");
        aBtnShowMore.classList.add(_CSS_MAIN.A_BUTTON_STANDARD_STYLE_ID);
        aBtnShowMore.classList.add(_CSS_MAIN.A_SHOW_MORE_STANDARD_STYLE_ID);
        aBtnShowMore.textContent = message;
        //---

        // Создаём строку таблицы без фона ---
        let trShowMore =
            this.createTrWithElementInside(
                numberOfColumns, aBtnShowMore, true, true);
        //---

        // Вешаем событие на кнопку ---
        aBtnShowMore.addEventListener("click", async function () {
            let tableBody = trShowMore.parentNode;
            tableBody.removeChild(trShowMore);

            let tableUtils = new TableUtils();
            let trMessage = tableUtils.MESSAGES_INSIDE_TABLE.createTrLoading(numberOfColumns);
            tableBody.appendChild(trMessage);

            await callback();

            for (let i = 0; i < trMessage.childElementCount; i++) {
                let childElement = trMessage.children.item(i);
                childElement.replaceChildren();
            }
        });
        //---

        return trShowMore;
    }

    createElementBetweenTwoHorizontalDelimiters(tableElement) {
        let div = document.createElement("div");
        div.style.display = "grid";
        div.style.grid = "20px 1fr 20px / 1fr";
        div.style.marginBottom = "-5px";

        // Создаём разделитель ---
        let divDelimiter = document.createElement("div");
        divDelimiter.classList.add(_CSS_MAIN.DIV_HORIZONTAL_DELIMITER_STYLE_ID);
        //---

        // Создаём контейнер для разделителя (чтобы разместить его по центру) ---
        let divDelimiterContainer = document.createElement("div");
        divDelimiterContainer.style.display = "grid";
        divDelimiterContainer.style.alignItems = "center";
        divDelimiterContainer.appendChild(divDelimiter);
        //---

        div.appendChild(divDelimiterContainer.cloneNode(true));
        div.appendChild(tableElement);
        div.appendChild(divDelimiterContainer.cloneNode(true));

        return div;
    }
}

class MessagesInsideTable {
    #GENERAL_FUNCTIONS = new GeneralFunctions();

    createTrCommon(numberOfColumns, text) {
        let divMessage = document.createElement("div");
        divMessage.textContent = text;
        divMessage.style.textAlign = "center";

        return this.#GENERAL_FUNCTIONS.createTrWithElementInside(
            numberOfColumns, divMessage, false, false);
    }

    createTrLoading(numberOfColumns) {
        let loadingElement = new LoadingElement();
        return this.#GENERAL_FUNCTIONS.createTrWithElementInside(
            numberOfColumns, loadingElement.createDiv(), false, false);
    }
}
