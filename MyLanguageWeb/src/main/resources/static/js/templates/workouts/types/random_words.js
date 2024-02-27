import {
    HttpStatuses
} from "../../../classes/http_statuses.js";

import {
    GlobalCookies
} from "../../../classes/global_cookies.js";

import {
    WorkoutTypes
} from "../../../classes/api/workout_types/workout_types.js";

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

const _WORKOUTS_API = new WorkoutsAPI();

const _HTTP_STATUSES = new HttpStatuses();
const _GLOBAL_COOKIES = new GlobalCookies();
const _RULE_TYPES = new RuleTypes();
const _LANG_UTILS = new LangUtils();
const _COMBO_BOX_UTILS = new ComboBoxUtils();

const _DIV_IN_LANG_CONTAINER_ID = "div_in_lang_container";
const _CB_IN_LANGS_ID = "cb_in_langs";
const _DIV_IN_LANG_IN_FLAG_ID = "in_lang_flag";

const _DIV_OUT_LANG_CONTAINER_ID = "div_out_lang_container";
const _CB_OUT_LANGS_ID = "cb_out_langs";
const _DIV_OUT_LANG_FLAG_ID = "out_lang_flag";

const _CB_NUMBER_OF_WORDS_ID = "cb_number_of_words";
const _SUBMIT_SEND_ID = "submit_send";
const _SUBMIT_BTN_ID = "submit_btn";
const _DIV_WORKOUT_START_INFO_CONTAINER_ID = "workout_start_info_container";

const _BTN_REFRESH_ID = "btn_refresh";
const _DIV_NOT_OVER_WORKOUTS_CONTAINER_ID = "not_over_workouts_container";

const _CURRENT_WORKOUT_TYPE = new WorkoutTypes().RANDOM_WORDS;
const _NUMBER_OF_WORDS_POSSIBLE_ARR = [10, 20, 30, 40, 50];

let _notOverWorkoutsTableHelper;

window.onload = async function() {
    changeDisableStatusInImportantElements(true);

    // Подготавливаем helper таблицы незавершённых тренировок ---
    _notOverWorkoutsTableHelper = new NotOverWorkoutsTableHelper(
        _DIV_NOT_OVER_WORKOUTS_CONTAINER_ID, _CURRENT_WORKOUT_TYPE.CODE, changeDisableStatusInImportantElements);
    _notOverWorkoutsTableHelper.startToBuildTable();
    //---

    await prepareCbInLangs();
    await prepareCbOutLangs();
    prepareCbNumberOfWords();
    prepareSubmitSend();
    prepareBtnRefresh();
    await tryToSetLastWorkoutSettings();

    changeDisableStatusInImportantElements(false);
}

async function prepareCbInLangs() {
    let cbInLangs = document.getElementById(_CB_IN_LANGS_ID);
    if (cbInLangs) {
        // Устанавливаем первый элемент списка, выводим белый флаг ---
        let firstOption = document.createElement("option");
        firstOption.textContent = "Выберите язык";

        let divInLangFlag = document.getElementById(_DIV_IN_LANG_IN_FLAG_ID);
        await _LANG_UTILS.prepareComboBox(cbInLangs, firstOption, divInLangFlag);
        //---

        cbInLangs.addEventListener("change", async function () {
            clearWorkoutStartInfoContainer();
            await checkCorrectLangIn();
        })
    }
}

async function prepareCbOutLangs() {
    let cbOutLangs = document.getElementById(_CB_OUT_LANGS_ID);
    if (cbOutLangs) {
        // Устанавливаем первый элемент списка, выводим белый флаг ---
        let firstOption = document.createElement("option");
        firstOption.textContent = "Выберите язык";

        let divOutLangFlag = document.getElementById(_DIV_OUT_LANG_FLAG_ID);
        await _LANG_UTILS.prepareComboBox(cbOutLangs, firstOption, divOutLangFlag);
        //---

        cbOutLangs.addEventListener("change", async function () {
            clearWorkoutStartInfoContainer();

            await checkCorrectLangOut();
        })
    }
}

