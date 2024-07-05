import {
    WorkoutsAPI
} from "../../../../../../api/entity/workouts_api.js";

import {
    CssRoot
} from "../../../../../../css/css_root.js";

import {
    CssImgSizes
} from "../../../../../../css/css_img_sizes.js";

import {
    CssTableElement
} from "../../../../../../css/table/css_table_element.js";

import {
    CssDivElement
} from "../../../../../../css/div/css_div_element.js";

import {
    HttpStatuses
} from "../../../../../../api/classes/http/http_statuses.js";

import {
    TableAbstractElement
} from "../../../../abstracts/table_abstract_element.js";

import {
    FavouriteLangResponseDTO
} from "../../../../../../dto/entity/workout/types/favourite/favourite_lang_response_dto.js";

import {
    SpanFlagElement
} from "../../../../../span/elements/span_flag_element.js";

import {
    FavouriteWorkoutTypeResponseDTO
} from "../../../../../../dto/entity/workout/types/favourite/favourite_workout_type_response_dto.js";

import {
    FavouriteCustomerCollectionResponseDTO
} from "../../../../../../dto/entity/workout/types/favourite/favourite_customer_collection_response_dto.js";

import {
    UrlPaths
} from "../../../../../../url/path/url_paths.js";

const _WORKOUTS_API = new WorkoutsAPI();

const _CSS_ROOT = new CssRoot();
const _CSS_IMG_SIZES = new CssImgSizes();
const _CSS_TABLE_ELEMENT = new CssTableElement();
const _CSS_DIV_ELEMENT = new CssDivElement();

const _HTTP_STATUSES = new HttpStatuses();
const _URL_PATHS = new UrlPaths();

export class TableElementWorkoutsCustomerFavouritesStatistic extends TableAbstractElement{
    #customerId;
    #workoutTypeCode;
    #days;

    constructor(table, colgroup, thead, tbody) {
        super(table, colgroup, thead, tbody);
    }

    setCustomerId(customerId) {
        this.#customerId = customerId;
    }

    setWorkoutTypeCode(workoutTypeCode) {
        this.#workoutTypeCode = workoutTypeCode;
    }

    setDays(days) {
        this.#days = days;
    }


