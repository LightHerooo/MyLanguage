import {
    FormAbstractElement
} from "../../../abstracts/form_abstract_element.js";

import {
    ResponseMessageResponseDTO
} from "../../../../../dto/other/response/response_message_response_dto.js";

import {
    CustomersAPI
} from "../../../../../api/entity/customers_api.js";

import {
    HttpStatuses
} from "../../../../../api/classes/http/http_statuses.js";

import {
    RuleTypes
} from "../../../../span/elements/rule/rule_types.js";

import {
    CustomerEditRequestDTO
} from "../../../../../dto/entity/customer/request/edit/customer_edit_request_dto.js";

import {
    EventNames
} from "../../../../event_names.js";

const _CUSTOMERS_API = new CustomersAPI();

const _HTTP_STATUSES = new HttpStatuses();
const _RULE_TYPES = new RuleTypes();
const _EVENT_NAMES = new EventNames();

export class FormElementCustomerEditProfile extends FormAbstractElement {
    #inputImgElementCustomerAvatar;
    #inputTextWithRuleElementCustomerNicknameEdit;
    #selectWithRuleElementCountries;
    #textareaWithCounterElementCustomerDescription;
    #customerResponseDTO;

    constructor(form, buttonSubmit, divMessageContainer) {
        super(form, buttonSubmit, divMessageContainer);
    }

    setInputImgElementCustomerAvatar(inputImgElementCustomerAvatarObj) {
        this.#inputImgElementCustomerAvatar = inputImgElementCustomerAvatarObj;
    }

    setInputTextWithRuleElementCustomerNicknameEdit(inputTextWithRuleElementCustomerNicknameEditObj) {
        this.#inputTextWithRuleElementCustomerNicknameEdit = inputTextWithRuleElementCustomerNicknameEditObj;
    }

    setSelectWithRuleElementCountries(selectWithRuleElementCountriesObj) {
        this.#selectWithRuleElementCountries = selectWithRuleElementCountriesObj;
    }

    setTextareaWithCounterElementCustomerDescription(textareaWithCounterElementObjCustomerDescription) {
        this.#textareaWithCounterElementCustomerDescription = textareaWithCounterElementObjCustomerDescription;
    }

    setCustomerResponseDTO(customerResponseDTOObj) {
        this.#customerResponseDTO = customerResponseDTOObj;
    }


    async prepare() {
        await super.prepare();

        let customerResponseDTO = this.#customerResponseDTO;
        let inputImgElementCustomerAvatar = this.#inputImgElementCustomerAvatar;
        if (inputImgElementCustomerAvatar) {
            if (!inputImgElementCustomerAvatar.getIsPrepared()) {
                inputImgElementCustomerAvatar.prepare();
            }

            if (customerResponseDTO) {
                inputImgElementCustomerAvatar.setCustomerResponseDTO(customerResponseDTO);
            }

            let inputFile = inputImgElementCustomerAvatar.getInputFile();
            if (inputFile) {
                let self = this;
                inputFile.addEventListener(_EVENT_NAMES.INPUT.FILE.CHANGE, function() {
                    self.clearDivMessageContainer();
                });
            }

            let buttonDropSelectedFiles = inputImgElementCustomerAvatar.getButtonDropSelectedFiles();
            if (buttonDropSelectedFiles) {
                let self = this;
                buttonDropSelectedFiles.addEventListener(_EVENT_NAMES.BUTTON.CLICK, function() {
                    self.clearDivMessageContainer();
                })
            }

            inputImgElementCustomerAvatar.refreshImgSrc();
        }

        let inputTextWithRuleElementCustomerNicknameEdit = this.#inputTextWithRuleElementCustomerNicknameEdit;
        if (inputTextWithRuleElementCustomerNicknameEdit) {
            if (!inputTextWithRuleElementCustomerNicknameEdit.getIsPrepared()) {
                inputTextWithRuleElementCustomerNicknameEdit.prepare();
            }

            if (customerResponseDTO) {
                inputTextWithRuleElementCustomerNicknameEdit.setCustomerId(customerResponseDTO.getId());
                inputTextWithRuleElementCustomerNicknameEdit.changeValue(
                    customerResponseDTO.getNickname(), true);
            }

            let inputText = inputTextWithRuleElementCustomerNicknameEdit.getInputText();
            if (inputText) {
                let self = this;
                inputText.addEventListener(_EVENT_NAMES.INPUT.TEXT.INPUT, function() {
                    self.clearDivMessageContainer();
                });
            }
        }

        let selectWithRuleElementCountries = this.#selectWithRuleElementCountries
        if (selectWithRuleElementCountries) {
            if (!selectWithRuleElementCountries.getIsPrepared()) {
                selectWithRuleElementCountries.prepare();
                await selectWithRuleElementCountries.fill();
            }

            if (customerResponseDTO) {
                let country = customerResponseDTO.getCountry();
                if (country) {
                    selectWithRuleElementCountries.changeSelectedOptionByValue(country.getCode(), true);
                }
            }

            let select = selectWithRuleElementCountries.getSelect();
            if (select) {
                let self = this;
                select.addEventListener(_EVENT_NAMES.SELECT.CHANGE, function() {
                    self.clearDivMessageContainer();
                });
            }
        }

        let textareaWithCounterElementCustomerDescription = this.#textareaWithCounterElementCustomerDescription;
        if (textareaWithCounterElementCustomerDescription) {
            if (!textareaWithCounterElementCustomerDescription.getIsPrepared()) {
                textareaWithCounterElementCustomerDescription.prepare();
                textareaWithCounterElementCustomerDescription.changeMaxLength(255);
            }

            if (customerResponseDTO) {
                textareaWithCounterElementCustomerDescription.changeValue(
                    customerResponseDTO.getDescription(), true);
            }

            let textarea = textareaWithCounterElementCustomerDescription.getTextarea();
            if (textarea) {
                let self = this;
                textarea.addEventListener(_EVENT_NAMES.TEXTAREA.INPUT, function () {
                    self.clearDivMessageContainer();
                });
            }
        }
    }

