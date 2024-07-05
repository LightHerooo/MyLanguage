import {
    DivWithTimerAbstractElement
} from "../../abstracts/div_with_timer_abstract_element.js";

import {
    RuleTypes
} from "../../../span/elements/rule/rule_types.js";

import {
    AButtonWithImgAndSpanElement
} from "../../../a/a_button/with_img_and_span/a_button_with_img_and_span_element.js";

import {
    AButtonWithImgAndSpanElementVerticalSizes
} from "../../../a/a_button/with_img_and_span/sizes/a_button_with_img_and_span_element_vertical_sizes.js";

import {
    AButtonWithImgAndSpanElementTypes
} from "../../../a/a_button/with_img_and_span/a_button_with_img_and_span_types.js";

import {
    UrlPaths
} from "../../../../url/path/url_paths.js";

import {
    HrefTypes
} from "../../../a/href_types.js";

import {
    ButtonWithImgAndSpanElement
} from "../../../button/with_img_and_span/button_with_img_and_span_element.js";

import {
    ButtonWithImgAndSpanElementVerticalSizes
} from "../../../button/with_img_and_span/sizes/button_with_img_and_span_element_vertical_sizes.js";

import {
    ButtonWithImgAndSpanElementTypes
} from "../../../button/with_img_and_span/button_with_img_and_span_element_types.js";

import {
    ButtonWithImgAndSpanElementDoubleClick
} from "../../../button/with_img_and_span/button_with_img_and_span_element_double_click.js";

import {
    ResponseMessageResponseDTO
} from "../../../../dto/other/response/response_message_response_dto.js";

import {
    CustomerCollectionsAPI
} from "../../../../api/entity/customer_collections_api.js";

import {
    HttpStatuses
} from "../../../../api/classes/http/http_statuses.js";

import {
    CssRoot
} from "../../../../css/css_root.js";

import {
    CustomerCollectionResponseDTO
} from "../../../../dto/entity/customer_collection/response/customer_collection_response_dto.js";

import {
    EntityIdRequestDTO
} from "../../../../dto/other/request/entity/entity_id_request_dto.js";

import {
    ImgSrcs
} from "../../../img_srcs.js";

const _CUSTOMER_COLLECTIONS_API = new CustomerCollectionsAPI();

const _CSS_ROOT = new CssRoot();

const _RULE_TYPES = new RuleTypes();
const _A_BUTTON_WITH_IMG_AND_SPAN_ELEMENT_VERTICAL_SIZES = new AButtonWithImgAndSpanElementVerticalSizes();
const _A_BUTTON_WITH_IMG_AND_SPAN_ELEMENT_TYPES = new AButtonWithImgAndSpanElementTypes();
const _BUTTON_WITH_IMG_AND_SPAN_ELEMENT_VERTICAL_SIZES = new ButtonWithImgAndSpanElementVerticalSizes();
const _BUTTON_WITH_IMG_AND_SPAN_ELEMENT_TYPES = new ButtonWithImgAndSpanElementTypes();
const _URL_PATHS = new UrlPaths();
const _HREF_TYPES = new HrefTypes();
const _IMG_SRCS = new ImgSrcs();
const _HTTP_STATUSES = new HttpStatuses();

export class DivWithTimerElementWorkoutActions extends DivWithTimerAbstractElement {
    #workoutResponseDTO;

    constructor(div) {
        super(div);
    }

    setWorkoutResponseDTO(workoutResponseDTOObj) {
        this.#workoutResponseDTO = workoutResponseDTOObj;
    }


    #checkCorrectValuesBeforeTryToCreateContent() {
        let isCorrect = true;

        let workoutResponseDTO = this.#workoutResponseDTO;
        if (!workoutResponseDTO) {
            isCorrect = false;
            this.showRule(_RULE_TYPES.ERROR, "Не удалось сгенерировать действия для тренировки");
        }

