import {
    CssTableElement
} from "../../../css/table/css_table_element.js";

import {
    CssDivElement
} from "../../../css/div/css_div_element.js";

import {
    CssRoot
} from "../../../css/css_root.js";

import {
    TableUtils
} from "../table_utils.js";

import {
    BigIntUtils
} from "../../../utils/bigint_utils.js";

const _CSS_ROOT = new CssRoot();
const _CSS_TABLE_ELEMENT = new CssTableElement();
const _CSS_DIV_ELEMENT = new CssDivElement();

const _TABLE_UTILS = new TableUtils();
const _BIGINT_UTILS = new BigIntUtils();

export class TableAbstractElement {
    #table;
    #colgroup;
    #thead;
    #tbody;

    #currentRowNumber = 0n;
    #valueForNextPage = null;

    #isPrepared = false;

    constructor(table, colgroup, thead, tbody) {
        if (this.constructor === TableAbstractElement) {
            throw new Error('Abstract classes can\'t be instantiated.');
        }

        this.#table = table;
        this.#colgroup = colgroup;
        this.#thead = thead;
        this.#tbody = tbody;

        this.#tryToSetDefaultValues();
    }

    getTable() {
        return this.#table;
    }

    setTable(table) {
        this.#table = table;
    }

    getColgroup() {
        return this.#colgroup;
    }

    setColgroup(colgroup) {
        this.#colgroup = colgroup;
    }

    getThead() {
        return this.#thead;
    }

    setThead(thead) {
        this.#thead = thead;
    }

    getTbody() {
        return this.#tbody;
    }

    setTbody(tbody) {
        this.#tbody = tbody;
    }


    getNumberOfColumns() {
        let numberOfColumns = this.#getNumberOfColumnsByColgroup();
        if (!numberOfColumns) {
            numberOfColumns = this.#getNumberOfColumnsByThead();
        }

        return numberOfColumns;
    }

    getCurrentRowNumber() {
        return this.#currentRowNumber;
    }

    setCurrentRowNumber(value) {
        let valueBI = _BIGINT_UTILS.parse(value);
        if (!valueBI) {
            valueBI = 0n;
        }

        this.#currentRowNumber = valueBI;
    }

    incrementCurrentRowNumber() {
        this.#currentRowNumber++;
    }

    getValueForNextPage() {
        return this.#valueForNextPage;
    }

    setValueForNextPage(value) {
        this.#valueForNextPage = value;
    }

    getIsPrepared() {
        return this.#isPrepared;
    }

    #tryToSetDefaultValues() {
        let table = this.#table;
        if (!table) {
            table = document.createElement("table");
            table.classList.add(_CSS_TABLE_ELEMENT.TABLE_ELEMENT_CLASS_ID);
        }

        let colgroup = this.#colgroup;
        let thead = this.#thead;
        if (!colgroup && !thead) {
            thead = document.createElement("thead");
            thead.classList.add(_CSS_TABLE_ELEMENT.THEAD_TABLE_ELEMENT_MEDIUM_CLASS_ID);
        }

        let tbody = this.#tbody;
        if (!tbody) {
            tbody = document.createElement("tbody");
        }


        // Добавляем элементы в таблицу, если они не имеют родителя ---
        if (colgroup && !colgroup.parentElement) {
            table.appendChild(colgroup);
        }

        if (thead && !thead.parentElement) {
            table.appendChild(thead);
        }

        if (tbody && !tbody.parentElement) {
            table.appendChild(tbody);
        }
        //---

