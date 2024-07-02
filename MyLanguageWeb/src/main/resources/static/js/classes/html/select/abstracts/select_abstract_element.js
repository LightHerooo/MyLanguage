import {
    HtmlUtils
} from "../../html_utils.js";

import {
    EventNames
} from "../../event_names.js";

import {
    CssSelectElement
} from "../../../css/select/css_select_element.js";

const _CSS_SELECT_ELEMENT = new CssSelectElement();

const _HTML_UTILS = new HtmlUtils();
const _EVENT_NAMES = new EventNames();

export class SelectAbstractElement {
    #select;
    #doNeedToCreateFirstOption = false;

    #isPrepared = false;

    constructor(select, doNeedToCreateFirstOption) {
        if (this.constructor === SelectAbstractElement) {
            throw new Error('Abstract classes can\'t be instantiated.');
        }

        this.#select = select;
        this.#doNeedToCreateFirstOption = doNeedToCreateFirstOption;

        this.#tryToSetDefaultValues();
    }

    getSelect() {
        return this.#select;
    }

    getDoNeedToCreateFirstOption() {
        return this.#doNeedToCreateFirstOption;
    }

    getIsPrepared() {
        return this.#isPrepared;
    }


    #tryToSetDefaultValues() {
        let select = this.#select;
        if (!select) {
            select = document.createElement("select");
            select.classList.add(_CSS_SELECT_ELEMENT.SELECT_SELECT_ELEMENT_CLASS_ID);
        }

