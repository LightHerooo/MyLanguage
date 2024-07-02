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

export class FormElementWorkoutRandomWords extends FormAbstractElement {
    #selectWithRuleElementLangsInWorkoutRandomWords;
    #selectWithRuleElementLangsOutWorkoutRandomWords;
    #selectWithRuleElementNumbersOfWords;

    #tableWithTimerElementWorkoutsNotOver;

    constructor(form, buttonSubmit, divMessageContainer) {
        super(form, buttonSubmit, divMessageContainer);

        this.#tryToSetDefaultValues();
    }

    setSelectWithRuleElementLangsInWorkoutRandomWords(selectWithRuleElementLangsInWorkoutRandomWordsObj) {
        this.#selectWithRuleElementLangsInWorkoutRandomWords = selectWithRuleElementLangsInWorkoutRandomWordsObj;
    }

    setSelectWithRuleElementLangsOutWorkoutRandomWords(selectWithRuleElementLangsOutWorkoutRandomWordsObj) {
        this.#selectWithRuleElementLangsOutWorkoutRandomWords = selectWithRuleElementLangsOutWorkoutRandomWordsObj;
    }

    setSelectWithRuleElementNumbersOfWords(selectWithRuleElementNumbersObj) {
        this.#selectWithRuleElementNumbersOfWords = selectWithRuleElementNumbersObj;
    }

    setTableWithTimerElementWorkoutsNotOver(tableWithTimerElementWorkoutsNotOverObj) {
        this.#tableWithTimerElementWorkoutsNotOver = tableWithTimerElementWorkoutsNotOverObj;
    }