function prepareCbNumberOfWords() {
    let cbNumberOfWords = document.getElementById(_CB_NUMBER_OF_WORDS_ID);
    if (cbNumberOfWords) {
        for (let i = 0; i < _NUMBER_OF_WORDS_POSSIBLE_ARR.length; i++) {
            let optionNumberOfWords = document.createElement("option");
            optionNumberOfWords.textContent = `${_NUMBER_OF_WORDS_POSSIBLE_ARR[i]}`;

            cbNumberOfWords.appendChild(optionNumberOfWords);
        }

        cbNumberOfWords.addEventListener("change", function () {
            clearWorkoutStartInfoContainer();

            checkCorrectNumberOfWords();
        })
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
            }
        } else {
            clearWorkoutStartInfoContainer();
            changeDisableStatusInImportantElements(false);
            _notOverWorkoutsTableHelper.startToBuildTable();
        }
    })
}

function prepareBtnRefresh() {
    let btnRefresh = document.getElementById(_BTN_REFRESH_ID);
    if (btnRefresh) {
        btnRefresh.addEventListener("click", function () {
            if (_notOverWorkoutsTableHelper) {
                _notOverWorkoutsTableHelper.startToBuildTable();
            }
        })
    }
}

async function tryToSetLastWorkoutSettings() {
    let authId = _GLOBAL_COOKIES.AUTH_ID.getValue();
    let workoutTypeCode = _CURRENT_WORKOUT_TYPE.CODE;
    let JSONResponse = await _WORKOUTS_API.GET.findLastByCustomerIdAndWorkoutTypeCode(authId, workoutTypeCode);
    if (JSONResponse.status === _HTTP_STATUSES.OK) {
        let workout = new WorkoutResponseDTO(JSONResponse.json);

        if (workout.langIn) {
            let cbInLangs = document.getElementById(_CB_IN_LANGS_ID);
            if (cbInLangs) {
                _COMBO_BOX_UTILS.CHANGE_SELECTED_ITEM.byComboBoxAndItemId(
                    cbInLangs, workout.langIn.code, true);
            }
        }

        if (workout.langOut) {
            let cbOutLangs = document.getElementById(_CB_OUT_LANGS_ID);
            if (cbOutLangs) {
                _COMBO_BOX_UTILS.CHANGE_SELECTED_ITEM.byComboBoxAndItemId(
                    cbOutLangs, workout.langOut.code, true);
            }
        }

        if (workout.numberOfWords) {
            let cbNumberOfWords = document.getElementById(_CB_NUMBER_OF_WORDS_ID);
            for (let i = 0; i < cbNumberOfWords.childNodes.length; i++) {
                let iOption = cbNumberOfWords.childNodes[i];
                if (BigInt(iOption.value) === workout.numberOfWords) {
                    _COMBO_BOX_UTILS.CHANGE_SELECTED_ITEM.byComboBoxAndItemIndex(
                        cbNumberOfWords, i, false);
                    break;
                }
            }
        }
    }
}

// Создание новой тренировки ---
async function checkCorrectLangIn() {
    let cbInLangs = document.getElementById(_CB_IN_LANGS_ID);
    let divInLangContainer = document.getElementById(_DIV_IN_LANG_CONTAINER_ID);
    if (cbInLangs && divInLangContainer) {
        return await _LANG_UTILS.checkCorrectValueInComboBox(cbInLangs, divInLangContainer);
    }
}

async function checkCorrectLangOut() {
    let cbOutLangs = document.getElementById(_CB_OUT_LANGS_ID);
    let divOutLangContainer = document.getElementById(_DIV_OUT_LANG_CONTAINER_ID);
    if (cbOutLangs && divOutLangContainer) {
        return await _LANG_UTILS.checkCorrectValueInComboBox(cbOutLangs, divOutLangContainer);
    }
}