    async checkCorrectValues() {
        let isAvatarCorrect = false;
        let inputImgElementCustomerAvatar = this.#inputImgElementCustomerAvatar;
        if (inputImgElementCustomerAvatar) {
            isAvatarCorrect = inputImgElementCustomerAvatar.checkFiles(false);
        }

        let isNicknameCorrect = false;
        let inputTextWithRuleElementCustomerNicknameEdit = this.#inputTextWithRuleElementCustomerNicknameEdit;
        if (inputTextWithRuleElementCustomerNicknameEdit) {
            isNicknameCorrect = await inputTextWithRuleElementCustomerNicknameEdit.checkCorrectValue();
        }

        let isCountryCorrect = false;
        let selectWithRuleElementCountries = this.#selectWithRuleElementCountries;
        if (selectWithRuleElementCountries) {
            isCountryCorrect = await selectWithRuleElementCountries.checkCorrectValue();
        }

        return isAvatarCorrect && isNicknameCorrect && isCountryCorrect;
    }

    async submit() {
        let dto = new CustomerEditRequestDTO();

        // Аватар ---
        let fileObjAvatar;
        let inputImgElementCustomerAvatar = this.#inputImgElementCustomerAvatar;
        if (inputImgElementCustomerAvatar) {
            let files = inputImgElementCustomerAvatar.getFiles();
            if (files && files.length > 0) {
                fileObjAvatar = files[0];
            }
        }
        //---

        // Никнейм ---
        let inputTextWithRuleElementCustomerNicknameEdit = this.#inputTextWithRuleElementCustomerNicknameEdit;
        if (inputTextWithRuleElementCustomerNicknameEdit) {
            dto.setNickname(inputTextWithRuleElementCustomerNicknameEdit.getValue());
        }
        //---

        // Страна ---
        let selectWithRuleElementCountries = this.#selectWithRuleElementCountries;
        if (selectWithRuleElementCountries) {
            dto.setCountryCode(selectWithRuleElementCountries.getSelectedValue());
        }
        //---

        // Описание ---
        let textareaWithCounterElementCustomerDescription = this.#textareaWithCounterElementCustomerDescription;
        if (textareaWithCounterElementCustomerDescription) {
            dto.setDescription(textareaWithCounterElementCustomerDescription.getValue());
        }
        //---

        // Пробуем изменить пользователя ---
        let isCorrect = true;
        let ruleType;
        let message;

        let jsonResponse = await _CUSTOMERS_API.PATCH.edit(fileObjAvatar, dto);
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

        let inputImgElementCustomerAvatar = this.#inputImgElementCustomerAvatar;
        if (inputImgElementCustomerAvatar) {
            inputImgElementCustomerAvatar.changeDisabledStatus(isDisabled);
        }

        let inputTextWithRuleElementCustomerNicknameEdit = this.#inputTextWithRuleElementCustomerNicknameEdit;
        if (inputTextWithRuleElementCustomerNicknameEdit) {
            inputTextWithRuleElementCustomerNicknameEdit.changeDisabledStatus(isDisabled);
        }

        let selectWithRuleElementCountries = this.#selectWithRuleElementCountries;
        if (selectWithRuleElementCountries) {
            selectWithRuleElementCountries.changeDisabledStatus(isDisabled);
        }

        let textareaWithCounterElementCustomerDescription = this.#textareaWithCounterElementCustomerDescription;
        if (textareaWithCounterElementCustomerDescription) {
            textareaWithCounterElementCustomerDescription.changeDisabledStatus(isDisabled);
        }
    }
}