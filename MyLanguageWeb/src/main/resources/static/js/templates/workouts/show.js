import {
    DivWithTimerElementWorkoutTypes
} from "../../classes/html/div/entity/workout_type/div_with_timer_element_workout_types.js";

const _GENERAL_TIMEOUT = 250;

// Контейнер "Режимы тренировок" ---
let _divWithTimerElementWorkoutTypes;
//---

window.onload = async function () {
    await prepareDivWithTimerElementWorkoutTypes();

    if (_divWithTimerElementWorkoutTypes) {
        _divWithTimerElementWorkoutTypes.startToFill();
    }
}

// Контейнер "Режимы тренировок" ---
async function prepareDivWithTimerElementWorkoutTypes() {
    let div = document.getElementById("div_workout_types");
    if (div) {
        _divWithTimerElementWorkoutTypes = new DivWithTimerElementWorkoutTypes(div);
        _divWithTimerElementWorkoutTypes.setTimeout(_GENERAL_TIMEOUT);

        await _divWithTimerElementWorkoutTypes.prepare();
    }
}
//---