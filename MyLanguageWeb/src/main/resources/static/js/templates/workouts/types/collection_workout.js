import {
    WorkoutTypes
} from "../../../classes/dto/entity/workout_type/workout_types.js";

import {
    CustomerCollectionUtils
} from "../../../classes/utils/entity/customer_collection_utils.js";

import {
    LangUtils
} from "../../../classes/utils/entity/lang_utils.js";

import {
    NotOverWorkoutsTableHelper
} from "../../../classes/utils/for_templates/not_over_workouts_table_helper.js";

import {
    RuleElement
} from "../../../classes/rule/rule_element.js";

import {
    ComboBoxUtils
} from "../../../classes/utils/combo_box_utils.js";

import {
    CustomerCollectionsAPI
} from "../../../classes/api/customer_collections_api.js";

import {
    HttpStatuses
} from "../../../classes/http_statuses.js";

import {
    CustomResponseMessage
} from "../../../classes/dto/other/custom_response_message.js";

import {
    RuleTypes
} from "../../../classes/rule/rule_types.js";

import {
    CustomerCollectionResponseDTO
} from "../../../classes/dto/entity/customer_collection.js";

import {
    LoadingElement
} from "../../../classes/loading_element.js";

import {
    WorkoutRequestDTO, WorkoutResponseDTO
} from "../../../classes/dto/entity/workout.js";

import {
    WorkoutsAPI
} from "../../../classes/api/workouts_api.js";

import {
    GlobalCookies
} from "../../../classes/global_cookies.js";

import {
    TextBoxUtils
} from "../../../classes/utils/text_box_utils.js";

import {
    CustomTimer
} from "../../../classes/custom_timer/custom_timer.js";

import {
    WordInCollectionResponseDTO
} from "../../../classes/dto/entity/word_in_collection.js";

import {
    TableUtils
} from "../../../classes/utils/table_utils.js";

import {
    WordsInCollectionAPI
} from "../../../classes/api/words_in_collection_api.js";

import {
    CssRoot
} from "../../../classes/css/css_root.js";

import {
    ComboBoxWithFlag
} from "../../../classes/element_with_flag/combo_box_with_flag.js";

import {
    LangsAPI
} from "../../../classes/api/langs_api.js";

import {
    CssMain
} from "../../../classes/css/css_main.js";

import {
    BigIntUtils
} from "../../../classes/utils/bigint_utils.js";

const _CUSTOMER_COLLECTIONS_API = new CustomerCollectionsAPI();
const _WORKOUTS_API = new WorkoutsAPI();
const _WORDS_IN_COLLECTION_API = new WordsInCollectionAPI();
const _LANGS_API = new LangsAPI();

const _CSS_MAIN = new CssMain();
const _CSS_ROOT = new CssRoot();

const _CUSTOMER_COLLECTION_UTILS = new CustomerCollectionUtils();
const _LANG_UTILS = new LangUtils();
const _COMBO_BOX_UTILS = new ComboBoxUtils();
const _HTTP_STATUSES = new HttpStatuses();
const _RULE_TYPES = new RuleTypes();
const _GLOBAL_COOKIES = new GlobalCookies();
const _TEXT_BOX_UTILS = new TextBoxUtils();
const _TABLE_UTILS = new TableUtils();
const _BIGINT_UTILS = new BigIntUtils();

const _DIV_CUSTOMER_COLLECTION_CONTAINER_ID = "div_customer_collection_container";
const _CB_CUSTOMER_COLLECTIONS_ID = "cb_customer_collections";
const _DIV_CUSTOMER_COLLECTION_FLAG_ID = "customer_collection_flag";

const _DIV_LANG_OUT_CONTAINER_ID = "div_lang_out_container";
const _CB_LANGS_OUT_ID = "cb_langs_out";
const _DIV_LANG_OUT_FLAG_ID = "lang_out_flag";

const _FORM_SUBMIT_SEND_ID = "submit_send";
const _BTN_SUBMIT_ID = "btn_submit";
const _BTN_DROP_WORKOUT_SETTINGS_ID = "btn_drop_workout_settings";
const _DIV_WORKOUT_START_INFO_CONTAINER_ID = "workout_start_info_container";

const _DIV_NOT_OVER_WORKOUTS_CONTAINER_ID = "not_over_workouts_container";

