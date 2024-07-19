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
    DateParts
} from "../../../date_parts.js";

import {
    DivWithTimerAbstractElement
} from "../../abstracts/div_with_timer_abstract_element.js";

import {
    CssRoot
} from "../../../../css/css_root.js";

import {
    UrlPath
} from "../../../../url/path/url_path.js";

import {
    ImgSrcs
} from "../../../img_srcs.js";

const _CUSTOMER_COLLECTIONS_API = new CustomerCollectionsAPI();

const _CSS_ROOT = new CssRoot();

const _HTTP_STATUSES = new HttpStatuses();
const _IMG_SRCS = new ImgSrcs();

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
        let divWithImgAndDataBuilderElement = new DivWithImgAndDataBuilderElement(true);

        // Изображение ---
        let pathToImage = customerCollectionResponseDTOObj.getPathToImage();
        divWithImgAndDataBuilderElement.setImageSrc(pathToImage
            ? new UrlPath(pathToImage).createFullPath()
            : _IMG_SRCS.ENTITY.CUSTOMER_COLLECTION.DEFAULT);
        //---

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

        // Описание ---
        let description = customerCollectionResponseDTOObj.getDescription();
        if (description) {
            let divWithTimerElementCustomerCollectionDescription =
                new DivWithTimerElementCustomerCollectionDescription(null);
            divWithTimerElementCustomerCollectionDescription.setDescription(description);
            await divWithTimerElementCustomerCollectionDescription.prepare();

            divWithImgAndDataBuilderElement.addSpanShowMore(divWithTimerElementCustomerCollectionDescription
                , "Показать описание...", "Скрыть описание...");
        }
        //---

        return divWithImgAndDataBuilderElement.getDivWithImgAndDataContainer();
    }
}

class DivWithTimerElementCustomerCollectionDescription extends DivWithTimerAbstractElement {
    #description;

    constructor(div) {
        super(div);
    }

    setDescription(description) {
        this.#description = description;
    }

    async tryToCreateContent() {
        let div;

        let description = this.#description;
        if (description) {
            div = document.createElement("div");
            div.style.fontSize = _CSS_ROOT.SMALL_FONT_SIZE_STYLE_ID;
            div.style.whiteSpace = "pre-wrap";

            div.textContent = description;
        } else {
            this.showMessage("Описание отсутствует", _CSS_ROOT.SMALL_FONT_SIZE_STYLE_ID);
        }

        return div;
    }
}