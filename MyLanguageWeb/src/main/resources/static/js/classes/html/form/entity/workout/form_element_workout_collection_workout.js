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

export class FormElementWorkoutCollectionWorkout extends FormAbstractElement {
    #selectWithRuleElementCustomerCollectionsWorkoutCollectionWorkout;
    #selectWithRuleElementLangsOutWorkoutCollectionWorkout;

    #tableWithTimerElementWorkoutsNotOver;

    constructor(form, buttonSubmit, divMessageContainer) {
        super(form, buttonSubmit, divMessageContainer);

        this.#tryToSetDefaultValues();
    }

    setSelectWithRuleElementCustomerCollectionsWorkoutCollectionWorkout(selectWithRuleElementCustomerCollectionsWorkoutCollectionWorkoutObj) {
        this.#selectWithRuleElementCustomerCollectionsWorkoutCollectionWorkout =
            selectWithRuleElementCustomerCollectionsWorkoutCollectionWorkoutObj;
    }

    setSelectWithRuleElementLangsOutWorkoutCollectionWorkout(selectWithRuleElementLangsOutWorkoutCollectionWorkoutObj) {
        this.#selectWithRuleElementLangsOutWorkoutCollectionWorkout =
            selectWithRuleElementLangsOutWorkoutCollectionWorkoutObj;
    }

    setTableWithTimerElementWorkoutsNotOver(tableWithTimerElementWorkoutsNotOverObj) {
        this.#tableWithTimerElementWorkoutsNotOver = tableWithTimerElementWorkoutsNotOverObj;
    }


