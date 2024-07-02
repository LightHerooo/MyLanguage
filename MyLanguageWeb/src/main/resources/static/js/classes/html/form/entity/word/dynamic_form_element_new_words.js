import {
    DynamicFormAbstractElement
} from "../../dynamic_form/abstracts/dynamic_form_abstract_element.js";

import {
    DynamicFormRowElementNewWord
} from "./dynamic_form_row_element_new_word.js";

import {
    RuleTypes
} from "../../../span/elements/rule/rule_types.js";

import {
    WordsAPI
} from "../../../../api/entity/words_api.js";

import {
    HttpStatuses
} from "../../../../api/classes/http/http_statuses.js";

import {
    WordAddRequestDTO
} from "../../../../dto/entity/word/request/word_add_request_dto.js";

import {
    EventNames
} from "../../../event_names.js";

const _WORDS_API = new WordsAPI();

const _RULE_TYPES = new RuleTypes();
const _HTTP_STATUSES = new HttpStatuses();
const _EVENT_NAMES = new EventNames();

export class DynamicFormElementNewWords extends DynamicFormAbstractElement {

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
                        let iInputTextWithRuleElementWordTitle = iDynamicFormRowDataElement.getInputTextWithRuleElementWordTitle();
                        let iSelectWithRuleElementLangsIn = iDynamicFormRowDataElement.getSelectWithRuleElementLangsIn();
                        if (iInputTextWithRuleElementWordTitle && iSelectWithRuleElementLangsIn) {
                            for (let jKey of dynamicFormRowElementsMap.keys()) {
                                if (iKey === jKey) continue;

                                let jDynamicFormRowElement = dynamicFormRowElementsMap.get(jKey);
                                if (jDynamicFormRowElement) {
                                    let jDynamicFormRowDataElement = jDynamicFormRowElement.getDynamicFormRowDataElement();
                                    if (jDynamicFormRowDataElement) {
                                        let jInputTextWithRuleElementWordTitle = jDynamicFormRowDataElement.getInputTextWithRuleElementWordTitle();
                                        let jSelectWithRuleElementLangsIn = jDynamicFormRowDataElement.getSelectWithRuleElementLangsIn();
                                        if (jInputTextWithRuleElementWordTitle && jSelectWithRuleElementLangsIn) {
                                            let iTitle = iInputTextWithRuleElementWordTitle.getValue();
                                            let jTitle = jInputTextWithRuleElementWordTitle.getValue();
                                            let iLangCode = iSelectWithRuleElementLangsIn.getSelectedValue();
                                            let jLangCode = jSelectWithRuleElementLangsIn.getSelectedValue();
                                            if (iTitle.toLowerCase() === jTitle.toLowerCase()
                                                && iLangCode.toLowerCase() === jLangCode.toLowerCase()) {
                                                isCorrect = false;
                                                let ruleType = _RULE_TYPES.ERROR;
                                                let message = "Слова с одинаковым названием не должны иметь одинакового языка";

                                                iInputTextWithRuleElementWordTitle.showRule(ruleType, message);
                                                jInputTextWithRuleElementWordTitle.showRule(ruleType, message);
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
        let dynamicFormRowElementNewWord = new DynamicFormRowElementNewWord(null);

        let dynamicFormRowDataElement = dynamicFormRowElementNewWord.getDynamicFormRowDataElement();
        if (dynamicFormRowDataElement) {
            let inputTextWithRuleElementWordTitle = dynamicFormRowDataElement.getInputTextWithRuleElementWordTitle();
            if (inputTextWithRuleElementWordTitle) {
                let inputText = inputTextWithRuleElementWordTitle.getInputText();
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

        return dynamicFormRowElementNewWord;
    }


    async checkCorrectValues() {
        let isCorrect = false;
        let dynamicFormRowElementsMap = this.getDynamicFormRowElementsMap();
        if (dynamicFormRowElementsMap) {
            isCorrect = true;

            for (let key of dynamicFormRowElementsMap.keys()) {
                let dynamicFormRowElement = dynamicFormRowElementsMap.get(key);
                if (dynamicFormRowElement) {
                    let dynamicFormRowDataElement = dynamicFormRowElement.getDynamicFormRowDataElement();
                    if (dynamicFormRowDataElement) {
                        let isTitleCorrect = false;
                        let inputTextWithRuleElementWordTitle = dynamicFormRowDataElement.getInputTextWithRuleElementWordTitle();
                        if (inputTextWithRuleElementWordTitle) {
                            isTitleCorrect = await inputTextWithRuleElementWordTitle.checkCorrectValue();
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
                        let wordAddRequestDTO = new WordAddRequestDTO();

                        let inputTextWithRuleElementWordTitle = dynamicFormRowDataElement.getInputTextWithRuleElementWordTitle();
                        if (inputTextWithRuleElementWordTitle) {
                            wordAddRequestDTO.setTitle(inputTextWithRuleElementWordTitle.getValue());
                        }

                        let selectWithRuleElementLangsIn = dynamicFormRowDataElement.getSelectWithRuleElementLangsIn();
                        if (selectWithRuleElementLangsIn) {
                            wordAddRequestDTO.setLangCode(selectWithRuleElementLangsIn.getSelectedValue());
                        }

                        let jsonResponse = await _WORDS_API.POST.add(wordAddRequestDTO);
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
                    "Не удалось отправить некоторые слова на проверку. Попробуйте ещё раз.");
            }
        }

        return isCorrect;
    }
}