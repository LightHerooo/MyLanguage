import {
    HttpStatuses
} from "../../../classes/http_statuses.js";

import {
    GlobalCookies
} from "../../../classes/global_cookies.js";

import {
    WorkoutTypes
} from "../../../classes/dto/entity/workout_type/workout_types.js";

import {
    RuleElement
} from "../../../classes/rule/rule_element.js";

import {
    RuleTypes
} from "../../../classes/rule/rule_types.js";

import {
    LangUtils
} from "../../../classes/utils/entity/lang_utils.js";

import {
    ComboBoxUtils
} from "../../../classes/utils/combo_box_utils.js";

import {
    LoadingElement
} from "../../../classes/loading_element.js";

import {
    WorkoutsAPI
} from "../../../classes/api/workouts_api.js";

import {
    WorkoutRequestDTO,
    WorkoutResponseDTO
} from "../../../classes/dto/entity/workout.js";

import {
    NotOverWorkoutsTableHelper
} from "../../../classes/utils/for_templates/not_over_workouts_table_helper.js";

import {
    CustomResponseMessage
} from "../../../classes/dto/other/custom_response_message.js";

import {
    ComboBoxWithFlag
} from "../../../classes/element_with_flag/combo_box_with_flag.js";

import {
    LangsAPI
} from "../../../classes/api/langs_api.js";

import {
    WorkoutUtils
} from "../../../classes/utils/entity/workout_utils.js";

import {
    CustomTimer
} from "../../../classes/custom_timer/custom_timer.js";

const _WORKOUTS_API = new WorkoutsAPI();
const _LANGS_API = new LangsAPI();

const _HTTP_STATUSES = new HttpStatuses();
const _GLOBAL_COOKIES = new GlobalCookies();
const _RULE_TYPES = new RuleTypes();
const _LANG_UTILS = new LangUtils();
const _COMBO_BOX_UTILS = new ComboBoxUtils();
const _WORKOUT_UTILS = new WorkoutUtils();

const _DIV_LANG_IN_CONTAINER_ID = "div_lang_in_container";
const _CB_LANGS_IN_ID = "cb_langs_in";
const _DIV_LANG_IN_FLAG_ID = "lang_in_flag";

const _DIV_LANG_OUT_CONTAINER_ID = "div_lang_out_container";
const _CB_LANGS_OUT_ID = "cb_langs_out";
const _DIV_LANG_OUT_FLAG_ID = "lang_out_flag";

const _CB_NUMBER_OF_WORDS_ID = "cb_number_of_words";
const _SUBMIT_SEND_ID = "submit_send";
const _BTN_SUBMIT_ID = "btn_submit";
const _BTN_DROP_WORKOUT_SETTINGS_ID = "btn_drop_workout_settings";
const _DIV_WORKOUT_START_INFO_CONTAINER_ID = "workout_start_info_container";

const _DIV_NOT_OVER_WORKOUTS_CONTAINER_ID = "not_over_workouts_container";

const _CURRENT_WORKOUT_TYPE = new WorkoutTypes().RANDOM_WORDS;

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

    await prepareCbLangsIn();
    await prepareCbLangsOut();
    prepareCbNumberOfWords();
    prepareSubmitSend();
    prepareBtnDropWorkoutSettings();

    // Заполняем списки поддерживающими языками ---
    await fillCbLangsInByLangOutCode();
    await fillCbLangsOutByLangInCode();
    //---

    changeDisableStatusInImportantElements(false);
}

async function prepareCbLangsIn() {
    let divLangInContainer = document.getElementById(_DIV_LANG_IN_CONTAINER_ID);
    let cbLangsIn = document.getElementById(_CB_LANGS_IN_ID);
    let divLangInFlag = document.getElementById(_DIV_LANG_IN_FLAG_ID);
    if (divLangInContainer && cbLangsIn && divLangInFlag) {
        let cbLangsInWithFlag = new ComboBoxWithFlag(divLangInContainer, cbLangsIn, divLangInFlag);

        let firstOption = document.createElement("option");
        firstOption.textContent = "Выберите язык";

        await _LANG_UTILS.CB_LANGS_IN.prepare(cbLangsInWithFlag, firstOption, true);

        // Меняем элемент списка на основе последней тренировки ---
        if (_lastWorkout && _lastWorkout.langIn) {
            _COMBO_BOX_UTILS.CHANGE_SELECTED_ITEM.byComboBoxAndItemId(
                cbLangsIn, _lastWorkout.langIn.code, true);
        }
        //---

        cbLangsIn.addEventListener("change", async function () {
            clearWorkoutStartInfoContainer();
            await fillCbLangsOutByLangInCode();
        });
    }
}

