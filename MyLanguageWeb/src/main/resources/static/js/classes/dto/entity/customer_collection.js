import {
    CustomerResponseDTO
} from "./customer.js";

import {
    LangResponseDTO
} from "./lang.js";

import {
    DateParts
} from "../../date_parts.js";

import {
    LongResponse
} from "../other/long_response.js";

import {
    HttpStatuses
} from "../../http_statuses.js";

import {
    WordsInCollectionAPI
} from "../../api/words_in_collection_api.js";

import {
    FlagElements
} from "../../flag_elements.js";

import {
    ImageSources
} from "../../image_sources.js";

import {
    CssDynamicInfoBlock
} from "../../css/info_blocks/css_dynamic_info_block.js";

const _WORDS_IN_COLLECTION_API = new WordsInCollectionAPI();

const _CSS_DYNAMIC_INFO_BLOCK = new CssDynamicInfoBlock();

const _HTTP_STATUSES = new HttpStatuses();
const _FLAG_ELEMENTS = new FlagElements();
const _IMAGE_SOURCES = new ImageSources();

export class CustomerCollectionResponseDTO {
    id;
    title;
    dateOfCreate;
    customer;
    lang;
    key;

    constructor(customerCollectionJson) {
        if (customerCollectionJson) {
            this.id = customerCollectionJson["id"];
            this.title = customerCollectionJson["title"];
            this.dateOfCreate = customerCollectionJson["date_of_create"];
            this.key = customerCollectionJson["key"];

            let customer = customerCollectionJson["customer"];
            if (customer) {
                this.customer = new CustomerResponseDTO(customer);
            }

            let lang = customerCollectionJson["lang"];
            if (lang) {
                this.lang = new LangResponseDTO(lang);
            }
        }
    }

    #createElement(differentElement) {
        let spanCollectionTitle = document.createElement("span");
        spanCollectionTitle.textContent = " " + this.title;

        differentElement.appendChild(_FLAG_ELEMENTS.SPAN.create(this.lang.country, false));
        differentElement.appendChild(spanCollectionTitle);
    }

    createDiv() {
        let div = document.createElement("div");
        this.#createElement(div);

        return div;
    }

    createSpan() {
        let span = document.createElement("span");
        this.#createElement(span);

        return span;
    }

    async createDivInfo() {
        let collectionInfoContainer = document.createElement("div");
        collectionInfoContainer.classList.add(
            _CSS_DYNAMIC_INFO_BLOCK.DIV_DYNAMIC_INFO_BLOCK_CONTAINER_STYLE_ID);

        // Генерируем левый контейнер ---
        let collectionInfoContainerLeft = document.createElement("div");
        collectionInfoContainerLeft.classList.add(
            _CSS_DYNAMIC_INFO_BLOCK.DIV_DYNAMIC_INFO_BLOCK_LEFT_CONTAINER_STYLE_ID);

        let collectionInfoImg = document.createElement("img");
        collectionInfoImg.classList.add(
            _CSS_DYNAMIC_INFO_BLOCK.IMG_IMG_DYNAMIC_INFO_BLOCK_STYLE_ID);
        collectionInfoImg.src = _IMAGE_SOURCES.CUSTOMER_COLLECTIONS.BOOKS;
        collectionInfoContainerLeft.appendChild(collectionInfoImg);

        collectionInfoContainer.appendChild(collectionInfoContainerLeft);
        //---

        // Генерируем правый контейнер ---
        let collectionInfoContainerRight = document.createElement("div");
        collectionInfoContainerRight.classList.add(
            _CSS_DYNAMIC_INFO_BLOCK.DIV_DYNAMIC_INFO_BLOCK_RIGHT_CONTAINER);
        //---

        // Название коллекции (с флагом) ---
        let h1CollectionName = document.createElement("h1");
        h1CollectionName.classList.add(
            _CSS_DYNAMIC_INFO_BLOCK.H1_H1_DYNAMIC_INFO_BLOCK_STYLE_ID);
        h1CollectionName.appendChild(this.createDiv());

        collectionInfoContainerRight.appendChild(h1CollectionName);
        //---

        // Дата создания ---
        let divDataRow = document.createElement("div");
        divDataRow.classList.add(_CSS_DYNAMIC_INFO_BLOCK.DIV_DYNAMIC_INFO_BLOCK_DATA_ROW_STYLE_ID);

        let spanInfoAboutData = document.createElement("span");
        spanInfoAboutData.classList.add(_CSS_DYNAMIC_INFO_BLOCK.SPAN_DATA_ROW_LEFT_TEXT_STYLE_ID);
        spanInfoAboutData.textContent = "Дата создания:";
        divDataRow.appendChild(spanInfoAboutData);

        let spanData = document.createElement("span");
        spanData.classList.add(_CSS_DYNAMIC_INFO_BLOCK.SPAN_DATA_ROW_RIGHT_TEXT_STYLE_ID);

        let dateOfCreate = new Date(this.dateOfCreate);
        let dateOfCreateParts = new DateParts(dateOfCreate);
        spanData.textContent = dateOfCreateParts.getDateStr();
        divDataRow.appendChild(spanData);

        collectionInfoContainerRight.appendChild(divDataRow);
        //---

        // Язык ---
        divDataRow = divDataRow.cloneNode(false);

        spanInfoAboutData = spanInfoAboutData.cloneNode(false);
        spanInfoAboutData.textContent = "Язык:";
        divDataRow.appendChild(spanInfoAboutData);

        spanData = spanData.cloneNode(false);
        spanData.appendChild(this.lang.createSpan());
        divDataRow.appendChild(spanData);

        collectionInfoContainerRight.appendChild(divDataRow);
        //---

        // Количество слов в коллекции ---
        let JSONResponse = await _WORDS_IN_COLLECTION_API.GET.getCountByCollectionKey(this.key);
        if (JSONResponse.status === _HTTP_STATUSES.OK) {
            divDataRow = divDataRow.cloneNode(false);

            spanInfoAboutData = spanInfoAboutData.cloneNode(false);
            spanInfoAboutData.textContent = "Количество слов:";
            divDataRow.appendChild(spanInfoAboutData);

            spanData = spanData.cloneNode(false);
            spanData.textContent = new LongResponse(JSONResponse.json).value;
            divDataRow.appendChild(spanData);

            collectionInfoContainerRight.appendChild(divDataRow);
        }
        //---

        // Ключ ---
        divDataRow = divDataRow.cloneNode(false);

        spanInfoAboutData = spanInfoAboutData.cloneNode(false);
        spanInfoAboutData.textContent = "Ключ:";
        divDataRow.appendChild(spanInfoAboutData);

        spanData = spanData.cloneNode(false);
        spanData.textContent = this.key;
        divDataRow.appendChild(spanData);

        collectionInfoContainerRight.appendChild(divDataRow);
        //---

        collectionInfoContainer.appendChild(collectionInfoContainerRight);

        return collectionInfoContainer;
    }
}

export class CustomerCollectionRequestDTO {
    title;
    langCode;
    workoutId;
    key;
}