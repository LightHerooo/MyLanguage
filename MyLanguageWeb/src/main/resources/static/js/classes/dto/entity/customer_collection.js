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

import {
    CustomResponseMessage
} from "../other/custom_response_message.js";

import {
    CssMain
} from "../../css/css_main.js";

import {
    CssRoot
} from "../../css/css_root.js";

import {
    GlobalCookies
} from "../../global_cookies.js";

import {
    CustomerCollectionsAPI
} from "../../api/customer_collections_api.js";

import {
    AButtons
} from "../../a_buttons/a_buttons.js";

import {
    AButtonImgSizes
} from "../../a_buttons/a_button_img_sizes.js";

const _CUSTOMER_COLLECTIONS_API = new CustomerCollectionsAPI();
const _WORDS_IN_COLLECTION_API = new WordsInCollectionAPI();

const _CSS_MAIN = new CssMain();
const _CSS_ROOT = new CssRoot();
const _CSS_DYNAMIC_INFO_BLOCK = new CssDynamicInfoBlock();

const _HTTP_STATUSES = new HttpStatuses();
const _FLAG_ELEMENTS = new FlagElements();
const _IMAGE_SOURCES = new ImageSources();
const _GLOBAL_COOKIES = new GlobalCookies();
const _A_BUTTONS = new AButtons();
const _A_BUTTON_IMG_SIZES = new AButtonImgSizes();

export class CustomerCollectionResponseDTO {
    id;
    title;
    dateOfCreate;
    isActiveForAuthor;
    customer;
    lang;

    constructor(customerCollectionJson) {
        if (customerCollectionJson) {
            this.id = customerCollectionJson["id"];
            this.title = customerCollectionJson["title"];
            this.dateOfCreate = customerCollectionJson["date_of_create"];
            this.isActiveForAuthor = customerCollectionJson["is_active_for_author"];

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

        // ID ---
        let divDataRow = document.createElement("div");
        divDataRow.classList.add(_CSS_DYNAMIC_INFO_BLOCK.DIV_DYNAMIC_INFO_BLOCK_DATA_ROW_STYLE_ID);

        let spanInfoAboutData = document.createElement("span");
        spanInfoAboutData.classList.add(_CSS_DYNAMIC_INFO_BLOCK.SPAN_DATA_ROW_LEFT_TEXT_STYLE_ID);
        spanInfoAboutData.textContent = "ID:";
        divDataRow.appendChild(spanInfoAboutData);

        let spanData = document.createElement("span");
        spanData.classList.add(_CSS_DYNAMIC_INFO_BLOCK.SPAN_DATA_ROW_RIGHT_TEXT_STYLE_ID);
        spanData.textContent = `${this.id}`;
        divDataRow.appendChild(spanData);

        collectionInfoContainerRight.appendChild(divDataRow);
        //---

        // Дата создания ---
        divDataRow = divDataRow.cloneNode(false);

        spanInfoAboutData = spanInfoAboutData.cloneNode(false);
        spanInfoAboutData.textContent = "Дата создания:";
        divDataRow.appendChild(spanInfoAboutData);

        spanData = spanData.cloneNode(false);

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
        let JSONResponse = await _WORDS_IN_COLLECTION_API.GET.getCountByCollectionId(this.id);
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

        collectionInfoContainer.appendChild(collectionInfoContainerRight);

        return collectionInfoContainer;
    }

    async tryToCreateDivInfoAfterValidate() {
        let isCorrect = true;
        let message;

        // Проверяем авторство пользователя к коллекции ---
        let authId = _GLOBAL_COOKIES.AUTH_ID.getValue();
        let JSONResponse = await
            _CUSTOMER_COLLECTIONS_API.GET.validateIsAuthor(authId, this.id);
        if (JSONResponse.status !== _HTTP_STATUSES.OK) {
            isCorrect = false;
            message = new CustomResponseMessage(JSONResponse.json).text;
        }
        //---

        // Проверяем активность языка коллекции ---
        if (isCorrect === true) {
            JSONResponse = await _CUSTOMER_COLLECTIONS_API.GET.validateIsLangActiveById(this.id);
            if (JSONResponse.status !== _HTTP_STATUSES.OK) {
                isCorrect = false;
                message = new CustomResponseMessage(JSONResponse.json).text;
            }
        }
        //---

        // Проверяем активность коллекции для автора ---
        if (isCorrect === true) {
            JSONResponse = await _CUSTOMER_COLLECTIONS_API.GET.validateIsActiveForAuthorByCollectionId(this.id);
            if (JSONResponse.status !== _HTTP_STATUSES.OK) {
                isCorrect = false;
                message = new CustomResponseMessage(JSONResponse.json).text;
            }
        }
        //---

        if (isCorrect === true) {
            return await this.createDivInfo();
        } else {
            let divMessage = document.createElement("div");
            divMessage.classList.add(_CSS_MAIN.DIV_CONTENT_CENTER_STANDARD_STYLE_ID);
            divMessage.style.fontSize = _CSS_ROOT.SECOND_FONT_SIZE;
            divMessage.textContent = message;

            return divMessage;
        }
    }
}

export class CustomerCollectionRequestDTO {
    id;
    title;
    langCode;
    workoutId;
    isActiveForAuthor;
}