async function fillCbLangsInByLangOutCode() {
    changeDisableStatusInImportantElements(true);

    let cbLangsOut = document.getElementById(_CB_LANGS_OUT_ID);
    if (cbLangsOut) {
        let divLangInContainer = document.getElementById(_DIV_LANG_IN_CONTAINER_ID);
        let cbLangsIn = document.getElementById(_CB_LANGS_IN_ID);
        let divLangInFlag = document.getElementById(_DIV_LANG_IN_FLAG_ID);
        if (divLangInContainer && cbLangsIn && divLangInFlag) {
            let cbLangsInWithFlag =
                new ComboBoxWithFlag(divLangInContainer, cbLangsIn, divLangInFlag);

            let firstOption = document.createElement("option");
            firstOption.textContent = "Выберите язык";

            let langOutCode = _COMBO_BOX_UTILS.GET_SELECTED_ITEM_ID.byComboBox(cbLangsOut);
            await _LANG_UTILS.CB_LANGS_IN.fillByLangOutCode(cbLangsInWithFlag, firstOption, langOutCode);
        }
    }

    changeDisableStatusInImportantElements(false);
}

async function prepareCbLangsOut() {
    let divLangOutContainer = document.getElementById(_DIV_LANG_OUT_CONTAINER_ID);
    let cbLangsOut = document.getElementById(_CB_LANGS_OUT_ID);
    let divLangOutFlag = document.getElementById(_DIV_LANG_OUT_FLAG_ID);
    if (divLangOutContainer && cbLangsOut && divLangOutFlag) {
        let cbLangsOutWithFlag = new ComboBoxWithFlag(divLangOutContainer, cbLangsOut, divLangOutFlag);

        let firstOption = document.createElement("option");
        firstOption.textContent = "Выберите язык";

        await _LANG_UTILS.CB_LANGS_OUT.prepare(cbLangsOutWithFlag, firstOption, true);

        // Меняем элемент списка на основе последней тренировки ---
        if (_lastWorkout && _lastWorkout.langOut) {
            _COMBO_BOX_UTILS.CHANGE_SELECTED_ITEM.byComboBoxAndItemId(
                cbLangsOut, _lastWorkout.langOut.code, true);
        }
        //---

        cbLangsOut.addEventListener("change", async function() {
            clearWorkoutStartInfoContainer();
            await fillCbLangsInByLangOutCode();
        });
    }
}

async function fillCbLangsOutByLangInCode(){
    changeDisableStatusInImportantElements(true);

    let cbLangsIn = document.getElementById(_CB_LANGS_IN_ID);
    if (cbLangsIn) {
        let divLangOutContainer = document.getElementById(_DIV_LANG_OUT_CONTAINER_ID);
        let cbLangsOut = document.getElementById(_CB_LANGS_OUT_ID);
        let divLangOutFlag = document.getElementById(_DIV_LANG_OUT_FLAG_ID);
        if (divLangOutContainer && cbLangsOut && divLangOutFlag) {
            let cbLangsOutWithFlag =
                new ComboBoxWithFlag(divLangOutContainer, cbLangsOut, divLangOutFlag);

            let firstOption = document.createElement("option");
            firstOption.textContent = "Выберите язык";

            let langInCode = _COMBO_BOX_UTILS.GET_SELECTED_ITEM_ID.byComboBox(cbLangsIn);
            await _LANG_UTILS.CB_LANGS_OUT.fillByLangInCode(cbLangsOutWithFlag, firstOption, langInCode);
        }
    }

    changeDisableStatusInImportantElements(false);
}

function prepareCbNumberOfWords() {
    let cbNumberOfWords = document.getElementById(_CB_NUMBER_OF_WORDS_ID);
    if (cbNumberOfWords) {
        _WORKOUT_UTILS.CB_NUMBER_OF_WORDS.prepare(cbNumberOfWords);

        // Меняем элемент списка на основе последней тренировки ---
        if (_lastWorkout && _lastWorkout.numberOfWords) {
            for (let i = 0; i < cbNumberOfWords.childNodes.length; i++) {
                try {
                    let iOption = cbNumberOfWords.childNodes[i];
                    let longValue = BigInt(iOption.value);
                    if (longValue === _lastWorkout.numberOfWords) {
                        _COMBO_BOX_UTILS.CHANGE_SELECTED_ITEM.byComboBoxAndItemIndex(
                            cbNumberOfWords, i, true);
                        break;
                    }
                } catch {

                }
            }
        }
        //---

        cbNumberOfWords.addEventListener("change", function () {
            clearWorkoutStartInfoContainer();
        });
    }
}

