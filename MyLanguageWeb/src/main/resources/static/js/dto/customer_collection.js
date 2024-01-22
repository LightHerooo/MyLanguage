import {
    CustomerResponseDTO
} from "./customer.js";

import {
    LangResponseDTO
} from "./lang.js";

import {
    CssInfoBlockWithImgAndHeader
} from "../classes/css/css_info_block_with_img_and_header.js";

import {
    DateElements
} from "../classes/date_elements.js";

import {
    LongResponse
} from "./other/long_response.js";

import {
    getJSONResponseCountOfWordsInCollectionByCollectionKey
} from "../api/words_in_collection.js";

import {
    HttpStatuses
} from "../classes/http_statuses.js";

const _HTTP_STATUSES = new HttpStatuses();
const _CSS_INFO_BLOCK_WITH_IMG_AND_HEADER = new CssInfoBlockWithImgAndHeader();

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
            this.customer = new CustomerResponseDTO(customerCollectionJson["customer"]);
            this.key = customerCollectionJson["key"];
            this.lang = new LangResponseDTO(customerCollectionJson["lang"]);
        }
    }

    async createDiv() {
        let collectionInfoContainer = document.createElement("div");
        collectionInfoContainer.classList.add(
            _CSS_INFO_BLOCK_WITH_IMG_AND_HEADER.DIV_INFO_BLOCK_WITH_IMG_AND_HEADER_CONTAINER_STYLE_ID);
        collectionInfoContainer.style.grid = "1fr / 180px 1fr";

        // Генерируем правый контейнер ---
        let collectionInfoContainerRight = document.createElement("div");
        collectionInfoContainerRight.classList.add(
            _CSS_INFO_BLOCK_WITH_IMG_AND_HEADER.DIV_INFO_BLOCK_WITH_IMG_AND_HEADER_RIGHT_CONTAINER_STYLE_ID);
        //---

        // Название коллекции (с флагом) ---
        let spanCollectionTitle = document.createElement("span");
        spanCollectionTitle.textContent = " " + this.title;

        let h1CollectionName = document.createElement("h1");
        h1CollectionName.classList.add(
            _CSS_INFO_BLOCK_WITH_IMG_AND_HEADER.H1_INFO_BLOCK_WITH_IMG_AND_HEADER_STYLE_ID);
        h1CollectionName.style.textAlign = "left";
        h1CollectionName.appendChild(this.lang.createSpanFlag());
        h1CollectionName.appendChild(spanCollectionTitle);

        collectionInfoContainerRight.appendChild(h1CollectionName);
        //---

        // Дата создания ---
        let dateOfCreate = new Date(this.dateOfCreate);
        let dateOfCreateElements = new DateElements(dateOfCreate);

        let spanCollectionDateOfCreateText = document.createElement("span")
        spanCollectionDateOfCreateText.textContent = "Дата создания: ";
        spanCollectionDateOfCreateText.style.fontWeight = "bold";

        let spanCollectionDateOfCreate = document.createElement("span");
        spanCollectionDateOfCreate.textContent = dateOfCreateElements.getDateStr();

        let divCollectionDateOfCreate = document.createElement("div");
        divCollectionDateOfCreate.classList.add(
            _CSS_INFO_BLOCK_WITH_IMG_AND_HEADER.DIV_INFO_BLOCK_WITH_IMG_AND_HEADER_TEXT_STYLE_ID);
        divCollectionDateOfCreate.style.marginTop = "-10px";
        divCollectionDateOfCreate.appendChild(spanCollectionDateOfCreateText);
        divCollectionDateOfCreate.appendChild(spanCollectionDateOfCreate);

        collectionInfoContainerRight.appendChild(divCollectionDateOfCreate);
        //---

        // Язык ---
        let spanLangText = document.createElement("span");
        spanLangText.textContent = "Язык: ";
        spanLangText.style.fontWeight = "bold";

        let divCollectionLang = document.createElement("div");
        divCollectionLang.classList.add(
            _CSS_INFO_BLOCK_WITH_IMG_AND_HEADER.DIV_INFO_BLOCK_WITH_IMG_AND_HEADER_TEXT_STYLE_ID);
        divCollectionLang.appendChild(spanLangText);
        divCollectionLang.appendChild(this.lang.createSpanLangWithFlag());

        collectionInfoContainerRight.appendChild(divCollectionLang);
        //---

        // Количество слов в коллекции ---
        let JSONResponse = await getJSONResponseCountOfWordsInCollectionByCollectionKey(this.key);
        if (JSONResponse.status === _HTTP_STATUSES.OK) {
            let longResponse = new LongResponse(JSONResponse.json);

            let spanCollectionNumberOfWordsText = document.createElement("span");
            spanCollectionNumberOfWordsText.textContent = "Количество слов: ";
            spanCollectionNumberOfWordsText.style.fontWeight = "bold";

            let spanCollectionNumberOfWords = document.createElement("span");
            spanCollectionNumberOfWords.textContent = longResponse.value;

            let divCollectionNumberOfWords = document.createElement("div");
            divCollectionNumberOfWords.classList.add(
                _CSS_INFO_BLOCK_WITH_IMG_AND_HEADER.DIV_INFO_BLOCK_WITH_IMG_AND_HEADER_TEXT_STYLE_ID);
            divCollectionNumberOfWords.appendChild(spanCollectionNumberOfWordsText);
            divCollectionNumberOfWords.appendChild(spanCollectionNumberOfWords);

            collectionInfoContainerRight.appendChild(divCollectionNumberOfWords);
        }
        //---

        // Ключ ---
        let spanCollectionKeyText = document.createElement("span");
        spanCollectionKeyText.style.fontWeight = "bold";
        spanCollectionKeyText.textContent = "Ключ: ";

        let spanCollectionKey = document.createElement("span");
        spanCollectionKey.textContent = this.key;

        let divCollectionKey = document.createElement("div");
        divCollectionKey.classList.add(
            _CSS_INFO_BLOCK_WITH_IMG_AND_HEADER.DIV_INFO_BLOCK_WITH_IMG_AND_HEADER_TEXT_STYLE_ID);
        divCollectionKey.appendChild(spanCollectionKeyText);
        divCollectionKey.appendChild(spanCollectionKey);

        collectionInfoContainerRight.appendChild(divCollectionKey);
        //---

        // Генерируем левый контейнер ---
        let collectionInfoContainerLeft = document.createElement("div");
        collectionInfoContainerLeft.classList.add(
            _CSS_INFO_BLOCK_WITH_IMG_AND_HEADER.DIV_INFO_BLOCK_WITH_IMG_AND_HEADER_LEFT_CONTAINER_STYLE_ID);
        //---

        // Генерируем изображение ---
        let collectionInfoImg = document.createElement("img");
        collectionInfoImg.classList.add(
            _CSS_INFO_BLOCK_WITH_IMG_AND_HEADER.IMG_INFO_BLOCK_WITH_IMG_AND_HEADER_STYLE_ID);
        collectionInfoImg.src = "/images/customer_collections/books.png";

        collectionInfoContainerLeft.appendChild(collectionInfoImg);
        //---

        // Добавляем элементы в основной контейнер ---
        collectionInfoContainer.appendChild(collectionInfoContainerLeft);
        collectionInfoContainer.appendChild(collectionInfoContainerRight);
        //---

        return collectionInfoContainer;
    }

    async changeDiv(oldDivElement) {
        oldDivElement.replaceChildren();

        let newDiv = await this.createDiv();
        for (let childItem of newDiv.childNodes) {
            oldDivElement.appendChild(childItem);
        }

        return oldDivElement;
    }
}

export class CustomerCollectionRequestDTO {
    title;
    langCode;

    constructor(title, langCode) {
        this.title = title;
        this.langCode = langCode;
    }
}