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
    ComboBoxUtils
} from "../combo_box_utils.js";

import {
    FlagElements
} from "../../flag_elements.js";

import {
    BigIntUtils
} from "../bigint_utils.js";

const _CUSTOMER_COLLECTIONS_API = new CustomerCollectionsAPI();

const _GLOBAL_COOKIES = new GlobalCookies();
const _HTTP_STATUSES = new HttpStatuses();
const _RULE_TYPES = new RuleTypes();
const _COMBO_BOX_UTILS = new ComboBoxUtils();
const _FLAG_ELEMENTS = new FlagElements();
const _BIGINT_UTILS = new BigIntUtils();

export class CustomerCollectionUtils {
    CB_CUSTOMER_COLLECTIONS = new CbCustomerCollections();
    TB_CUSTOMER_COLLECTION_TITLE = new TbCustomerCollectionTitle();
}

class CbCustomerCollections {
    async #fillClear(comboBoxWithFlagObj, firstOption, JSONResponseByCustomerCollectionsAPI) {
        if (comboBoxWithFlagObj) {
            let cbCustomerCollections = comboBoxWithFlagObj.comboBox;
            if (cbCustomerCollections) {
                cbCustomerCollections.replaceChildren();

                if (firstOption) {
                    firstOption.value = "";
                    cbCustomerCollections.appendChild(firstOption);
                }

                if (JSONResponseByCustomerCollectionsAPI) {
                    if (JSONResponseByCustomerCollectionsAPI.status === _HTTP_STATUSES.OK) {
                        let json = JSONResponseByCustomerCollectionsAPI.json;
                        for (let i = 0; i < json.length; i++) {
                            let customerCollection = new CustomerCollectionResponseDTO(json[i]);

                            let option = document.createElement("option");
                            option.value = customerCollection.id;
                            option.textContent = customerCollection.title;

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
                let country;
                let collectionId = _COMBO_BOX_UTILS.GET_SELECTED_ITEM_VALUE.byComboBox(cbCustomerCollections);
                let JSONResponse = await _CUSTOMER_COLLECTIONS_API.GET.findById(collectionId);
                if (JSONResponse.status === _HTTP_STATUSES.OK) {
                    let collection = new CustomerCollectionResponseDTO(JSONResponse.json);
                    country = collection.lang.country;
                }

                _FLAG_ELEMENTS.DIV.setStyles(divFlag, country, true);
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
                let oldCustomerCollection = _COMBO_BOX_UTILS.GET_SELECTED_ITEM_VALUE.byComboBox(cbCustomerCollections);
                //---

                let authId = _GLOBAL_COOKIES.AUTH_ID.getValue();
                let JSONResponse = await _CUSTOMER_COLLECTIONS_API.GET.getAllForInByCustomerId(authId);
                await this.#fillClear(comboBoxWithFlagObj, firstOption, JSONResponse);

                // Пытаемся установить старый элемент ---
                _COMBO_BOX_UTILS.CHANGE_SELECTED_ITEM.byComboBoxAndItemValue(
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
                let oldCustomerCollection = _COMBO_BOX_UTILS.GET_SELECTED_ITEM_VALUE.byComboBox(cbCustomerCollections);
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
                    _COMBO_BOX_UTILS.CHANGE_SELECTED_ITEM.byComboBoxAndItemValue(
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
            if (cbCollectionsContainer && cbCollections) {
                isCorrect = true;
                let ruleElement = new RuleElement(cbCollections, cbCollectionsContainer);

                // Пользователь должен выбрать коллекцию с ключом ---
                let collectionIdStr = _COMBO_BOX_UTILS.GET_SELECTED_ITEM_VALUE.byComboBox(cbCollections);
                let collectionId = _BIGINT_UTILS.parse(collectionIdStr);
                if (!collectionIdStr || !collectionId) {
                    isCorrect = false;
                    ruleElement.message = "Выберите коллекцию.";
                    ruleElement.ruleType = _RULE_TYPES.ERROR;
                }
                //---

                // Ищем коллекцию ---
                if (isCorrect === true) {
                    let JSONResponse = await _CUSTOMER_COLLECTIONS_API.GET.findById(collectionId);
                    if (JSONResponse.status !== _HTTP_STATUSES.OK) {
                        isCorrect = false;
                        ruleElement.message = new CustomResponseMessage(JSONResponse.json).text;
                        ruleElement.ruleType = _RULE_TYPES.ERROR;
                    }
                }
                //---

                // Проверяем принадлежность пользователя к искомой коллекции ---
                if (isCorrect === true) {
                    let authId = _GLOBAL_COOKIES.AUTH_ID.getValue();
                    let JSONResponse = await _CUSTOMER_COLLECTIONS_API.GET
                        .validateIsCustomerCollectionAuthor(authId, collectionId);
                    if (JSONResponse.status !== _HTTP_STATUSES.OK) {
                        isCorrect = false;
                        ruleElement.message = new CustomResponseMessage(JSONResponse.json).text;
                        ruleElement.ruleType = _RULE_TYPES.ERROR;
                    }
                }
                //---

                // Проверяем активность языка у искомой коллекции ---
                if (isCorrect === true) {
                    let JSONResponse = await _CUSTOMER_COLLECTIONS_API.GET
                        .validateIsLangActiveInCollectionByCollectionId(collectionId);
                    if (JSONResponse.status !== _HTTP_STATUSES.OK) {
                        isCorrect = false;
                        ruleElement.message = new CustomResponseMessage(JSONResponse.json).text;
                        ruleElement.ruleType = _RULE_TYPES.ERROR;
                    }
                }
                //---

                // Проверяем количество слов в искомой коллекции ---
                if (isCorrect === true) {
                    let JSONResponse = await _CUSTOMER_COLLECTIONS_API.GET
                        .validateMinNumberOfWordsForWorkoutByCollectionId(collectionId);
                    if (JSONResponse.status !== _HTTP_STATUSES.OK) {
                        isCorrect = false;
                        ruleElement.message = new CustomResponseMessage(JSONResponse.json).text;
                        ruleElement.ruleType = _RULE_TYPES.ERROR;
                    } else {
                        isCorrect = true;
                    }
                }
                //---

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
                        resolve(await _CUSTOMER_COLLECTIONS_API.POST.validateBeforeAdd(customerCollectionRequestDTO));
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