import {
    CssSelectElement
} from "../../../../css/select/css_select_element.js";

import {
    SelectAbstractElement
} from "../../abstracts/select_abstract_element.js";

import {
    EventNames
} from "../../../event_names.js";

import {
    ImgSrcs
} from "../../../img_srcs.js";

const _CSS_SELECT_ELEMENT = new CssSelectElement();
const _IMG_SRCS = new ImgSrcs();

const _EVENT_NAMES = new EventNames();

export class SelectWithImgAbstractElement extends SelectAbstractElement {
    #divContainer;
    #img;

    constructor(divContainer, select, img, doNeedToCreateFirstOption) {
        super(select, doNeedToCreateFirstOption);
        if (this.constructor === SelectWithImgAbstractElement) {
            throw new Error('Abstract classes can\'t be instantiated.');
        }

        this.#divContainer = divContainer;
        this.#img = img;

        this.#tryToSetDefaultValues();
    }

    getDivContainer() {
        return this.#divContainer;
    }

    getImg() {
        return this.#img;
    }


    #tryToSetDefaultValues() {
        let divContainer = this.#divContainer;
        if (!divContainer) {
            divContainer = document.createElement("div");
            divContainer.classList.add(_CSS_SELECT_ELEMENT.DIV_SELECT_WITH_IMG_ELEMENT_CONTAINER_CLASS_ID);
        }

        let img = this.#img;
        if (!img) {
            img = document.createElement("img");
        }


        // Добавляем элементы в контейнер, если они не имеют родителя ---
        let select = this.getSelect();
        if (select && !select.parentElement) {
            divContainer.appendChild(select);
        }

        if (img && !img.parentElement) {
            let divImgContentCenter = document.createElement("div");
            let divImgContainer = document.createElement("div");

            divImgContainer.appendChild(img);
            divImgContentCenter.appendChild(divImgContainer);

            divContainer.appendChild(divImgContentCenter);
        }
        //---

        this.#divContainer = divContainer;
        this.#img = img;
    }


    prepare() {
        super.prepare();

        // Вешаем событие изменения изображения рядом с выпадающим списком ---
        let select = this.getSelect();
        if (select) {
            let self = this;
            select.addEventListener(_EVENT_NAMES.SELECT.CHANGE, async function() {
                await self.changeImgSrc();
            });
        }
        //---
    }


    async fill() {
        await super.fill();

        // Меняем изображение рядом с выпадающим списком ---
        await this.changeImgSrc();
        //---
    }

    async refresh(doNeedToSaveSelectedPosition) {
        await super.refresh(doNeedToSaveSelectedPosition);

        // Меняем изображение рядом с выпадающим списком ---
        await this.changeImgSrc();
        //---
    }


    async changeImgSrc() {
        let img = this.#img;
        if (img) {
            img.src = _IMG_SRCS.OTHER.EMPTY;
        }

        throw new Error('Method \'changeImgSrc()\' must be implemented.');
    }
}