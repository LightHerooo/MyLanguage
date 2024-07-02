import {
    WorkoutTypesAPI
} from "../../../../api/entity/workout_types_api.js";

import {
    HttpStatuses
} from "../../../../api/classes/http/http_statuses.js";

import {
    WorkoutTypeResponseDTO
} from "../../../../dto/entity/workout_type/response/workout_type_response_dto.js";

import {
    SelectWithImgAbstractElement
} from "../../abstracts/with_img/select_with_img_abstract_element.js";

import {
    ImgSrcs
} from "../../../img_srcs.js";

const _WORKOUT_TYPES_API = new WorkoutTypesAPI();

const _IMG_SRCS = new ImgSrcs();
const _HTTP_STATUSES = new HttpStatuses();

export class SelectElementWorkoutTypes extends SelectWithImgAbstractElement {

    constructor(divContainer, select, img, doNeedToCreateFirstOption) {
        super(divContainer, select, img, doNeedToCreateFirstOption);
    }

    async createFirstOption() {
        let option = document.createElement("option");
        option.value = "";
        option.textContent = "Все";

        return option;
    }

    async createOptionsArr() {
        let optionsArr = [];

        let jsonResponse = await _WORKOUT_TYPES_API.GET.getAll(null, true, null, null, null);
        if (jsonResponse.getStatus() === _HTTP_STATUSES.OK) {
            let json = jsonResponse.getJson();
            for (let i = 0; i < json.length; i++) {
                let workoutType = new WorkoutTypeResponseDTO(json[i]);

                let option = document.createElement("option");
                option.value = workoutType.getCode();
                option.textContent = workoutType.getTitle();

                optionsArr.push(option);
            }
        }

        return optionsArr;
    }

    async changeImgSrc() {
        let img = this.getImg();
        if (img) {
            let src;
            let title;
            let workoutTypeCode = this.getSelectedValue();
            if (workoutTypeCode) {
                let jsonResponse = await _WORKOUT_TYPES_API.GET.findByCode(workoutTypeCode);
                if (jsonResponse.getStatus() === _HTTP_STATUSES.OK) {
                    let workoutType = new WorkoutTypeResponseDTO(jsonResponse.getJson());

                    src = workoutType.getPathToImage();
                    title = workoutType.getTitle();
                }
            }

            if (!src) {
                src = _IMG_SRCS.OTHER.EMPTY;
                title = "";
            }

            img.src = src;
            img.title = title;
        }
    }
}