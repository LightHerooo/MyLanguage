import {
    TextareaWithCounterElement
} from "../../with_counter/textarea_with_counter_element.js";


export class TextareaElementCustomerDescription extends TextareaWithCounterElement {
    constructor(textareaWithCounterElementObj) {
        super(textareaWithCounterElementObj.getDivContainer(), textareaWithCounterElementObj,
            textareaWithCounterElementObj.getSpanCounter());
    }

    prepare() {
        super.prepare();

        this.changeMaxLength(255);
    }
}