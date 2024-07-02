import {
    DivAbstractElement
} from "../../abstracts/div_abstract_element.js";

import {
    RuleTypes
} from "../../../span/elements/rule/rule_types.js";

import {
    CssDivElement
} from "../../../../css/div/css_div_element.js";

import {
    CssImgSizes
} from "../../../../css/css_img_sizes.js";

import {
    CssRoot
} from "../../../../css/css_root.js";

const _CSS_DIV_ELEMENT = new CssDivElement();
const _CSS_IMG_SIZES = new CssImgSizes();
const _CSS_ROOT = new CssRoot();

const _RULE_TYPES = new RuleTypes();

export class DivElementWorkoutType extends DivAbstractElement {
    #workoutTypeResponseDTO;

    constructor(div) {
        super(div);
    }

    setWorkoutTypeResponseDTO(workoutTypeResponseDTOObj) {
        this.#workoutTypeResponseDTO = workoutTypeResponseDTOObj;
    }

    #checkCorrectValuesBeforeTryToCreateContent() {
        let isCorrect = true;

        let workoutTypeResponseDTO = this.#workoutTypeResponseDTO;
        if (!workoutTypeResponseDTO) {
            isCorrect = false;
            this.showRule(_RULE_TYPES.ERROR, "Не удалось сгенерировать название режима тренировки");
        }

        return isCorrect;
    }

    async tryToCreateContent() {
        let div;
        let isCorrect = this.#checkCorrectValuesBeforeTryToCreateContent();
        if (isCorrect) {
            let workoutTypeResponseDTO = this.#workoutTypeResponseDTO;
            if (workoutTypeResponseDTO) {
                div = document.createElement("div");
                div.classList.add(_CSS_DIV_ELEMENT.DIV_ELEMENT_HORIZONTAL_FLEX_CONTAINER_CENTER_CLASS_ID);

                // Изображение ---
                let divContentCenter = document.createElement("div");
                divContentCenter.classList.add(_CSS_DIV_ELEMENT.DIV_ELEMENT_CONTENT_CENTER_CLASS_ID);

                let img = document.createElement("img");
                img.classList.add(_CSS_IMG_SIZES.IMG_SIZE_64_CLASS_ID);
                img.src = workoutTypeResponseDTO.getPathToImage();
                divContentCenter.appendChild(img);

                div.appendChild(divContentCenter);
                //---

                // Название ---
                let span = document.createElement("span");
                span.style.fontSize = _CSS_ROOT.MEDIUM_FONT_SIZE_STYLE_ID;
                span.style.fontWeight = "bold";
                span.textContent = workoutTypeResponseDTO.getTitle();

                div.appendChild(span);
                //---
            }
        }

        return div;
    }
}