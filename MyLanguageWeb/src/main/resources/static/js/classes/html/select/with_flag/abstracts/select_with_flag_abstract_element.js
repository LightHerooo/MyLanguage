import {
    SpanFlagElement
} from "../../../span/elements/span_flag_element.js";

import {
    CssSelectElement
} from "../../../../css/select/css_select_element.js";

import {
    SelectAbstractElement
} from "../../abstracts/select_abstract_element.js";

import {
    EventNames
} from "../../../event_names.js";

const _CSS_SELECT_ELEMENT = new CssSelectElement();

const _EVENT_NAMES = new EventNames();

export class SelectWithFlagAbstractElement extends SelectAbstractElement {
    #divContainer;
    #spanFlag;

    #spanFlagElement;

    constructor(divContainer, select, spanFlag, doNeedToCreateFirstOption) {
        super(select, doNeedToCreateFirstOption);
        if (this.constructor === SelectWithFlagAbstractElement) {
            throw new Error('Abstract classes can\'t be instantiated.');
        }

        this.#divContainer = divContainer;
        this.#spanFlag = spanFlag;

        this.#tryToSetDefaultValues();
    }

    getDivContainer() {
        return this.#divContainer;
    }

    getSpanFlag() {
        return this.#spanFlag;
    }

    getSpanFlagElement() {
        return this.#spanFlagElement;
    }


    #tryToSetDefaultValues() {
        let divContainer = this.#divContainer;
        if (!divContainer) {
            divContainer = document.createElement("div");
            divContainer.classList.add(_CSS_SELECT_ELEMENT.DIV_SELECT_WITH_FLAG_ELEMENT_CONTAINER_CLASS_ID);
        }

        let spanFlag = this.#spanFlag;
        if (!spanFlag) {
            spanFlag = document.createElement("span");
        }

        // Создаём элемент, который будет нужен для изменения флага ---
        let spanFlagElement = new SpanFlagElement(spanFlag);
        //---


        // Добавляем элементы в контейнер, если они не имеют родителя ---
        let select = this.getSelect();
        if (select && !select.parentElement) {
            divContainer.appendChild(select);
        }

        if (spanFlag && !spanFlag.parentElement) {
            let divFlagContentCenter = document.createElement("div");
            let divFlagContainer = document.createElement("div");

            divFlagContainer.appendChild(spanFlag);
            divFlagContentCenter.appendChild(divFlagContainer);

            divContainer.appendChild(divFlagContentCenter);
        }
        //---

        this.#divContainer = divContainer;
        this.#spanFlag = spanFlag;
        this.#spanFlagElement = spanFlagElement;
    }


    prepare() {
        super.prepare();

        // Вешаем событие изменения флага рядом с выпадающим списком ---
        let select = this.getSelect();
        if (select) {
            let self = this;
            select.addEventListener(_EVENT_NAMES.SELECT.CHANGE, async function() {
                await self.changeFlag();
            })
        }
        //---
    }


    async fill() {
        await super.fill();

        // Меняем флаг рядом с выпадающим списком ---
        await this.changeFlag();
        //---
    }

    async refresh(doNeedToSaveSelectedPosition) {
        await super.refresh(doNeedToSaveSelectedPosition);

        // Меняем флаг рядом с выпадающим списком ---
        await this.changeFlag();
        //---
    }


    async changeFlag() {
        let spanFlagElement = this.#spanFlagElement;
        if (spanFlagElement) {
            spanFlagElement.changeFlag("Неизвестная страна", null, true);
        }

        throw new Error('Method \'changeFlag()\' must be implemented.');
    }
}