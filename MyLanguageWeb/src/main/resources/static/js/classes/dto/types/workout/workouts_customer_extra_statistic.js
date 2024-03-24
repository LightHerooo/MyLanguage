import {
    LangResponseDTO
} from "../../entity/lang.js";

import {
    WorkoutTypeResponseDTO
} from "../../entity/workout_type/workout_type.js";

import {
    CustomerCollectionResponseDTO
} from "../../entity/customer_collection.js";

import {
    CssMain
} from "../../../css/css_main.js";

import {
    CssRoot
} from "../../../css/css_root.js";

import {
    TimeParts
} from "../../../time_parts.js";

import {
    WorkoutAnswersStatistic
} from "./workout_answers_statistic.js";

import {
    FlagElements
} from "../../../flag_elements.js";

import {
    ImageSources
} from "../../../image_sources.js";

import {
    CustomerResponseDTO
} from "../../entity/customer.js";

const _CSS_MAIN = new CssMain();
const _CSS_ROOT = new CssRoot();

const _FLAG_ELEMENTS = new FlagElements();
const _IMAGE_SOURCES = new ImageSources();

export class WorkoutsCustomerExtraStatisticResponseDTO {
    numberOfMilliseconds;
    numberOfWorkouts;
    numberOfRounds;

    customer;
    workoutAnswersStatistic;
    favouriteLangIn;
    favouriteLangOut;
    favouriteWorkoutType;
    favouriteCustomerCollection;

    constructor(workoutsStatisticJson) {
        this.numberOfMilliseconds = workoutsStatisticJson["number_of_milliseconds"];
        this.numberOfWorkouts = workoutsStatisticJson["number_of_workouts"];
        this.numberOfRounds = workoutsStatisticJson["number_of_rounds"];

        let customer = workoutsStatisticJson["customer"];
        if (customer) {
            this.customer = new CustomerResponseDTO(customer);
        }

        let workoutAnswersStatistic = workoutsStatisticJson["workout_answers_statistic"];
        if (workoutAnswersStatistic) {
            this.workoutAnswersStatistic = new WorkoutAnswersStatistic(workoutAnswersStatistic);
        }

        let favouriteLangIn = workoutsStatisticJson["favourite_lang_in"];
        if (favouriteLangIn) {
            this.favouriteLangIn = new LangResponseDTO(favouriteLangIn);
        }

        let favouriteLangOut = workoutsStatisticJson["favourite_lang_out"];
        if (favouriteLangIn) {
            this.favouriteLangOut = new LangResponseDTO(favouriteLangOut);
        }

        let favouriteWorkoutType = workoutsStatisticJson["favourite_workout_type"];
        if (favouriteWorkoutType) {
            this.favouriteWorkoutType = new WorkoutTypeResponseDTO(favouriteWorkoutType);
        }

        let favouriteCustomerCollection = workoutsStatisticJson["favourite_customer_collection"];
        if (favouriteCustomerCollection) {
            this.favouriteCustomerCollection = new CustomerCollectionResponseDTO(favouriteCustomerCollection);
        }
    }

    createTable() {
        let table = document.createElement("table");
        table.classList.add(_CSS_MAIN.TABLE_STANDARD_STYLE_ID);

        // Создаём colgroup ---
        let colgroup = document.createElement("colgroup");

        let col = document.createElement("col");
        col.style.width = "25%";
        colgroup.appendChild(col);

        col = document.createElement("col");
        col.style.width = "50%";
        colgroup.appendChild(col);

        col = document.createElement("col");
        col.style.width = "25%";
        colgroup.appendChild(col);

        table.appendChild(colgroup);
        //---

        // Создаём tHead ---
        let tr = document.createElement("tr");

        let th = document.createElement("th");
        th.style.fontSize = _CSS_ROOT.THIRD_FONT_SIZE;
        th.textContent = "Количество тренировок";
        tr.appendChild(th);

        th = th.cloneNode(false);
        th.textContent = "Время";
        tr.appendChild(th);

        th = th.cloneNode(false);
        th.textContent = "Количество раундов";
        tr.appendChild(th);

        let tHead = document.createElement("thead");
        tHead.appendChild(tr);

        table.appendChild(tHead);
        //---

        // Количество тренировок ---
        tr = document.createElement("tr");

        let td = document.createElement("td");
        td.style.textAlign = "center";
        td.style.fontWeight = "bold";
        td.style.fontSize = _CSS_ROOT.SECOND_FONT_SIZE;
        td.textContent = this.numberOfWorkouts;

        tr.appendChild(td);
        //---

        // Времени затрачено ---

        td = td.cloneNode(false);
        td.textContent = new TimeParts(this.numberOfMilliseconds)
            .getTimeStr(true, true, true, false);

        tr.appendChild(td);
        //---

        // Количество раундов ---
        td = td.cloneNode(false);
        td.textContent = this.numberOfRounds;

        tr.appendChild(td);
        //---

        // Создаём tBody ---
        let tBody = document.createElement("tbody");
        tBody.appendChild(tr);

        table.appendChild(tBody);
        //---

        return table;
    }

