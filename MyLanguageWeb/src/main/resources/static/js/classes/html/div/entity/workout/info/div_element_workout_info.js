import {
    DivAbstractElement
} from "../../../abstracts/div_abstract_element.js";

import {
    DivElementWorkoutUtils
} from "../div_element_workout_utils.js";

import {
    CssRoot
} from "../../../../../css/css_root.js";

const _CSS_ROOT = new CssRoot();

const _DIV_ELEMENT_WORKOUT_UTILS = new DivElementWorkoutUtils();

export class DivElementWorkoutInfo extends DivAbstractElement {
    #workoutId;
    #workoutResponseDTO;
    #doNeedToShowSpanElementCustomer;

    constructor(div) {
        super(div);
    }

    setWorkoutId(workoutId) {
        this.#workoutId = workoutId;
    }

    setWorkoutResponseDTO(workoutResponseDTOObj) {
        this.#workoutResponseDTO = workoutResponseDTOObj;
    }

    setDoNeedToShowSpanElementCustomer(doNeedToShowSpanElementCustomer) {
        this.#doNeedToShowSpanElementCustomer = doNeedToShowSpanElementCustomer;
    }

    async tryToCreateContent() {
        let div;

        let workoutResponseDTO = this.#workoutResponseDTO;
        let workoutId = this.#workoutId;
        let doNeedToShowSpanElementCustomer = this.#doNeedToShowSpanElementCustomer;
        if (workoutResponseDTO) {
            div = _DIV_ELEMENT_WORKOUT_UTILS.createDivInfoByDTO(workoutResponseDTO, doNeedToShowSpanElementCustomer);
        } else if (workoutId) {
            div = _DIV_ELEMENT_WORKOUT_UTILS.createDivInfoById(workoutId, doNeedToShowSpanElementCustomer);
        }

        if (!div) {
            this.showMessage("Не удалось отобразить информацию о тренировке", _CSS_ROOT.MEDIUM_FONT_SIZE_STYLE_ID);
        }

        return div;
    }
}