import {
    DivElementTimer
} from "../../elements/div_element_timer.js";

import {
    CustomTimerTickerTypes
} from "../../../../timer/ticker/custom_timer_ticker_types.js";

import {
    UrlPaths
} from "../../../../url/path/url_paths.js";

import {
    UrlPath
} from "../../../../url/path/url_path.js";

import {
    WorkoutsAPI
} from "../../../../api/entity/workouts_api.js";

import {
    EntityIdRequestDTO
} from "../../../../dto/other/request/entity/entity_id_request_dto.js";

const _WORKOUTS_API = new WorkoutsAPI();

const _CUSTOM_TIMER_TICKER_TYPES = new CustomTimerTickerTypes();
const _URL_PATHS = new UrlPaths();

export class DivElementTimerWorkout extends DivElementTimer {
    #workoutResponseDTO;

    constructor(divElementTimerObj) {
        super(divElementTimerObj.getDiv(), divElementTimerObj.getRootFontSize());
    }

    setWorkoutResponseDTO(workoutResponseDTOObj) {
        this.#workoutResponseDTO = workoutResponseDTOObj;
    }

    changeStartMillisecondsByWorkout() {
        let workoutResponseDTO = this.#workoutResponseDTO;
        if (workoutResponseDTO) {
            this.changeStartMilliseconds(workoutResponseDTO.getCurrentMilliseconds());
        }
    }

    async prepare() {
        await super.prepare();

        this.setDoNeedHours(false);
        this.setDoNeedMinutes(true);
        this.setDoNeedSeconds(true);
        this.setDoNeedMilliseconds(false);

        let customTimerTicker = this.getCustomTimerTicker();
        if (customTimerTicker) {
            let self = this;
            let oldHandler = customTimerTicker.getHandler();
            customTimerTicker.setHandler(async function() {
                await oldHandler();

                // Если таймер идёт в обратном порядке, мы должны вовремя отключить его и завершить тренировку
                let workoutResponseDTO = self.#workoutResponseDTO;
                let customTimerTickerType = self.getCustomTimerTickerType();
                let currentMilliseconds = self.getCurrentMilliseconds();
                if (workoutResponseDTO
                    && customTimerTickerType === _CUSTOM_TIMER_TICKER_TYPES.BACKWARD
                    && currentMilliseconds <= 0n
                    && customTimerTicker.getIsActive()) {
                    self.stop();

                    let workoutId = workoutResponseDTO.getId();
                    let entityIdRequestDTO = new EntityIdRequestDTO();
                    entityIdRequestDTO.setId(workoutId);

                    await _WORKOUTS_API.PATCH.close(entityIdRequestDTO);

                    window.onbeforeunload = null;

                    let path = _URL_PATHS.WORKOUTS.INFO.getPath();
                    let urlPath = new UrlPath(`${path}/${workoutId}`);
                    urlPath.replace(false);
                }
                //---
            })
        }
    }
}