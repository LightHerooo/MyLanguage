import {
    AButtonAbstractElement
} from "../../abstracts/a_button/a_button_abstract_element.js";

export class AButtonWithTextElement extends AButtonAbstractElement {
    constructor(aElementObj) {
        super(aElementObj);
    }

    changeText(str) {
        let a = this.getA();
        if (a) {
            a.textContent = str;
        }
    }
}