const _TB_FINDER_ID = "tb_finder";
const _BTN_REFRESH_ID = "btn_refresh_table";
const _DIV_COLLECTION_INFO_ID = "div_collection_info";
const _THEAD_WORDS_IN_COLLECTION = "words_in_collection_head";
const _TBODY_WORDS_IN_COLLECTION = "words_in_collection_body";

const _CUSTOM_TIMER_COLLECTION_INFO_FINDER = new CustomTimer();

const _CUSTOM_TIMER_TB_FINDER = new CustomTimer();
const _CUSTOM_TIMER_WORDS_IN_COLLECTION_FINDER = new CustomTimer();
const _TIMEOUT_FOR_FINDERS = 1000;

const _NUMBER_OF_WORDS = 20;
let _lastWordNumberInList = 0;
let _lastWordInCollectionIdOnPreviousPage = 0n;

const _CURRENT_WORKOUT_TYPE = new WorkoutTypes().COLLECTION_WORKOUT;

let _lastWorkout;
let _notOverWorkoutsTableHelper;

window.onload = async function() {
    changeDisableStatusInImportantElements(true);

    // Ищем последнюю тренировку в данном режиме, чтобы установить последние настройки ---
    let authId = _GLOBAL_COOKIES.AUTH_ID.getValue();
    let workoutTypeCode = _CURRENT_WORKOUT_TYPE.CODE;
    let JSONResponse = await _WORKOUTS_API.GET.findLastByCustomerIdAndWorkoutTypeCode(authId, workoutTypeCode);
    if (JSONResponse.status === _HTTP_STATUSES.OK) {
        _lastWorkout = new WorkoutResponseDTO(JSONResponse.json);
    }
    //---

    // Подготавливаем helper таблицы незавершённых тренировок ---
    _notOverWorkoutsTableHelper = new NotOverWorkoutsTableHelper(
        _DIV_NOT_OVER_WORKOUTS_CONTAINER_ID, _CURRENT_WORKOUT_TYPE.CODE, changeDisableStatusInImportantElements);
    _notOverWorkoutsTableHelper.startToBuildTable();
    //---

    // Подготавливаем таймеры ---
    prepareCollectionInfoFinder();
    prepareWordsInCollectionFinder();
    //---

    await prepareCbCustomerCollections();
    await prepareCbLangsOut();
    await prepareFormSubmitSend();
    await prepareBtnDropWorkoutSettings();

    // Заполняем списки поддерживающими коллекциями и языками ---
    await fillCbCustomerCollectionsByLangOutCode();
    await fillCbLangsOutByCustomerCollectionLangCode();
    //---

    prepareTbFinder();
    prepareBtnRefresh();
    startCollectionFinders();

    changeDisableStatusInImportantElements(false);
}

async function prepareCbCustomerCollections() {
    let divCustomerCollectionContainer = document.getElementById(_DIV_CUSTOMER_COLLECTION_CONTAINER_ID);
    let cbCustomerCollections = document.getElementById(_CB_CUSTOMER_COLLECTIONS_ID);
    let divCustomerCollectionFlag = document.getElementById(_DIV_CUSTOMER_COLLECTION_FLAG_ID);
    if (divCustomerCollectionContainer && cbCustomerCollections && divCustomerCollectionFlag) {
        let comboBoxWithFlag =
            new ComboBoxWithFlag(divCustomerCollectionContainer, cbCustomerCollections, divCustomerCollectionFlag);

        let firstOption = document.createElement("option");
        firstOption.textContent = "Выберите коллекцию";

        await _CUSTOMER_COLLECTION_UTILS.CB_CUSTOMER_COLLECTIONS.prepare(
            comboBoxWithFlag, firstOption, true);

        // Меняем элемент списка на основе последней тренировки ---
        if (_lastWorkout && _lastWorkout.customerCollection) {
            _COMBO_BOX_UTILS.CHANGE_SELECTED_ITEM.byComboBoxAndItemValue(
                cbCustomerCollections, _lastWorkout.customerCollection.id, true);
        }
        //---

        cbCustomerCollections.addEventListener("change", async function() {
            clearDivWorkoutStartInfoContainer();

            startCollectionFinders();
            await fillCbLangsOutByCustomerCollectionLangCode();
        })
    }
}

