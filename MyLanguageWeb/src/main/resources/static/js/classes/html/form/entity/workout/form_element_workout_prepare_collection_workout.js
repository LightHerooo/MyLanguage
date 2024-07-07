import {
    FormAbstractElement
} from "../../abstracts/form_abstract_element.js";

import {
    WorkoutTypes
} from "../../../../dto/entity/workout_type/workout_types.js";

import {
    WorkoutResponseDTO
} from "../../../../dto/entity/workout/response/workout_response_dto.js";

import {
    WorkoutsAPI
} from "../../../../api/entity/workouts_api.js";

import {
    HttpStatuses
} from "../../../../api/classes/http/http_statuses.js";

import {
    CustomerCollectionsAPI
} from "../../../../api/entity/customer_collections_api.js";

import {
    CustomerCollectionResponseDTO
} from "../../../../dto/entity/customer_collection/response/customer_collection_response_dto.js";

import {
    RuleTypes
} from "../../../span/elements/rule/rule_types.js";

import {
    WorkoutAddCollectionWorkoutRequestDTO
} from "../../../../dto/entity/workout/request/workout_add_collection_workout_request_dto.js";

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
const _CUSTOMER_COLLECTIONS_API = new CustomerCollectionsAPI();

const _PROJECT_COOKIES = new ProjectCookies();
const _HTTP_STATUSES = new HttpStatuses();
const _RULE_TYPES = new RuleTypes();
const _EVENT_NAMES = new EventNames();

export class FormElementWorkoutPrepareCollectionWorkout extends FormAbstractElement {
    #selectWithRuleElementCustomerCollectionsPrepareWorkoutCollectionWorkout;
    #selectWithRuleElementLangsOutPrepareWorkoutCollectionWorkout;

    #tableWithTimerElementWorkoutsNotOver;

    constructor(form, buttonSubmit, divMessageContainer) {
        super(form, buttonSubmit, divMessageContainer);

        this.#tryToSetDefaultValues();
    }

    setSelectWithRuleElementCustomerCollectionsPrepareWorkoutCollectionWorkout(
        selectWithRuleElementCustomerCollectionsPrepareWorkoutCollectionWorkoutObj) {
        this.#selectWithRuleElementCustomerCollectionsPrepareWorkoutCollectionWorkout =
            selectWithRuleElementCustomerCollectionsPrepareWorkoutCollectionWorkoutObj;
    }

    setSelectWithRuleElementLangsOutPrepareWorkoutCollectionWorkout(
        selectWithRuleElementLangsOutPrepareWorkoutCollectionWorkoutObj) {
        this.#selectWithRuleElementLangsOutPrepareWorkoutCollectionWorkout =
            selectWithRuleElementLangsOutPrepareWorkoutCollectionWorkoutObj;
    }

    setTableWithTimerElementWorkoutsNotOver(tableWithTimerElementWorkoutsNotOverObj) {
        this.#tableWithTimerElementWorkoutsNotOver = tableWithTimerElementWorkoutsNotOverObj;
    }