function prepareSubmitSend() {
    let submitSend = document.getElementById(_SUBMIT_SEND_ID);
    submitSend.addEventListener("submit", async function(event) {
        event.preventDefault();

        // Блокируем элементы и отображаем загрузки ---
        changeDisableStatusInImportantElements(true);
        _notOverWorkoutsTableHelper.showLoading();

        clearWorkoutStartInfoContainer();
        let divWorkoutStartInfoContainer = document.getElementById(_DIV_WORKOUT_START_INFO_CONTAINER_ID);
        if (divWorkoutStartInfoContainer) {
            divWorkoutStartInfoContainer.appendChild(new LoadingElement().createDiv());
        }
        //---

        if (await checkBeforeWorkoutStart() === true) {
            if (await createWorkout() === true) {
                submitSend.submit();
            } else {
                changeDisableStatusInImportantElements(false);
                _notOverWorkoutsTableHelper.startToBuildTable();
            }
        } else {
            clearWorkoutStartInfoContainer();
            changeDisableStatusInImportantElements(false);
            _notOverWorkoutsTableHelper.startToBuildTable();
        }
    })
}

function prepareBtnDropWorkoutSettings() {
    let customTimerDropWorkoutSettings = new CustomTimer();
    customTimerDropWorkoutSettings.setTimeout(500);
    customTimerDropWorkoutSettings.setHandler(async function() {
        let divLangInContainer = document.getElementById(_DIV_LANG_IN_CONTAINER_ID);
        let cbLangsIn = document.getElementById(_CB_LANGS_IN_ID);
        if (divLangInContainer && cbLangsIn) {
            _COMBO_BOX_UTILS.CHANGE_SELECTED_ITEM
                .byComboBoxAndItemIndex(cbLangsIn, 0, false);

            let ruleElement = new RuleElement(cbLangsIn, divLangInContainer);
            ruleElement.removeRule();
        }

        let divLangOutContainer = document.getElementById(_DIV_LANG_OUT_CONTAINER_ID);
        let cbLangsOut = document.getElementById(_CB_LANGS_OUT_ID);
        if (divLangOutContainer && cbLangsOut) {
            _COMBO_BOX_UTILS.CHANGE_SELECTED_ITEM
                .byComboBoxAndItemIndex(cbLangsOut, 0, false);

            let ruleElement = new RuleElement(cbLangsOut, divLangOutContainer);
            ruleElement.removeRule();
        }

        let cbNumberOfWords = document.getElementById(_CB_NUMBER_OF_WORDS_ID);
        if (cbNumberOfWords) {
            _COMBO_BOX_UTILS.CHANGE_SELECTED_ITEM
                .byComboBoxAndItemIndex(cbNumberOfWords, 0, false);

            let ruleElement = new RuleElement(cbNumberOfWords, cbNumberOfWords.parentElement);
            ruleElement.removeRule();
        }

        // Заполняем списки поддерживающими языками ---
        await fillCbLangsInByLangOutCode();
        await fillCbLangsOutByLangInCode();
        //---

        changeDisableStatusInImportantElements(false);
    });

    let btnDropWorkoutSettings = document.getElementById(_BTN_DROP_WORKOUT_SETTINGS_ID);
    if (btnDropWorkoutSettings) {
        btnDropWorkoutSettings.addEventListener("click", async function() {
            clearWorkoutStartInfoContainer();
            changeDisableStatusInImportantElements(true);

            customTimerDropWorkoutSettings.stop();
            customTimerDropWorkoutSettings.start();
        });
    }
}