async function fillCbCustomerCollectionsByLangOutCode() {
    changeDisableStatusInImportantElements(true);

    let cbLangsOut = document.getElementById(_CB_LANGS_OUT_ID);
    if (cbLangsOut) {
        let divCustomerCollectionContainer = document.getElementById(_DIV_CUSTOMER_COLLECTION_CONTAINER_ID);
        let cbCustomerCollections = document.getElementById(_CB_CUSTOMER_COLLECTIONS_ID);
        let divCustomerCollectionFlag = document.getElementById(_DIV_CUSTOMER_COLLECTION_FLAG_ID);
        if (divCustomerCollectionContainer && cbCustomerCollections && divCustomerCollectionFlag) {
            let cbCustomerCollectionsWithFlag =
                new ComboBoxWithFlag(divCustomerCollectionContainer, cbCustomerCollections, divCustomerCollectionFlag);

            let firstOption = document.createElement("option");
            firstOption.textContent = "Выберите коллекцию";

            let langOutCode = _COMBO_BOX_UTILS.GET_SELECTED_ITEM_VALUE.byComboBox(cbLangsOut);
            await _CUSTOMER_COLLECTION_UTILS.CB_CUSTOMER_COLLECTIONS.fillByLangOutCode(
                cbCustomerCollectionsWithFlag, firstOption, langOutCode);
        }
    }

    changeDisableStatusInImportantElements(false);
}

async function prepareCbLangsOut() {
    let divLangOutContainer = document.getElementById(_DIV_LANG_OUT_CONTAINER_ID);
    let cbLangsOut = document.getElementById(_CB_LANGS_OUT_ID);
    let divLangOutFlag = document.getElementById(_DIV_LANG_OUT_FLAG_ID);
    if (divLangOutFlag && cbLangsOut && divLangOutFlag) {
        let cbLangsOutWithFlag = new ComboBoxWithFlag(divLangOutContainer, cbLangsOut, divLangOutFlag);

        let firstOption = document.createElement("option");
        firstOption.textContent = "Выберите язык";

        await _LANG_UTILS.CB_LANGS_OUT.prepare(cbLangsOutWithFlag, firstOption, true);

        // Меняем элемент списка на основе последней тренировки ---
        if (_lastWorkout && _lastWorkout.langOut) {
            _COMBO_BOX_UTILS.CHANGE_SELECTED_ITEM.byComboBoxAndItemValue(
                cbLangsOut, _lastWorkout.langOut.code, true);
        }
        //---

        cbLangsOut.addEventListener("change", async function () {
            clearDivWorkoutStartInfoContainer();

            await fillCbCustomerCollectionsByLangOutCode();
            startCollectionFinders();
        })
    }
}

async function fillCbLangsOutByCustomerCollectionLangCode() {
    changeDisableStatusInImportantElements(true);

    let cbCustomerCollections = document.getElementById(_CB_CUSTOMER_COLLECTIONS_ID);
    if (cbCustomerCollections) {
        let langInCode;

        let collectionId = _COMBO_BOX_UTILS.GET_SELECTED_ITEM_VALUE.byComboBox(cbCustomerCollections);
        let JSONResponse = await _CUSTOMER_COLLECTIONS_API.GET.findById(collectionId);
        if (JSONResponse.status === _HTTP_STATUSES.OK) {
            let customerCollection = new CustomerCollectionResponseDTO(JSONResponse.json);
            langInCode = customerCollection.lang.code;
        }

        let divLangOutContainer = document.getElementById(_DIV_LANG_OUT_CONTAINER_ID);
        let cbLangsOut = document.getElementById(_CB_LANGS_OUT_ID);
        let divLangOutFlag = document.getElementById(_DIV_LANG_OUT_FLAG_ID);
        if (divLangOutContainer && cbLangsOut && divLangOutFlag) {
            let cbLangsOutWithFlag =
                new ComboBoxWithFlag(divLangOutContainer, cbLangsOut, divLangOutFlag);

            let firstOption = document.createElement("option");
            firstOption.textContent = "Выберите язык";

            await _LANG_UTILS.CB_LANGS_OUT.fillByLangInCode(cbLangsOutWithFlag, firstOption, langInCode);
        }
    }

    changeDisableStatusInImportantElements(false);
}