        this.#table = table;
        this.#colgroup = colgroup;
        this.#thead = thead;
        this.#tbody = tbody;
    }

    #getNumberOfColumnsByColgroup() {
        let numberOfColumns = 0;
        let colgroup = this.#colgroup;
        if (colgroup) {
            numberOfColumns = colgroup.childElementCount;
        }

        return numberOfColumns;
    }

    #getNumberOfColumnsByThead() {
        let numberOfColumns = 0;
        let thead = this.#thead;
        if (thead) {
            let tr = thead.children.item(0);
            if (tr) {
                for (let i = 0; i < tr.childElementCount; i++) {
                    let child = tr.children.item(i);
                    if (child.colSpan) {
                        numberOfColumns += child.colSpan;
                    } else {
                        numberOfColumns++;
                    }
                }
            }
        }

        return numberOfColumns;
    }


    async prepare() {
        let isPrepared = this.#isPrepared;
        if (!isPrepared) {
            this.#isPrepared = true;
        } else {
            throw new Error("Object \'TableAbstractElement\' has already been prepared");
        }
    }


    buildNewTable() {
        this.#table = null;
        this.#colgroup = null;
        this.#thead = null;
        this.#tbody = null;

        this.#tryToSetDefaultValues();
    }

    clear() {
        let isPrepared = this.#isPrepared;
        if (isPrepared) {
            let tbody = this.#tbody;
            if (tbody) {
                tbody.replaceChildren();
            }
        } else {
            throw new Error("Object \'TableAbstractElement\' is not prepared");
        }
    }

    showMessage(message, rootFontSize) {
        let isPrepared = this.#isPrepared;
        if (isPrepared) {
            if (!message) {
                message = "???";
            }

            if (!rootFontSize) {
                rootFontSize = _CSS_ROOT.SMALL_FONT_SIZE_STYLE_ID;
            }

            let divMessage = document.createElement("div");
            divMessage.classList.add(_CSS_DIV_ELEMENT.DIV_ELEMENT_CONTENT_CENTER_CLASS_ID);
            divMessage.style.fontSize = rootFontSize;
            divMessage.textContent = message;

            let tr = _TABLE_UTILS.createTrWithMessage(message, rootFontSize, this.getNumberOfColumns(),
                false);
            if (tr) {
                this.clear();
                this.addTr(tr);
            }
        } else {
            throw new Error("Object \'TableAbstractElement\' is not prepared");
        }
    }


    addTr(tr) {
        let isPrepared = this.#isPrepared;
        if (isPrepared) {
            let tbody = this.#tbody;
            if (tbody && tr) {
                tbody.appendChild(tr);
            }
        } else {
            throw new Error("Object \'TableAbstractElement\' is not prepared");
        }
    }

    async fill() {
        let isPrepared = this.#isPrepared;
        if (isPrepared) {
            // Очищаем данные для генерации строк ---
            this.setValueForNextPage(0n);
            this.setValueForNextPage(null);
            //---

            let trsArr = await this.tryToCreateTrsArr(true);
            if (trsArr) {
                this.clear();

                for (let tr of trsArr) {
                    this.addTr(tr);
                }
            }
        } else {
            throw new Error("Object \'TableAbstractElement\' is not prepared");
        }
    }

    createTrShowMore(message) {
        let isPrepared = this.#isPrepared;
        if (isPrepared) {
            let self = this;
            return _TABLE_UTILS.createTrShowMore(this.getNumberOfColumns(), message, async function() {
                let trsArr = await self.tryToCreateTrsArr(false);
                if (trsArr) {
                    for (let tr of trsArr) {
                        self.addTr(tr);
                    }
                }
            });
        } else {
            throw new Error("Object \'TableAbstractElement\' is not prepared");
        }
    }


    async tryToCreateTrsArr(giveAccessToShowMessage) {
        let trsArr;

        let testValue = true;
        if (testValue) {
            trsArr = [];

            let divMessageNotPrepared = document.createElement("div");
            divMessageNotPrepared.classList.add(_CSS_DIV_ELEMENT.DIV_ELEMENT_CONTENT_CENTER_CLASS_ID);
            divMessageNotPrepared.textContent = "Генерация строк таблицы не подготовлена";

            let tr = _TABLE_UTILS.createTrWithAnyElement(
                divMessageNotPrepared, this.getNumberOfColumns(), false);
            if (tr) {
                trsArr.push(tr);
            }
        } else if (giveAccessToShowMessage) {
            this.showMessage("Сообщение не подготовлено", _CSS_ROOT.SMALL_FONT_SIZE_STYLE_ID)
        }

        return trsArr;
    }


    changeDisabledStatusToTableInstruments(isDisabled) {
        throw new Error('Method \'changeDisabledStatusToTableInstruments(isDisabled)\' must be implemented.');
    }
}