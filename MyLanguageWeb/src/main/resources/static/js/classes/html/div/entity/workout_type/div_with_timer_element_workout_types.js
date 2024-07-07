import {
    DivWithTimerAbstractElement
} from "../../abstracts/div_with_timer_abstract_element.js";

import {
    WorkoutTypesAPI
} from "../../../../api/entity/workout_types_api.js";

import {
    HttpStatuses
} from "../../../../api/classes/http/http_statuses.js";

import {
    CssRoot
} from "../../../../css/css_root.js";

import {
    ResponseMessageResponseDTO
} from "../../../../dto/other/response/response_message_response_dto.js";

import {
    CustomersAPI
} from "../../../../api/entity/customers_api.js";

import {
    AButtonWithImgAndSpanElement
} from "../../../a/a_button/with_img_and_span/a_button_with_img_and_span_element.js";

import {
    AButtonWithImgAndSpanElementTypes
} from "../../../a/a_button/with_img_and_span/a_button_with_img_and_span_types.js";

import {
    AButtonWithImgAndSpanElementVerticalSizes
} from "../../../a/a_button/with_img_and_span/sizes/a_button_with_img_and_span_element_vertical_sizes.js";

import {
    WorkoutTypeResponseDTO
} from "../../../../dto/entity/workout_type/response/workout_type_response_dto.js";

import {
    UrlPaths
} from "../../../../url/path/url_paths.js";

import {
    HrefTypes
} from "../../../a/href_types.js";

import {
    ProjectCookies
} from "../../../project_cookies.js";

const _WORKOUT_TYPES_API = new WorkoutTypesAPI();
const _CUSTOMERS_API = new CustomersAPI();

const _CSS_ROOT = new CssRoot();

const _HTTP_STATUSES = new HttpStatuses();
const _PROJECT_COOKIES = new ProjectCookies();
const _A_BUTTON_WITH_IMG_AND_SPAN_ELEMENT_TYPES = new AButtonWithImgAndSpanElementTypes();
const _A_BUTTON_WITH_IMG_AND_SPAN_ELEMENT_VERTICAL_SIZE = new AButtonWithImgAndSpanElementVerticalSizes();
const _URL_PATHS = new UrlPaths();
const _HREF_TYPES = new HrefTypes();

export class DivWithTimerElementWorkoutTypes extends DivWithTimerAbstractElement {

    constructor(div) {
        super(div);
    }

    showLoading() {
        super.showLoading();

        this.addInfoBlockContainerClassStyle();
    }

    async tryToCreateContent() {
        let div;

        let jsonResponse = await _WORKOUT_TYPES_API.GET.getAll(
            null, null, null, 0, 0);
        if (jsonResponse.getStatus() === _HTTP_STATUSES.OK) {
            div = document.createElement("div");

            let json = jsonResponse.getJson();

            // Высчитываем количество колонок и строк ---
            let numberOfColumns = 3;
            let numberOfRows = Math.ceil(json.length / numberOfColumns);

            let gridTemplateColumnsStr = "1fr";
            for (let i = 0; i < numberOfColumns - 1; i++) {
                gridTemplateColumnsStr += " 1fr";
            }

            let gridTemplateRowsStr = "1fr";
            for (let i = 0; i < numberOfRows - 1; i++) {
                gridTemplateRowsStr += " 1fr";
            }

            div.style.display = "grid";
            div.style.grid = `${gridTemplateRowsStr} / ${gridTemplateColumnsStr}`;
            div.style.gridAutoFlow = "row";
            div.style.gap = "10px";
            //---

            // Ищем пользователя (в зависимости от роли будет меняться доступ к кнопкам) ---
            let isSuperUser = false;
            let customerId = _PROJECT_COOKIES.CUSTOMER_ID.getValue();
            jsonResponse = await _CUSTOMERS_API.GET.validateIsSuperUser(customerId);

            isSuperUser = jsonResponse.getStatus() === _HTTP_STATUSES.OK;
            //---

            // Генерируем кнопки режимов тренировок ---
            for (let i = 0; i < numberOfColumns * numberOfRows; i++) {
                let aButtonWithImgAndSpanElement = new AButtonWithImgAndSpanElement(
                    null, null, null);
                aButtonWithImgAndSpanElement.changeAButtonWithImgAndTextElementSize(
                    _A_BUTTON_WITH_IMG_AND_SPAN_ELEMENT_VERTICAL_SIZE.SIZE_128);
                aButtonWithImgAndSpanElement.changeTo(_A_BUTTON_WITH_IMG_AND_SPAN_ELEMENT_TYPES.DEFAULT);
                aButtonWithImgAndSpanElement.changeSpanText("..");
                aButtonWithImgAndSpanElement.changeDisabledStatus(true, false);

                if (i < json.length) {
                    let workoutType = new WorkoutTypeResponseDTO(json[i]);

                    let pathToImage = workoutType.getPathToImage();
                    if (pathToImage) {
                        aButtonWithImgAndSpanElement.changeImgSrc(pathToImage);
                    }

                    aButtonWithImgAndSpanElement.changeSpanText(workoutType.getTitle());

                    let description = workoutType.getDescription();
                    let isPrepared = workoutType.getIsPrepared();
                    if (isPrepared) {
                        let isActive = workoutType.getIsActive();
                        if (isActive || isSuperUser) {
                            aButtonWithImgAndSpanElement.changeDisabledStatus(false, true);
                            aButtonWithImgAndSpanElement.changeTitle(description);

                            aButtonWithImgAndSpanElement.changeHref(
                                `${_URL_PATHS.WORKOUTS.PREPARE.getPath()}/${workoutType.getCode()}`);
                            aButtonWithImgAndSpanElement.changeHrefType(_HREF_TYPES.OPEN_IN_THIS_PAGE);
                        } else {
                            aButtonWithImgAndSpanElement.changeDisabledStatus(true, true);
                            aButtonWithImgAndSpanElement.changeTitle(`${description} (временно недоступно)`);
                        }
                    } else {
                        aButtonWithImgAndSpanElement.changeDisabledStatus(true, true);
                        aButtonWithImgAndSpanElement.changeTitle(`${description} (скоро)`);
                    }
                }

                let a = aButtonWithImgAndSpanElement.getA();
                if (a) {
                    div.appendChild(a);
                }
            }
            //---

            this.removeInfoBlockContainerClassStyle();
        } else {
            this.showMessage(new ResponseMessageResponseDTO(jsonResponse.getJson()).getMessage(),
                _CSS_ROOT.MEDIUM_FONT_SIZE_STYLE_ID);
        }

        return div;
    }
}