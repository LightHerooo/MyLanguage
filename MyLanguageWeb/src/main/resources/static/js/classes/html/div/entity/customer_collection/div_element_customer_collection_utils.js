import {
    DivWithImgAndDataBuilderElement
} from "../../data_builder/with_img/div_with_img_and_data_builder_element.js";

import {
    SpanElementCustomerCollection
} from "../../../span/entity/customer_collection/span_element_customer_collection.js";

import {
    CustomerCollectionsAPI
} from "../../../../api/entity/customer_collections_api.js";

import {
    HttpStatuses
} from "../../../../api/classes/http/http_statuses.js";

import {
    SpanElementLang
} from "../../../span/entity/lang/span_element_lang.js";
import {
    CustomerCollectionResponseDTO
} from "../../../../dto/entity/customer_collection/response/customer_collection_response_dto.js";

import {
    ImgSrcs
} from "../../../img_srcs.js";

import {
    DateParts
} from "../../../date_parts.js";

const _CUSTOMER_COLLECTIONS_API = new CustomerCollectionsAPI();

const _IMG_SRCS = new ImgSrcs();
const _HTTP_STATUSES = new HttpStatuses();

export class DivElementCustomerCollectionUtils {
    async createDivInfoById(customerCollectionId) {
        let div;

        if (customerCollectionId) {
            let jsonResponse = await _CUSTOMER_COLLECTIONS_API.GET.findById(customerCollectionId);
            if (jsonResponse.getStatus() === _HTTP_STATUSES.OK) {
                let customerCollectionResponseDTO =
                    new CustomerCollectionResponseDTO(jsonResponse.getJson());
                div = await this.createDivInfoByDTO(customerCollectionResponseDTO);
            }
        }

        return div;
    }

    async createDivInfoByDTO(customerCollectionResponseDTOObj) {
        let divWithImgAndDataBuilderElement = new DivWithImgAndDataBuilderElement();
        divWithImgAndDataBuilderElement.setImageSrc(_IMG_SRCS.OTHER.BOOKS);

        let spanElementCustomerCollection = new SpanElementCustomerCollection(null);
        spanElementCustomerCollection.setCustomerCollectionResponseDTO(customerCollectionResponseDTOObj);
        await spanElementCustomerCollection.prepare();
        await spanElementCustomerCollection.fill();

        divWithImgAndDataBuilderElement.setHeaderBySpan(spanElementCustomerCollection.getSpan());

        // ID ---
        let id = customerCollectionResponseDTOObj.getId();
        if (id) {
            divWithImgAndDataBuilderElement.addDataRowByStr("ID:", id);
        }
        //---

        // Дата создания ---
        let dateOfCreate = customerCollectionResponseDTOObj.getDateOfCreate();
        if (dateOfCreate) {
            divWithImgAndDataBuilderElement.addDataRowByStr("Дата создания:",
                new DateParts(dateOfCreate).getDateStr());
        }
        //---

        // Язык ---
        let lang = customerCollectionResponseDTOObj.getLang();
        if (lang) {
            let leftSpan = document.createElement("span");
            leftSpan.textContent = "Язык:";

            let spanElementLang = new SpanElementLang(null);
            spanElementLang.setLangResponseDTO(lang);
            await spanElementLang.prepare();
            await spanElementLang.fill();

            divWithImgAndDataBuilderElement.addDataRowBySpan(leftSpan, spanElementLang.getSpan());
        }
        //---

        // Количество слов в коллекции ---
        divWithImgAndDataBuilderElement.addDataRowByStr("Количество слов:",
            customerCollectionResponseDTOObj.getNumberOfWords());
        //---

        return divWithImgAndDataBuilderElement.getDivWithImgAndDataContainer();
    }
}