function prepareFormSubmitSend() {
    let formSubmitSend = document.getElementById(_FORM_SUBMIT_SEND_ID);
    if (formSubmitSend) {
        formSubmitSend.addEventListener("submit", async function(event) {
            event.preventDefault();

            // Блокируем элементы и отображаем загрузки ---
            changeDisableStatusInImportantElements(true);
            _notOverWorkoutsTableHelper.showLoading();

            clearDivWorkoutStartInfoContainer();
            let divWorkoutStartInfoContainer = document.getElementById(_DIV_WORKOUT_START_INFO_CONTAINER_ID);
            if (divWorkoutStartInfoContainer) {
                divWorkoutStartInfoContainer.appendChild(new LoadingElement().createDiv());
            }
            //---

            let isCorrect = true;
            if (await checkBeforeWorkoutStart() === true) {
                if (await createWorkout() === true) {
                    formSubmitSend.submit();
                } else {
                    isCorrect = false;
                }
            } else {
                isCorrect = false;
                clearDivWorkoutStartInfoContainer();

            }

            if (isCorrect === false) {
                changeDisableStatusInImportantElements(false);
                _notOverWorkoutsTableHelper.startToBuildTable();
                startCollectionFinders();
            }
        });
    }
}

function prepareBtnDropWorkoutSettings() {
    let customTimerDropWorkoutSettings = new CustomTimer();
    customTimerDropWorkoutSettings.setTimeout(500);
    customTimerDropWorkoutSettings.setHandler(async function() {
        let divCustomerCollectionContainer = document.getElementById(_DIV_CUSTOMER_COLLECTION_CONTAINER_ID);
        let cbCustomerCollections = document.getElementById(_CB_CUSTOMER_COLLECTIONS_ID);
        if (divCustomerCollectionContainer && cbCustomerCollections) {
            _COMBO_BOX_UTILS.CHANGE_SELECTED_ITEM
                .byComboBoxAndItemIndex(cbCustomerCollections, 0, false);

            let ruleElement = new RuleElement(cbCustomerCollections, divCustomerCollectionContainer);
            ruleElement.removeRule();
        }

        let divLangOutContainer = document.getElementById(_DIV_LANG_OUT_CONTAINER_ID);
        let cbLangsOut = document.getElementById(_CB_LANGS_OUT_ID);
        if (divLangOutContainer && cbLangsOut) {
            _COMBO_BOX_UTILS.CHANGE_SELECTED_ITEM
                .byComboBoxAndItemIndex(cbLangsOut, 0, false);

            let ruleElement = new RuleElement(cbLangsOut, cbCustomerCollections);
            ruleElement.removeRule();
        }

        // Заполняем списки поддерживающими языками ---
        await fillCbCustomerCollectionsByLangOutCode();
        await fillCbLangsOutByCustomerCollectionLangCode();
        //---

        // Запускаем таймеры с информацией о коллекции ---
        startCollectionFinders();
        //---

        changeDisableStatusInImportantElements(false);
    });

    let btnDropWorkoutSettings = document.getElementById(_BTN_DROP_WORKOUT_SETTINGS_ID);
    if (btnDropWorkoutSettings) {
        btnDropWorkoutSettings.addEventListener("click", async function() {
            clearDivWorkoutStartInfoContainer();
            changeDisableStatusInImportantElements(true);

            customTimerDropWorkoutSettings.stop();
            customTimerDropWorkoutSettings.start();
        });
    }
}

function prepareTbFinder() {
    let tbFinder = document.getElementById(_TB_FINDER_ID);
    if (tbFinder) {
        _TEXT_BOX_UTILS.prepareTbFinder(tbFinder, startCollectionFinders, _CUSTOM_TIMER_TB_FINDER);
    }
}

function prepareBtnRefresh() {
    let btnRefresh = document.getElementById(_BTN_REFRESH_ID);
    if (btnRefresh) {
        btnRefresh.addEventListener("click", function () {
            startCollectionFinders();
        })
    }
}

function startCollectionFinders() {
    startToFindCollectionInfo();
    startToFindWordsInCollection();
}

