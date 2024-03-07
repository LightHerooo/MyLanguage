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
    CssCollectionInfo
} from "../../css/entity/css_collection_info.js";

import {
    FlagElements
} from "../../flag_elements.js";

import {
    ImageSources
} from "../../image_sources.js";

const _WORDS_IN_COLLECTION_API = new WordsInCollectionAPI();

const _HTTP_STATUSES = new HttpStatuses();
const _CSS_COLLECTION_INFO = new CssCollectionInfo();
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

        differentElement.appendChild(_FLAG_ELEMENTS.SPAN.create(this.lang.code, false));
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
            _CSS_COLLECTION_INFO.DIV_COLLECTION_INFO_CONTAINER_STYLE_ID);

        // Генерируем правый контейнер ---
        let collectionInfoContainerRight = document.createElement("div");
        collectionInfoContainerRight.classList.add(
            _CSS_COLLECTION_INFO.DIV_COLLECTION_INFO_RIGHT_CONTAINER_STYLE_ID);
        //---

        // Название коллекции (с флагом) ---
        let h1CollectionName = document.createElement("h1");
        h1CollectionName.classList.add(
            _CSS_COLLECTION_INFO.H1_COLLECTION_INFO_HEADER_STYLE_ID);
        h1CollectionName.appendChild(this.createDiv());

        collectionInfoContainerRight.appendChild(h1CollectionName);
        //---

        // Дата создания ---
        let dateOfCreate = new Date(this.dateOfCreate);
        let dateOfCreateParts = new DateParts(dateOfCreate);

        let spanCollectionDateOfCreateText = document.createElement("span")
        spanCollectionDateOfCreateText.classList.add(_CSS_COLLECTION_INFO.SPAN_COLLECTION_INFO_LEFT_TEXT_STYLE_ID);
        spanCollectionDateOfCreateText.textContent = "Дата создания: ";

        let spanCollectionDateOfCreate = document.createElement("span");
        spanCollectionDateOfCreate.classList.add(_CSS_COLLECTION_INFO.SPAN_COLLECTION_INFO_RIGHT_TEXT_STYLE_ID);
        spanCollectionDateOfCreate.textContent = dateOfCreateParts.getDateStr();

        let divCollectionDateOfCreate = document.createElement("div");
        divCollectionDateOfCreate.appendChild(spanCollectionDateOfCreateText);
        divCollectionDateOfCreate.appendChild(spanCollectionDateOfCreate);

        collectionInfoContainerRight.appendChild(divCollectionDateOfCreate);
        //---

        // Язык ---
        let spanLangText = document.createElement("span");
        spanLangText.classList.add(_CSS_COLLECTION_INFO.SPAN_COLLECTION_INFO_LEFT_TEXT_STYLE_ID);
        spanLangText.textContent = "Язык: ";

        let spanLangFlag = this.lang.createSpan();
        spanLangFlag.classList.add(_CSS_COLLECTION_INFO.SPAN_COLLECTION_INFO_RIGHT_TEXT_STYLE_ID);

        let divCollectionLang = document.createElement("div");
        divCollectionLang.appendChild(spanLangText);
        divCollectionLang.appendChild(spanLangFlag);

        collectionInfoContainerRight.appendChild(divCollectionLang);
        //---

        // Количество слов в коллекции ---
        let JSONResponse = await _WORDS_IN_COLLECTION_API.GET.getCountByCollectionKey(this.key);
        if (JSONResponse.status === _HTTP_STATUSES.OK) {
            let longResponse = new LongResponse(JSONResponse.json);

            let spanCollectionNumberOfWordsText = document.createElement("span");
            spanCollectionNumberOfWordsText.classList.add(_CSS_COLLECTION_INFO.SPAN_COLLECTION_INFO_LEFT_TEXT_STYLE_ID);
            spanCollectionNumberOfWordsText.textContent = "Количество слов: ";

            let spanCollectionNumberOfWords = document.createElement("span");
            spanCollectionNumberOfWords.classList.add(_CSS_COLLECTION_INFO.SPAN_COLLECTION_INFO_RIGHT_TEXT_STYLE_ID);
            spanCollectionNumberOfWords.textContent = longResponse.value;

            let divCollectionNumberOfWords = document.createElement("div");
            divCollectionNumberOfWords.appendChild(spanCollectionNumberOfWordsText);
            divCollectionNumberOfWords.appendChild(spanCollectionNumberOfWords);

            collectionInfoContainerRight.appendChild(divCollectionNumberOfWords);
        }
        //---

        // Ключ ---
        let spanCollectionKeyText = document.createElement("span");
        spanCollectionKeyText.classList.add(_CSS_COLLECTION_INFO.SPAN_COLLECTION_INFO_LEFT_TEXT_STYLE_ID);
        spanCollectionKeyText.textContent = "Ключ: ";

        let spanCollectionKey = document.createElement("span");
        spanCollectionKey.classList.add(_CSS_COLLECTION_INFO.SPAN_COLLECTION_INFO_RIGHT_TEXT_STYLE_ID);
        spanCollectionKey.textContent = this.key;

        let divCollectionKey = document.createElement("div");
        divCollectionKey.appendChild(spanCollectionKeyText);
        divCollectionKey.appendChild(spanCollectionKey);

        collectionInfoContainerRight.appendChild(divCollectionKey);
        //---

        // Генерируем левый контейнер ---
        let collectionInfoContainerLeft = document.createElement("div");
        collectionInfoContainerLeft.classList.add(
            _CSS_COLLECTION_INFO.DIV_COLLECTION_INFO_LEFT_CONTAINER_STYLE_ID);
        //---

        // Генерируем изображение ---
        let collectionInfoImg = document.createElement("img");
        collectionInfoImg.classList.add(
            _CSS_COLLECTION_INFO.IMG_IMG_COLLECTION_INFO_STYLE_ID);
        collectionInfoImg.src = _IMAGE_SOURCES.CUSTOMER_COLLECTIONS.BOOKS;

        collectionInfoContainerLeft.appendChild(collectionInfoImg);
        //---

        // Добавляем элементы в основной контейнер ---
        collectionInfoContainer.appendChild(collectionInfoContainerLeft);
        collectionInfoContainer.appendChild(collectionInfoContainerRight);
        //---

        return collectionInfoContainer;
    }
}

export class CustomerCollectionRequestDTO {
    title;
    langCode;
    workoutId;
    key;
}