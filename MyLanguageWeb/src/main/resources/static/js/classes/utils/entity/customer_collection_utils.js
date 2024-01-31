import {
    CustomerCollectionRequestDTO,
    CustomerCollectionResponseDTO
} from "../../dto/customer_collection.js";

import {
    GlobalCookies
} from "../../global_cookies.js";

import {
    HttpStatuses
} from "../../http_statuses.js";

import {
    RuleElement,
    RuleTypes
} from "../../rule_element.js";

import {
    CustomResponseMessage
} from "../../dto/other/custom_response_message.js";

import {
    CustomerCollectionsAPI
} from "../../api/customer_collections_api.js";

import {
    CssCollectionInfo
} from "../../css/css_collection_info.js";

import {
    ComboBoxUtils
} from "../combo_box_utils.js";

import {
    FlagElements
} from "../../flag_elements.js";

import {
    CustomTimer
} from "../../custom_timer.js";

const _CUSTOMER_COLLECTIONS_API = new CustomerCollectionsAPI();

const _CSS_COLLECTION_INFO = new CssCollectionInfo();

const _GLOBAL_COOKIES = new GlobalCookies();
const _HTTP_STATUSES = new HttpStatuses();
const _RULE_TYPES = new RuleTypes();
const _COMBO_BOX_UTILS = new ComboBoxUtils();
const _FLAG_ELEMENTS = new FlagElements();

export class CustomerCollectionUtils {
    async prepareComboBox(cbCustomerCollections, firstOption, divCollectionFlag) {
        if (firstOption) {
            cbCustomerCollections.appendChild(firstOption);
        }

        let authId = _GLOBAL_COOKIES.AUTH_ID.getValue();
        let JSONResponse = await _CUSTOMER_COLLECTIONS_API.GET.getAllByCustomerId(authId);
        if (JSONResponse.status === _HTTP_STATUSES.OK) {
            let json = JSONResponse.json;
            for (let i = 0; i < json.length; i++) {
                let customerCollection = new CustomerCollectionResponseDTO(json[i]);

                let option = document.createElement("option");
                option.textContent = customerCollection.title;
                option.id = customerCollection.key;

                cbCustomerCollections.appendChild(option);
            }
        }

        // Создаём таймер для поиска языка в коллекции и смены флага
        // Это нужно, чтобы избежать возможного скопления запросов к API ---
        let customerTimerCollectionFlagChanger = new CustomTimer();
        customerTimerCollectionFlagChanger.timeout = 1;
        customerTimerCollectionFlagChanger.handler = async function() {
            let langCode;
            let collectionKey = _COMBO_BOX_UTILS.GET_SELECTED_ITEM_ID.byComboBox(cbCustomerCollections);
            let JSONResponse = await _CUSTOMER_COLLECTIONS_API.GET.findByKey(collectionKey);
            if (JSONResponse.status === _HTTP_STATUSES.OK) {
                let collection = new CustomerCollectionResponseDTO(JSONResponse.json);
                langCode = collection.lang.code;
            }

            _FLAG_ELEMENTS.DIV.setStyles(divCollectionFlag, langCode, true);
        }
        //---

        cbCustomerCollections.addEventListener("change", function() {
            customerTimerCollectionFlagChanger.start();
        })

        _COMBO_BOX_UTILS.CHANGE_SELECTED_ITEM.byComboBoxAndItemIndex(
            cbCustomerCollections, 0, true);
    }

    prepareTextBox(tbCustomerCollection, divCollectionFlag){
        // Создаём таймер для поиска языка в коллекции и смены флага
        // Это нужно, чтобы избежать возможного скопления запросов к API ---
        let customerTimerCollectionFlagChanger = new CustomTimer();
        customerTimerCollectionFlagChanger.timeout = 250;
        customerTimerCollectionFlagChanger.handler = async function() {
            let langCode;
            let collectionKey = tbCustomerCollection.value;
            let JSONResponse = await _CUSTOMER_COLLECTIONS_API.GET.findByKey(collectionKey);
            if (JSONResponse.status === _HTTP_STATUSES.OK) {
                let collection = new CustomerCollectionResponseDTO(JSONResponse.json);
                langCode = collection.lang.code;
            }

            _FLAG_ELEMENTS.DIV.setStyles(divCollectionFlag, langCode, true);
        }
        //---

        tbCustomerCollection.addEventListener("input", function () {
            customerTimerCollectionFlagChanger.start();
        });

        let event = new Event('input');
        tbCustomerCollection.dispatchEvent(event);
    }

