import {
    CssLoading
} from "./css/css_loading.js";

const _CSS_LOADING = new CssLoading();
export class LoadingElement {

    createDiv() {
        let imgLoading = document.createElement("img");
        imgLoading.classList.add(_CSS_LOADING.IMG_GIF_LOADING_STYLE_ID);
        imgLoading.src = "/images/other/loading.gif";

        let loadingTexts = ["Загружаем...", "Идёт загрузка...", "Загрузка...", "Подождите..."];

        let spanLoading = document.createElement("span");
        spanLoading.classList.add(_CSS_LOADING.SPAN_LOADING_TEXT_STYLE_ID);
        spanLoading.textContent = loadingTexts[Math.floor(Math.random() * loadingTexts.length)];

        let divLoadingMessage = document.createElement("div");
        divLoadingMessage.classList.add(_CSS_LOADING.DIV_LOADING_CONTAINER_STYLE_ID);

        divLoadingMessage.appendChild(imgLoading);
        divLoadingMessage.appendChild(spanLoading);

        return divLoadingMessage;
    }
}