import {
    FormWithDeleteAbstractElement
} from "../../abstracts/form_with_delete_abstract_element.js";

import {
    EventNames
} from "../../../event_names.js";

import {
    CustomerCollectionEditRequestDTO
} from "../../../../dto/entity/customer_collection/request/customer_collection_edit_request_dto.js";

import {
    CustomerCollectionsAPI
} from "../../../../api/entity/customer_collections_api.js";

import {
    HttpStatuses
} from "../../../../api/classes/http/http_statuses.js";

import {
    RuleTypes
} from "../../../span/elements/rule/rule_types.js";

import {
    ResponseMessageResponseDTO
} from "../../../../dto/other/response/response_message_response_dto.js";

import {
    EntityIdRequestDTO
} from "../../../../dto/other/request/entity/entity_id_request_dto.js";

import {
    CustomerCollectionResponseDTO
} from "../../../../dto/entity/customer_collection/response/customer_collection_response_dto.js";

const _CUSTOMER_COLLECTIONS_API = new CustomerCollectionsAPI();

const _EVENT_NAMES = new EventNames();
const _HTTP_STATUSES = new HttpStatuses();
const _RULE_TYPES = new RuleTypes();

export class FormElementCustomerCollectionEdit extends FormWithDeleteAbstractElement {
    #inputImgElementCustomerCollectionImage;
    #inputTextWithRuleElementCustomerCollectionTitleEdit;
    #selectWithRuleElementBooleanCustomerCollectionIsActive;
    #textareaWithCounterElementCustomerCollectionDescription;
    #tableWithTimerElementWordsInCollectionEdit;
    #customerCollectionId;

    constructor(form, buttonSubmit, divMessageContainer, buttonWithTextElementDoubleClickObjDelete) {
        super(form, buttonSubmit, divMessageContainer, buttonWithTextElementDoubleClickObjDelete);
    }

    setInputImgElementCustomerCollectionImage(inputImgElementCustomerCollectionImageObj) {
        this.#inputImgElementCustomerCollectionImage = inputImgElementCustomerCollectionImageObj;
    }

    setInputTextWithRuleElementCustomerCollectionTitleEdit(inputTextWithRuleElementCustomerCollectionTitleEditObj) {
        this.#inputTextWithRuleElementCustomerCollectionTitleEdit = inputTextWithRuleElementCustomerCollectionTitleEditObj;
    }

    setSelectWithRuleElementBooleanCustomerCollectionIsActive(selectWithRuleElementBooleanCustomerCollectionIsActiveObj) {
        this.#selectWithRuleElementBooleanCustomerCollectionIsActive = selectWithRuleElementBooleanCustomerCollectionIsActiveObj;
    }

    setTextareaWithCounterElementCustomerCollectionDescription(textareaWithCounterElementObjCustomerCollectionDescription) {
        this.#textareaWithCounterElementCustomerCollectionDescription = textareaWithCounterElementObjCustomerCollectionDescription;
    }

    setTableWithTimerElementWordsInCollectionEdit(tableWithTimerElementWordsInCollectionEditObj) {
        this.#tableWithTimerElementWordsInCollectionEdit = tableWithTimerElementWordsInCollectionEditObj;
    }

    setCustomerCollectionId(customerCollectionId) {
        this.#customerCollectionId = customerCollectionId;
    }


