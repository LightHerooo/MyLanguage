import {
    CustomerCollectionRequestDTO,
    CustomerCollectionResponseDTO
} from "../../dto/entity/customer_collection.js";

import {
    GlobalCookies
} from "../../global_cookies.js";

import {
    HttpStatuses
} from "../../http_statuses.js";

import {
    RuleElement
} from "../../rule/rule_element.js";

import {
    RuleTypes
} from "../../rule/rule_types.js";

import {
    CustomResponseMessage
} from "../../dto/other/custom_response_message.js";

import {
    CustomerCollectionsAPI
} from "../../api/customer_collections_api.js";

import {
    CssCollectionInfo
} from "../../css/entity/css_collection_info.js";

import {
    ComboBoxUtils
} from "../combo_box_utils.js";

import {
    FlagElements
} from "../../flag_elements.js";

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

        cbCustomerCollections.addEventListener("change", async function() {
            let langCode;
            let collectionKey = _COMBO_BOX_UTILS.GET_SELECTED_ITEM_ID.byComboBox(cbCustomerCollections);
            let JSONResponse = await _CUSTOMER_COLLECTIONS_API.GET.findByKey(collectionKey);
            if (JSONResponse.status === _HTTP_STATUSES.OK) {
                let collection = new CustomerCollectionResponseDTO(JSONResponse.json);
                langCode = collection.lang.code;
            }

            _FLAG_ELEMENTS.DIV.setStyles(divCollectionFlag, langCode, true);
        })

        _COMBO_BOX_UTILS.CHANGE_SELECTED_ITEM.byComboBoxAndItemIndex(
            cbCustomerCollections, 0, true);
    }

    async checkCorrectValueInTbTitle(tbTitle, parentElement, langCode, customTimerObj) {
        let isCorrect = true;
        if (tbTitle && parentElement) {
            const TITLE_MIN_SIZE = 3;
            const TITLE_MAX_SIZE = 30;

            let ruleElement = new RuleElement(tbTitle, parentElement);

            customTimerObj.stop();
            let inputText = tbTitle.value.trim();
            if (!inputText) {
                isCorrect = false;
                ruleElement.message = "Название не может быть пустым.";
                ruleElement.ruleType = _RULE_TYPES.ERROR;
            } else if (inputText.length < TITLE_MIN_SIZE || inputText.length > TITLE_MAX_SIZE) {
                isCorrect = false;
                ruleElement.message = `Название должно быть быть от ${TITLE_MIN_SIZE} до ${TITLE_MAX_SIZE} символов.`;
                ruleElement.ruleType = _RULE_TYPES.ERROR;
            } else {
                ruleElement.removeRule();

                let customerCollectionRequestDTO = new CustomerCollectionRequestDTO();
                customerCollectionRequestDTO.title = inputText;
                customerCollectionRequestDTO.langCode = langCode;

                let JSONResponsePromise = new Promise(resolve => {
                    customTimerObj.setHandler(async function () {
                        resolve(await _CUSTOMER_COLLECTIONS_API.POST.validateBeforeCrud(customerCollectionRequestDTO));
                    });

                    customTimerObj.setTimeout(250);
                    customTimerObj.start();
                });

                let JSONResponse = await JSONResponsePromise;
                if (JSONResponse.status !== _HTTP_STATUSES.OK) {
                    isCorrect = false;
                    ruleElement.message = new CustomResponseMessage(JSONResponse.json).text;
                    ruleElement.ruleType = _RULE_TYPES.ERROR;
                }
            }

            // Отображаем предупреждение (правило), если это необходимо ---
            if (isCorrect === false) {
                ruleElement.showRule();
            } else {
                ruleElement.removeRule();
            }
            //---
        } else {
            isCorrect = false;
        }

        return isCorrect;
    }

    async createDivCollectionInfoAfterValidate(collectionKey) {
        let customerCollection;
        let message;

        let authId = _GLOBAL_COOKIES.AUTH_ID.getValue();
        let JSONResponse = await
            _CUSTOMER_COLLECTIONS_API.GET.findByCustomerIdAndKey(authId, collectionKey);
        if (JSONResponse.status === _HTTP_STATUSES.OK) {
            customerCollection = new CustomerCollectionResponseDTO(JSONResponse.json);

            JSONResponse = await _CUSTOMER_COLLECTIONS_API.GET.validateIsLangActiveInCollectionByKey(collectionKey);
            if (JSONResponse.status !== _HTTP_STATUSES.OK) {
                customerCollection = null;
                message = new CustomResponseMessage(JSONResponse.json).text;
            }
        } else {
            message = new CustomResponseMessage(JSONResponse.json).text;
        }

        if (customerCollection) {
            return await customerCollection.createDivInfo();
        } else {
            let divMessage = document.createElement("div");
            divMessage.classList.add(_CSS_COLLECTION_INFO.DIV_COLLECTION_INFO_ERROR_CONTAINER_STYLE_ID);
            divMessage.textContent = message;

            return divMessage;
        }
    }
}