// Создание новой тренировки ---
async function checkAllLangs() {
    let isCorrect = true;

    let collectionLangCode;
    let cbCustomerCollections = document.getElementById(_CB_CUSTOMER_COLLECTIONS_ID);
    if (cbCustomerCollections) {
        // Найдём язык выбранной коллекции ---

        let collectionId = _COMBO_BOX_UTILS.GET_SELECTED_ITEM_VALUE.byComboBox(cbCustomerCollections);
        let JSONResponse = await _CUSTOMER_COLLECTIONS_API.GET.findById(collectionId);
        if (JSONResponse.status !== _HTTP_STATUSES.OK) {
            isCorrect = false;

            let parentElement = document.getElementById(_DIV_CUSTOMER_COLLECTION_CONTAINER_ID);
            let ruleElement = new RuleElement(cbCustomerCollections, parentElement);
            ruleElement.message = new CustomResponseMessage(JSONResponse.json).text;
            ruleElement.ruleType = _RULE_TYPES.ERROR;

            ruleElement.showRule();
        } else {
            let collection = new CustomerCollectionResponseDTO(JSONResponse.json);
            collectionLangCode = collection.lang.code;
        }
        //---
    } else {
        isCorrect = false;
    }

    if (collectionLangCode) {
        let cbLangsOut = document.getElementById(_CB_LANGS_OUT_ID);
        if (cbLangsOut) {
            let langOutCode = _COMBO_BOX_UTILS.GET_SELECTED_ITEM_VALUE.byComboBox(cbLangsOut);

            // Совпадение языков запрещено ---
            let message;
            let ruleType;

            if (collectionLangCode === langOutCode) {
                isCorrect = false;
                message = "Языки не могут быть одинаковыми.";
                ruleType = _RULE_TYPES.ERROR;
            }
            //---

            if (isCorrect === true) {
                // Пара языков должна поддерживаться ---
                let JSONResponse = await _LANGS_API.GET.validateCoupleOfLanguages(collectionLangCode, langOutCode);
                if (JSONResponse.status !== _HTTP_STATUSES.OK) {
                    isCorrect = false;
                    message = new CustomResponseMessage(JSONResponse.json).text;
                    ruleType = _RULE_TYPES.ERROR;
                }
                //---
            }

            // Отображаем предупреждение (правило), если это необходимо ---
            let parentElement = document.getElementById(_DIV_CUSTOMER_COLLECTION_CONTAINER_ID);
            let ruleElement = new RuleElement(cbCustomerCollections, parentElement);
            ruleElement.message = message;
            ruleElement.ruleType = ruleType;
            if (isCorrect === false) {
                ruleElement.showRule();
            } else {
                ruleElement.removeRule();
            }
            //---

            // Отображаем предупреждение (правило), если это необходимо ---
            parentElement = document.getElementById(_DIV_LANG_OUT_CONTAINER_ID);
            ruleElement = new RuleElement(cbLangsOut, parentElement);
            ruleElement.message = message;
            ruleElement.ruleType = ruleType;
            if (isCorrect === false) {
                ruleElement.showRule();
            } else {
                ruleElement.removeRule();
            }
            //---
        } else {
            isCorrect = false;
        }
    }

    return isCorrect;
}

async function checkBeforeWorkoutStart() {
    // Проверяем корректность коллекции ---
    let isCustomerCollectionCorrect = false;

    let divCustomerCollectionContainer = document.getElementById(_DIV_CUSTOMER_COLLECTION_CONTAINER_ID);
    let cbCustomerCollections = document.getElementById(_CB_CUSTOMER_COLLECTIONS_ID);
    let divCustomerCollectionFlag = document.getElementById(_DIV_CUSTOMER_COLLECTION_FLAG_ID);
    if (divCustomerCollectionContainer && cbCustomerCollections && divCustomerCollectionFlag) {
        let comboBoxWithFlag =
            new ComboBoxWithFlag(divCustomerCollectionContainer, cbCustomerCollections, divCustomerCollectionFlag);
        isCustomerCollectionCorrect =
            await _CUSTOMER_COLLECTION_UTILS.CB_CUSTOMER_COLLECTIONS.checkCorrectValue(comboBoxWithFlag);
    }
    //---

    // Проверяем корректность выходного языка ---
    let isLangOutCorrect = false;

    let divLangOutContainer = document.getElementById(_DIV_LANG_OUT_CONTAINER_ID);
    let cbLangsOut = document.getElementById(_CB_LANGS_OUT_ID);
    let divLangOutFlag = document.getElementById(_DIV_LANG_OUT_FLAG_ID);
    if (divLangOutFlag && cbLangsOut && divLangOutFlag) {
        let cbLangsOutWithFlag =
            new ComboBoxWithFlag(divLangOutContainer, cbLangsOut, divLangOutFlag);
        isLangOutCorrect = await _LANG_UTILS.CB_LANGS_OUT.checkCorrectValue(cbLangsOutWithFlag);
    }
    //---

    let isCorrect = (isCustomerCollectionCorrect === true
        && isLangOutCorrect === true);

    if (isCorrect === true) {
        isCorrect = await checkAllLangs();
    }

    return isCorrect;
}