function checkCorrectNumberOfWords() {
    const NUMBER_OF_WORDS_REGEXP = /^[0-9]+$/;

    let isCorrect = true;
    let cbNumberOfWords = document.getElementById(_CB_NUMBER_OF_WORDS_ID);
    let ruleElement = new RuleElement(cbNumberOfWords.parentElement,
        "number_of_words_correct");

    let numberOfWords = _COMBO_BOX_UTILS.GET_SELECTED_ITEM.byComboBox(cbNumberOfWords).value;
    if (!NUMBER_OF_WORDS_REGEXP.test(numberOfWords)) {
        isCorrect = false;
        ruleElement.message = "Количество слов должно быть числом.";
        ruleElement.ruleType = _RULE_TYPES.ERROR;
    } else {
        let numberOfWordsArePossible = false;
        for (let i = 0; i < _NUMBER_OF_WORDS_POSSIBLE_ARR.length; i++) {
            if (numberOfWords === _NUMBER_OF_WORDS_POSSIBLE_ARR[i].toString()) {
                numberOfWordsArePossible = true;
                break;
            }
        }

        if (numberOfWordsArePossible === false) {
            isCorrect = false;
            ruleElement.message = "Нельзя тренировать такое количество.";
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

    return isCorrect;
}

function checkAllLangs() {
    let isCorrect = true;
    let message;
    let ruleType;

    let cbInLangs = document.getElementById(_CB_IN_LANGS_ID);
    let cbOutLangs = document.getElementById(_CB_OUT_LANGS_ID);
    if (cbInLangs && cbOutLangs) {
        let divInLangCode = _COMBO_BOX_UTILS.GET_SELECTED_ITEM_ID.byComboBox(cbInLangs);
        let divOutLangCode = _COMBO_BOX_UTILS.GET_SELECTED_ITEM_ID.byComboBox(cbOutLangs);

        // Совпадение языков запрещено ---
        if (divInLangCode === divOutLangCode) {
            isCorrect = false;
            message = "Языки не могут быть одинаковыми.";
            ruleType = _RULE_TYPES.ERROR;
        }
        //---

        // Отображаем предупреждение (правило), если это необходимо ---
        let parentElement = document.getElementById(_DIV_IN_LANG_CONTAINER_ID);
        let ruleElement = new RuleElement(cbInLangs, parentElement);
        ruleElement.message = message;
        ruleElement.ruleType = ruleType;
        if (isCorrect === false) {
            ruleElement.showRule();
        } else {
            ruleElement.removeRule();
        }
        //---

        // Отображаем предупреждение (правило), если это необходимо ---
        parentElement = document.getElementById(_DIV_OUT_LANG_CONTAINER_ID);
        ruleElement = new RuleElement(cbOutLangs, parentElement);
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
    let isLangInCorrect = await checkCorrectLangIn();
    let isLangOutCorrect = await checkCorrectLangOut();
    let isNumberOfWordsCorrect = checkCorrectNumberOfWords();

    let isCorrect = (isLangInCorrect && isLangOutCorrect && isNumberOfWordsCorrect);

    if (isCorrect === true) {
        isCorrect = checkAllLangs();
    }

    return isCorrect;
}

async function createWorkout() {
    let workoutRequestDTO = new WorkoutRequestDTO();
    workoutRequestDTO.workoutTypeCode = _CURRENT_WORKOUT_TYPE.CODE;
    workoutRequestDTO.langInCode = _COMBO_BOX_UTILS.GET_SELECTED_ITEM_ID.byComboBoxId(_CB_IN_LANGS_ID);
    workoutRequestDTO.langOutCode = _COMBO_BOX_UTILS.GET_SELECTED_ITEM_ID.byComboBoxId(_CB_OUT_LANGS_ID);
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

        _notOverWorkoutsTableHelper.startToBuildTable();
    }

    return isCorrect;
}

function changeDisableStatusInImportantElements(isDisable) {
    let cbInLangs = document.getElementById(_CB_IN_LANGS_ID);
    if (cbInLangs) {
        cbInLangs.disabled = isDisable;
    }

    let cbOutLangs = document.getElementById(_CB_OUT_LANGS_ID);
    if (cbOutLangs) {
        cbOutLangs.disabled = isDisable;
    }

    let cbNumberOfWords = document.getElementById(_CB_NUMBER_OF_WORDS_ID);
    if (cbNumberOfWords) {
        cbNumberOfWords.disabled = isDisable;
    }

    let btnSend = document.getElementById(_SUBMIT_BTN_ID);
    if (btnSend) {
        btnSend.disabled = isDisable;
    }

    let btnRefresh = document.getElementById(_BTN_REFRESH_ID);
    if (btnRefresh) {
        btnRefresh.disabled = isDisable;
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