    async prepare() {
        await super.prepare();

        let customerCollectionResponseDTO;
        let customerCollectionId = this.#customerCollectionId;
        if (customerCollectionId) {
            let jsonResponse = await _CUSTOMER_COLLECTIONS_API.GET.findById(customerCollectionId);
            if (jsonResponse.getStatus() === _HTTP_STATUSES.OK) {
                customerCollectionResponseDTO = new CustomerCollectionResponseDTO(jsonResponse.getJson());
            } else {
                this.showRule(_RULE_TYPES.ERROR, new ResponseMessageResponseDTO(jsonResponse.getJson()).getMessage());
            }
        } else {
            this.showRule(_RULE_TYPES.ERROR, "Id коллекции не установлен");
        }

        if (customerCollectionResponseDTO) {
            let inputImgElementCustomerCollectionImage = this.#inputImgElementCustomerCollectionImage;
            if (inputImgElementCustomerCollectionImage) {
                if (!inputImgElementCustomerCollectionImage.getIsPrepared()) {
                    inputImgElementCustomerCollectionImage.prepare();
                }

                inputImgElementCustomerCollectionImage.setCustomerCollectionResponseDTO(customerCollectionResponseDTO);
                inputImgElementCustomerCollectionImage.refreshImgSrc();

                let inputFile = inputImgElementCustomerCollectionImage.getInputFile();
                if (inputFile) {
                    let self = this;
                    inputFile.addEventListener(_EVENT_NAMES.INPUT.FILE.CHANGE, function() {
                        self.clearDivMessageContainer();
                    });
                }

                let buttonDropSelectedFiles = inputImgElementCustomerCollectionImage.getButtonDropSelectedFiles();
                if (buttonDropSelectedFiles) {
                    let self = this;
                    buttonDropSelectedFiles.addEventListener(_EVENT_NAMES.BUTTON.CLICK, function () {
                        self.clearDivMessageContainer();
                    })
                }
            }

            let inputTextWithRuleElementCustomerCollectionTitleEdit = this.#inputTextWithRuleElementCustomerCollectionTitleEdit;
            if (inputTextWithRuleElementCustomerCollectionTitleEdit) {
                if (!inputTextWithRuleElementCustomerCollectionTitleEdit.getIsPrepared()) {
                    inputTextWithRuleElementCustomerCollectionTitleEdit.prepare();
                }

                inputTextWithRuleElementCustomerCollectionTitleEdit.setCustomerCollectionResponseDTO(
                    customerCollectionResponseDTO);
                inputTextWithRuleElementCustomerCollectionTitleEdit.changeValue(
                    customerCollectionResponseDTO.getTitle(), true);

                let inputText = inputTextWithRuleElementCustomerCollectionTitleEdit.getInputText();
                if (inputText) {
                    let self = this;
                    inputText.addEventListener(_EVENT_NAMES.INPUT.TEXT.INPUT, function () {
                        self.clearDivMessageContainer();
                    })
                }
            }

            let selectWithRuleElementBooleanCustomerCollectionIsActive = this.#selectWithRuleElementBooleanCustomerCollectionIsActive;
            if (selectWithRuleElementBooleanCustomerCollectionIsActive) {
                if (!selectWithRuleElementBooleanCustomerCollectionIsActive.getIsPrepared()) {
                    selectWithRuleElementBooleanCustomerCollectionIsActive.prepare();
                    await selectWithRuleElementBooleanCustomerCollectionIsActive.fill();
                }

                selectWithRuleElementBooleanCustomerCollectionIsActive.changeSelectedOptionByValue(
                    customerCollectionResponseDTO.getIsActiveForAuthor(), true);

                let select = selectWithRuleElementBooleanCustomerCollectionIsActive.getSelect();
                if (select) {
                    let self = this;
                    select.addEventListener(_EVENT_NAMES.SELECT.CHANGE, function () {
                        self.clearDivMessageContainer();
                    })
                }
            }

            let textareaWithCounterElementCustomerCollectionDescription = this.#textareaWithCounterElementCustomerCollectionDescription;
            if (textareaWithCounterElementCustomerCollectionDescription) {
                if (!textareaWithCounterElementCustomerCollectionDescription.getIsPrepared()) {
                    textareaWithCounterElementCustomerCollectionDescription.prepare();
                }

                textareaWithCounterElementCustomerCollectionDescription.changeValue(
                    customerCollectionResponseDTO.getDescription(), true);
            }
        }
    }

    async checkCorrectValues() {
        let isImageCorrect = false;
        let inputImgElementCustomerCollectionImage = this.#inputImgElementCustomerCollectionImage;
        if (inputImgElementCustomerCollectionImage) {
            isImageCorrect = inputImgElementCustomerCollectionImage.checkFiles(false);
        }

        let isTitleCorrect = false;
        let inputTextWithRuleElementCustomerCollectionTitleEdit = this.#inputTextWithRuleElementCustomerCollectionTitleEdit;
        if (inputTextWithRuleElementCustomerCollectionTitleEdit) {
            isTitleCorrect = await inputTextWithRuleElementCustomerCollectionTitleEdit.checkCorrectValue();
        }

        let isActiveForAuthorCorrect = false;
        let selectWithRuleElementBooleanCustomerCollectionIsActive = this.#selectWithRuleElementBooleanCustomerCollectionIsActive;
        if (selectWithRuleElementBooleanCustomerCollectionIsActive) {
            isActiveForAuthorCorrect = await selectWithRuleElementBooleanCustomerCollectionIsActive.checkCorrectValue();
        }

        return isImageCorrect && isTitleCorrect && isActiveForAuthorCorrect;
    }