async function createWorkout() {
    let workoutRequestDTO = new WorkoutRequestDTO();
    workoutRequestDTO.workoutTypeCode = _CURRENT_WORKOUT_TYPE.CODE;
    workoutRequestDTO.langOutCode = _COMBO_BOX_UTILS.GET_SELECTED_ITEM_VALUE.byComboBoxId(_CB_LANGS_OUT_ID);
    workoutRequestDTO.collectionId = _COMBO_BOX_UTILS.GET_SELECTED_ITEM_VALUE.byComboBoxId(_CB_CUSTOMER_COLLECTIONS_ID);

    let isCorrect = true;
    let JSONResponse = await _WORKOUTS_API.POST.add(workoutRequestDTO);
    if (JSONResponse.status !== _HTTP_STATUSES.OK) {
        isCorrect = false;

        // Отображаем ошибку в контейнере информации ---
        clearDivWorkoutStartInfoContainer();
        let divWorkoutStartInfoContainer = document.getElementById(_DIV_WORKOUT_START_INFO_CONTAINER_ID);
        if (divWorkoutStartInfoContainer) {
            let ruleElement = new RuleElement(divWorkoutStartInfoContainer, divWorkoutStartInfoContainer);
            ruleElement.message = new CustomResponseMessage(JSONResponse.json).text;
            ruleElement.ruleType = _RULE_TYPES.ERROR;
            ruleElement.showRule();
        }
        //---
    }

    return isCorrect;
}

function clearDivWorkoutStartInfoContainer() {
    let divWorkoutStartInfoContainer = document.getElementById(_DIV_WORKOUT_START_INFO_CONTAINER_ID);
    if (divWorkoutStartInfoContainer) {
        divWorkoutStartInfoContainer.replaceChildren();
    }
}

function changeDisableStatusInImportantElements(isDisable) {
    let btnSend = document.getElementById(_BTN_SUBMIT_ID);
    if (btnSend) {
        btnSend.disabled = isDisable;
    }

    let cbCustomerCollections = document.getElementById(_CB_CUSTOMER_COLLECTIONS_ID);
    if (cbCustomerCollections) {
        cbCustomerCollections.disabled = isDisable;
    }

    let cbOutLangs = document.getElementById(_CB_LANGS_OUT_ID);
    if (cbOutLangs) {
        cbOutLangs.disabled = isDisable;
    }
}
//---

// Информация о коллекции ---
function prepareCollectionInfoFinder() {
    _CUSTOM_TIMER_COLLECTION_INFO_FINDER.setTimeout(_TIMEOUT_FOR_FINDERS);
    _CUSTOM_TIMER_COLLECTION_INFO_FINDER.setHandler(async function() {
        await tryToFillCollectionInfo();
    });
}

function startToFindCollectionInfo() {
    if (_CUSTOM_TIMER_COLLECTION_INFO_FINDER) {
        _CUSTOM_TIMER_COLLECTION_INFO_FINDER.stop();
    }

    let divCollectionInfo = document.getElementById(_DIV_COLLECTION_INFO_ID);
    if (divCollectionInfo) {
        divCollectionInfo.replaceChildren();
        divCollectionInfo.appendChild(new LoadingElement().createDiv());
    }

    if (_CUSTOM_TIMER_COLLECTION_INFO_FINDER) {
        _CUSTOM_TIMER_COLLECTION_INFO_FINDER.start();
    }
}