    #tryToSetDefaultValues() {
        // Связывваем два списка между собой ---
        let selectWithRuleElementCustomerCollectionsWorkoutCollectionWorkout =
            this.#selectWithRuleElementCustomerCollectionsWorkoutCollectionWorkout;
        let selectWithRuleElementLangsOutWorkoutCollectionWorkout =
            this.#selectWithRuleElementLangsOutWorkoutCollectionWorkout;
        if (selectWithRuleElementCustomerCollectionsWorkoutCollectionWorkout
            && selectWithRuleElementLangsOutWorkoutCollectionWorkout) {
            selectWithRuleElementCustomerCollectionsWorkoutCollectionWorkout.setSelectWithRuleElementLangsOutWorkoutCollectionWorkout(
                selectWithRuleElementLangsOutWorkoutCollectionWorkout);
            selectWithRuleElementLangsOutWorkoutCollectionWorkout.setSelectWithRuleElementCustomerCollectionsWorkoutCollectionWorkout(
                selectWithRuleElementCustomerCollectionsWorkoutCollectionWorkout);
        }
        //---
    }

    async #checkCorrectLangs() {
        let isCorrect = false;

        let selectWithRuleElementCustomerCollectionsWorkoutCollectionWorkout =
            this.#selectWithRuleElementCustomerCollectionsWorkoutCollectionWorkout;
        let selectWithRuleElementLangsOutWorkoutCollectionWorkout =
            this.#selectWithRuleElementLangsOutWorkoutCollectionWorkout;
        if (selectWithRuleElementCustomerCollectionsWorkoutCollectionWorkout
            && selectWithRuleElementLangsOutWorkoutCollectionWorkout) {
            isCorrect = true;
            let ruleType;
            let message;

            let langInCode;
            let customerCollectionId = selectWithRuleElementCustomerCollectionsWorkoutCollectionWorkout.getSelectedValue();
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

            let langOutCode = selectWithRuleElementLangsOutWorkoutCollectionWorkout.getSelectedValue();
            if (langInCode === langOutCode) {
                isCorrect = false;
                ruleType = _RULE_TYPES.ERROR;
                message = "Языки не могут повторяться";
            }

            if (!isCorrect) {
                selectWithRuleElementCustomerCollectionsWorkoutCollectionWorkout.showRule(ruleType, message);
                selectWithRuleElementLangsOutWorkoutCollectionWorkout.showRule(ruleType, message);
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

        let selectWithRuleElementCustomerCollectionsWorkoutCollectionWorkout =
            this.#selectWithRuleElementCustomerCollectionsWorkoutCollectionWorkout;
        if (selectWithRuleElementCustomerCollectionsWorkoutCollectionWorkout) {
            if (!selectWithRuleElementCustomerCollectionsWorkoutCollectionWorkout.getIsPrepared()) {
                selectWithRuleElementCustomerCollectionsWorkoutCollectionWorkout.prepare();
                await selectWithRuleElementCustomerCollectionsWorkoutCollectionWorkout.fill();
            }

            let select = selectWithRuleElementCustomerCollectionsWorkoutCollectionWorkout.getSelect();
            if (select) {
                let self = this;
                select.addEventListener(_EVENT_NAMES.SELECT.CHANGE, function() {
                    self.clearDivMessageContainer();
                })
            }
        }

        let selectWithRuleElementLangsOutWorkoutCollectionWorkout =
            this.#selectWithRuleElementLangsOutWorkoutCollectionWorkout;
        if (selectWithRuleElementLangsOutWorkoutCollectionWorkout) {
            if (!selectWithRuleElementLangsOutWorkoutCollectionWorkout.getIsPrepared()) {
                selectWithRuleElementLangsOutWorkoutCollectionWorkout.prepare();
                await selectWithRuleElementLangsOutWorkoutCollectionWorkout.fill();
            }

            let select = selectWithRuleElementLangsOutWorkoutCollectionWorkout.getSelect();
            if (select) {
                let self = this;
                select.addEventListener(_EVENT_NAMES.SELECT.CHANGE, function() {
                    self.clearDivMessageContainer();
                })
            }
        }

        // Мы должны обновить списки (если нашлась предыдущая тренировка) ---
        if (selectWithRuleElementCustomerCollectionsWorkoutCollectionWorkout
            && selectWithRuleElementLangsOutWorkoutCollectionWorkout
            && workoutResponseDTO) {

            let customerCollection = workoutResponseDTO.getCustomerCollection();
            if (customerCollection) {
                selectWithRuleElementCustomerCollectionsWorkoutCollectionWorkout.changeSelectedOptionByValue(
                    customerCollection.getId(), false);
            }

            let langOut = workoutResponseDTO.getLangOut();
            if (langOut) {
                selectWithRuleElementLangsOutWorkoutCollectionWorkout.changeSelectedOptionByValue(
                    langOut.getCode(), false);
            }

            await selectWithRuleElementCustomerCollectionsWorkoutCollectionWorkout.refresh(true);
            await selectWithRuleElementLangsOutWorkoutCollectionWorkout.refresh(true);
        }
        //---
    }

    async checkCorrectValues() {
        let isCustomerCollectionCorrect = false;
        let selectWithRuleElementCustomerCollectionsWorkoutCollectionWorkout =
            this.#selectWithRuleElementCustomerCollectionsWorkoutCollectionWorkout;
        if (selectWithRuleElementCustomerCollectionsWorkoutCollectionWorkout) {
            isCustomerCollectionCorrect =
                await selectWithRuleElementCustomerCollectionsWorkoutCollectionWorkout.checkCorrectValue();
        }

        let isLangOutCorrect = false;
        let selectWithRuleElementLangsOutWorkoutCollectionWorkout =
            this.#selectWithRuleElementLangsOutWorkoutCollectionWorkout;
        if (selectWithRuleElementLangsOutWorkoutCollectionWorkout) {
            isLangOutCorrect = await selectWithRuleElementLangsOutWorkoutCollectionWorkout.checkCorrectValue();
        }

        let isCorrect = isCustomerCollectionCorrect && isLangOutCorrect;
        if (isCorrect) {
            isCorrect = this.#checkCorrectLangs();
        }

        return isCorrect;
    }

    async submit() {
        let tableWithTimerElementWorkoutsNotOver = this.#tableWithTimerElementWorkoutsNotOver;
        if (tableWithTimerElementWorkoutsNotOver) {
            tableWithTimerElementWorkoutsNotOver.showLoading();
        }

        let dto = new WorkoutAddCollectionWorkoutRequestDTO();

        let selectWithRuleElementCustomerCollectionsWorkoutCollectionWorkout =
            this.#selectWithRuleElementCustomerCollectionsWorkoutCollectionWorkout;
        if (selectWithRuleElementCustomerCollectionsWorkoutCollectionWorkout) {
            dto.setCustomerCollectionId(selectWithRuleElementCustomerCollectionsWorkoutCollectionWorkout.getSelectedValue());
        }

        let selectWithRuleElementLangsOutWorkoutCollectionWorkout =
            this.#selectWithRuleElementLangsOutWorkoutCollectionWorkout;
        if (selectWithRuleElementLangsOutWorkoutCollectionWorkout) {
            dto.setLangOutCode(selectWithRuleElementLangsOutWorkoutCollectionWorkout.getSelectedValue());
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
        let selectWithRuleElementCustomerCollectionsWorkoutCollectionWorkout =
            this.#selectWithRuleElementCustomerCollectionsWorkoutCollectionWorkout;
        let selectWithRuleElementLangsOutWorkoutCollectionWorkout =
            this.#selectWithRuleElementLangsOutWorkoutCollectionWorkout;
        if (selectWithRuleElementCustomerCollectionsWorkoutCollectionWorkout
            && selectWithRuleElementLangsOutWorkoutCollectionWorkout) {
            selectWithRuleElementCustomerCollectionsWorkoutCollectionWorkout.changeSelectedOptionByIndex(
                0, false);
            selectWithRuleElementLangsOutWorkoutCollectionWorkout.changeSelectedOptionByIndex(
                0, false);

            await selectWithRuleElementCustomerCollectionsWorkoutCollectionWorkout.refresh(false);
            await selectWithRuleElementLangsOutWorkoutCollectionWorkout.refresh(false);
        }
    }


    changeDisabledStatusToFormElements(isDisabled) {
        super.changeDisabledStatusToFormElements(isDisabled);

        let selectWithRuleElementCustomerCollectionsWorkoutCollectionWorkout =
            this.#selectWithRuleElementCustomerCollectionsWorkoutCollectionWorkout;
        if (selectWithRuleElementCustomerCollectionsWorkoutCollectionWorkout) {
            selectWithRuleElementCustomerCollectionsWorkoutCollectionWorkout.changeDisabledStatus(isDisabled);
        }

        let selectWithRuleElementLangsOutWorkoutCollectionWorkout =
            this.#selectWithRuleElementLangsOutWorkoutCollectionWorkout;
        if (selectWithRuleElementLangsOutWorkoutCollectionWorkout) {
            selectWithRuleElementLangsOutWorkoutCollectionWorkout.changeDisabledStatus(isDisabled);
        }
    }
}