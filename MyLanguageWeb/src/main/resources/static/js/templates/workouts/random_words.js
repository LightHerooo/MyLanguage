import {
    HttpStatuses
} from "../../classes/http_statuses.js";

import {
    GlobalCookies
} from "../../classes/global_cookies.js";

import {
    WorkoutTypes
} from "../../classes/api/workout_types/workout_types.js";

import {
    RuleTypes,
    RuleElement
} from "../../classes/rule_element.js";

import {
    LangUtils
} from "../../classes/utils/entity/lang_utils.js";

import {
    ComboBoxUtils
} from "../../classes/utils/combo_box_utils.js";

import {
    LoadingElement
} from "../../classes/loading_element.js";

import {
    WorkoutsAPI
} from "../../classes/api/workouts_api.js";

import {
    WorkoutRequestDTO,
    WorkoutResponseDTO
} from "../../classes/dto/workout.js";

import {
    CustomResponseMessage
} from "../../classes/dto/other/custom_response_message.js";

const _WORKOUTS_API = new WorkoutsAPI();

const _CURRENT_WORKOUT_TYPE = new WorkoutTypes().RANDOM_WORDS;

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

const _NUMBER_OF_WORDS_POSSIBLE_ARR = [10, 20, 30, 40, 50]

window.onload = async function() {
    await prepareCbInLangs();
    await prepareCbOutLangs();

    prepareCbNumberOfWords();
    prepareSubmitSend();

    await tryToSetLastWorkoutSettings();
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
            changeWorkoutStartInfoRule(true, null, null);

            await checkCorrectLang(this.id, _DIV_IN_LANG_CONTAINER_ID);
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
            changeWorkoutStartInfoRule(true, null, null);

            await checkCorrectLang(this.id, _DIV_OUT_LANG_CONTAINER_ID);
        })
    }
}

function prepareCbNumberOfWords() {
    let cbNumberOfWords = document.getElementById(_CB_NUMBER_OF_WORDS_ID);
    if (cbNumberOfWords) {
        for (let i = 0; i < _NUMBER_OF_WORDS_POSSIBLE_ARR.length; i++) {
            let optionNumberOfWords = document.createElement("option");
           /* optionNumberOfWords.value = _NUMBER_OF_WORDS_POSSIBLE_ARR[i];*/
            optionNumberOfWords.textContent = _NUMBER_OF_WORDS_POSSIBLE_ARR[i];

            cbNumberOfWords.appendChild(optionNumberOfWords);
        }

        cbNumberOfWords.addEventListener("change", function () {
            changeWorkoutStartInfoRule(true, null, null);
            checkCorrectNumberOfWords();
        })
    }
}

function prepareSubmitSend() {
    let submitSend = document.getElementById(_SUBMIT_SEND_ID);
    let submitBtn = document.getElementById(_SUBMIT_BTN_ID);
    submitSend.addEventListener("submit", async function(event) {
        submitBtn.disabled = true;
        event.preventDefault();

        // Показываем анимацию загрузки (предварительно очистив информацию в контейнере) ---
        let divWorkoutStartInfo = document.getElementById(_DIV_WORKOUT_START_INFO_CONTAINER_ID);
        divWorkoutStartInfo.replaceChildren();

        let divLoading = new LoadingElement().createDiv();
        divWorkoutStartInfo.appendChild(divLoading);
        //---

        if (await checkBeforeWorkoutStart() === true) {
            if (await createWorkout() === true) {
                submitSend.submit();
            }
        } else {
            divWorkoutStartInfo.removeChild(divLoading);
        }

        submitBtn.disabled = false;
    })
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

async function checkCorrectLang(cbLangsId, parentElementId) {
    let cbLangs = document.getElementById(cbLangsId);
    let parentElement = document.getElementById(parentElementId);
    return await _LANG_UTILS.checkCorrectValueInComboBox(cbLangs, parentElement, false);
}

function checkCorrectNumberOfWords() {
    const NUMBER_OF_WORDS_REGEXP = /^[0-9]+$/;

    let isCorrect = true;
    let message;
    let ruleType;

    let cbNumberOfWords = document.getElementById(_CB_NUMBER_OF_WORDS_ID);
    let numberOfWords = _COMBO_BOX_UTILS.GET_SELECTED_ITEM.byComboBox(cbNumberOfWords).value;
    if (!NUMBER_OF_WORDS_REGEXP.test(numberOfWords)) {
        isCorrect = false;
        message = "Количество слов должно быть числом.";
        ruleType = _RULE_TYPES.ERROR;
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
            message = "Нельзя тренировать такое количество.";
            ruleType = _RULE_TYPES.ERROR;
        }
    }

    // Отображаем предупреждение (правило), если это необходимо ---
    let ruleElement = new RuleElement(cbNumberOfWords.parentElement.id);
    if (isCorrect === false) {
        ruleElement.createOrChangeDiv(message, ruleType);
    } else {
        ruleElement.removeDiv();
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
        let ruleElement = new RuleElement(_DIV_IN_LANG_CONTAINER_ID);
        if (isCorrect === false) {
            ruleElement.createOrChangeDiv(message, ruleType);
        } else {
            ruleElement.removeDiv();
        }
        //---

        // Отображаем предупреждение (правило), если это необходимо ---
        ruleElement = new RuleElement(_DIV_OUT_LANG_CONTAINER_ID);
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

async function checkBeforeWorkoutStart() {
    let isLangInCorrect = await checkCorrectLang(_CB_IN_LANGS_ID, _DIV_IN_LANG_CONTAINER_ID);
    let isLangOutCorrect = await checkCorrectLang(_CB_OUT_LANGS_ID, _DIV_OUT_LANG_CONTAINER_ID);
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
    let message;
    let ruleType;

    let JSONResponse = await _WORKOUTS_API.POST.add(workoutRequestDTO);
    if (JSONResponse.status !== _HTTP_STATUSES.OK) {
        isCorrect = false;
        message = new CustomResponseMessage(JSONResponse.json).text;
        ruleType = _RULE_TYPES.ERROR;
    }

    changeWorkoutStartInfoRule(isCorrect, message, ruleType);
    return isCorrect;
}

function changeWorkoutStartInfoRule(isCorrect, message, ruleType) {
    let divWorkoutStartInfo = document.getElementById(_DIV_WORKOUT_START_INFO_CONTAINER_ID);
    divWorkoutStartInfo.replaceChildren();

    let ruleElement = new RuleElement(_DIV_WORKOUT_START_INFO_CONTAINER_ID);
    if (isCorrect === false) {
        ruleElement.createOrChangeDiv(message, ruleType);
    } else {
        ruleElement.removeDiv();
    }
}