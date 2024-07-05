import {
    DivAbstractElement
} from "../../../div/abstracts/div_abstract_element.js";

export class DynamicFormRowDataAbstractElement extends DivAbstractElement {
    constructor(div) {
        super(div);
        if (this.constructor === DynamicFormRowDataAbstractElement) {
            throw new Error('Abstract classes can\'t be instantiated.');
        }
    }

    changeDisabledStatusToRowDataElements(isDisabled) {
        let isPrepared = this.getIsPrepared();
        if (!isPrepared) {
            throw new Error("Object \'DynamicFormRowDataAbstractElement\' is not prepared");
        }
    }
}