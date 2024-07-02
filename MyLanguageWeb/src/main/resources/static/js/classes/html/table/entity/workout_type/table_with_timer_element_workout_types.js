import {
    WorkoutTypesAPI
} from "../../../../api/entity/workout_types_api.js";

import {
    CssRoot
} from "../../../../css/css_root.js";

import {
    HttpStatuses
} from "../../../../api/classes/http/http_statuses.js";

import {
    TableWithTimerAbstractElement
} from "../../with_timer/abstracts/table_with_timer_abstract_element.js";

import {
    SelectElementBoolean
} from "../../../select/elements/select_element_boolean.js";

import {
    DivElementWorkoutType
} from "../../../div/entity/workout_type/div_element_workout_type.js";

import {
    EntityEditValueByCodeRequestDTO
} from "../../../../dto/other/request/entity/edit/entity_edit_value_by_code_request_dto.js";

import {
    ResponseMessageResponseDTO
} from "../../../../dto/other/response/response_message_response_dto.js";

import {
    WorkoutTypeResponseDTO
} from "../../../../dto/entity/workout_type/response/workout_type_response_dto.js";

import {
    EventNames
} from "../../../event_names.js";

const _WORKOUT_TYPES_API = new WorkoutTypesAPI();

const _CSS_ROOT = new CssRoot();

const _HTTP_STATUSES = new HttpStatuses();
const _EVENT_NAMES = new EventNames();

export class TableWithTimerElementWorkoutTypes extends TableWithTimerAbstractElement {
    #inputTextElementFinder;
    #selectElementBooleanIsActive;
    #buttonElementRefresh;

    #maxNumberOfWorkoutTypesOnPage = 10;

    constructor(table, colgroup, thead, tbody) {
        super(table, colgroup, thead, tbody);
    }

    setInputTextElementFinder(inputTextElementFinderObj) {
        this.#inputTextElementFinder = inputTextElementFinderObj;
    }

    setSelectElementBooleanIsActive(selectElementBooleanIsActiveObj) {
        this.#selectElementBooleanIsActive = selectElementBooleanIsActiveObj;
    }

    setButtonElementRefresh(buttonElementRefreshObj) {
        this.#buttonElementRefresh = buttonElementRefreshObj;
    }


    async #createTr(workoutTypeResponseDTOObj) {
        let tr;
        if (workoutTypeResponseDTOObj) {
            const ROW_HEIGHT = "90px";

            tr = document.createElement("tr");
            tr.style.minHeight = ROW_HEIGHT;

            // Номер строки ---
            let td = document.createElement("td");
            td.style.textAlign = "center";

            this.incrementCurrentRowNumber(1);
            td.textContent = `${this.getCurrentRowNumber()}.`;

            tr.appendChild(td);
            //---

            // Название ---
            td = document.createElement("td");

            let divElementWorkoutType = new DivElementWorkoutType(null);
            divElementWorkoutType.setWorkoutTypeResponseDTO(workoutTypeResponseDTOObj);

            await divElementWorkoutType.prepare();
            await divElementWorkoutType.fill();

            let div = divElementWorkoutType.getDiv();
            if (div) {
                div.style.display = "grid";
                div.style.justifyContent = "left";

                td.appendChild(div);
            }

            tr.appendChild(td);
            //---

            // Статус активности ---
            td = document.createElement("td");
            td.style.padding = "1px";

            let selectElementBooleanIsActive = new SelectElementBoolean(null, false);

            selectElementBooleanIsActive.prepare();
            await selectElementBooleanIsActive.fill();

            selectElementBooleanIsActive.changeSelectedOptionByValue(
                workoutTypeResponseDTOObj.getIsActive(), true);

            let select = selectElementBooleanIsActive.getSelect();
            if (select) {
                select.style.height = ROW_HEIGHT;
                select.style.width = "100%";

                select.addEventListener(_EVENT_NAMES.SELECT.CHANGE, async function() {
                    selectElementBooleanIsActive.changeDisabledStatus(true);

                    let entityEditValueByCodeRequestDTO = new EntityEditValueByCodeRequestDTO();
                    entityEditValueByCodeRequestDTO.setCode(workoutTypeResponseDTOObj.getCode());
                    entityEditValueByCodeRequestDTO.setValue(selectElementBooleanIsActive.getSelectedValue());

                    let jsonResponse = await _WORKOUT_TYPES_API.PATCH.editIsActive(entityEditValueByCodeRequestDTO);
                    if (jsonResponse.getStatus() === _HTTP_STATUSES.OK) {
                        selectElementBooleanIsActive.changeDisabledStatus(false);
                    } else {
                        selectElementBooleanIsActive.changeTitle(
                            new ResponseMessageResponseDTO(jsonResponse.getJson()).getMessage());
                    }
                });

                td.appendChild(select);
            }

            tr.appendChild(td);
            //---
        }