async function tryToFillCollectionInfo() {
    let currentFinder = _CUSTOM_TIMER_COLLECTION_INFO_FINDER;

    let divCollectionInfoContainer = document.getElementById(_DIV_COLLECTION_INFO_ID);
    if (divCollectionInfoContainer) {
        let isCorrect = true;
        let message;

        let collectionIdStr = _COMBO_BOX_UTILS.GET_SELECTED_ITEM_VALUE.byComboBoxId(_CB_CUSTOMER_COLLECTIONS_ID);
        let collectionId = _BIGINT_UTILS.parse(collectionIdStr);
        if (!collectionId) {
            isCorrect = false;
            message = "Выберите коллекцию, которую хотите тренировать, чтобы увидеть информацию о ней.";
        }

        if (isCorrect === true) {
            let JSONResponse = await _CUSTOMER_COLLECTIONS_API.GET.findById(collectionId);
            if (JSONResponse.status === _HTTP_STATUSES.OK) {
                isCorrect = true;

                let customerCollection = new CustomerCollectionResponseDTO(JSONResponse.json);
                let divCollectionInfo = await customerCollection.tryToCreateDivInfoAfterValidate();
                if (currentFinder.getActive() === true) {
                    divCollectionInfoContainer.replaceChildren();
                    if (currentFinder.getActive() === true) {
                        divCollectionInfoContainer.appendChild(divCollectionInfo);
                    }
                }
            } else {
                isCorrect = false;
                message = new CustomResponseMessage(JSONResponse.json).text;
            }
        }

        if (isCorrect === false) {
            let divMessage = document.createElement("div");
            divMessage.classList.add(_CSS_MAIN.DIV_CONTENT_CENTER_STANDARD_STYLE_ID);
            divMessage.style.fontSize = _CSS_ROOT.SECOND_FONT_SIZE;
            divMessage.textContent = message;

            if (currentFinder.getActive() === true) {
                divCollectionInfoContainer.replaceChildren();
                if (currentFinder.getActive() === true) {
                    divCollectionInfoContainer.appendChild(divMessage);
                }
            }
        }
    }
}
//---

// Слова в коллекции ---
function prepareWordsInCollectionFinder() {
    _CUSTOM_TIMER_WORDS_IN_COLLECTION_FINDER.setTimeout(_TIMEOUT_FOR_FINDERS);
    _CUSTOM_TIMER_WORDS_IN_COLLECTION_FINDER.setHandler(async function() {
        let readyToFill = true;

        // Пользователь должен выбрать коллекцию в выпадающем списке ---
        let collectionIdStr = _COMBO_BOX_UTILS.GET_SELECTED_ITEM_VALUE.byComboBoxId(_CB_CUSTOMER_COLLECTIONS_ID);
        let collectionId = _BIGINT_UTILS.parse(collectionIdStr);
        if (!collectionId) {
            readyToFill = false;
            setMessageInsideTable("Выберите коллекцию, которую хотите тренировать, чтобы просмотреть слова в ней.");
        }
        //---

        // Коллекция должна принадлежать пользователю ---
        if (readyToFill === true) {
            let authId = _GLOBAL_COOKIES.AUTH_ID.getValue();
            let JSONResponse = await
                _CUSTOMER_COLLECTIONS_API.GET.validateIsCustomerCollectionAuthor(authId, collectionId);
            if (JSONResponse.status !== _HTTP_STATUSES.OK) {
                readyToFill = false;
                setMessageInsideTable(new CustomResponseMessage(JSONResponse.json).text);
            }
        }
        //---

        if (readyToFill === true) {
            _lastWordNumberInList = 0;
            _lastWordInCollectionIdOnPreviousPage = 0n;

            await tryToFillTableRows(true, true);
        }
    });
}

function startToFindWordsInCollection() {
    if (_CUSTOM_TIMER_WORDS_IN_COLLECTION_FINDER) {
        _CUSTOM_TIMER_WORDS_IN_COLLECTION_FINDER.stop();
    }

    // Отображаем загрузку в таблице ---
    let tableHead = document.getElementById(_THEAD_WORDS_IN_COLLECTION);
    let tableBody = document.getElementById(_TBODY_WORDS_IN_COLLECTION);
    if (tableHead && tableBody) {
        let numberOfColumns = _TABLE_UTILS.getNumberOfColumnsByTableHead(tableHead);
        let trMessage =
            _TABLE_UTILS.MESSAGES_INSIDE_TABLE.createTrLoading(numberOfColumns);

        tableBody.replaceChildren();
        tableBody.appendChild(trMessage);
    }
    //---

    if (_CUSTOM_TIMER_WORDS_IN_COLLECTION_FINDER) {
        _CUSTOM_TIMER_WORDS_IN_COLLECTION_FINDER.start();
    }
}

