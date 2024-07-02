import {
    TextareaWithCounterAndRuleElement
} from "../../with_counter/textarea_with_counter_and_rule_element.js";

export class TextareaWithRuleElementCustomerDescription extends TextareaWithCounterAndRuleElement {
    constructor(textareaWithCounterAndRuleElementObj) {
        super(textareaWithCounterAndRuleElementObj, textareaWithCounterAndRuleElementObj.getIsRequired());
    }

    prepare() {
        super.prepare();

        this.changeMaxLength(255);
    }
}