    #tryToSetDefaultValues() {
        // Связывваем два списка между собой ---
        let selectWithRuleElementCustomerCollectionsPrepareWorkoutCollectionWorkout =
            this.#selectWithRuleElementCustomerCollectionsPrepareWorkoutCollectionWorkout;
        let selectWithRuleElementLangsOutPrepareWorkoutCollectionWorkout =
            this.#selectWithRuleElementLangsOutPrepareWorkoutCollectionWorkout;
        if (selectWithRuleElementCustomerCollectionsPrepareWorkoutCollectionWorkout
            && selectWithRuleElementLangsOutPrepareWorkoutCollectionWorkout) {
            selectWithRuleElementCustomerCollectionsPrepareWorkoutCollectionWorkout.setSelectWithRuleElementLangsOutPrepareWorkoutCollectionWorkout(
                selectWithRuleElementLangsOutPrepareWorkoutCollectionWorkout);
            selectWithRuleElementLangsOutPrepareWorkoutCollectionWorkout.setSelectWithRuleElementCustomerCollectionsPrepareWorkoutCollectionWorkout(
                selectWithRuleElementCustomerCollectionsPrepareWorkoutCollectionWorkout);
        }
        //---
    }

    async #checkCorrectLangs() {
        let isCorrect = false;

        let selectWithRuleElementCustomerCollectionsPrepareWorkoutCollectionWorkout =
            this.#selectWithRuleElementCustomerCollectionsPrepareWorkoutCollectionWorkout;
        let selectWithRuleElementLangsOutPrepareWorkoutCollectionWorkout =
            this.#selectWithRuleElementLangsOutPrepareWorkoutCollectionWorkout;
        if (selectWithRuleElementCustomerCollectionsPrepareWorkoutCollectionWorkout
            && selectWithRuleElementLangsOutPrepareWorkoutCollectionWorkout) {
            isCorrect = true;
            let ruleType;
            let message;

            let langInCode;
            let customerCollectionId = selectWithRuleElementCustomerCollectionsPrepareWorkoutCollectionWorkout.getSelectedValue();
            if (customerCollectionId) {
                let jsonResponse = await _CUSTOMER_COLLECTIONS_API.GET.findById(customerCollectionId);
                if (jsonResponse.getStatus() === _HTTP_STATUSES.OK) {
                    let customerCollectionResponseDTO =
                        new CustomerCollectionResponseDTO(jsonResponse.getJson());

                    let lang = customerCollectionResponseDTO.getLang();
                    if (lang) {
                        langInCode = lang.getCode();
                    }
                }
            }

            let langOutCode = selectWithRuleElementLangsOutPrepareWorkoutCollectionWorkout.getSelectedValue();
            if (langInCode === langOutCode) {
                isCorrect = false;
                ruleType = _RULE_TYPES.ERROR;
                message = "Языки не могут повторяться";
            }

            if (!isCorrect) {
                selectWithRuleElementCustomerCollectionsPrepareWorkoutCollectionWorkout.showRule(ruleType, message);
                selectWithRuleElementLangsOutPrepareWorkoutCollectionWorkout.showRule(ruleType, message);
            }
        }

        return isCorrect;
    }


    async prepare() {
        await super.prepare();

        // Ищем предыдущую тренировкку в конкретном режиме, чтобы установить её настройки ---
        let workoutTypeCode = new WorkoutTypes().COLLECTION_WORKOUT.CODE;
        let customerId = _PROJECT_COOKIES.CUSTOMER_ID.getValue();

        let workoutResponseDTO;
        let jsonResponse = await _WORKOUTS_API.GET.findLast(workoutTypeCode, customerId);
        if (jsonResponse.getStatus() === _HTTP_STATUSES.OK) {
            workoutResponseDTO = new WorkoutResponseDTO(jsonResponse.getJson());
        }
        //---

        let selectWithRuleElementCustomerCollectionsPrepareWorkoutCollectionWorkout =
            this.#selectWithRuleElementCustomerCollectionsPrepareWorkoutCollectionWorkout;
        if (selectWithRuleElementCustomerCollectionsPrepareWorkoutCollectionWorkout) {
            if (!selectWithRuleElementCustomerCollectionsPrepareWorkoutCollectionWorkout.getIsPrepared()) {
                selectWithRuleElementCustomerCollectionsPrepareWorkoutCollectionWorkout.prepare();
                await selectWithRuleElementCustomerCollectionsPrepareWorkoutCollectionWorkout.fill();
            }

            let select = selectWithRuleElementCustomerCollectionsPrepareWorkoutCollectionWorkout.getSelect();
            if (select) {
                let self = this;
                select.addEventListener(_EVENT_NAMES.SELECT.CHANGE, function() {
                    self.clearDivMessageContainer();
                })
            }
        }

        let selectWithRuleElementLangsOutPrepareWorkoutCollectionWorkout =
            this.#selectWithRuleElementLangsOutPrepareWorkoutCollectionWorkout;
        if (selectWithRuleElementLangsOutPrepareWorkoutCollectionWorkout) {
            if (!selectWithRuleElementLangsOutPrepareWorkoutCollectionWorkout.getIsPrepared()) {
                selectWithRuleElementLangsOutPrepareWorkoutCollectionWorkout.prepare();
                await selectWithRuleElementLangsOutPrepareWorkoutCollectionWorkout.fill();
            }

            let select = selectWithRuleElementLangsOutPrepareWorkoutCollectionWorkout.getSelect();
            if (select) {
                let self = this;
                select.addEventListener(_EVENT_NAMES.SELECT.CHANGE, function() {
                    self.clearDivMessageContainer();
                })
            }
        }

        // Мы должны обновить списки (если нашлась предыдущая тренировка) ---
        if (selectWithRuleElementCustomerCollectionsPrepareWorkoutCollectionWorkout
            && selectWithRuleElementLangsOutPrepareWorkoutCollectionWorkout
            && workoutResponseDTO) {

            let customerCollection = workoutResponseDTO.getCustomerCollection();
            if (customerCollection) {
                selectWithRuleElementCustomerCollectionsPrepareWorkoutCollectionWorkout.changeSelectedOptionByValue(
                    customerCollection.getId(), false);
            }

            let langOut = workoutResponseDTO.getLangOut();
            if (langOut) {
                selectWithRuleElementLangsOutPrepareWorkoutCollectionWorkout.changeSelectedOptionByValue(
                    langOut.getCode(), false);
            }

            await selectWithRuleElementCustomerCollectionsPrepareWorkoutCollectionWorkout.refresh(true);
            await selectWithRuleElementLangsOutPrepareWorkoutCollectionWorkout.refresh(true);
        }
        //---
    }

    async checkCorrectValues() {
        // Мы должны отобразить загрузку на время проверок ---
        let tableWithTimerElementWorkoutsNotOver = this.#tableWithTimerElementWorkoutsNotOver;
        if (tableWithTimerElementWorkoutsNotOver) {
            tableWithTimerElementWorkoutsNotOver.showLoading();
        }
        //---

        let isCustomerCollectionCorrect = false;
        let selectWithRuleElementCustomerCollectionsPrepareWorkoutCollectionWorkout =
            this.#selectWithRuleElementCustomerCollectionsPrepareWorkoutCollectionWorkout;
        if (selectWithRuleElementCustomerCollectionsPrepareWorkoutCollectionWorkout) {
            isCustomerCollectionCorrect =
                await selectWithRuleElementCustomerCollectionsPrepareWorkoutCollectionWorkout.checkCorrectValue();
        }

        let isLangOutCorrect = false;
        let selectWithRuleElementLangsOutPrepareWorkoutCollectionWorkout =
            this.#selectWithRuleElementLangsOutPrepareWorkoutCollectionWorkout;
        if (selectWithRuleElementLangsOutPrepareWorkoutCollectionWorkout) {
            isLangOutCorrect = await selectWithRuleElementLangsOutPrepareWorkoutCollectionWorkout.checkCorrectValue();
        }

        let isCorrect = isCustomerCollectionCorrect && isLangOutCorrect;
        if (isCorrect) {
            isCorrect = this.#checkCorrectLangs();
        }

        if (!isCorrect && tableWithTimerElementWorkoutsNotOver) {
            tableWithTimerElementWorkoutsNotOver.startToFill();
        }

        return isCorrect;
    }

    async submit() {
        let tableWithTimerElementWorkoutsNotOver = this.#tableWithTimerElementWorkoutsNotOver;
        if (tableWithTimerElementWorkoutsNotOver) {
            tableWithTimerElementWorkoutsNotOver.showLoading();
        }

        let dto = new WorkoutAddCollectionWorkoutRequestDTO();

        let selectWithRuleElementCustomerCollectionsPrepareWorkoutCollectionWorkout =
            this.#selectWithRuleElementCustomerCollectionsPrepareWorkoutCollectionWorkout;
        if (selectWithRuleElementCustomerCollectionsPrepareWorkoutCollectionWorkout) {
            dto.setCustomerCollectionId(selectWithRuleElementCustomerCollectionsPrepareWorkoutCollectionWorkout.getSelectedValue());
        }

        let selectWithRuleElementLangsOutPrepareWorkoutCollectionWorkout =
            this.#selectWithRuleElementLangsOutPrepareWorkoutCollectionWorkout;
        if (selectWithRuleElementLangsOutPrepareWorkoutCollectionWorkout) {
            dto.setLangOutCode(selectWithRuleElementLangsOutPrepareWorkoutCollectionWorkout.getSelectedValue());
        }

        let isCorrect = true;
        let ruleType;
        let message;
        let jsonResponse = await _WORKOUTS_API.POST.addCollectionWorkout(dto);
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
        let selectWithRuleElementCustomerCollectionsPrepareWorkoutCollectionWorkout =
            this.#selectWithRuleElementCustomerCollectionsPrepareWorkoutCollectionWorkout;
        let selectWithRuleElementLangsOutPrepareWorkoutCollectionWorkout =
            this.#selectWithRuleElementLangsOutPrepareWorkoutCollectionWorkout;
        if (selectWithRuleElementCustomerCollectionsPrepareWorkoutCollectionWorkout
            && selectWithRuleElementLangsOutPrepareWorkoutCollectionWorkout) {
            selectWithRuleElementCustomerCollectionsPrepareWorkoutCollectionWorkout.changeSelectedOptionByIndex(
                0, false);
            selectWithRuleElementLangsOutPrepareWorkoutCollectionWorkout.changeSelectedOptionByIndex(
                0, false);

            await selectWithRuleElementCustomerCollectionsPrepareWorkoutCollectionWorkout.refresh(false);
            await selectWithRuleElementLangsOutPrepareWorkoutCollectionWorkout.refresh(false);
        }
    }


    changeDisabledStatusToFormElements(isDisabled) {
        super.changeDisabledStatusToFormElements(isDisabled);

        let selectWithRuleElementCustomerCollectionsPrepareWorkoutCollectionWorkout =
            this.#selectWithRuleElementCustomerCollectionsPrepareWorkoutCollectionWorkout;
        if (selectWithRuleElementCustomerCollectionsPrepareWorkoutCollectionWorkout) {
            selectWithRuleElementCustomerCollectionsPrepareWorkoutCollectionWorkout.changeDisabledStatus(isDisabled);
        }

        let selectWithRuleElementLangsOutPrepareWorkoutCollectionWorkout =
            this.#selectWithRuleElementLangsOutPrepareWorkoutCollectionWorkout;
        if (selectWithRuleElementLangsOutPrepareWorkoutCollectionWorkout) {
            selectWithRuleElementLangsOutPrepareWorkoutCollectionWorkout.changeDisabledStatus(isDisabled);
        }
    }
}