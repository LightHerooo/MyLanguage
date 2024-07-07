import {
    FormAbstractElement
} from "../../abstracts/form_abstract_element.js";

import {
    WorkoutsAPI
} from "../../../../api/entity/workouts_api.js";

import {
    HttpStatuses
} from "../../../../api/classes/http/http_statuses.js";

import {
    WorkoutTypes
} from "../../../../dto/entity/workout_type/workout_types.js";

import {
    WorkoutResponseDTO
} from "../../../../dto/entity/workout/response/workout_response_dto.js";

import {
    RuleTypes
} from "../../../span/elements/rule/rule_types.js";

import {
    WorkoutAddRandomWordsRequestDTO
} from "../../../../dto/entity/workout/request/workout_add_random_words_request_dto.js";

import {
    ResponseMessageResponseDTO
} from "../../../../dto/other/response/response_message_response_dto.js";

import {
    EventNames
} from "../../../event_names.js";

import {
    ProjectCookies
} from "../../../project_cookies.js";

const _WORKOUTS_API = new WorkoutsAPI();

const _HTTP_STATUSES = new HttpStatuses();
const _PROJECT_COOKIES = new ProjectCookies();
const _RULE_TYPES = new RuleTypes();
const _EVENT_NAMES = new EventNames();

export class FormElementWorkoutPrepareRandomWords extends FormAbstractElement {
    #selectWithRuleElementLangsInPrepareWorkoutRandomWords;
    #selectWithRuleElementLangsOutPrepareWorkoutRandomWords;
    #selectWithRuleElementNumbersOfWords;

    #tableWithTimerElementWorkoutsNotOver;

    constructor(form, buttonSubmit, divMessageContainer) {
        super(form, buttonSubmit, divMessageContainer);

        this.#tryToSetDefaultValues();
    }

    setSelectWithRuleElementLangsInPrepareWorkoutRandomWords(selectWithRuleElementLangsInPrepareWorkoutRandomWordsObj) {
        this.#selectWithRuleElementLangsInPrepareWorkoutRandomWords = selectWithRuleElementLangsInPrepareWorkoutRandomWordsObj;
    }

    setSelectWithRuleElementLangsOutPrepareWorkoutRandomWords(selectWithRuleElementLangsOutPrepareWorkoutRandomWordsObj) {
        this.#selectWithRuleElementLangsOutPrepareWorkoutRandomWords = selectWithRuleElementLangsOutPrepareWorkoutRandomWordsObj;
    }

    setSelectWithRuleElementNumbersOfWords(selectWithRuleElementNumbersObj) {
        this.#selectWithRuleElementNumbersOfWords = selectWithRuleElementNumbersObj;
    }

    setTableWithTimerElementWorkoutsNotOver(tableWithTimerElementWorkoutsNotOverObj) {
        this.#tableWithTimerElementWorkoutsNotOver = tableWithTimerElementWorkoutsNotOverObj;
    }