async function tryToFillTableRows(doNeedToClearTable, doNeedToShowTableMessage) {
    let currentFinder = _CUSTOM_TIMER_WORDS_IN_COLLECTION_FINDER;

    let isCorrect = true;
    let message;

    let collectionIdStr = _COMBO_BOX_UTILS.GET_SELECTED_ITEM_VALUE.byComboBoxId(_CB_CUSTOMER_COLLECTIONS_ID);
    let collectionId = _BIGINT_UTILS.parse(collectionIdStr);
    if (!collectionId) {
        isCorrect = false;
        message = "Выберите коллекцию";
    }

    if (isCorrect === true) {
        let title = document.getElementById(_TB_FINDER_ID).value;
        let JSONResponse = await _WORDS_IN_COLLECTION_API.GET.getAllInCollectionFilteredPagination(collectionId,
            _NUMBER_OF_WORDS, title, _lastWordInCollectionIdOnPreviousPage);
        if (JSONResponse.status === _HTTP_STATUSES.OK) {
            isCorrect = true;

            let tableRows = await createTableRows(JSONResponse.json);
            let tableBody = document.getElementById(_TBODY_WORDS_IN_COLLECTION);
            if (tableRows && tableBody && currentFinder.getActive() === true) {
                if (doNeedToClearTable === true) {
                    tableBody.replaceChildren();
                }

                for (let i = 0; i < tableRows.length; i++) {
                    if (currentFinder.getActive() !== true) break;
                    tableBody.appendChild(tableRows[i]);
                }
            }
        } else {
            isCorrect = false;
            message = new CustomResponseMessage(JSONResponse.json).text;
        }
    }

    if (isCorrect === false && doNeedToShowTableMessage === true) {
        setMessageInsideTable(message);
    }
}

async function createTableRows(allWordsInCollectionFilteredPaginationJson){
    let currentFinder = _CUSTOM_TIMER_WORDS_IN_COLLECTION_FINDER;
    let tableRows = [];

    for (let i = 0; i < allWordsInCollectionFilteredPaginationJson.length; i++) {
        if (currentFinder.getActive() !== true) break;
        let wordInCollection =
            new WordInCollectionResponseDTO(allWordsInCollectionFilteredPaginationJson[i]);

        let row = await createTableRow(wordInCollection);
        if (row) {
            tableRows.push(row);
        }

        // Получаем id последнего элемента JSON-коллекции
        if (i === allWordsInCollectionFilteredPaginationJson.length - 1) {
            _lastWordInCollectionIdOnPreviousPage = wordInCollection.id;
        }
    }

    // Создаем кнопку "Показать больше", если запрос вернул максимальное количество на страницу
    if (currentFinder.getActive() === true
        && allWordsInCollectionFilteredPaginationJson.length === _NUMBER_OF_WORDS) {
        let tableHead = document.getElementById(_THEAD_WORDS_IN_COLLECTION);
        let numberOfColumns = _TABLE_UTILS.getNumberOfColumnsByTableHead(tableHead);

        let message =  `Показать ещё ${_NUMBER_OF_WORDS} элементов...`;
        let trShowMore = _TABLE_UTILS.createTrShowMore(numberOfColumns,
            message, async function (){
                await tryToFillTableRows(false, false);
            });

        tableRows.push(trShowMore);
    }

    return tableRows;
}

async function createTableRow(wordInCollectionResponseDTO) {
    let row = document.createElement("tr");

    // Порядковый номер ---
    let numberColumn = document.createElement("td");
    numberColumn.style.textAlign = "center";
    numberColumn.textContent = `${++_lastWordNumberInList}.`;
    row.appendChild(numberColumn);
    //---

    // Название слова ---
    let titleColumn = document.createElement("td");
    titleColumn.textContent = wordInCollectionResponseDTO.word.title;
    row.appendChild(titleColumn);
    //---

    // Язык ---
    let langColumn = document.createElement("td");
    langColumn.appendChild(wordInCollectionResponseDTO.word.lang.createSpan());
    row.appendChild(langColumn);
    //---

    return row;
}

function setMessageInsideTable(message) {
    let currentFinder = _CUSTOM_TIMER_WORDS_IN_COLLECTION_FINDER;

    let tableHead = document.getElementById(_THEAD_WORDS_IN_COLLECTION);
    let tableBody = document.getElementById(_TBODY_WORDS_IN_COLLECTION);
    if (tableHead && tableBody) {
        let numberOfColumns = _TABLE_UTILS.getNumberOfColumnsByTableHead(tableHead);
        let trMessage =
            _TABLE_UTILS.MESSAGES_INSIDE_TABLE.createTrCommon(numberOfColumns, message);

        if (currentFinder.getActive() === true) {
            tableBody.replaceChildren();
            if (currentFinder.getActive() === true) {
                tableBody.appendChild(trMessage);
            }
        }
    }
}
//---