        return isCorrect;
    }


    showLoading() {
        super.showLoading();

        this.addInfoBlockContainerClassStyle();
    }

    async tryToCreateContent() {
        let div;

        let isCorrect = this.#checkCorrectValuesBeforeTryToCreateContent();
        if (isCorrect) {
            let workoutResponseDTO = this.#workoutResponseDTO;
            if (workoutResponseDTO) {
                let actionsArr = [];

                // Кнопка "Новая тренировка" ---
                let aButtonWithImgAndTextElement = new AButtonWithImgAndSpanElement(
                    null, null, null);
                aButtonWithImgAndTextElement.changeAButtonWithImgAndTextElementSize(
                    _A_BUTTON_WITH_IMG_AND_SPAN_ELEMENT_VERTICAL_SIZES.SIZE_128)
                aButtonWithImgAndTextElement.changeTo(_A_BUTTON_WITH_IMG_AND_SPAN_ELEMENT_TYPES.DEFAULT);

                let pathToImage;
                let spanText = "Новая тренировка";
                let href = _URL_PATHS.WORKOUTS.MAIN.getPath();

                let workoutType = workoutResponseDTO.getWorkoutType();
                if (workoutType) {
                    pathToImage = workoutType.getPathToImage();
                    spanText = `${spanText} "${workoutType.getTitle()}"`;
                    href = `${href}/${workoutType.getCode()}`;
                }

                if (pathToImage) {
                    aButtonWithImgAndTextElement.changeImgSrc(pathToImage);
                }
                aButtonWithImgAndTextElement.changeSpanText(spanText);
                aButtonWithImgAndTextElement.changeHref(href);
                aButtonWithImgAndTextElement.changeHrefType(_HREF_TYPES.OPEN_IN_THIS_PAGE);

                let a = aButtonWithImgAndTextElement.getA();
                if (a) {
                    actionsArr.push(a);
                }
                //---

                // Кнопка "Создать коллекцию на основе тренировки" ---
                if (workoutResponseDTO.getDateOfEnd()) {
                    let buttonWithImgAndTextElement = new ButtonWithImgAndSpanElement(
                        null, null, null);
                    let buttonWithImgAndTextElementDoubleClick =
                        new ButtonWithImgAndSpanElementDoubleClick(buttonWithImgAndTextElement);
                    buttonWithImgAndTextElementDoubleClick.changeButtonWithImgAndSpanElementSize(
                        _BUTTON_WITH_IMG_AND_SPAN_ELEMENT_VERTICAL_SIZES.SIZE_128);
                    buttonWithImgAndTextElementDoubleClick.changeTo(_BUTTON_WITH_IMG_AND_SPAN_ELEMENT_TYPES.DEFAULT);
                    buttonWithImgAndTextElementDoubleClick.changeImgSrc(_IMG_SRCS.OTHER.BOOKS);
                    buttonWithImgAndTextElementDoubleClick.changeSpanText("Создать новую коллекцию на основе слов тренировки");
                    buttonWithImgAndTextElementDoubleClick.setAfterDoubleClickFunction(async function() {
                        buttonWithImgAndTextElementDoubleClick.turnOff(true);

                        let entityIdRequestDTO = new EntityIdRequestDTO();
                        entityIdRequestDTO.setId(workoutResponseDTO.getId());

                        let jsonResponse = await _CUSTOMER_COLLECTIONS_API.POST.addByWorkout(entityIdRequestDTO);
                        if (jsonResponse.getStatus() === _HTTP_STATUSES.OK) {
                            let customerCollection =
                                new CustomerCollectionResponseDTO(jsonResponse.getJson());
                            buttonWithImgAndTextElementDoubleClick.changeTo(_BUTTON_WITH_IMG_AND_SPAN_ELEMENT_TYPES.ACCEPT);
                            buttonWithImgAndTextElementDoubleClick.changeSpanText(
                                `Коллекция "${customerCollection.getTitle()}" успешно создана!`);
                        } else {
                            buttonWithImgAndTextElementDoubleClick.changeTo(_BUTTON_WITH_IMG_AND_SPAN_ELEMENT_TYPES.DENY);

                            let message = new ResponseMessageResponseDTO(jsonResponse.getJson());
                            buttonWithImgAndTextElementDoubleClick.changeSpanText(message.getMessage());
                        }

                        buttonWithImgAndTextElementDoubleClick.changeDisabledStatus(false);
                    })
                    buttonWithImgAndTextElementDoubleClick.prepare();

                    let button = buttonWithImgAndTextElementDoubleClick.getButton();
                    if (button) {
                        actionsArr.push(button);
                    }
                }
                //---

                if (actionsArr.length > 0) {
                    // Генерируем столько колонок, сколько кнопок ---
                    div = document.createElement("div");
                    div.style.display = "grid";
                    div.style.gap = "5px";

                    let gridColumnsStr = "1fr";
                    for (let i = 0; i < actionsArr.length - 1; i++) {
                        gridColumnsStr = gridColumnsStr + " 1fr";
                    }

                    div.style.grid = `1fr / ${gridColumnsStr}`;

                    for (let i = 0; i < actionsArr.length; i++) {
                        div.appendChild(actionsArr[i]);
                    }

                    let divParent = this.getDiv();
                    if (divParent) {
                        divParent.style.display = "grid";

                        this.removeInfoBlockContainerClassStyle();
                    }
                    //---
                } else {
                    this.showMessage("Нет действий для тренировки", _CSS_ROOT.MEDIUM_FONT_SIZE_STYLE_ID);
                }
            }
        }

        return div;
    }
}