import {
    SpanElementLang
} from "../../../span/entity/lang/span_element_lang.js";

import {
    SpanElementCustomerCollection
} from "../../../span/entity/customer_collection/span_element_customer_collection.js";

import {
    DivWithImgAndDataBuilderElement
} from "../../data_builder/with_img/div_with_img_and_data_builder_element.js";

import {
    WorkoutsAPI
} from "../../../../api/entity/workouts_api.js";

import {
    HttpStatuses
} from "../../../../api/classes/http/http_statuses.js";

import {
    WorkoutResponseDTO
} from "../../../../dto/entity/workout/response/workout_response_dto.js";

import {
    AElementCustomer
} from "../../../a/entity/customer/a_element_customer.js";

import {
    DateParts
} from "../../../date_parts.js";

import {
    UrlPath
} from "../../../../url/path/url_path.js";

const _WORKOUTS_API = new WorkoutsAPI();

const _HTTP_STATUSES = new HttpStatuses();

export class DivElementWorkoutUtils {
    async createDivInfoById(workoutId, doNeedToShowSpanElementCustomer) {
        let div;

        if (workoutId) {
            let jsonResponse = await _WORKOUTS_API.GET.findById(workoutId);
            if (jsonResponse.getStatus() === _HTTP_STATUSES.OK) {
                let workoutResponseDTO = new WorkoutResponseDTO(jsonResponse.getJson());
                div = await this.createDivInfoByDTO(workoutResponseDTO, doNeedToShowSpanElementCustomer);
            }
        }

        return div;
    }

    async createDivInfoByDTO(workoutResponseDTOObj, doNeedToShowSpanElementCustomer) {
        let div;
        if (workoutResponseDTOObj) {
            let divWithImgAndDataBuilderElement = new DivWithImgAndDataBuilderElement(false);

            let workoutType = workoutResponseDTOObj.getWorkoutType();
            if (workoutType) {
                divWithImgAndDataBuilderElement.setImageSrc(new UrlPath(workoutType.getPathToImage()).createFullPath());
                divWithImgAndDataBuilderElement.setHeaderByStr(workoutType.getTitle());
            }

            // ID ---
            let id = workoutResponseDTOObj.getId();
            if (id) {
                divWithImgAndDataBuilderElement.addDataRowByStr("ID:", id);
            }
            //---

            // Количество слов ---
            let numberOfWords = workoutResponseDTOObj.getNumberOfWords();
            if (numberOfWords) {
                divWithImgAndDataBuilderElement.addDataRowByStr("Количество слов:", numberOfWords);
            }
            //---

            // Дата начала ---
            let dateOfStart = workoutResponseDTOObj.getDateOfStart();
            if (dateOfStart) {
                divWithImgAndDataBuilderElement.addDataRowByStr("Дата начала:",
                    new DateParts(dateOfStart).getDateWithTimeStr());
            }
            //---

            // Дата окончания (при наличии) ---
            let dateOfEnd = workoutResponseDTOObj.getDateOfEnd();
            if (dateOfEnd) {
                divWithImgAndDataBuilderElement.addDataRowByStr("Дата окончания:",
                    new DateParts(dateOfEnd).getDateWithTimeStr());
            }
            //---

            // Входящий язык ---
            let langIn = workoutResponseDTOObj.getLangIn();
            if (langIn) {
                let leftSpan = document.createElement("span");
                leftSpan.textContent = "Входящий язык:";

                let spanElementLang = new SpanElementLang(null);
                spanElementLang.setLangResponseDTO(langIn);
                await spanElementLang.prepare();
                await spanElementLang.fill();

                divWithImgAndDataBuilderElement.addDataRowBySpan(leftSpan, spanElementLang.getSpan());
            }
            //---

            // Выходящий язык ---
            let langOut = workoutResponseDTOObj.getLangOut();
            if (langOut) {
                let leftSpan = document.createElement("span");
                leftSpan.textContent = "Выходящий язык:";

                let spanElementLang = new SpanElementLang(null);
                spanElementLang.setLangResponseDTO(langOut);
                await spanElementLang.prepare();
                await spanElementLang.fill();

                divWithImgAndDataBuilderElement.addDataRowBySpan(leftSpan, spanElementLang.getSpan());
            }
            //---

            // Коллекция (при наличии)
            let customerCollection = workoutResponseDTOObj.getCustomerCollection();
            if (customerCollection) {
                let leftSpan = document.createElement("span");
                leftSpan.textContent = "Коллекция:";

                let spanElementCustomerCollection = new SpanElementCustomerCollection(null);
                spanElementCustomerCollection.setCustomerCollectionResponseDTO(customerCollection);
                await spanElementCustomerCollection.prepare();
                await spanElementCustomerCollection.fill();

                divWithImgAndDataBuilderElement.addDataRowBySpan(leftSpan, spanElementCustomerCollection.getSpan());
            }
            //---

            // Пользователь (при необходимости) ---
            if (doNeedToShowSpanElementCustomer) {
                let customer = workoutResponseDTOObj.getCustomer();
                if (customer) {
                    let leftSpan = document.createElement("span");
                    leftSpan.textContent = "Пользователь:";

                    // Ссылка на пользователя ---
                    let rightSpan;
                    let aElementCustomer = new AElementCustomer(null);
                    aElementCustomer.setCustomerResponseDTO(customer);

                    await aElementCustomer.prepare();
                    await aElementCustomer.fill();

                    let a = aElementCustomer.getA();
                    if (a) {
                        rightSpan = document.createElement("span");
                        rightSpan.appendChild(a);
                    }
                    //---

                    divWithImgAndDataBuilderElement.addDataRowBySpan(leftSpan, rightSpan);
                }

            }
            //---

            div = divWithImgAndDataBuilderElement.getDivWithImgAndDataContainer();
        }

        return div;
    }
}