// Создание новой тренировки ---
async function checkAllLangs() {
    let isCorrect = true;
    let message;
    let ruleType;

    let cbLangsIn = document.getElementById(_CB_LANGS_IN_ID);
    let cbLangsOut = document.getElementById(_CB_LANGS_OUT_ID);
    if (cbLangsIn && cbLangsOut) {
        let langInCode = _COMBO_BOX_UTILS.GET_SELECTED_ITEM_ID.byComboBox(cbLangsIn);
        let langOutCode = _COMBO_BOX_UTILS.GET_SELECTED_ITEM_ID.byComboBox(cbLangsOut);

        // Совпадение языков запрещено ---
        if (langInCode === langOutCode) {
            isCorrect = false;
            message = "Языки не могут быть одинаковыми.";
            ruleType = _RULE_TYPES.ERROR;
        }
        //---

        if (isCorrect === true) {
            // Пара языков должна поддерживаться ---
            let JSONResponse = await _LANGS_API.GET.validateCoupleOfLanguages(langInCode, langOutCode);
            if (JSONResponse.status !== _HTTP_STATUSES.OK) {
                isCorrect = false;
                message = new CustomResponseMessage(JSONResponse.json).text;
                ruleType = _RULE_TYPES.ERROR;
            }
            //---
        }

        // Отображаем предупреждение (правило), если это необходимо ---
        let parentElement = document.getElementById(_DIV_LANG_IN_CONTAINER_ID);

        let ruleElement = new RuleElement(cbLangsIn, parentElement);
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

    return isCorrect;
}

async function checkBeforeWorkoutStart() {
    // Проверяем входящий язык ---
    let isLangInCorrect = false;

    let divLangInContainer = document.getElementById(_DIV_LANG_IN_CONTAINER_ID);
    let cbLangsIn = document.getElementById(_CB_LANGS_IN_ID);
    let divLangInFlag = document.getElementById(_DIV_LANG_IN_FLAG_ID);
    if (divLangInContainer && cbLangsIn && divLangInFlag) {
        let cbLangsInWithFlag = new ComboBoxWithFlag(divLangInContainer, cbLangsIn, divLangInFlag);
        isLangInCorrect = await _LANG_UTILS.CB_LANGS_IN.checkCorrectValue(cbLangsInWithFlag);
    }
    //---

    // Проверяем исходящий язык ---
    let isLangOutCorrect = false;

    let divLangOutContainer = document.getElementById(_DIV_LANG_OUT_CONTAINER_ID);
    let cbLangsOut = document.getElementById(_CB_LANGS_OUT_ID);
    let divLangOutFlag = document.getElementById(_DIV_LANG_OUT_FLAG_ID);
    if (divLangOutContainer && cbLangsOut && divLangOutFlag) {
        let cbLangsOutWithFlag = new ComboBoxWithFlag(divLangOutContainer, cbLangsOut, divLangOutFlag);
        isLangOutCorrect = await _LANG_UTILS.CB_LANGS_IN.checkCorrectValue(cbLangsOutWithFlag);
    }
    //---

    // Проверяем количество слов ---
    let isNumberOfWordsCorrect = false;

    let cbNumberOfWords = document.getElementById(_CB_NUMBER_OF_WORDS_ID);
    if (cbNumberOfWords) {
        isNumberOfWordsCorrect = _WORKOUT_UTILS.CB_NUMBER_OF_WORDS.checkCorrectValue(cbNumberOfWords);
    }
    //---

    let isCorrect = (isLangInCorrect === true
        && isLangOutCorrect === true
        && isNumberOfWordsCorrect === true);

    if (isCorrect === true) {
        isCorrect = checkAllLangs();
    }

    return isCorrect;
}

async function createWorkout() {
    let workoutRequestDTO = new WorkoutRequestDTO();
    workoutRequestDTO.workoutTypeCode = _CURRENT_WORKOUT_TYPE.CODE;
    workoutRequestDTO.langInCode = _COMBO_BOX_UTILS.GET_SELECTED_ITEM_ID.byComboBoxId(_CB_LANGS_IN_ID);
    workoutRequestDTO.langOutCode = _COMBO_BOX_UTILS.GET_SELECTED_ITEM_ID.byComboBoxId(_CB_LANGS_OUT_ID);
    workoutRequestDTO.numberOfWords =
        BigInt(_COMBO_BOX_UTILS.GET_SELECTED_ITEM.byComboBoxId(_CB_NUMBER_OF_WORDS_ID).value);

    let isCorrect = true;
    let JSONResponse = await _WORKOUTS_API.POST.add(workoutRequestDTO);
    if (JSONResponse.status !== _HTTP_STATUSES.OK) {
        isCorrect = false;

        // Отображаем ошибку в контейнере информации ---
        clearWorkoutStartInfoContainer();
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

function changeDisableStatusInImportantElements(isDisable) {
    let btnSend = document.getElementById(_BTN_SUBMIT_ID);
    if (btnSend) {
        btnSend.disabled = isDisable;
    }

    let btnDropWorkoutSettings = document.getElementById(_BTN_DROP_WORKOUT_SETTINGS_ID);
    if (btnDropWorkoutSettings) {
        btnDropWorkoutSettings.disabled = isDisable;
    }

    let cbInLangs = document.getElementById(_CB_LANGS_IN_ID);
    if (cbInLangs) {
        cbInLangs.disabled = isDisable;
    }

    let cbOutLangs = document.getElementById(_CB_LANGS_OUT_ID);
    if (cbOutLangs) {
        cbOutLangs.disabled = isDisable;
    }

    let cbNumberOfWords = document.getElementById(_CB_NUMBER_OF_WORDS_ID);
    if (cbNumberOfWords) {
        cbNumberOfWords.disabled = isDisable;
    }
}

function clearWorkoutStartInfoContainer() {
    let divWorkoutStartInfoContainer =
        document.getElementById(_DIV_WORKOUT_START_INFO_CONTAINER_ID);
    if (divWorkoutStartInfoContainer) {
        divWorkoutStartInfoContainer.replaceChildren();
    }
}
//---