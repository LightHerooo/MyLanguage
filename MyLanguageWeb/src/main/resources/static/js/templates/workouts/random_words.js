import {
    changeSelectedOptionById,
    changeSelectedOptionByIndex,
    checkCorrectCbLangs,
    fillCbLangs, getSelectedOption,
    getSelectedOptionId
} from "../../utils/combo_box_utils.js";

import {
    getJSONResponseFindLangByCode
} from "../../api/langs.js";

import {
    HttpStatuses
} from "../../classes/http_statuses.js";

import {
    LangResponseDTO
} from "../../dto/lang.js";

import {
    changeRuleStatus,
    getOrCreateRule
} from "../../utils/div_rules.js";

import {
    getJSONResponseFindWorkoutSettingByWorkoutTypeCodeAndCustomerId,
    patchJSONResponseEditSettingInRandomWords,
    postJSONResponseAddSettingInRandomWords
} from "../../api/workout_settings.js";

import {
    getGlobalCookie
} from "../../utils/global_cookie_utils.js";

import {
    GlobalCookies
} from "../../classes/global_cookies.js";

import {
    WorkoutTypes
} from "../../classes/api/workout_types.js";

import {
    WorkoutSettingRequestDTO,
    WorkoutSettingResponseDTO
} from "../../dto/workout_setting.js";

import {
    CustomResponseMessage
} from "../../dto/other/custom_response_message.js";

const _HTTP_STATUSES = new HttpStatuses();
const _GLOBAL_COOKIES = new GlobalCookies();
const _CURRENT_WORKOUT_TYPE = new WorkoutTypes().RANDOM_WORDS;

const _DIV_LANG_FLAG_STYLE_ID = "lang-flag";

const _DIV_IN_LANG_CONTAINER = "div_in_lang_container";
const _CB_IN_LANGS_ID = "cb_in_langs";
const _DIV_IN_LANG_FLAG_ID = "div_in_lang_flag";
const _DIV_OUT_LANG_CONTAINER = "div_out_lang_container";
const _CB_OUT_LANGS_ID = "cb_out_langs";
const _DIV_OUT_LANG_FLAG_ID = "div_out_lang_flag";
const _DIV_NUMBER_OF_WORDS_CONTAINER = "div_number_of_words_container";
const _CB_NUMBER_OF_WORDS_ID = "cb_number_of_words";
const _CHECK_SAVE_SETTINGS_ID = "check_save_settings";
const _A_SAVE_SETTINGS = "a_save_settings";
const _SUBMIT_SEND_ID = "submit_send";
const _SUBMIT_BTN_ID = "submit_btn";
const _DIV_WORKOUT_START_INFO_CONTAINER = "workout_start_info_container";

const _MIN_NUMBER_OF_WORDS = 10;
const _MAX_NUMBER_OF_WORDS = 50;

window.onload = async function() {
    await prepareCbInLangs();
    await prepareCbOutLangs();

    prepareCbNumberOfWords();
    prepareSaveSettingsContainer();
    prepareSubmitSend();

    await tryToSetSavedSettings();
}

async function changeLangFlag(cbLangsId, divLangsFlagId) {
    let langCode = getSelectedOptionId(cbLangsId);
    let lang = null;

    // Получаем язык ---
    if (langCode) {
        let JSONResponse = await getJSONResponseFindLangByCode(langCode);
        if (JSONResponse.status === _HTTP_STATUSES.OK) {
            lang = new LangResponseDTO(JSONResponse.json);
        }
    }
    //---

    // Если язык ранее не был найден, выводим белый флаг ---
    if (!lang) {
        lang = new LangResponseDTO(null);
    }
    //---

    // Устанавливаем стиль ---
    let divLangsFlag = document.getElementById(divLangsFlagId);
    if (divLangsFlag) {
        lang.setFlagStyle(divLangsFlag);
        divLangsFlag.classList.add(_DIV_LANG_FLAG_STYLE_ID);
    }
    //---
}