    #tryToSetDefaultValues() {
        // Связывваем два списка между собой ---
        let selectWithRuleElementLangsInWorkoutRandomWords =
            this.#selectWithRuleElementLangsInWorkoutRandomWords;
        let selectWithRuleElementLangsOutWorkoutRandomWords =
            this.#selectWithRuleElementLangsOutWorkoutRandomWords;
        if (selectWithRuleElementLangsInWorkoutRandomWords
            && selectWithRuleElementLangsOutWorkoutRandomWords) {
            selectWithRuleElementLangsInWorkoutRandomWords.setSelectWithRuleElementLangsOutWorkoutRandomWords(
                selectWithRuleElementLangsOutWorkoutRandomWords);
            selectWithRuleElementLangsOutWorkoutRandomWords.setSelectWithRuleElementLangsInWorkoutRandomWords(
                selectWithRuleElementLangsInWorkoutRandomWords);
        }
        //---
    }

    #checkCorrectLangs() {
        let isCorrect = false;
        let selectWithRuleElementLangsInWorkoutRandomWords = this.#selectWithRuleElementLangsInWorkoutRandomWords;
        let selectWithRuleElementLangsOutWorkoutRandomWords = this.#selectWithRuleElementLangsOutWorkoutRandomWords;
        if (selectWithRuleElementLangsInWorkoutRandomWords
            && selectWithRuleElementLangsOutWorkoutRandomWords) {
            isCorrect = true;
            let ruleType;
            let message;

            let langInCode = selectWithRuleElementLangsInWorkoutRandomWords.getSelectedValue();
            let langOutCode = selectWithRuleElementLangsOutWorkoutRandomWords.getSelectedValue();
            if (langInCode === langOutCode) {
                isCorrect = false;
                ruleType = _RULE_TYPES.ERROR;
                message = "Языки не могут повторяться";
            }

            if (!isCorrect) {
                selectWithRuleElementLangsInWorkoutRandomWords.showRule(ruleType, message);
                selectWithRuleElementLangsOutWorkoutRandomWords.showRule(ruleType, message);
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

        let selectWithRuleElementLangsInWorkoutRandomWords = this.#selectWithRuleElementLangsInWorkoutRandomWords;
        if (selectWithRuleElementLangsInWorkoutRandomWords) {
            if (!selectWithRuleElementLangsInWorkoutRandomWords.getIsPrepared()) {
                selectWithRuleElementLangsInWorkoutRandomWords.prepare();
                await selectWithRuleElementLangsInWorkoutRandomWords.fill();
            }

            let select = selectWithRuleElementLangsInWorkoutRandomWords.getSelect();
            if (select) {
                let self = this;
                select.addEventListener(_EVENT_NAMES.SELECT.CHANGE, function() {
                    self.clearDivMessageContainer();
                })
            }
        }

        let selectWithRuleElementLangsOutWorkoutRandomWords = this.#selectWithRuleElementLangsOutWorkoutRandomWords;
        if (selectWithRuleElementLangsOutWorkoutRandomWords) {
            if (!selectWithRuleElementLangsOutWorkoutRandomWords.getIsPrepared()) {
                selectWithRuleElementLangsOutWorkoutRandomWords.prepare();
                await selectWithRuleElementLangsOutWorkoutRandomWords.fill();
            }

            let select = selectWithRuleElementLangsOutWorkoutRandomWords.getSelect();
            if (select) {
                let self = this;
                select.addEventListener(_EVENT_NAMES.SELECT.CHANGE, function() {
                    self.clearDivMessageContainer();
                })
            }
        }

        // Мы должны обновить списки языков (если нашлась предыдущая тренировка) ---
        if (selectWithRuleElementLangsInWorkoutRandomWords
            && selectWithRuleElementLangsOutWorkoutRandomWords
            && workoutResponseDTO) {

            let langIn = workoutResponseDTO.getLangIn();
            if (langIn) {
                selectWithRuleElementLangsInWorkoutRandomWords.changeSelectedOptionByValue(
                    langIn.getCode(), false);
            }

            let langOut = workoutResponseDTO.getLangOut();
            if (langOut) {
                selectWithRuleElementLangsOutWorkoutRandomWords.changeSelectedOptionByValue(
                    langOut.getCode(), true);
            }

            await selectWithRuleElementLangsInWorkoutRandomWords.refresh(true);
            await selectWithRuleElementLangsOutWorkoutRandomWords.refresh(true);
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
        let isLangInCorrect = false;
        let selectWithRuleElementLangsInWorkoutRandomWords =
            this.#selectWithRuleElementLangsInWorkoutRandomWords;
        if (selectWithRuleElementLangsInWorkoutRandomWords) {
            isLangInCorrect = await selectWithRuleElementLangsInWorkoutRandomWords.checkCorrectValue();
        }

        let isLangOutCorrect = false;
        let selectWithRuleElementLangsOutWorkoutRandomWords =
            this.#selectWithRuleElementLangsOutWorkoutRandomWords;
        if (selectWithRuleElementLangsOutWorkoutRandomWords) {
            isLangOutCorrect = await selectWithRuleElementLangsOutWorkoutRandomWords.checkCorrectValue();
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

        let selectWithRuleElementLangsInWorkoutRandomWords =
            this.#selectWithRuleElementLangsInWorkoutRandomWords;
        if (selectWithRuleElementLangsInWorkoutRandomWords) {
            dto.setLangInCode(selectWithRuleElementLangsInWorkoutRandomWords.getSelectedValue());
        }

        let selectWithRuleElementLangsOutWorkoutRandomWords =
            this.#selectWithRuleElementLangsOutWorkoutRandomWords;
        if (selectWithRuleElementLangsOutWorkoutRandomWords) {
            dto.setLangOutCode(selectWithRuleElementLangsOutWorkoutRandomWords.getSelectedValue());
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
        let selectWithRuleElementLangsInWorkoutRandomWords = this.#selectWithRuleElementLangsInWorkoutRandomWords;
        let selectWithRuleElementLangsOutWorkoutRandomWords = this.#selectWithRuleElementLangsOutWorkoutRandomWords;
        if (selectWithRuleElementLangsInWorkoutRandomWords
            && selectWithRuleElementLangsOutWorkoutRandomWords) {

            selectWithRuleElementLangsInWorkoutRandomWords.changeSelectedOptionByIndex(
                0, false);
            selectWithRuleElementLangsOutWorkoutRandomWords.changeSelectedOptionByIndex(
                0, false);

            await selectWithRuleElementLangsInWorkoutRandomWords.refresh(false);
            await selectWithRuleElementLangsOutWorkoutRandomWords.refresh(false);
        }

        let selectWithRuleElementNumbersOfWords = this.#selectWithRuleElementNumbersOfWords;
        if (selectWithRuleElementNumbersOfWords) {
            await selectWithRuleElementNumbersOfWords.refresh(false);
        }
    }

    changeDisabledStatusToFormElements(isDisabled) {
        super.changeDisabledStatusToFormElements(isDisabled);

        let selectWithRuleElementLangsInWorkoutRandomWords =
            this.#selectWithRuleElementLangsInWorkoutRandomWords;
        if (selectWithRuleElementLangsInWorkoutRandomWords) {
            selectWithRuleElementLangsInWorkoutRandomWords.changeDisabledStatus(isDisabled);
        }

        let selectWithRuleElementLangsOutWorkoutRandomWords =
            this.#selectWithRuleElementLangsOutWorkoutRandomWords;
        if (selectWithRuleElementLangsOutWorkoutRandomWords) {
            selectWithRuleElementLangsOutWorkoutRandomWords.changeDisabledStatus(isDisabled);
        }

        let selectWithRuleElementNumbersOfWords = this.#selectWithRuleElementNumbersOfWords;
        if (selectWithRuleElementNumbersOfWords) {
            selectWithRuleElementNumbersOfWords.changeDisabledStatus(isDisabled);
        }
    }
}