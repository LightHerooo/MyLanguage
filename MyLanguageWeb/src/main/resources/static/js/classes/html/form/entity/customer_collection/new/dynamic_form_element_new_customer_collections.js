import {
    DynamicFormAbstractElement
} from "../../../abstracts/dynamic_form/dynamic_form_abstract_element.js";

import {
    DynamicFormRowElementNewCustomerCollection
} from "./dynamic_form_row_element_new_customer_collection.js";

import {
    RuleTypes
} from "../../../../span/elements/rule/rule_types.js";

import {
    CustomerCollectionsAPI
} from "../../../../../api/entity/customer_collections_api.js";

import {
    HttpStatuses
} from "../../../../../api/classes/http/http_statuses.js";

import {
    CustomerCollectionAddRequestDTO
} from "../../../../../dto/entity/customer_collection/request/customer_collection_add_request_dto.js";

import {
    EventNames
} from "../../../../event_names.js";

const _CUSTOMER_COLLECTIONS_API = new CustomerCollectionsAPI();

const _RULE_TYPES = new RuleTypes();
const _HTTP_STATUSES = new HttpStatuses();
const _EVENT_NAMES = new EventNames();

export class DynamicFormElementNewCustomerCollections extends DynamicFormAbstractElement {

    constructor(form, divRowsContainer, divButtonAddRowContainer, divMessageContainer, buttonSubmit) {
        super(form, divRowsContainer, divButtonAddRowContainer, divMessageContainer, buttonSubmit);
    }