async function prepareCbInLangs() {
    let cbInLangs = document.getElementById(_CB_IN_LANGS_ID);
    if (cbInLangs) {
        // Устанавливаем первый элемент списка, выводим белый флаг ---
        let firstOption = document.createElement("option");
        firstOption.textContent = "Выберите язык";
        cbInLangs.appendChild(firstOption);
        await fillCbLangs(cbInLangs);

        await changeLangFlag(cbInLangs.id, _DIV_IN_LANG_FLAG_ID);
        //---

        cbInLangs.addEventListener("change", async function () {
            changeWorkoutStartInfoRule(null, true);

            await changeLangFlag(cbInLangs.id, _DIV_IN_LANG_FLAG_ID);
            await checkCorrectLang(cbInLangs.id, _DIV_IN_LANG_CONTAINER);
        })
    }
}

async function prepareCbOutLangs() {
    let cbOutLangs = document.getElementById(_CB_OUT_LANGS_ID);
    if (cbOutLangs) {
        // Устанавливаем первый элемент списка, выводим белый флаг ---
        let firstOption = document.createElement("option");
        firstOption.textContent = "Выберите язык";
        cbOutLangs.appendChild(firstOption);
        await fillCbLangs(cbOutLangs);

        await changeLangFlag(cbOutLangs.id, _DIV_OUT_LANG_FLAG_ID);
        //---

        cbOutLangs.addEventListener("change", async function () {
            changeWorkoutStartInfoRule(null, true);

            await changeLangFlag(cbOutLangs.id, _DIV_OUT_LANG_FLAG_ID);
            await checkCorrectLang(cbOutLangs.id, _DIV_OUT_LANG_CONTAINER);
        })
    }
}

function prepareCbNumberOfWords() {
    let cbNumberOfWords = document.getElementById(_CB_NUMBER_OF_WORDS_ID);
    if (cbNumberOfWords) {
        for (let i = _MIN_NUMBER_OF_WORDS; i <= _MAX_NUMBER_OF_WORDS; i += _MIN_NUMBER_OF_WORDS) {
            let optionNumberOfWords = document.createElement("option");
            optionNumberOfWords.textContent = i;

            cbNumberOfWords.appendChild(optionNumberOfWords);
        }

        cbNumberOfWords.addEventListener("change", function () {
            changeWorkoutStartInfoRule(null, true);
            checkCorrectNumberOfWords();
        })
    }
}

function prepareSaveSettingsContainer() {
    let checkSaveSettings = document.getElementById(_CHECK_SAVE_SETTINGS_ID);
    checkSaveSettings.checked = true;

    let aSaveSettings = document.getElementById(_A_SAVE_SETTINGS);
    aSaveSettings.addEventListener("click", function () {
        checkSaveSettings.checked = !checkSaveSettings.checked;
    })
}

function prepareSubmitSend() {
    let submitSend = document.getElementById(_SUBMIT_SEND_ID);
    let submitBtn = document.getElementById(_SUBMIT_BTN_ID);
    submitSend.addEventListener("submit", async function(event) {
        submitBtn.disabled = true;
        event.preventDefault();

        if (await checkBeforeWorkoutStart()) {
            let acceptSend = true;

            // Добаляем/изменяем настройки, если этого хочет пользователь ---
            let checkSaveSettings = document.getElementById(_CHECK_SAVE_SETTINGS_ID);
            if (checkSaveSettings && checkSaveSettings.checked) {
                acceptSend = await createOrChangeWorkoutSetting();
            }
            //---

            if (acceptSend) {
                submitSend.submit();
            }
        }

        submitBtn.disabled = false;
    })
}