    async checkCorrectValueInTbTitle(tbTitle, parentElement, customTimerObj) {
        let isCorrect = true;
        if (tbTitle && parentElement) {
            const TITLE_MIN_SIZE = 3;
            const TITLE_MAX_SIZE = 30;

            let ruleElement = new RuleElement(parentElement.id);
            let message;
            let ruleType;

            let inputText = tbTitle.value.trim();
            if (!inputText) {
                isCorrect = false;
                message = "Название не может быть пустым.";
                ruleType = _RULE_TYPES.ERROR;
            } else if (inputText.length < TITLE_MIN_SIZE || inputText.length > TITLE_MAX_SIZE) {
                isCorrect = false;
                message = `Название должно быть быть от ${TITLE_MIN_SIZE} до ${TITLE_MAX_SIZE} символов.`;
                ruleType = _RULE_TYPES.ERROR;
            } else {
                ruleElement.removeDiv();

                let customerCollectionRequestDTO = new CustomerCollectionRequestDTO();
                customerCollectionRequestDTO.title = inputText;

                let JSONResponsePromise = new Promise(resolve => {
                    customTimerObj.handler = async function () {
                        resolve(await _CUSTOMER_COLLECTIONS_API.POST.validateBeforeCrud(customerCollectionRequestDTO));
                    }

                    customTimerObj.timeout = 250;
                    customTimerObj.start();
                });

                let JSONResponse = await JSONResponsePromise;
                if (JSONResponse.status !== _HTTP_STATUSES.OK) {
                    isCorrect = false;
                    message = new CustomResponseMessage(JSONResponse.json).text;
                    ruleType = _RULE_TYPES.ERROR;
                }
            }

            // Отображаем предупреждение (правило), если это необходимо ---
            if (isCorrect === false) {
                ruleElement.createOrChangeDiv(message, ruleType);
            } else {
                ruleElement.removeDiv();
            }
            //---
        } else {
            isCorrect = false;
        }

        return isCorrect;
    }

    async checkCorrectValueInTbKey(tbKey, parentElement, customTimerObj) {
        let isCorrect = true;

        if (tbKey && parentElement) {
            let ruleElement = new RuleElement(parentElement.id);
            let message;
            let ruleType;

            let inputText = tbKey.value.trim();
            if (!inputText) {
                isCorrect = false;
                message = "Ключ не может быть пустым.";
                ruleType = _RULE_TYPES.ERROR;
            } else {
                ruleElement.removeDiv();

                let JSONResponsePromise = new Promise(resolve => {
                    customTimerObj.handler = async function () {
                        resolve(await _CUSTOMER_COLLECTIONS_API.GET.findByKey(inputText));
                    }

                    customTimerObj.timeout = 250;
                    customTimerObj.start();
                });

                let JSONResponse = await JSONResponsePromise;
                if (JSONResponse.status !== _HTTP_STATUSES.OK) {
                    isCorrect = false;
                    message = "Коллекции с таким ключом не существует.";
                    ruleType = _RULE_TYPES.ERROR;
                }
            }

            // Отображаем предупреждение (правило), если это необходимо ---
            if (isCorrect === false) {
                ruleElement.createOrChangeDiv(message, ruleType);
            } else {
                ruleElement.removeDiv();
            }
            //---
        } else {
            isCorrect = false;
        }

        return isCorrect;
    }

    async createDivCollectionInfoAfterCheckAuthId(collectionKey) {
        let authId = _GLOBAL_COOKIES.AUTH_ID.getValue();
        let JSONResponse = await
            _CUSTOMER_COLLECTIONS_API.GET.findByCustomerIdAndKey(authId, collectionKey);
        if (JSONResponse.status === _HTTP_STATUSES.OK) {
            let customerCollection = new CustomerCollectionResponseDTO(JSONResponse.json);
            return await customerCollection.createDivInfo();
        } else {
            let divMessage = document.createElement("div");
            divMessage.classList.add(_CSS_COLLECTION_INFO.DIV_COLLECTION_INFO_ERROR_CONTAINER_STYLE_ID);
            divMessage.textContent = new CustomResponseMessage(JSONResponse.json).text;

            return divMessage;
        }
    }
}