    #tryToSetDefaultValues() {
        // Связывваем два списка между собой ---
        let selectWithRuleElementLangsInPrepareWorkoutRandomWords =
            this.#selectWithRuleElementLangsInPrepareWorkoutRandomWords;
        let selectWithRuleElementLangsOutPrepareWorkoutRandomWords =
            this.#selectWithRuleElementLangsOutPrepareWorkoutRandomWords;
        if (selectWithRuleElementLangsInPrepareWorkoutRandomWords
            && selectWithRuleElementLangsOutPrepareWorkoutRandomWords) {
            selectWithRuleElementLangsInPrepareWorkoutRandomWords.setSelectWithRuleElementLangsOutPrepareWorkoutRandomWords(
                selectWithRuleElementLangsOutPrepareWorkoutRandomWords);
            selectWithRuleElementLangsOutPrepareWorkoutRandomWords.setSelectWithRuleElementLangsInPrepareWorkoutRandomWords(
                selectWithRuleElementLangsInPrepareWorkoutRandomWords);
        }
        //---
    }

    #checkCorrectLangs() {
        let isCorrect = false;
        let selectWithRuleElementLangsInPrepareWorkoutRandomWords = this.#selectWithRuleElementLangsInPrepareWorkoutRandomWords;
        let selectWithRuleElementLangsOutPrepareWorkoutRandomWords = this.#selectWithRuleElementLangsOutPrepareWorkoutRandomWords;
        if (selectWithRuleElementLangsInPrepareWorkoutRandomWords
            && selectWithRuleElementLangsOutPrepareWorkoutRandomWords) {
            isCorrect = true;
            let ruleType;
            let message;

            let langInCode = selectWithRuleElementLangsInPrepareWorkoutRandomWords.getSelectedValue();
            let langOutCode = selectWithRuleElementLangsOutPrepareWorkoutRandomWords.getSelectedValue();
            if (langInCode === langOutCode) {
                isCorrect = false;
                ruleType = _RULE_TYPES.ERROR;
                message = "Языки не могут повторяться";
            }

            if (!isCorrect) {
                selectWithRuleElementLangsInPrepareWorkoutRandomWords.showRule(ruleType, message);
                selectWithRuleElementLangsOutPrepareWorkoutRandomWords.showRule(ruleType, message);
            }
        }

        return isCorrect;
    }


    async prepare() {
        await super.prepare();

        // Ищем предыдущую тренировкку в конкретном режиме, чтобы установить её настройки ---
        let workoutTypeCode = new WorkoutTypes().RANDOM_WORDS.CODE;
        let customerId = _PROJECT_COOKIES.CUSTOMER_ID.getValue();

        let workoutResponseDTO;
        let jsonResponse = await _WORKOUTS_API.GET.findLast(workoutTypeCode, customerId);
        if (jsonResponse.getStatus() === _HTTP_STATUSES.OK) {
            workoutResponseDTO = new WorkoutResponseDTO(jsonResponse.getJson());
        }
        //---

        let selectWithRuleElementLangsInPrepareWorkoutRandomWords = this.#selectWithRuleElementLangsInPrepareWorkoutRandomWords;
        if (selectWithRuleElementLangsInPrepareWorkoutRandomWords) {
            if (!selectWithRuleElementLangsInPrepareWorkoutRandomWords.getIsPrepared()) {
                selectWithRuleElementLangsInPrepareWorkoutRandomWords.prepare();
                await selectWithRuleElementLangsInPrepareWorkoutRandomWords.fill();
            }

            let select = selectWithRuleElementLangsInPrepareWorkoutRandomWords.getSelect();
            if (select) {
                let self = this;
                select.addEventListener(_EVENT_NAMES.SELECT.CHANGE, function() {
                    self.clearDivMessageContainer();
                })
            }
        }

        let selectWithRuleElementLangsOutPrepareWorkoutRandomWords = this.#selectWithRuleElementLangsOutPrepareWorkoutRandomWords;
        if (selectWithRuleElementLangsOutPrepareWorkoutRandomWords) {
            if (!selectWithRuleElementLangsOutPrepareWorkoutRandomWords.getIsPrepared()) {
                selectWithRuleElementLangsOutPrepareWorkoutRandomWords.prepare();
                await selectWithRuleElementLangsOutPrepareWorkoutRandomWords.fill();
            }

            let select = selectWithRuleElementLangsOutPrepareWorkoutRandomWords.getSelect();
            if (select) {
                let self = this;
                select.addEventListener(_EVENT_NAMES.SELECT.CHANGE, function() {
                    self.clearDivMessageContainer();
                })
            }
        }

        // Мы должны обновить списки языков (если нашлась предыдущая тренировка) ---
        if (selectWithRuleElementLangsInPrepareWorkoutRandomWords
            && selectWithRuleElementLangsOutPrepareWorkoutRandomWords
            && workoutResponseDTO) {

            let langIn = workoutResponseDTO.getLangIn();
            if (langIn) {
                selectWithRuleElementLangsInPrepareWorkoutRandomWords.changeSelectedOptionByValue(
                    langIn.getCode(), false);
            }

            let langOut = workoutResponseDTO.getLangOut();
            if (langOut) {
                selectWithRuleElementLangsOutPrepareWorkoutRandomWords.changeSelectedOptionByValue(
                    langOut.getCode(), true);
            }

            await selectWithRuleElementLangsInPrepareWorkoutRandomWords.refresh(true);
            await selectWithRuleElementLangsOutPrepareWorkoutRandomWords.refresh(true);
        }
        //---

        let selectWithRuleElementNumbersOfWords = this.#selectWithRuleElementNumbersOfWords;
        if (selectWithRuleElementNumbersOfWords) {
            if (!selectWithRuleElementNumbersOfWords.getIsPrepared()) {
                selectWithRuleElementNumbersOfWords.prepare();
                await selectWithRuleElementNumbersOfWords.fill();
            }

            if (workoutResponseDTO) {
                selectWithRuleElementNumbersOfWords.changeSelectedOptionByValue(
                    workoutResponseDTO.getNumberOfWords(), true);
            }

            let select = selectWithRuleElementNumbersOfWords.getSelect();
            if (select) {
                let self = this;
                select.addEventListener(_EVENT_NAMES.SELECT.CHANGE, function() {
                    self.clearDivMessageContainer();
                })
            }
        }
    }

    async checkCorrectValues() {
        // Мы должны отобразить загрузку на время проверок ---
        let tableWithTimerElementWorkoutsNotOver = this.#tableWithTimerElementWorkoutsNotOver;
        if (tableWithTimerElementWorkoutsNotOver) {
            tableWithTimerElementWorkoutsNotOver.showLoading();
        }
        //---

        let isLangInCorrect = false;
        let selectWithRuleElementLangsInPrepareWorkoutRandomWords =
            this.#selectWithRuleElementLangsInPrepareWorkoutRandomWords;
        if (selectWithRuleElementLangsInPrepareWorkoutRandomWords) {
            isLangInCorrect = await selectWithRuleElementLangsInPrepareWorkoutRandomWords.checkCorrectValue();
        }

        let isLangOutCorrect = false;
        let selectWithRuleElementLangsOutPrepareWorkoutRandomWords =
            this.#selectWithRuleElementLangsOutPrepareWorkoutRandomWords;
        if (selectWithRuleElementLangsOutPrepareWorkoutRandomWords) {
            isLangOutCorrect = await selectWithRuleElementLangsOutPrepareWorkoutRandomWords.checkCorrectValue();
        }

        let isNumberOfWordsCorrect = false;
        let selectWithRuleElementNumbersOfWords = this.#selectWithRuleElementNumbersOfWords;
        if (selectWithRuleElementNumbersOfWords) {
            isNumberOfWordsCorrect = await selectWithRuleElementNumbersOfWords.checkCorrectValue();
        }

        let isCorrect = isLangInCorrect && isLangOutCorrect && isNumberOfWordsCorrect;
        if (isCorrect) {
            isCorrect = this.#checkCorrectLangs();
        }

        if (!isCorrect && tableWithTimerElementWorkoutsNotOver) {
            tableWithTimerElementWorkoutsNotOver.startToFill();
        }

        return isCorrect;
    }

    async submit() {
        // Мы должны отобразить загрузку на время отправки данных формы ---
        let tableWithTimerElementWorkoutsNotOver = this.#tableWithTimerElementWorkoutsNotOver;
        if (tableWithTimerElementWorkoutsNotOver) {
            tableWithTimerElementWorkoutsNotOver.showLoading();
        }
        //---

        let dto = new WorkoutAddRandomWordsRequestDTO();

        let selectWithRuleElementLangsInPrepareWorkoutRandomWords =
            this.#selectWithRuleElementLangsInPrepareWorkoutRandomWords;
        if (selectWithRuleElementLangsInPrepareWorkoutRandomWords) {
            dto.setLangInCode(selectWithRuleElementLangsInPrepareWorkoutRandomWords.getSelectedValue());
        }

        let selectWithRuleElementLangsOutPrepareWorkoutRandomWords =
            this.#selectWithRuleElementLangsOutPrepareWorkoutRandomWords;
        if (selectWithRuleElementLangsOutPrepareWorkoutRandomWords) {
            dto.setLangOutCode(selectWithRuleElementLangsOutPrepareWorkoutRandomWords.getSelectedValue());
        }

        let selectWithRuleElementNumbersOfWords = this.#selectWithRuleElementNumbersOfWords;
        if (selectWithRuleElementNumbersOfWords) {
            dto.setNumberOfWords(selectWithRuleElementNumbersOfWords.getSelectedValue());
        }

        let isCorrect = true;
        let ruleType;
        let message;
        let jsonResponse = await _WORKOUTS_API.POST.addRandomWords(dto);
        if (jsonResponse.getStatus() === _HTTP_STATUSES.OK) {
            let workoutResponseDTO = new WorkoutResponseDTO(jsonResponse.getJson());

            let form = this.getForm();
            if (form) {
                form.action = `${form.action}/${workoutResponseDTO.getId()}`;
            }
        } else {
            isCorrect = false;
            ruleType = _RULE_TYPES.ERROR;
            message = new ResponseMessageResponseDTO(jsonResponse.getJson()).getMessage();
        }

        if (!isCorrect) {
            this.showRule(ruleType, message);

            if (tableWithTimerElementWorkoutsNotOver) {
                tableWithTimerElementWorkoutsNotOver.startToFill();
            }
        }

        return isCorrect;
    }

    async reset() {
        let selectWithRuleElementLangsInPrepareWorkoutRandomWords = this.#selectWithRuleElementLangsInPrepareWorkoutRandomWords;
        let selectWithRuleElementLangsOutPrepareWorkoutRandomWords = this.#selectWithRuleElementLangsOutPrepareWorkoutRandomWords;
        if (selectWithRuleElementLangsInPrepareWorkoutRandomWords
            && selectWithRuleElementLangsOutPrepareWorkoutRandomWords) {

            selectWithRuleElementLangsInPrepareWorkoutRandomWords.changeSelectedOptionByIndex(
                0, false);
            selectWithRuleElementLangsOutPrepareWorkoutRandomWords.changeSelectedOptionByIndex(
                0, false);

            await selectWithRuleElementLangsInPrepareWorkoutRandomWords.refresh(false);
            await selectWithRuleElementLangsOutPrepareWorkoutRandomWords.refresh(false);
        }

        let selectWithRuleElementNumbersOfWords = this.#selectWithRuleElementNumbersOfWords;
        if (selectWithRuleElementNumbersOfWords) {
            await selectWithRuleElementNumbersOfWords.refresh(false);
        }
    }

    changeDisabledStatusToFormElements(isDisabled) {
        super.changeDisabledStatusToFormElements(isDisabled);

        let selectWithRuleElementLangsInPrepareWorkoutRandomWords =
            this.#selectWithRuleElementLangsInPrepareWorkoutRandomWords;
        if (selectWithRuleElementLangsInPrepareWorkoutRandomWords) {
            selectWithRuleElementLangsInPrepareWorkoutRandomWords.changeDisabledStatus(isDisabled);
        }

        let selectWithRuleElementLangsOutPrepareWorkoutRandomWords =
            this.#selectWithRuleElementLangsOutPrepareWorkoutRandomWords;
        if (selectWithRuleElementLangsOutPrepareWorkoutRandomWords) {
            selectWithRuleElementLangsOutPrepareWorkoutRandomWords.changeDisabledStatus(isDisabled);
        }

        let selectWithRuleElementNumbersOfWords = this.#selectWithRuleElementNumbersOfWords;
        if (selectWithRuleElementNumbersOfWords) {
            selectWithRuleElementNumbersOfWords.changeDisabledStatus(isDisabled);
        }
    }
}