        return tr;
    }


    async prepare() {
        await super.prepare();

        let inputTextElementFinder = this.#inputTextElementFinder;
        if (inputTextElementFinder) {
            if (!inputTextElementFinder.getIsPrepared()) {
                inputTextElementFinder.prepare();
            }

            let self = this;
            inputTextElementFinder.addInputFunction(function() {
                self.startToFill();
            });
        }

        let selectElementBooleanIsActive = this.#selectElementBooleanIsActive;
        if (selectElementBooleanIsActive) {
            if (!selectElementBooleanIsActive.getIsPrepared()) {
                selectElementBooleanIsActive.prepare();
            }

            let select = selectElementBooleanIsActive.getSelect();
            if (select) {
                let self = this;
                select.addEventListener(_EVENT_NAMES.SELECT.CHANGE, function() {
                    self.startToFill();
                });
            }
        }

        let buttonElementRefresh = this.#buttonElementRefresh;
        if (buttonElementRefresh) {
            if (!buttonElementRefresh.getIsPrepared()) {
                buttonElementRefresh.prepare();
            }

            let self = this;
            buttonElementRefresh.setBeforeRefreshFunction(function() {
                self.changeDisabledStatusToTableInstruments(true);

                // Отображаем загрузки на момент перезагрузки ---
                self.showLoading();
                //---
            });
            buttonElementRefresh.setRefreshFunction(async function() {
                let selectElementBooleanIsActive = self.#selectElementBooleanIsActive;
                if (selectElementBooleanIsActive) {
                    await selectElementBooleanIsActive.refresh(true);
                }
            });
            buttonElementRefresh.setAfterRefreshFunction(function() {
                self.startToFill();
                self.changeDisabledStatusToTableInstruments(false);
            });
        }
    }

    async tryToCreateTrsArr(giveAccessToShowMessage) {
        let trsArr;

        // Получаем данные для поиска ---
        let title;
        let inputTextElementFinder = this.#inputTextElementFinder;
        if (inputTextElementFinder) {
            title = inputTextElementFinder.getValue();
        }

        let isActive;
        let selectElementBooleanIsActive = this.#selectElementBooleanIsActive;
        if (selectElementBooleanIsActive) {
            isActive = selectElementBooleanIsActive.getSelectedValue();
        }

        let maxNumberOfWorkoutTypesOnPage = this.#maxNumberOfWorkoutTypesOnPage;
        let lastWorkoutTypeIdOnPreviousPage = this.getValueForNextPage();
        //---

        let jsonResponse = await _WORKOUT_TYPES_API.GET.getAll(
            title, true, isActive, maxNumberOfWorkoutTypesOnPage, lastWorkoutTypeIdOnPreviousPage);
        if (jsonResponse.getStatus() === _HTTP_STATUSES.OK) {
            trsArr = [];

            let json = jsonResponse.getJson();
            for (let i = 0; i < json.length; i++) {
                if (!this.getFindStatus()) break;

                let workoutTypeResponseDTO = new WorkoutTypeResponseDTO(json[i]);
                let tr = await this.#createTr(workoutTypeResponseDTO);
                if (tr) {
                    trsArr.push(tr);
                }
            }

            if (this.getFindStatus() && maxNumberOfWorkoutTypesOnPage === json.length) {
                let tr = this.createTrShowMore(`Показать ещё ${maxNumberOfWorkoutTypesOnPage} режимов тренировок`);
                if (tr) {
                    trsArr.push(tr);
                }
            }
        } else if (giveAccessToShowMessage) {
            this.showMessage(new ResponseMessageResponseDTO(jsonResponse.getJson()).getMessage(),
                _CSS_ROOT.SMALL_FONT_SIZE_STYLE_ID);
        }

        return trsArr;
    }

    changeDisabledStatusToTableInstruments(isDisabled) {
        let buttonElementRefresh = this.#buttonElementRefresh;
        if (buttonElementRefresh) {
            buttonElementRefresh.changeDisabledStatus(isDisabled);
        }

        let inputTextElementFinder = this.#inputTextElementFinder;
        if (inputTextElementFinder) {
            inputTextElementFinder.changeDisabledStatus(isDisabled);
        }

        let selectElementBooleanIsActive = this.#selectElementBooleanIsActive;
        if (selectElementBooleanIsActive) {
            selectElementBooleanIsActive.changeDisabledStatus(isDisabled);
        }
    }
}