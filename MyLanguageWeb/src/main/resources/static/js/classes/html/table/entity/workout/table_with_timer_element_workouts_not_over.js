import {
    WorkoutsAPI
} from "../../../../api/entity/workouts_api.js";

import {
    CssRoot
} from "../../../../css/css_root.js";

import {
    CssTableElement
} from "../../../../css/table/css_table_element.js";

import {
    CssDivElement
} from "../../../../css/div/css_div_element.js";

import {
    HttpStatuses
} from "../../../../api/classes/http/http_statuses.js";

import {
    TableUtils
} from "../../table_utils.js";

import {
    AButtonWithImgElementSizes
} from "../../../a/a_button/with_img/a_button_with_img_element_sizes.js";

import {
    AButtonWithImgElementTypes
} from "../../../a/a_button/with_img/a_button_with_img_element_types.js";

import {
    ButtonWithImgElementSizes
} from "../../../button/with_img/button_with_img_element_sizes.js";

import {
    ButtonWithImgElementTypes
} from "../../../button/with_img/button_with_img_element_types.js";

import {
    UrlPaths
} from "../../../../url/path/url_paths.js";

import {
    HrefTypes
} from "../../../a/href_types.js";

import {
    TableWithTimerAbstractElement
} from "../../with_timer/abstracts/table_with_timer_abstract_element.js";

import {
    ButtonWithImgElement
} from "../../../button/with_img/button_with_img_element.js";

import {
    DivElementWorkoutInfo
} from "../../../div/entity/workout/info/div_element_workout_info.js";

import {
    AButtonWithImgElement
} from "../../../a/a_button/with_img/a_button_with_img_element.js";

import {
    ButtonWithImgElementDoubleClick
} from "../../../button/with_img/button_with_img_element_double_click.js";

import {
    EntityIdRequestDTO
} from "../../../../dto/other/request/entity/entity_id_request_dto.js";

import {
    WorkoutResponseDTO
} from "../../../../dto/entity/workout/response/workout_response_dto.js";

import {
    ProjectCookies
} from "../../../project_cookies.js";

import {
    TimeParts
} from "../../../time_parts.js";

import {
    EventNames
} from "../../../event_names.js";

const _WORKOUTS_API = new WorkoutsAPI();

const _CSS_ROOT = new CssRoot();
const _CSS_TABLE_ELEMENT = new CssTableElement();
const _CSS_DIV_ELEMENT = new CssDivElement();

const _HTTP_STATUSES = new HttpStatuses();
const _PROJECT_COOKIES = new ProjectCookies();
const _TABLE_UTILS = new TableUtils();
const _A_BUTTON_WITH_IMG_ELEMENT_SIZES = new AButtonWithImgElementSizes();
const _A_BUTTON_WITH_IMG_ELEMENT_TYPES = new AButtonWithImgElementTypes();
const _BUTTON_WITH_IMG_ELEMENT_SIZES = new ButtonWithImgElementSizes();
const _BUTTON_WITH_IMG_ELEMENT_TYPES = new ButtonWithImgElementTypes();
const _URL_PATHS = new UrlPaths();
const _HREF_TYPES = new HrefTypes();
const _EVENT_NAMES = new EventNames();

export class TableWithTimerElementWorkoutsNotOver extends TableWithTimerAbstractElement {
    #workoutTypeCode;
    #buttonElementRefresh;

    #formElementCreateNewWorkout;
    #maxNumberOfNotOverWorkouts = 3;

    constructor(table, colgroup, thead, tbody) {
        super(table, colgroup, thead, tbody);
    }

    setWorkoutTypeCode(workoutTypeCode) {
        this.#workoutTypeCode = workoutTypeCode;
    }

    setButtonElementRefresh(buttonElementRefreshObj) {
        this.#buttonElementRefresh = buttonElementRefreshObj;
    }

    setFormElementCreateNewWorkout(formElementObjCreateNewWorkout) {
        this.#formElementCreateNewWorkout = formElementObjCreateNewWorkout;
    }


    #checkCorrectValuesBeforeTryToCreateTrsArr() {
        let isCorrect = true;

        let workoutTypeCode = this.#workoutTypeCode;
        if (!workoutTypeCode) {
            isCorrect = false;
            this.showMessage("Не указан режим тренировки", _CSS_ROOT.MEDIUM_FONT_SIZE_STYLE_ID);
        }