async function tryToSetSavedSettings() {
    let workoutTypeCode = _CURRENT_WORKOUT_TYPE.CODE;
    let authId = getGlobalCookie(_GLOBAL_COOKIES.AUTH_ID);
    let JSONResponse = await
        getJSONResponseFindWorkoutSettingByWorkoutTypeCodeAndCustomerId(workoutTypeCode, authId);
    if (JSONResponse.status === _HTTP_STATUSES.OK) {
        let workoutSetting = new WorkoutSettingResponseDTO(JSONResponse.json);

        if (workoutSetting.langIn) {
            let cbInLangs = document.getElementById(_CB_IN_LANGS_ID);
            if (cbInLangs) {
                changeSelectedOptionById(cbInLangs.id, workoutSetting.langIn.code);

                let event = new Event('change');
                cbInLangs.dispatchEvent(event);
            }

        }

        if (workoutSetting.langOut) {
            let cbOutLangs = document.getElementById(_CB_OUT_LANGS_ID);
            if (cbOutLangs) {
                changeSelectedOptionById(cbOutLangs.id, workoutSetting.langOut.code);

                let event = new Event('change');
                cbOutLangs.dispatchEvent(event);
            }
        }

        if (workoutSetting.numberOfWords) {
            let cbNumberOfWords = document.getElementById(_CB_NUMBER_OF_WORDS_ID);
            for (let i = 0; i < cbNumberOfWords.childNodes.length; i++) {
                let iOption = cbNumberOfWords.childNodes[i];
                if (BigInt(iOption.value) === workoutSetting.numberOfWords) {
                    changeSelectedOptionByIndex(cbNumberOfWords.id, i);
                    break;
                }
            }
        }
    }
}

async function checkCorrectLang(cbLangsId, langContainerId) {
    let isCorrect = false;
    let cbLangs = document.getElementById(cbLangsId);
    if (cbLangs) {
        const DIV_RULE_ID = cbLangs.id + "_div_rule";

        let divRuleElement = getOrCreateRule(DIV_RULE_ID);
        let langCode = getSelectedOptionId(cbLangs.id);
        if (!langCode) {
            isCorrect = false;
            divRuleElement.textContent = "Выберите язык.";
            changeRuleStatus(divRuleElement, langContainerId, isCorrect);
        } else {
            isCorrect = await checkCorrectCbLangs(cbLangs, DIV_RULE_ID, langContainerId);
        }
    }

    return isCorrect;
}

function checkCorrectNumberOfWords() {
    let cbNumberOfWords = document.getElementById(_CB_NUMBER_OF_WORDS_ID);

    let isCorrect = false;
    if (cbNumberOfWords) {
        let divRuleElement = getOrCreateRule(cbNumberOfWords.id + "_div_rule");
        let numberOfWords = getSelectedOption(cbNumberOfWords.id).value;
        if (numberOfWords < _MIN_NUMBER_OF_WORDS || numberOfWords > _MAX_NUMBER_OF_WORDS) {
            isCorrect = false;

            divRuleElement.textContent =
                `Количество слов должно быть от ${_MIN_NUMBER_OF_WORDS} до ${_MAX_NUMBER_OF_WORDS}`;
            changeRuleStatus(divRuleElement, _DIV_NUMBER_OF_WORDS_CONTAINER, isCorrect);
        } else {
            isCorrect = true;
            changeRuleStatus(divRuleElement, _DIV_NUMBER_OF_WORDS_CONTAINER, isCorrect);
        }
    }

    return isCorrect;
}

