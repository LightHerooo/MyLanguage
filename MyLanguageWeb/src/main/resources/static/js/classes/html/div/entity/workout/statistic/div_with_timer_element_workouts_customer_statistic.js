import {
    DivWithTimerAbstractElement
} from "../../../abstracts/div_with_timer_abstract_element.js";

import {
    WorkoutsAPI
} from "../../../../../api/entity/workouts_api.js";

import {
    CssRoot
} from "../../../../../css/css_root.js";

import {
    HttpStatuses
} from "../../../../../api/classes/http/http_statuses.js";

import {
    WorkoutsCustomerStatisticResponseDTO
} from "../../../../../dto/entity/workout/types/statistic/workouts_customer_statistic_response_dto.js";

import {
    ResponseMessageResponseDTO
} from "../../../../../dto/other/response/response_message_response_dto.js";

import {
    TableElementWorkoutsCustomerStatistic
} from "../../../../table/entity/workout/statistic/customer/table_element_workouts_customer_statistic.js";

import {
    TableElementWorkoutAnswersStatistic
} from "../../../../table/entity/workout/statistic/answers/table_element_workout_answers_statistic.js";

import {
    TableElementWorkoutsCustomerFavouritesStatistic
} from "../../../../table/entity/workout/statistic/customer/table_element_workouts_cusomer_favourites_statistic.js";

import {
    EventNames
} from "../../../../event_names.js";

const _WORKOUTS_API = new WorkoutsAPI();

const _CSS_ROOT = new CssRoot();

const _HTTP_STATUSES = new HttpStatuses();
const _EVENT_NAMES = new EventNames();

export class DivWithTimerElementWorkoutsCustomerStatistic extends DivWithTimerAbstractElement {
    #customerId;
    #selectElementWorkoutTypes;
    #selectElementPeriods;
    #buttonElementRefresh;

    constructor(div) {
        super(div);
    }

    setCustomerId(customerId) {
        this.#customerId = customerId;
    }

    setSelectElementWorkoutTypes(selectElementWorkoutTypesObj) {
        this.#selectElementWorkoutTypes = selectElementWorkoutTypesObj;
    }

    setSelectElementPeriods(selectElementPeriodsObj) {
        this.#selectElementPeriods = selectElementPeriodsObj;
    }

    setButtonElementRefresh(buttonElementRefreshObj) {
        this.#buttonElementRefresh = buttonElementRefreshObj;
    }


    #checkCorrectValuesBeforeTryToCreateContent() {
        let isCorrect = true;

        let customerId = this.#customerId;
        if (!customerId) {
            isCorrect = false;
            this.showMessage("Не удалось получить id владельца страницы", _CSS_ROOT.MEDIUM_FONT_SIZE_STYLE_ID);
        }