    createFavouritesTable() {
        // Создаём строку tHead и tBody вместе ---
        let trForHead = document.createElement("tr");
        let th = document.createElement("th");
        th.style.fontSize = _CSS_ROOT.THIRD_FONT_SIZE;

        let trMainForBody = document.createElement("tr");
        let tdMain = document.createElement("td");
        let divForTdMain = document.createElement("div");
        divForTdMain.classList.add(_CSS_MAIN.DIV_CONTENT_CENTER_STANDARD_STYLE_ID);

        let trExtraForBody = document.createElement("tr");
        let tdExtra = document.createElement("td");
        tdExtra.style.textAlign = "center";
        tdExtra.style.fontWeight = "bold";
        //---

        // Любимый входящий язык ---
        let favouriteLangIn = this.favouriteLangIn;
        if (favouriteLangIn) {
            th = th.cloneNode(false);
            th.textContent = "Любимый входящий язык";
            trForHead.appendChild(th);

            // Генерируем флаг ---
            let divFlag = _FLAG_ELEMENTS.DIV.create(favouriteLangIn.country, false);
            divFlag.style.width = "128px";
            divFlag.style.height = "128px";

            divForTdMain = divForTdMain.cloneNode(false);
            divForTdMain.appendChild(divFlag);

            tdMain = tdMain.cloneNode(false);
            tdMain.appendChild(divForTdMain);

            trMainForBody.appendChild(tdMain);
            //---

            // Отображаем название языка ---
            tdExtra = tdExtra.cloneNode(false);
            tdExtra.textContent = favouriteLangIn.title;

            trExtraForBody.appendChild(tdExtra);
            //---
        }
        //---

        // Любимый выходящий язык ---
        let favouriteLangOut = this.favouriteLangOut;
        if (favouriteLangOut) {
            th = th.cloneNode(false);
            th.textContent = "Любимый выходящий язык";
            trForHead.appendChild(th);

            // Генерируем флаг ---
            let divFlag = _FLAG_ELEMENTS.DIV.create(favouriteLangOut.country, false);
            divFlag.style.width = "128px";
            divFlag.style.height = "128px";

            divForTdMain = divForTdMain.cloneNode(false);
            divForTdMain.appendChild(divFlag);

            tdMain = tdMain.cloneNode(false);
            tdMain.appendChild(divForTdMain);

            trMainForBody.appendChild(tdMain);
            //---

            // Отображаем название языка ---
            tdExtra = tdExtra.cloneNode(false);
            tdExtra.textContent = favouriteLangOut.title;

            trExtraForBody.appendChild(tdExtra);
            //---
        }
        //---

        // Любимый режим тренировки ---
        let favouriteWorkoutType = this.favouriteWorkoutType;
        if (favouriteWorkoutType) {
            th = th.cloneNode(false);
            th.textContent = "Любимый режим тренировки";
            trForHead.appendChild(th);

            // Генерируем картинку режима тренировки ---
            let img = document.createElement("img");
            img.style.width = "128px";
            img.style.height = "128px";
            img.src = favouriteWorkoutType.pathToImage;

            divForTdMain = divForTdMain.cloneNode(false);
            divForTdMain.appendChild(img);

            tdMain = tdMain.cloneNode(false);
            tdMain.appendChild(divForTdMain);

            trMainForBody.appendChild(tdMain);
            //---

            // Отображаем название режима тренировки ---
            tdExtra = tdExtra.cloneNode(false);
            tdExtra.textContent = favouriteWorkoutType.title;

            trExtraForBody.appendChild(tdExtra);
            //---
        }
        //---

        // Любимая коллекция ---
        let favouriteCustomerCollection = this.favouriteCustomerCollection;
        if (favouriteCustomerCollection) {
            th = th.cloneNode(false);
            th.textContent = "Любимая коллекция";
            trForHead.appendChild(th);

            // Генерируем картинку коллекции ---
            let img = document.createElement("img");
            img.style.width = "128px";
            img.style.height = "128px";
            img.src = _IMAGE_SOURCES.CUSTOMER_COLLECTIONS.BOOKS;

            divForTdMain = divForTdMain.cloneNode(false);
            divForTdMain.appendChild(img);

            tdMain = tdMain.cloneNode(false);
            tdMain.appendChild(divForTdMain);

            trMainForBody.appendChild(tdMain);
            //---

            // Отображаем название режима тренировки ---
            let divCollection = favouriteCustomerCollection.createDiv();

            tdExtra = tdExtra.cloneNode(false);
            tdExtra.appendChild(divCollection);

            trExtraForBody.appendChild(tdExtra);
            //---
        }
        //---


        let table;
        let numberOfColumns = trForHead.childElementCount;
        if (numberOfColumns > 0) {
            table = document.createElement("table");
            table.classList.add(_CSS_MAIN.TABLE_STANDARD_STYLE_ID);

            // Генерируем колонки ---
            let percentOfWidth = Math.round(100 / numberOfColumns);

            let colgroup = document.createElement("colgroup");
            for (let i = 0; i < numberOfColumns; i++) {
                let col = document.createElement("col");
                col.style.width = `${percentOfWidth}%`;
                colgroup.appendChild(col);
            }
            table.appendChild(colgroup);
            //---

            // Создаём tHead ---
            let tHead = document.createElement("thead");
            tHead.appendChild(trForHead);

            table.appendChild(tHead);
            //---

            // Создаём tBody ---
            let tBody = document.createElement("tbody");
            tBody.appendChild(trMainForBody);
            tBody.appendChild(trExtraForBody);

            table.appendChild(tBody);
            //---
        }

        return table;
    }
}