        this.#select = select;
    }

    async #refill() {
        let optionsArr = await this.createOptionsArr();
        if (!optionsArr) {
            optionsArr = [];
        }

        // Проверяем, не нужно ли дополнительно создать первый элемент списка ---
        let doNeedToCreateFirstOption = this.#doNeedToCreateFirstOption;
        if (doNeedToCreateFirstOption) {
            let firstOption = await this.createFirstOption();
            if (firstOption) {
                optionsArr.unshift(firstOption);
            }
        }
        //---

        // Если массив пустой, мы должны добавить элемент-заглушку ---
        if (optionsArr.length === 0) {
            let option = document.createElement("option");
            option.value = "";
            option.textContent = "Пустой список";
            optionsArr.push(option);
        }
        //---

        // Очищаем список, заполняем элементами массива ---
        this.clear();
        for (let option of optionsArr) {
            this.addOption(option);
        }
        //---
    }

    #changeBackgroundBySelectedOption() {
        let select = this.#select;
        if (select) {
            let selectedOption = this.getSelectedOption();
            if (selectedOption) {
                select.style.background = selectedOption.style.color;
            }
        }
    }


    prepare() {
        let isPrepared = this.#isPrepared;
        if (!isPrepared) {
            // Вешаем событие изменения фона выпадающего списка (если текст выделяемого option имеет цвет) ---
            let select = this.getSelect();
            if (select) {
                let self = this;
                select.addEventListener(_EVENT_NAMES.SELECT.CHANGE, function() {
                    self.#changeBackgroundBySelectedOption();
                })
            }
            //---

            this.#isPrepared = true;
        } else {
            throw new Error("Object \'SelectAbstractElement\' has already been prepared.");
        }
    }


    async fill() {
        let isPrepared = this.getIsPrepared();
        if (isPrepared) {
            await this.#refill();

            // Меняем фон выпадающего списка (если текст выделенного option имеет цвет) ---
            this.#changeBackgroundBySelectedOption();
            //---
        } else {
            throw new Error("Object \'SelectAbstractElement\' is not prepared.");
        }
    }

    async refresh(doNeedToSaveSelectedPosition){
        let isPrepared = this.getIsPrepared();
        if (isPrepared) {
            let selectedValue = this.getSelectedValue();

            await this.#refill();

            // Если нужно вернуть предыдущий выделенный элемент, возвращаем ---
            if (doNeedToSaveSelectedPosition) {
                this.changeSelectedOptionByValue(selectedValue, false);
            }
            //---

            // Меняем фон выпадающего списка (если текст выделенного option имеет цвет) ---
            this.#changeBackgroundBySelectedOption();
            //---
        } else {
            throw new Error("Object \'SelectAbstractElement\' is not prepared.");
        }
    }


    getSelectedOption() {
        let selectedOption;
        let isPrepared = this.#isPrepared;
        if (isPrepared) {
            let select = this.#select;
            if (select) {
                if (select.selectedIndex > -1) {
                    selectedOption = select.options[select.selectedIndex];
                }
            }
        } else {
            throw new Error("Object \'SelectAbstractElement\' is not prepared.");
        }

        return selectedOption;
    }

    getSelectedValue() {
        let selectedValue;
        let isPrepared = this.#isPrepared;
        if (isPrepared) {
            let selectedOption = this.getSelectedOption();
            if (selectedOption) {
                selectedValue = selectedOption.value;
            }
        } else {
            throw new Error("Object \'SelectAbstractElement\' is not prepared.");
        }

        return selectedValue;
    }


    clear() {
        let isPrepared = this.#isPrepared;
        if (isPrepared) {
            let select = this.#select;
            if (select) {
                select.replaceChildren();
            }
        } else {
            throw new Error("Object \'SelectAbstractElement\' is not prepared.");
        }
    }

    addOption(option) {
        let isPrepared = this.#isPrepared;
        if (isPrepared) {
            let select = this.#select;
            if (select && option) {
                select.appendChild(option);
            }
        } else {
            throw new Error("Object \'SelectAbstractElement\' is not prepared.");
        }
    }


    changeSelectedOptionByValue(value, doNeedToCallChangeEvent) {
        let isPrepared = this.#isPrepared;
        if (isPrepared) {
            let select = this.#select;
            if (select && value) {
                let options = select.options;
                if (options) {
                    for (let i = 0; i < options.length; i++) {
                        if (String(options[i].value) === String(value)) {
                            select.selectedIndex = i;
                            break;
                        }
                    }

                    if (doNeedToCallChangeEvent) {
                        this.callEvent(_EVENT_NAMES.SELECT.CHANGE);
                    }
                }
            }
        } else {
            throw new Error("Object \'SelectAbstractElement\' is not prepared.");
        }
    }

    changeSelectedOptionByIndex(index, doNeedToCallChangeEvent) {
        let isPrepared = this.#isPrepared;
        if (isPrepared) {
            let select = this.#select;
            if (select) {
                select.selectedIndex = index;

                if (doNeedToCallChangeEvent) {
                    this.callEvent(_EVENT_NAMES.SELECT.CHANGE);
                }
            }
        } else {
            throw new Error("Object \'SelectAbstractElement\' is not prepared.");
        }
    }

    changeTitle(title) {
        let isPrepared = this.#isPrepared;
        if (isPrepared) {
            let select = this.#select;
            if (select && title) {
                select.title = title;
            }
        } else {
            throw new Error("Object \'SelectAbstractElement\' is not prepared.");
        }
    }

    changeDisabledStatus(isDisabled) {
        let isPrepared = this.#isPrepared;
        if (isPrepared) {
            let select = this.#select;
            if (select) {
                select.disabled = isDisabled;
            }
        } else {
            throw new Error("Object \'SelectAbstractElement\' is not prepared.");
        }
    }

    changeReadOnlyStatus(isReadOnly) {
        let isPrepared = this.#isPrepared;
        if (isPrepared) {
            let select = this.#select;
            if (select) {
                select.readOnly = isReadOnly;
            }
        } else {
            throw new Error("Object \'SelectAbstractElement\' is not prepared.");
        }
    }


    callEvent(eventName) {
        let isPrepared = this.#isPrepared;
        if (isPrepared) {
            let select = this.#select;
            if (select && eventName) {
                _HTML_UTILS.callEvent(select, eventName);
            }
        } else {
            throw new Error("Object \'SelectAbstractElement\' is not prepared.");
        }
    }


    async createFirstOption() {
        let option = document.createElement("option");
        option.value = "";
        option.textContent = "Выберите элемент";

        return option;
    }

    async createOptionsArr() {
        let optionsArr;

        let testValue = true;
        if (testValue) {
            optionsArr = [];

            let option = document.createElement("option");
            option.textContent = "Список не подготовлен";
            optionsArr.push(option);
        }

        return optionsArr;
    }
}