        return isCorrect;
    }


    showLoading() {
        super.showLoading();

        this.addInfoBlockContainerClassStyle();
    }

    async prepare() {
        await super.prepare();

        // Выпадающий список "Режимы тренировок" ---
        let selectElementWorkoutTypes = this.#selectElementWorkoutTypes;
        if (selectElementWorkoutTypes) {
            if (!selectElementWorkoutTypes.getIsPrepared()) {
                await selectElementWorkoutTypes.prepare();
                await selectElementWorkoutTypes.fill();
            }

            let select = selectElementWorkoutTypes.getSelect();
            if (select) {
                let self = this;
                select.addEventListener(_EVENT_NAMES.SELECT.CHANGE, function() {
                    self.startToFill();
                })
            }
        }
        //---

        // Выпадающий список "Периоды дней" ---
        let selectElementPeriods = this.#selectElementPeriods;
        if (selectElementPeriods) {
            if (!selectElementPeriods.getIsPrepared()) {
                await selectElementPeriods.prepare();
                await selectElementPeriods.fill();
            }

            let select = selectElementPeriods.getSelect();
            if (select) {
                let self = this;
                select.addEventListener(_EVENT_NAMES.SELECT.CHANGE, function() {
                    self.startToFill();
                })
            }
        }
        //---

        // Кнопка "Обновить" ---
        let buttonElementRefresh = this.#buttonElementRefresh;
        if (buttonElementRefresh) {
            if (!buttonElementRefresh.getIsPrepared()) {
                buttonElementRefresh.prepare();
            }

            let self = this;
            buttonElementRefresh.setBeforeRefreshFunction(function() {
                self.changeDisabledStatusToDivInstruments(true);

                // Отображаем загрузки на момент перезагрузки ---
                self.showLoading();
                //---
            });
            buttonElementRefresh.setRefreshFunction(async function() {
                let selectElementWorkoutTypes = self.#selectElementWorkoutTypes;
                if (selectElementWorkoutTypes) {
                    await selectElementWorkoutTypes.refresh(true);
                }

                let selectElementPeriods = self.#selectElementPeriods;
                if (selectElementPeriods) {
                    await selectElementPeriods.refresh(true);
                }
            });
            buttonElementRefresh.setAfterRefreshFunction(function() {
                self.startToFill();
                self.changeDisabledStatusToDivInstruments(false);
            })
        }
        //---
    }

    async tryToCreateContent() {
        let div;
        let isCorrect = this.#checkCorrectValuesBeforeTryToCreateContent();
        if (isCorrect) {
            // Получаем данные для поиска ---
            let customerId = this.#customerId;

            let workoutTypeCode;
            let selectElementWorkoutTypes = this.#selectElementWorkoutTypes;
            if (selectElementWorkoutTypes) {
                workoutTypeCode = selectElementWorkoutTypes.getSelectedValue();
            }

            let days;
            let selectElementPeriods = this.#selectElementPeriods;
            if (selectElementPeriods) {
                days = selectElementPeriods.getSelectedValue();
            }
            //---

            let jsonResponse = await _WORKOUTS_API.GET.findCustomerStatistic(customerId, workoutTypeCode, days);
            if (jsonResponse.getStatus() === _HTTP_STATUSES.OK) {
                let workoutsCustomerStatisticResponseDTO =
                    new WorkoutsCustomerStatisticResponseDTO(jsonResponse.getJson());

                div = document.createElement("div");
                div.style.display = "flex";
                div.style.flexDirection = "column";
                div.style.gap = "5px";

                // Основная статистика по тренировкам пользователя ---
                let tableElementWorkoutsCustomerStatistic =
                    new TableElementWorkoutsCustomerStatistic(null, null, null, null);
                tableElementWorkoutsCustomerStatistic.setWorkoutsCustomerStatisticResponseDTO(workoutsCustomerStatisticResponseDTO);
                tableElementWorkoutsCustomerStatistic.buildNewTable();

                await tableElementWorkoutsCustomerStatistic.prepare();
                await tableElementWorkoutsCustomerStatistic.fill();

                let table = tableElementWorkoutsCustomerStatistic.getTable();
                if (table) {
                    div.appendChild(table);
                }
                //---

                // Статистика по ответам в тренировках пользоватея ---
                let tableElementWorkoutAnswersStatistic =
                    new TableElementWorkoutAnswersStatistic(null, null, null, null);

                tableElementWorkoutAnswersStatistic.setWorkoutAnswersStatisticResponseDTO(
                    workoutsCustomerStatisticResponseDTO.getWorkoutAnswersStatistic());
                tableElementWorkoutAnswersStatistic.buildNewTable();

                await tableElementWorkoutAnswersStatistic.prepare();
                await tableElementWorkoutAnswersStatistic.fill();

                table = tableElementWorkoutAnswersStatistic.getTable();
                if (table) {
                    div.appendChild(table);
                }
                //--

                // Любимые языки, режим тренировок и коллекция ---
                let tableElementWorkoutsCustomerFavouritesStatistic =
                    new TableElementWorkoutsCustomerFavouritesStatistic(null, null, null, null);
                tableElementWorkoutsCustomerFavouritesStatistic.setCustomerId(customerId);
                tableElementWorkoutsCustomerFavouritesStatistic.setWorkoutTypeCode(workoutTypeCode);
                tableElementWorkoutsCustomerFavouritesStatistic.setDays(days);

                await tableElementWorkoutsCustomerFavouritesStatistic.prepare();
                await tableElementWorkoutsCustomerFavouritesStatistic.fill();

                table = tableElementWorkoutsCustomerFavouritesStatistic.getTable();
                if (table) {
                    div.appendChild(table);
                }
                //---

                this.removeInfoBlockContainerClassStyle();
            } else {
                this.showMessage(new ResponseMessageResponseDTO(jsonResponse.getJson()).getMessage(),
                    _CSS_ROOT.MEDIUM_FONT_SIZE_STYLE_ID);
            }
        }

        return div;
    }

    changeDisabledStatusToDivInstruments(isDisabled) {
        // Кнопка "Обновить" ---
        let buttonElementRefresh = this.#buttonElementRefresh;
        if (buttonElementRefresh) {
            buttonElementRefresh.changeDisabledStatus(isDisabled);
        }
        //---

        // Выпадающий список "Режимы тренировок" ---
        let selectElementWorkoutTypes = this.#selectElementWorkoutTypes;
        if (selectElementWorkoutTypes) {
            selectElementWorkoutTypes.changeDisabledStatus(isDisabled);
        }
        //---

        // Выпадающий список "Периоды дней" ---
        let selectElementPeriods = this.#selectElementPeriods;
        if (selectElementPeriods) {
            selectElementPeriods.changeDisabledStatus(isDisabled);
        }
        //---
    }
}