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
    CB_CUSTOMER_COLLECTIONS = new CbCustomerCollections();
    TB_CUSTOMER_COLLECTION_TITLE = new TbCustomerCollectionTitle();

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

class CbCustomerCollections {
    async #fillClear(comboBoxWithFlagObj, firstOption, JSONResponseByCustomerCollectionsAPI) {
        if (comboBoxWithFlagObj) {
            let cbCustomerCollections = comboBoxWithFlagObj.comboBox;
            if (cbCustomerCollections) {
                cbCustomerCollections.replaceChildren();

                if (firstOption) {
                    cbCustomerCollections.appendChild(firstOption);
                }

                if (JSONResponseByCustomerCollectionsAPI) {
                    if (JSONResponseByCustomerCollectionsAPI.status === _HTTP_STATUSES.OK) {
                        let json = JSONResponseByCustomerCollectionsAPI.json;
                        for (let i = 0; i < json.length; i++) {
                            let customerCollection = new CustomerCollectionResponseDTO(json[i]);

                            let option = document.createElement("option");
                            option.textContent = customerCollection.title;
                            option.id = customerCollection.key;

                            cbCustomerCollections.appendChild(option);
                        }
                    }
                }
            }
        }
    }

    async changeFlag(comboBoxWithFlagObj){
        if (comboBoxWithFlagObj) {
            let cbCustomerCollections = comboBoxWithFlagObj.comboBox;
            let divFlag = comboBoxWithFlagObj.divFlag;
            if (cbCustomerCollections && divFlag) {
                let langCode;
                let collectionKey = _COMBO_BOX_UTILS.GET_SELECTED_ITEM_ID.byComboBox(cbCustomerCollections);
                let JSONResponse = await _CUSTOMER_COLLECTIONS_API.GET.findByKey(collectionKey);
                if (JSONResponse.status === _HTTP_STATUSES.OK) {
                    let collection = new CustomerCollectionResponseDTO(JSONResponse.json);
                    langCode = collection.lang.code;
                }

                _FLAG_ELEMENTS.DIV.setStyles(divFlag, langCode, true);
            }
        }
    }

    async prepare(comboBoxWithFlagObj, firstOption, doNeedValueChecker) {
        if (comboBoxWithFlagObj) {
            let cbCollectionsContainer = comboBoxWithFlagObj.comboBoxWithFlagContainer;
            let cbCustomerCollections = comboBoxWithFlagObj.comboBox;
            let divFlag = comboBoxWithFlagObj.divFlag;
            if (cbCollectionsContainer && cbCustomerCollections && divFlag) {
                let authId = _GLOBAL_COOKIES.AUTH_ID.getValue();
                let JSONResponse = await _CUSTOMER_COLLECTIONS_API.GET.getAllForInByCustomerId(authId);
                await this.#fillClear(comboBoxWithFlagObj, firstOption, JSONResponse);

                // Меняем флаг ---
                await this.changeFlag(comboBoxWithFlagObj);
                //---

                // Вешаем событие изменения флага ---
                let thisClass = this;
                cbCustomerCollections.addEventListener("change", async function () {
                    await thisClass.changeFlag(comboBoxWithFlagObj);
                });
                //---

                if (doNeedValueChecker === true) {
                    cbCustomerCollections.addEventListener("change", async function() {
                        await thisClass.checkCorrectValue(comboBoxWithFlagObj);
                    });
                }
            }
        }
    }

    async fill(comboBoxWithFlagObj, firstOption){
        if (comboBoxWithFlagObj) {
            let cbCustomerCollections = comboBoxWithFlagObj.comboBox;
            let divFlag = comboBoxWithFlagObj.divFlag;
            if (cbCustomerCollections && divFlag) {
                // Запоминаем, какой элемент был выбран до очистки списка ---
                let oldCustomerCollection = _COMBO_BOX_UTILS.GET_SELECTED_ITEM_ID.byComboBox(cbCustomerCollections);
                //---

                let authId = _GLOBAL_COOKIES.AUTH_ID.getValue();
                let JSONResponse = await _CUSTOMER_COLLECTIONS_API.GET.getAllForInByCustomerId(authId);
                await this.#fillClear(comboBoxWithFlagObj, firstOption, JSONResponse);

                // Пытаемся установить старый элемент ---
                _COMBO_BOX_UTILS.CHANGE_SELECTED_ITEM.byComboBoxAndItemId(
                    cbCustomerCollections, oldCustomerCollection, false);
                //---

                // Меняем флаг ---
                await this.changeFlag(comboBoxWithFlagObj);
                //---
            }
        }
    }

    async fillByLangOutCode(comboBoxWithFlagObj, firstOption, langOutCode){
        if (comboBoxWithFlagObj) {
            let cbCustomerCollections = comboBoxWithFlagObj.comboBox;
            let divFlag = comboBoxWithFlagObj.divFlag;
            if (cbCustomerCollections && divFlag) {
                // Запоминаем, какой элемент был выбран до очистки списка ---
                let oldCustomerCollection = _COMBO_BOX_UTILS.GET_SELECTED_ITEM_ID.byComboBox(cbCustomerCollections);
                //---

                let isLangCodeCorrect = false;
                let authId = _GLOBAL_COOKIES.AUTH_ID.getValue();
                if (langOutCode) {
                    let JSONResponse = await _CUSTOMER_COLLECTIONS_API.GET
                        .getAllForInByCustomerIdAndLangOutCode(authId, langOutCode);
                    if (JSONResponse.status === _HTTP_STATUSES.OK) {
                        isLangCodeCorrect = true;
                        await this.#fillClear(comboBoxWithFlagObj, firstOption, JSONResponse);
                    }
                }

                if (isLangCodeCorrect === true) {
                    // Пытаемся установить старый элемент ---
                    _COMBO_BOX_UTILS.CHANGE_SELECTED_ITEM.byComboBoxAndItemId(
                        cbCustomerCollections, oldCustomerCollection, false);
                    //---

                    // Меняем флаг ---
                    await this.changeFlag(comboBoxWithFlagObj);
                    //---

                } else {
                    // Если код был пустой или недопустимый, заполняем всеми значениями ---
                    await this.fill(comboBoxWithFlagObj, firstOption);
                    //---
                }
            }
        }
    }

    async checkCorrectValue(comboBoxWithFlagObj) {
        let isCorrect = false;
        if (comboBoxWithFlagObj) {
            let cbCollectionsContainer = comboBoxWithFlagObj.comboBoxWithFlagContainer;
            let cbCollections = comboBoxWithFlagObj.comboBox;
            let divFlag = comboBoxWithFlagObj.divFlag;
            if (cbCollectionsContainer && cbCollections && divFlag) {
                let ruleElement = new RuleElement(cbCollections, cbCollectionsContainer);

                let customerCollectionKey = _COMBO_BOX_UTILS.GET_SELECTED_ITEM_ID.byComboBox(cbCollections);
                if (customerCollectionKey) {
                    // Ищем коллекцию у пользователя ---
                    let authId = _GLOBAL_COOKIES.AUTH_ID.getValue();

                    let customerCollection;
                    let JSONResponse = await _CUSTOMER_COLLECTIONS_API.GET
                        .findByCustomerIdAndKey(authId, customerCollectionKey);
                    if (JSONResponse.status !== _HTTP_STATUSES.OK) {
                        isCorrect = false;
                        ruleElement.message = new CustomResponseMessage(JSONResponse.json).text;
                        ruleElement.ruleType = _RULE_TYPES.ERROR;
                    } else {
                        customerCollection = new CustomerCollectionResponseDTO(JSONResponse.json);
                    }
                    //---

                    if (customerCollection) {
                        // Проверяем активность языка у найденной коллекции ---
                        JSONResponse = await _CUSTOMER_COLLECTIONS_API.GET
                            .validateIsLangActiveInCollectionByKey(customerCollection.key);
                        if (JSONResponse.status !== _HTTP_STATUSES.OK) {
                            isCorrect = false;
                            ruleElement.message = new CustomResponseMessage(JSONResponse.json).text;
                            ruleElement.ruleType = _RULE_TYPES.ERROR;
                        } else {
                            // Проверяем количество слов в найденной коллекции ---
                            JSONResponse = await _CUSTOMER_COLLECTIONS_API.GET
                                .validateMinNumberOfWordsForWorkoutByKey(customerCollection.key);
                            if (JSONResponse.status !== _HTTP_STATUSES.OK) {
                                isCorrect = false;
                                ruleElement.message = new CustomResponseMessage(JSONResponse.json).text;
                                ruleElement.ruleType = _RULE_TYPES.ERROR;
                            } else {
                                isCorrect = true;
                            }
                            //---
                        }
                        //---
                    }
                } else {
                    isCorrect = false;
                    ruleElement.message = "Выберите коллекцию.";
                    ruleElement.ruleType = _RULE_TYPES.ERROR;
                }

                if (isCorrect === false) {
                    ruleElement.showRule();
                } else {
                    ruleElement.removeRule();
                }
            }
        }

        return isCorrect;
    }
}

class TbCustomerCollectionTitle {
    async checkCorrectValue(tbTitle, langCode, customTimerObj) {
        let isCorrect = false;
        if (tbTitle && customTimerObj) {
            const TITLE_MIN_SIZE = 3;
            const TITLE_MAX_SIZE = 30;

            let ruleElement = new RuleElement(tbTitle, tbTitle.parentElement);

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
                    customTimerObj.setTimeout(250);
                    customTimerObj.setHandler(async function () {
                        resolve(await _CUSTOMER_COLLECTIONS_API.POST.validateBeforeCrud(customerCollectionRequestDTO));
                    });

                    customTimerObj.start();
                });

                let JSONResponse = await JSONResponsePromise;
                if (JSONResponse.status !== _HTTP_STATUSES.OK) {
                    isCorrect = false;
                    ruleElement.message = new CustomResponseMessage(JSONResponse.json).text;
                    ruleElement.ruleType = _RULE_TYPES.ERROR;
                } else {
                    isCorrect = true;
                }
            }

            if (isCorrect === false) {
                ruleElement.showRule();
            } else {
                ruleElement.removeRule();
            }
        }

        return isCorrect;
    }
}