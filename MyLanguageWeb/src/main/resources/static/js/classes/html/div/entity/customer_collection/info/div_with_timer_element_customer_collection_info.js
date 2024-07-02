import {
    DivWithTimerAbstractElement
} from "../../../with_timer/abstracts/div_with_timer_abstract_element.js";

import {
    CssRoot
} from "../../../../../css/css_root.js";

import {
    DivElementCustomerCollectionUtils
} from "../div_element_customer_collection_utils.js";

import {
    EventNames
} from "../../../../event_names.js";

const _CSS_ROOT = new CssRoot();

const _DIV_ELEMENT_CUSTOMER_COLLECTION_UTILS = new DivElementCustomerCollectionUtils();
const _EVENT_NAMES = new EventNames();

export class DivWithTimerElementCustomerCollectionInfo extends DivWithTimerAbstractElement {
    #selectElementCustomerCollections;

    constructor(div) {
        super(div);
    }

    setSelectElementCustomerCollections(selectElementCustomerCollectionsObj) {
        this.#selectElementCustomerCollections = selectElementCustomerCollectionsObj;
    }


    #checkCorrectValuesBeforeTryToCreateContent() {
        let isCorrect = true;

        let selectElementCustomerCollections = this.#selectElementCustomerCollections;
        if (!selectElementCustomerCollections) {
            isCorrect = false;
            this.showMessage("Не удалось получить выпадающий список коллекций",
                _CSS_ROOT.MEDIUM_FONT_SIZE_STYLE_ID);
        }

        if (isCorrect) {
            let customerCollectionId = selectElementCustomerCollections.getSelectedValue();
            if (!customerCollectionId) {
                isCorrect = false;
                this.showMessage("Выберите коллекцию, чтобы увидеть информацию о ней",
                    _CSS_ROOT.MEDIUM_FONT_SIZE_STYLE_ID);
            }
        }

        return isCorrect;
    }


    async prepare() {
        await super.prepare();

        let selectElementCustomerCollections = this.#selectElementCustomerCollections;
        if (selectElementCustomerCollections) {
            let select = selectElementCustomerCollections.getSelect();
            if (select) {
                let self = this;
                select.addEventListener(_EVENT_NAMES.SELECT.CHANGE, function() {
                    self.startToFill();
                })
            }
        }
    }


    async tryToCreateContent() {
        let div;

        let isCorrect = this.#checkCorrectValuesBeforeTryToCreateContent();
        if (isCorrect) {
            let selectElementCustomerCollections = this.#selectElementCustomerCollections;
            if (selectElementCustomerCollections) {
                let customerCollectionId = selectElementCustomerCollections.getSelectedValue();
                if (customerCollectionId) {
                    div = _DIV_ELEMENT_CUSTOMER_COLLECTION_UTILS.createDivInfoById(customerCollectionId);
                }
            }

            if (!div) {
                this.showMessage("Не удалось отобразить информацию о коллекции", _CSS_ROOT.MEDIUM_FONT_SIZE_STYLE_ID);
            }
        }

        return div;
    }
}