    async tryToCreateTrsArr(giveAccessToShowMessage) {
        let trsArr;

        // Получаем значения для поиска ---
        let customerId = this.#customerId;
        let workoutTypeCode = this.#workoutTypeCode;
        let days = this.#days;
        //---

        // Создаём строки для таблицы и отслеживаем количество ---
        let trForThead = document.createElement("tr");
        let trMainInfo = document.createElement("tr");
        let trDescription = document.createElement("tr");

        let numberOfColumns = 0;
        //---

        // Любимый входящий язык ---
        let jsonResponse = await _WORKOUTS_API.GET.findFavouriteLangIn(customerId, workoutTypeCode, days);
        if (jsonResponse.getStatus() === _HTTP_STATUSES.OK) {
            let favouriteLangResponseDTO = new FavouriteLangResponseDTO(jsonResponse.getJson());

            let lang = favouriteLangResponseDTO.getLang();
            if (lang) {
                // Заголовок колонки ---
                let th = document.createElement("th");
                th.textContent = "Любимый входящий язык";

                trForThead.appendChild(th);
                //---

                // Флаг ---
                let td = document.createElement("td");

                let divContentCenter = document.createElement("div");
                divContentCenter.classList.add(_CSS_DIV_ELEMENT.DIV_ELEMENT_CONTENT_CENTER_CLASS_ID);

                let divFlagContainer = document.createElement("div");
                divFlagContainer.style.width = "128px";
                divFlagContainer.style.height = "128px";

                let countryName;
                let countryCode;
                let country = lang.getCountry();
                if (country) {
                    countryName = country.getTitle();
                    countryCode = country.getCode();
                }

                let spanFlagElement = new SpanFlagElement(null);
                spanFlagElement.changeFlag(countryName, countryCode, false);

                let span = spanFlagElement.getSpan();
                if (span) {
                    span.style.width = "100%";
                    span.style.height = "100%";
                }

                divFlagContainer.appendChild(span);
                divContentCenter.appendChild(divFlagContainer);
                td.appendChild(divContentCenter);
                trMainInfo.appendChild(td);
                //---

                // Название + количество ---
                td = document.createElement("td");
                td.style.fontWeight = "bold";
                td.style.textAlign = "center";
                td.textContent = `${lang.getTitle()} (${favouriteLangResponseDTO.getNumberOfWorkouts()})`;

                trDescription.appendChild(td);
                //---

                numberOfColumns++;
            }
        }
        //---

        // Любимый выходящий язык ---
        jsonResponse = await _WORKOUTS_API.GET.findFavouriteLangOut(customerId, workoutTypeCode, days);
        if (jsonResponse.getStatus() === _HTTP_STATUSES.OK) {
            let favouriteLangResponseDTO = new FavouriteLangResponseDTO(jsonResponse.getJson());

            let lang = favouriteLangResponseDTO.getLang();
            if (lang) {
                // Заголовок колонки ---
                let th = document.createElement("th");
                th.textContent = "Любимый выходящий язык";

                trForThead.appendChild(th);
                //---

                // Флаг ---
                let td = document.createElement("td");

                let divContentCenter = document.createElement("div");
                divContentCenter.classList.add(_CSS_DIV_ELEMENT.DIV_ELEMENT_CONTENT_CENTER_CLASS_ID);

                let divFlagContainer = document.createElement("div");
                divFlagContainer.style.width = "128px";
                divFlagContainer.style.height = "128px";

                let countryName;
                let countryCode;
                let country = lang.getCountry();
                if (country) {
                    countryName = country.getTitle();
                    countryCode = country.getCode();
                }

                let spanFlagElement = new SpanFlagElement(null);
                spanFlagElement.changeFlag(countryName, countryCode, false);

                let span = spanFlagElement.getSpan();
                if (span) {
                    span.style.width = "100%";
                    span.style.height = "100%";
                }

                divFlagContainer.appendChild(span);
                divContentCenter.appendChild(divFlagContainer);
                td.appendChild(divContentCenter);
                trMainInfo.appendChild(td);
                //---

                // Название + количество ---
                td = document.createElement("td");
                td.style.fontWeight = "bold";
                td.style.textAlign = "center";
                td.textContent = `${lang.getTitle()} (${favouriteLangResponseDTO.getNumberOfWorkouts()})`;

                trDescription.appendChild(td);
                //---

                numberOfColumns++;
            }
        }
        //---

        // Любимый режим тренировки (выводим только тогда, когда не выбран конкретный) ---
        if (!workoutTypeCode) {
            jsonResponse = await _WORKOUTS_API.GET.findFavouriteWorkoutType(customerId, days);
            if (jsonResponse.getStatus() === _HTTP_STATUSES.OK) {
                let favouriteWorkoutTypeResponseDTO = new FavouriteWorkoutTypeResponseDTO(jsonResponse.getJson());

                let workoutType = favouriteWorkoutTypeResponseDTO.getWorkoutType();
                if (workoutType) {
                    // Заголовок колонки ---
                    let th = document.createElement("th");
                    th.textContent = "Любимый режим тренировки";

                    trForThead.appendChild(th);
                    //---

                    // Изображение режима тренировки ---
                    let td = document.createElement("td");

                    let divContentCenter = document.createElement("div");
                    divContentCenter.classList.add(_CSS_DIV_ELEMENT.DIV_ELEMENT_CONTENT_CENTER_CLASS_ID);

                    let img = document.createElement("img");
                    img.classList.add(_CSS_IMG_SIZES.IMG_SIZE_128_CLASS_ID);
                    img.src = workoutType.getPathToImage();

                    divContentCenter.appendChild(img);
                    td.appendChild(divContentCenter);
                    trMainInfo.appendChild(td);
                    //---

                    // Название + количество ---
                    td = document.createElement("td");
                    td.style.fontWeight = "bold";
                    td.style.textAlign = "center";
                    td.textContent = `${workoutType.getTitle()} (${favouriteWorkoutTypeResponseDTO.getNumberOfWorkouts()})`;

                    trDescription.appendChild(td);
                    //---

                    numberOfColumns++;
                }
            }
        }
        //---

        // Любимая коллекция ---
        jsonResponse = await _WORKOUTS_API.GET.findFavouriteCustomerCollection(customerId, workoutTypeCode, days);
        if (jsonResponse.getStatus() === _HTTP_STATUSES.OK) {
            let favouriteCustomerCollectionResponseDTO =
                new FavouriteCustomerCollectionResponseDTO(jsonResponse.getJson());

            let customerCollection = favouriteCustomerCollectionResponseDTO.getCustomerCollection();
            if (customerCollection) {
                // Заголовок колонки ---
                let th = document.createElement("th");
                th.textContent = "Любимая коллекция";

                trForThead.appendChild(th);
                //---

                // Изображение коллекции ---
                let td = document.createElement("td");

                let divContentCenter = document.createElement("div");
                divContentCenter.classList.add(_CSS_DIV_ELEMENT.DIV_ELEMENT_CONTENT_CENTER_CLASS_ID);

                let img = document.createElement("img");
                img.classList.add(_CSS_IMG_SIZES.IMG_SIZE_128_CLASS_ID);

                let pathToImage = customerCollection.getPathToImage();
                img.src = pathToImage
                    ? pathToImage
                    : _URL_PATHS.CUSTOMER_COLLECTIONS.IMAGE_DEFAULT.getPath();

                divContentCenter.appendChild(img)
                td.appendChild(divContentCenter);
                trMainInfo.appendChild(td);
                //---

                // Название + количество ---
                td = document.createElement("td");
                td.style.fontWeight = "bold";
                td.style.textAlign = "center";
                td.textContent = `${customerCollection.getTitle()} 
                    (${favouriteCustomerCollectionResponseDTO.getNumberOfWorkouts()})`;

                trDescription.appendChild(td);
                //---

                numberOfColumns++;
            }
        }
        //---

        if (numberOfColumns) {
            // Создаем новую таблицу на основе количества сгенерированных ячеек ---
            let table = document.createElement("table");
            table.classList.add(_CSS_TABLE_ELEMENT.TABLE_ELEMENT_CLASS_ID);
            //---

            // Создаем colgroup ---
            let colgroup = document.createElement("colgroup");

            let percentOfWidth = 100 / numberOfColumns;
            for (let i = 0; i < numberOfColumns; i++) {
                let col = document.createElement("col");
                col.style.width = `${percentOfWidth}%`;

                colgroup.appendChild(col);
            }

            table.appendChild(colgroup);
            //---

            // Создаем thead ---
            let thead = document.createElement("thead");
            thead.classList.add(_CSS_TABLE_ELEMENT.THEAD_TABLE_ELEMENT_SMALL_CLASS_ID);
            thead.appendChild(trForThead);

            table.appendChild(thead);
            //---

            // Создаем tbody ---
            let tbody = document.createElement("tbody");
            table.appendChild(tbody);
            //---

            this.setTable(table);
            this.setColgroup(colgroup);
            this.setThead(thead);
            this.setTbody(tbody);

            // Создаём массив строк для возвращения из функции ---
            trsArr = [];

            trsArr.push(trMainInfo);
            trsArr.push(trDescription);
            //---
        } else {
            this.buildNewTable();
            this.showMessage("Не удалось сгенерировать доплнительную статистику пользователя",
                _CSS_ROOT.MEDIUM_FONT_SIZE_STYLE_ID);
        }

        return trsArr;
    }
}