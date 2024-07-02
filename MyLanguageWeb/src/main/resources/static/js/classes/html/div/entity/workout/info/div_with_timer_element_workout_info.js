import {
    DivWithTimerAbstractElement
} from "../../../with_timer/abstracts/div_with_timer_abstract_element.js";

import {
    DivElementWorkoutUtils
} from "../div_element_workout_utils.js";

import {
    RuleTypes
} from "../../../../span/elements/rule/rule_types.js";

const _DIV_ELEMENT_WORKOUT_UTILS = new DivElementWorkoutUtils();
const _RULE_TYPES = new RuleTypes();

export class DivWithTimerElementWorkoutInfo extends DivWithTimerAbstractElement {
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
            this.showRule(_RULE_TYPES.ERROR, "Не удалось отобразить информацию о тренировке");
        }

        return div;
    }
}