function checkAllLangs() {
    let isCorrect = false;
    let cbInLangs = document.getElementById(_CB_IN_LANGS_ID);
    let cbOutLangs = document.getElementById(_CB_OUT_LANGS_ID);
    if (cbInLangs && cbOutLangs) {
        let divInLangCode = getSelectedOptionId(cbInLangs.id);
        let divInLangsRule = getOrCreateRule(cbInLangs.id + "_div_rule");

        let divOutLangCode = getSelectedOptionId(cbOutLangs.id);
        let divOutLangsRule = getOrCreateRule(cbOutLangs.id + "_div_rule");

        // Совпадение языков запрещено ---
        if (divInLangCode === divOutLangCode) {
            isCorrect = false;
            let generalMessage = "Языки не могут быть одинаковыми.";

            divInLangsRule.textContent = generalMessage;
            divOutLangsRule.textContent = generalMessage;
        } else {
            isCorrect = true;
        }
        //---

        changeRuleStatus(divInLangsRule, _DIV_IN_LANG_CONTAINER, isCorrect);
        changeRuleStatus(divOutLangsRule, _DIV_OUT_LANG_CONTAINER, isCorrect);
    }

    return isCorrect;
}

async function checkBeforeWorkoutStart() {
    let isCorrect = true;

    let isLangInCorrect = await checkCorrectLang(_CB_IN_LANGS_ID, _DIV_IN_LANG_CONTAINER);
    let isLangOutCorrect = await checkCorrectLang(_CB_OUT_LANGS_ID, _DIV_OUT_LANG_CONTAINER);
    let isNumberOfWordsCorrect = checkCorrectNumberOfWords();
    isCorrect = (isLangInCorrect && isLangOutCorrect && isNumberOfWordsCorrect);

    if (isCorrect) {
        isCorrect = checkAllLangs();
    }

    return isCorrect;
}

async function createOrChangeWorkoutSetting() {
    let authId = getGlobalCookie(_GLOBAL_COOKIES.AUTH_ID);
    let workoutTypeCode = _CURRENT_WORKOUT_TYPE.CODE;

    let langInCode = getSelectedOptionId(_CB_IN_LANGS_ID);
    let langOutCode = getSelectedOptionId(_CB_OUT_LANGS_ID);
    let numberOfWords = BigInt(getSelectedOption(_CB_NUMBER_OF_WORDS_ID).value);

    let acceptOperation = true;
    let JSONResponse = await
        getJSONResponseFindWorkoutSettingByWorkoutTypeCodeAndCustomerId(workoutTypeCode, authId);
    if (JSONResponse.status === _HTTP_STATUSES.OK) {
        // Если настройки уже существуют, изменяем
        let workoutSetting = new WorkoutSettingResponseDTO(JSONResponse.json);
        let requestDTO = new WorkoutSettingRequestDTO();
        requestDTO.id = BigInt(workoutSetting.id);
        requestDTO.numberOfWords = numberOfWords;
        requestDTO.langInCode = langInCode;
        requestDTO.langOutCode = langOutCode;

        JSONResponse = await patchJSONResponseEditSettingInRandomWords(requestDTO);
        if (JSONResponse.status !== _HTTP_STATUSES.OK) {
            acceptOperation = false;

            let message = new CustomResponseMessage(JSONResponse.json);
            changeWorkoutStartInfoRule(message.text, acceptOperation);
        }
    } else {
        // Если настроек не существует, создаём новые
        let requestDTO = new WorkoutSettingRequestDTO();
        requestDTO.numberOfWords = numberOfWords;
        requestDTO.langInCode = langInCode;
        requestDTO.langOutCode = langOutCode

        JSONResponse = await postJSONResponseAddSettingInRandomWords(requestDTO);
        if (JSONResponse.status !== _HTTP_STATUSES.OK) {
            acceptOperation = false;

            let message = new CustomResponseMessage(JSONResponse.json);
            changeWorkoutStartInfoRule(message.text, acceptOperation);
        }
    }

    return acceptOperation;
}

function changeWorkoutStartInfoRule(text, isRuleCorrect) {
    let divRuleElement = getOrCreateRule(_DIV_WORKOUT_START_INFO_CONTAINER + "_div_rule");
    divRuleElement.textContent = text;
    changeRuleStatus(divRuleElement, _DIV_WORKOUT_START_INFO_CONTAINER, isRuleCorrect);
}