    async submit() {
        let dto = new CustomerCollectionEditRequestDTO();

        // Изображение ---
        let fileObjImage;
        let inputImgElementCustomerCollectionImage = this.#inputImgElementCustomerCollectionImage;
        if (inputImgElementCustomerCollectionImage) {
            let files = inputImgElementCustomerCollectionImage.getFiles();
            if (files && files.length > 0) {
                fileObjImage = files[0];
            }
        }
        //---

        // Id ---
        dto.setId(this.#customerCollectionId);
        //---

        // Название ---
        let inputTextWithRuleElementCustomerCollectionTitleEdit = this.#inputTextWithRuleElementCustomerCollectionTitleEdit;
        if (inputTextWithRuleElementCustomerCollectionTitleEdit) {
            dto.setTitle(inputTextWithRuleElementCustomerCollectionTitleEdit.getValue());
        }
        //---

        // Активность для автора ---
        let selectWithRuleElementBooleanCustomerCollectionIsActive = this.#selectWithRuleElementBooleanCustomerCollectionIsActive;
        if (selectWithRuleElementBooleanCustomerCollectionIsActive) {
            dto.setIsActiveForAuthor(selectWithRuleElementBooleanCustomerCollectionIsActive.getSelectedValue());
        }
        //---

        // Описание ---
        let textareaWithCounterElementCustomerCollectionDescription = this.#textareaWithCounterElementCustomerCollectionDescription;
        if (textareaWithCounterElementCustomerCollectionDescription) {
            dto.setDescription(textareaWithCounterElementCustomerCollectionDescription.getValue());
        }
        //---

        let tableWithTimerElementWordsInCollectionEdit = this.#tableWithTimerElementWordsInCollectionEdit;
        if (tableWithTimerElementWordsInCollectionEdit) {
            // Нужно ли удалять все слова в коллекции ---
            dto.setDoNeedToDeleteAllWords(
                tableWithTimerElementWordsInCollectionEdit.getDoNeedToDeleteAllWords())
            //---

            // Массив исключений слов в коллекции ---
            dto.setExcludedWordInCollectionIdsArr(
                tableWithTimerElementWordsInCollectionEdit.getExcludedWordInCollectionIdsArr());
            //---
        }

        // Пробуем изменить коллекцию ---
        let isCorrect = true;
        let ruleType;
        let message;

        let jsonResponse = await _CUSTOMER_COLLECTIONS_API.PATCH.edit(fileObjImage, dto);
        if (jsonResponse.getStatus() !== _HTTP_STATUSES.OK) {
            isCorrect = false;
            ruleType = _RULE_TYPES.ERROR;
            message = new ResponseMessageResponseDTO(jsonResponse.getJson()).getMessage();
        }
        //---

        if (!isCorrect) {
            this.showRule(ruleType, message);
        }

        return isCorrect;
    }

    async delete() {
        let entityIdRequestDTO = new EntityIdRequestDTO();
        entityIdRequestDTO.setId(this.#customerCollectionId);

        // Пробуем удалить коллекцию ---
        let isCorrect = true;
        let ruleType;
        let message;

        let jsonResponse = await _CUSTOMER_COLLECTIONS_API.DELETE.delete(entityIdRequestDTO);
        if (jsonResponse.getStatus() !== _HTTP_STATUSES.OK) {
            isCorrect = false;
            ruleType = _RULE_TYPES.ERROR;
            message = new ResponseMessageResponseDTO(jsonResponse.getJson()).getMessage();
        }
        //---

        if (!isCorrect) {
            this.showRule(ruleType, message);
        }

        return isCorrect;
    }


    changeDisabledStatusToFormElements(isDisabled) {
        super.changeDisabledStatusToFormElements(isDisabled);

        let inputImgElementCustomerCollectionImage = this.#inputImgElementCustomerCollectionImage;
        if (inputImgElementCustomerCollectionImage) {
            inputImgElementCustomerCollectionImage.changeDisabledStatus(isDisabled);
        }

        let inputTextWithRuleElementCustomerCollectionTitleEdit = this.#inputTextWithRuleElementCustomerCollectionTitleEdit;
        if (inputTextWithRuleElementCustomerCollectionTitleEdit) {
            inputTextWithRuleElementCustomerCollectionTitleEdit.changeDisabledStatus(isDisabled);
        }

        let selectWithRuleElementBooleanCustomerCollectionIsActive = this.#selectWithRuleElementBooleanCustomerCollectionIsActive;
        if (selectWithRuleElementBooleanCustomerCollectionIsActive) {
            selectWithRuleElementBooleanCustomerCollectionIsActive.changeDisabledStatus(isDisabled);
        }

        let textareaWithCounterElementCustomerCollectionDescription = this.#textareaWithCounterElementCustomerCollectionDescription;
        if (textareaWithCounterElementCustomerCollectionDescription) {
            textareaWithCounterElementCustomerCollectionDescription.changeDisabledStatus(isDisabled);
        }
    }
}