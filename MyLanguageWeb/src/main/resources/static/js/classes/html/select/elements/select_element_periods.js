import {
    SelectAbstractElement
} from "../abstracts/select_abstract_element.js";

export class SelectElementPeriods extends SelectAbstractElement {
    constructor(select, doNeedToCreateFirstOption) {
        super(select, doNeedToCreateFirstOption);
    }

    async createOptionsArr() {
        let optionsArr = [];

        let option = document.createElement("option");
        option.value = "1";
        option.textContent = "За сегодня";
        optionsArr.push(option);

        option = option.cloneNode(false);
        option.value = "7";
        option.textContent = "За последние 7 дней";
        optionsArr.push(option);

        option = option.cloneNode(false);
        option.value = "30";
        option.textContent = "За последние 30 дней";
        optionsArr.push(option);

        option = option.cloneNode(false);
        option.value = "365";
        option.textContent = "За последние 365 дней";
        optionsArr.push(option);

        option = option.cloneNode(false);
        option.value = "0";
        option.textContent = "За всё время";
        optionsArr.push(option);

        return optionsArr;
    }
}