        return isCorrect;
    }

    async #createTr(workoutResponseDTOObj) {
        let tr;
        if (workoutResponseDTOObj) {
            tr = document.createElement("tr");

            // Номер строки ---
            let td = document.createElement("td");
            td.style.textAlign = "center";

            this.incrementCurrentRowNumber();
            td.textContent = `${this.getCurrentRowNumber()}.`;
            tr.appendChild(td);
            //---

            // Информация о тренировке ---
            td = document.createElement("td");

            let divElementWorkoutInfo = new DivElementWorkoutInfo(null);
            divElementWorkoutInfo.setWorkoutResponseDTO(workoutResponseDTOObj);
            divElementWorkoutInfo.setDoNeedToShowSpanElementCustomer(false);
            await divElementWorkoutInfo.prepare();
            await divElementWorkoutInfo.fill();

            let div = divElementWorkoutInfo.getDiv();
            if (div) {
                td.appendChild(div);
            }

            tr.appendChild(td);
            //---

            // Время ---
            td = document.createElement("td");
            td.style.textAlign = "center";
            td.style.fontSize = _CSS_ROOT.BIG_FONT_SIZE_STYLE_ID;
            td.style.fontWeight = "bold";
            td.textContent = new TimeParts(workoutResponseDTOObj.getCurrentMilliseconds())
                .getTimeStr(false, true, true, false);

            tr.appendChild(td);
            //---

            // Действия ---
            td = document.createElement("td");

            div = document.createElement("div");
            div.classList.add(_CSS_DIV_ELEMENT.DIV_ELEMENT_CONTENT_CENTER_CLASS_ID);
            div.style.grid = "1fr 1fr / 1fr";
            div.style.gap = "5px";

            // Продолжение тренировки
            let self = this;
            let workoutId = workoutResponseDTOObj.getId();

            let aButtonWithImgElementContinue = new AButtonWithImgElement(null, null);
            aButtonWithImgElementContinue.changeTo(_A_BUTTON_WITH_IMG_ELEMENT_TYPES.ARROW_RIGHT);
            aButtonWithImgElementContinue.changeAButtonWithImgElementSize(_A_BUTTON_WITH_IMG_ELEMENT_SIZES.SIZE_32);
            aButtonWithImgElementContinue.changeTitle(`Продолжить тренировку №${workoutId}`);
            aButtonWithImgElementContinue.changeHref(`${_URL_PATHS.WORKOUTS.START.getPath()}/${workoutId}`);
            aButtonWithImgElementContinue.changeHrefType(_HREF_TYPES.OPEN_IN_THIS_PAGE);

            let a = aButtonWithImgElementContinue.getA();
            if (a) {
                div.appendChild(a);

                a.addEventListener(_EVENT_NAMES.A.CLICK, function() {
                    self.showLoading();

                    let formElementCreateNewWorkout = self.#formElementCreateNewWorkout;
                    if (formElementCreateNewWorkout) {
                        formElementCreateNewWorkout.showLoading();
                        formElementCreateNewWorkout.changeDisabledStatusToFormElements(true);
                    }
                })
            }

            // Удаление тренировки
            let buttonWithImgElement = new ButtonWithImgElement(null, null);
            let buttonWithImgElementDoubleClickDelete =
                new ButtonWithImgElementDoubleClick(buttonWithImgElement);
            buttonWithImgElementDoubleClickDelete.changeTo(_BUTTON_WITH_IMG_ELEMENT_TYPES.DELETE);
            buttonWithImgElementDoubleClickDelete.changeButtonWithImgElementSize(
                _BUTTON_WITH_IMG_ELEMENT_SIZES.SIZE_32);
            buttonWithImgElementDoubleClickDelete.changeTitle(`Удалить тренировку №${workoutId}`);
            buttonWithImgElementDoubleClickDelete.setAfterDoubleClickFunction(async function() {
                self.showLoading();

                let entityIdRequestDTO = new EntityIdRequestDTO();
                entityIdRequestDTO.setId(workoutId);

                await _WORKOUTS_API.DELETE.delete(entityIdRequestDTO);

                self.startToFill();
            });
            buttonWithImgElementDoubleClickDelete.prepare();

            let button = buttonWithImgElementDoubleClickDelete.getButton();
            if (button) {
                div.appendChild(button);
            }

            td.appendChild(div);
            tr.appendChild(td);
            //---
        }

        return tr;
    }

    #createTrEmptySlot() {
        this.incrementCurrentRowNumber();

        let tr = _TABLE_UTILS.createTrWithMessage(`Пустой слот №${this.getCurrentRowNumber()}`,
            _CSS_ROOT.MEDIUM_FONT_SIZE_STYLE_ID, this.getNumberOfColumns(), false);
        tr.style.height = "150px";

        return tr;
    }


    async prepare() {
        await super.prepare();

        let buttonElementRefresh = this.#buttonElementRefresh;
        if (buttonElementRefresh) {
            if (!buttonElementRefresh.getIsPrepared()) {
                buttonElementRefresh.prepare();
            }

            let button = buttonElementRefresh.getButton();
            if (button) {
                let self = this;
                button.addEventListener(_EVENT_NAMES.BUTTON.CLICK, function() {
                    self.startToFill();
                })
            }
        }
    }

    buildNewTable() {
        let table = document.createElement("table");
        table.classList.add(_CSS_TABLE_ELEMENT.TABLE_ELEMENT_CLASS_ID);

        // colgroup таблицы ---
        let colgroup = document.createElement("colgroup");

        let col = document.createElement("col");
        col.style.height = "5%";
        colgroup.appendChild(col);

        col = document.createElement("col");
        col.style.height = "65%";
        colgroup.appendChild(col);

        col = document.createElement("col");
        col.style.height = "30%";
        colgroup.appendChild(col);

        col = document.createElement("col");
        col.style.height = "80px";
        colgroup.appendChild(col);

        table.appendChild(colgroup);
        //---

        // thead таблицы ---
        let thead = document.createElement("thead");
        thead.classList.add(_CSS_TABLE_ELEMENT.THEAD_TABLE_ELEMENT_SMALL_CLASS_ID);

        let tr = document.createElement("tr");

        let th = document.createElement("th");
        th.textContent = "№";
        tr.appendChild(th);

        th = document.createElement("th");
        th.textContent = "Тренировка";
        tr.appendChild(th);

        th = document.createElement("th");
        th.textContent = "Время";
        tr.appendChild(th);

        th = document.createElement("th");
        tr.appendChild(th);

        thead.appendChild(tr);
        table.appendChild(thead);
        //---

        // tbody таблицы ---
        let tbody = document.createElement("tbody");

        table.appendChild(tbody);
        //---

        this.setTable(table);
        this.setColgroup(colgroup);
        this.setThead(thead);
        this.setTbody(tbody);
    }


    async tryToCreateTrsArr(giveAccessToShowMessage) {
        let trsArr;
        let isCorrect = this.#checkCorrectValuesBeforeTryToCreateTrsArr();
        if (isCorrect) {
            trsArr = [];

            // Получаем данные для поиска ---
            let workoutTypeCode = this.#workoutTypeCode;
            let customerId = _PROJECT_COOKIES.CUSTOMER_ID.getValue();
            //---

            let jsonResponse = await _WORKOUTS_API.GET.getAllNotOver(workoutTypeCode, customerId);
            if (jsonResponse.getStatus() === _HTTP_STATUSES.OK) {
                let json = jsonResponse.getJson();

                let maxNumberOfNotOverWorkouts = this.#maxNumberOfNotOverWorkouts;
                for (let i = 0; i < maxNumberOfNotOverWorkouts; i++) {
                    let tr = i < json.length
                        ? await this.#createTr(new WorkoutResponseDTO(json[i]))
                        : this.#createTrEmptySlot();

                    if (tr) {
                        trsArr.push(tr);
                    }
                }
            } else {
                // Если ни одной незаконченной тренировки не найдено, то мы должны сгенерировать 3 пустые строки ---
                let maxNumberOfNotOverWorkouts = this.#maxNumberOfNotOverWorkouts;
                for (let i = 0; i < maxNumberOfNotOverWorkouts; i++) {
                    let tr = this.#createTrEmptySlot();
                    if (tr) {
                        trsArr.push(tr);
                    }
                }
                //---
            }
        }

        return trsArr;
    }

    changeDisabledStatusToTableInstruments(isDisabled) {
        let buttonElementRefresh = this.#buttonElementRefresh;
        if (buttonElementRefresh) {
            buttonElementRefresh.changeDisabledStatus(isDisabled);
        }
    }
}