    #checkRepeats() {
        let isCorrect = false;
        let dynamicFormRowElementsMap = this.getDynamicFormRowElementsMap();
        if (dynamicFormRowElementsMap) {
            isCorrect = true;

            for (let iKey of dynamicFormRowElementsMap.keys()) {
                let iDynamicFormRowElement = dynamicFormRowElementsMap.get(iKey);
                if (iDynamicFormRowElement) {
                    let iDynamicFormRowDataElement = iDynamicFormRowElement.getDynamicFormRowDataElement();
                    if (iDynamicFormRowDataElement) {
                        let iInputTextWithRuleElementCustomerCollectionTitleAdd =
                            iDynamicFormRowDataElement.getInputTextWithRuleElementCustomerCollectionTitleAdd();
                        if (iInputTextWithRuleElementCustomerCollectionTitleAdd) {
                            for (let jKey of dynamicFormRowElementsMap.keys()) {
                                if (iKey === jKey) continue;

                                let jDynamicFormRowElement = dynamicFormRowElementsMap.get(jKey);
                                if (jDynamicFormRowElement) {
                                    let jDynamicFormRowDataElement = jDynamicFormRowElement.getDynamicFormRowDataElement();
                                    if (jDynamicFormRowDataElement) {
                                        let jInputTextWithRuleElementCustomerCollectionTitleAdd =
                                            jDynamicFormRowDataElement.getInputTextWithRuleElementCustomerCollectionTitleAdd();
                                        if (jInputTextWithRuleElementCustomerCollectionTitleAdd) {
                                            let iTitle = iInputTextWithRuleElementCustomerCollectionTitleAdd.getValue();
                                            let jTitle = jInputTextWithRuleElementCustomerCollectionTitleAdd.getValue();
                                            if (iTitle.toLowerCase() === jTitle.toLowerCase()) {
                                                isCorrect = false;
                                                let ruleType = _RULE_TYPES.ERROR;
                                                let message = "Названия коллекций не могут повторяться";

                                                iInputTextWithRuleElementCustomerCollectionTitleAdd.showRule(ruleType, message);
                                                jInputTextWithRuleElementCustomerCollectionTitleAdd.showRule(ruleType, message);
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        return isCorrect;
    }


    createDynamicFormRowElementObject() {
        let dynamicFormRowElementNewCustomerCollection =
            new DynamicFormRowElementNewCustomerCollection(null);

        let dynamicFormRowDataElement = dynamicFormRowElementNewCustomerCollection.getDynamicFormRowDataElement();
        if (dynamicFormRowDataElement) {
            let inputTextWithRuleElementCustomerCollectionTitleAdd = dynamicFormRowDataElement.getInputTextWithRuleElementCustomerCollectionTitleAdd();
            if (inputTextWithRuleElementCustomerCollectionTitleAdd) {
                let inputText = inputTextWithRuleElementCustomerCollectionTitleAdd.getInputText();
                if (inputText) {
                    let self = this;
                    inputText.addEventListener(_EVENT_NAMES.INPUT.TEXT.INPUT, function() {
                        self.clearDivMessageContainer();
                    })
                }
            }

            let selectWithRuleElementLangsIn = dynamicFormRowDataElement.getSelectWithRuleElementLangsIn();
            if (selectWithRuleElementLangsIn) {
                let select = selectWithRuleElementLangsIn.getSelect();
                if (select) {
                    let self = this;
                    select.addEventListener(_EVENT_NAMES.SELECT.CHANGE, function() {
                        self.clearDivMessageContainer();
                    })
                }
            }
        }

        return dynamicFormRowElementNewCustomerCollection;
    }


    async checkCorrectValues() {
        let isCorrect = true;
        let dynamicFormRowElementsMap = this.getDynamicFormRowElementsMap();
        if (dynamicFormRowElementsMap) {
            isCorrect = true;

            for (let key of dynamicFormRowElementsMap.keys()) {
                let dynamicFormRowElement = dynamicFormRowElementsMap.get(key);
                if (dynamicFormRowElement) {
                    let dynamicFormRowDataElement = dynamicFormRowElement.getDynamicFormRowDataElement();
                    if (dynamicFormRowDataElement) {
                        let isTitleCorrect = false;
                        let inputTextWithRuleElementCustomerCollectionTitleAdd = dynamicFormRowDataElement
                            .getInputTextWithRuleElementCustomerCollectionTitleAdd();
                        if (inputTextWithRuleElementCustomerCollectionTitleAdd) {
                            isTitleCorrect = await inputTextWithRuleElementCustomerCollectionTitleAdd.checkCorrectValue();
                        }

                        let isLangCorrect = false;
                        let selectWithRuleElementLangsIn = dynamicFormRowDataElement.getSelectWithRuleElementLangsIn();
                        if (selectWithRuleElementLangsIn) {
                            isLangCorrect = await selectWithRuleElementLangsIn.checkCorrectValue();
                        }

                        if (isCorrect) {
                            isCorrect = isTitleCorrect && isLangCorrect;
                        }
                    }
                }
            }

            if (isCorrect) {
                isCorrect = this.#checkRepeats();
            }
        }

        return isCorrect;
    }

    async submit() {
        let isCorrect = false;

        let dynamicFormRowElementsMap = this.getDynamicFormRowElementsMap();
        if (dynamicFormRowElementsMap) {
            isCorrect = true;

            let correctKeys = [];
            for (let key of dynamicFormRowElementsMap.keys()) {
                let dynamicFormRowElement = dynamicFormRowElementsMap.get(key);
                if (dynamicFormRowElement) {
                    let dynamicFormRowDataElement = dynamicFormRowElement.getDynamicFormRowDataElement();
                    if (dynamicFormRowDataElement) {
                        let customerCollectionAddRequestDTO = new CustomerCollectionAddRequestDTO();

                        let inputTextWithRuleElementCustomerCollectionTitleAdd = dynamicFormRowDataElement
                            .getInputTextWithRuleElementCustomerCollectionTitleAdd();
                        if (inputTextWithRuleElementCustomerCollectionTitleAdd) {
                            customerCollectionAddRequestDTO.setTitle(inputTextWithRuleElementCustomerCollectionTitleAdd.getValue());
                        }

                        let selectWithRuleElementLangsIn = dynamicFormRowDataElement.getSelectWithRuleElementLangsIn();
                        if (selectWithRuleElementLangsIn) {
                            customerCollectionAddRequestDTO.setLangCode(selectWithRuleElementLangsIn.getSelectedValue());
                        }

                        let jsonResponse = await _CUSTOMER_COLLECTIONS_API.POST.add(customerCollectionAddRequestDTO);
                        if (jsonResponse.getStatus() === _HTTP_STATUSES.OK) {
                            correctKeys.push(key);
                        }
                    }
                }
            }

            if (dynamicFormRowElementsMap.size !== correctKeys.length) {
                isCorrect = false;

                // Удаляем строки, которые были успешно отправлены на сервер ---
                for (let key of correctKeys) {
                    this.tryToDeleteRow(key);
                }
                //---

                this.showRule(_RULE_TYPES.ERROR,
                    "Не удалось создать некоторые коллекции. Попробуйте ещё раз");
            }
        }

        return isCorrect;
    }
}