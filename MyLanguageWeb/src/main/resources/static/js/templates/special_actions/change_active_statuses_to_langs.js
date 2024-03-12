import {
    CustomTimer
} from "../../classes/custom_timer/custom_timer.js";

import {
    TableUtils
} from "../../classes/utils/table_utils.js";

import {
    LangsAPI
} from "../../classes/api/langs_api.js";

import {
    HttpStatuses
} from "../../classes/http_statuses.js";

import {
    YandexDictionaryLangs
} from "../../classes/dto/other/yandex_langs.js";

import {
    CustomResponseMessage
} from "../../classes/dto/other/custom_response_message.js";

import {
    LangRequestDTO,
    LangResponseDTO
} from "../../classes/dto/entity/lang.js";

import {
    ComboBoxUtils
} from "../../classes/utils/combo_box_utils.js";

import {
    CssRoot
} from "../../classes/css/css_root.js";

import {
    TextBoxUtils
} from "../../classes/utils/text_box_utils.js";

import {
    ImageSources
} from "../../classes/image_sources.js";

import {
    CssMain
} from "../../classes/css/css_main.js";

const _LANGS_API = new LangsAPI();

const _CSS_ROOT = new CssRoot();
const _CSS_MAIN = new CssMain();

const _TABLE_UTILS = new TableUtils();
const _HTTP_STATUSES = new HttpStatuses();
const _COMBO_BOX_UTILS = new ComboBoxUtils();
const _TEXT_BOX_UTILS = new TextBoxUtils();
const _IMAGE_SOURCES = new ImageSources();

const _A_BTN_ON_LANGS_SUPPORTED_FOR_IN_ID = "on_langs_supported_for_in";
const _A_BTN_ON_LANGS_SUPPORTED_FOR_OUT_ID = "on_langs_supported_for_out";
const _A_BTN_OFF_LANGS_DOESNT_SUPPORTED_FOR_IN_ID = "off_langs_doesnt_supported_for_in";
const _A_BTN_OFF_LANGS_DOESNT_SUPPORTED_FOR_OUT_ID = "off_langs_doesnt_supported_for_out";

const _TB_FINDER_ID = "tb_finder";
const _BTN_REFRESH_LANGS = "btn_refresh_langs";
const _THEAD_LANGS = "thead_langs";
const _TBODY_LANGS = "tbody_langs";

const _BTN_REFRESH_NEW_LANGS = "btn_refresh_new_langs";
const _THEAD_NEW_LANGS = "thead_new_langs";
const _TBODY_NEW_LANGS = "tbody_new_langs";

const _CUSTOM_TIMER_LANGS_FINDER = new CustomTimer();
const _CUSTOM_TIMER_NEW_LANGS_FINDER = new CustomTimer();
const _CUSTOM_TIMER_TB_FINDER = new CustomTimer();
const _TIMEOUT_FOR_FINDERS = 1000;

window.onload = async function() {
    // Подготавливаем таймеры ---
    prepareLangsFinder();
    prepareNewLangsFinder();
    //---

    prepareABtnOnLangsSupportedForIn();
    prepareABtnOnLangsSupportedForOut();
    prepareABtnOffLangsDoesntSupportedForIn();
    prepareABtnOffLangsDoesntSupportedForOut();

    prepareTbFinder();
    prepareBtnRefreshLangs();
    prepareBtnRefreshNewLangs();

    // Запускаем таймеры ---
    startToFindLangs();
    startToFindNewLangs();
    //---
}

function prepareABtnOnLangsSupportedForIn() {
    let aBtnOnLangsSupportedForIn = document.getElementById(_A_BTN_ON_LANGS_SUPPORTED_FOR_IN_ID);
    if (aBtnOnLangsSupportedForIn) {
        aBtnOnLangsSupportedForIn.addEventListener("click", async function() {
            this.className = "";
            this.classList.add(_CSS_MAIN.A_BUTTON_DISABLED_STANDARD_STYLE_ID);

            let JSONResponse = await _LANGS_API.PATCH.onLangsSupportedForIn();
            if (JSONResponse.status === _HTTP_STATUSES.OK) {
                this.className = "";
                this.classList.add(_CSS_MAIN.A_BUTTON_ACCEPT_STANDARD_STYLE_ID);

                startToFindLangs();
            }
        });
    }
}

function prepareABtnOnLangsSupportedForOut() {
    let aBtnOnLangsSupportedForOut = document.getElementById(_A_BTN_ON_LANGS_SUPPORTED_FOR_OUT_ID);
    if (aBtnOnLangsSupportedForOut) {
        aBtnOnLangsSupportedForOut.addEventListener("click", async function() {
            this.className = "";
            this.classList.add(_CSS_MAIN.A_BUTTON_DISABLED_STANDARD_STYLE_ID);

            let JSONResponse = await _LANGS_API.PATCH.onLangsSupportedForOut();
            if (JSONResponse.status === _HTTP_STATUSES.OK) {
                this.className = "";
                this.classList.add(_CSS_MAIN.A_BUTTON_ACCEPT_STANDARD_STYLE_ID);

                startToFindLangs();
            }
        });
    }
}

function prepareABtnOffLangsDoesntSupportedForIn() {
    let aBtnOffLangsDoesntSupportedForIn =
        document.getElementById(_A_BTN_OFF_LANGS_DOESNT_SUPPORTED_FOR_IN_ID);
    if (aBtnOffLangsDoesntSupportedForIn) {
        aBtnOffLangsDoesntSupportedForIn.addEventListener("click", async function() {
            this.className = "";
            this.classList.add(_CSS_MAIN.A_BUTTON_DISABLED_STANDARD_STYLE_ID);

            let JSONResponse = await _LANGS_API.PATCH.offLangsDoesntSupportedForIn();
            if (JSONResponse.status === _HTTP_STATUSES.OK) {
                this.className = "";
                this.classList.add(_CSS_MAIN.A_BUTTON_DENY_STANDARD_STYLE_ID);

                startToFindLangs();
            }
        });
    }
}

function prepareABtnOffLangsDoesntSupportedForOut() {
    let aBtnOffLangsDoesntSupportedForOut =
        document.getElementById(_A_BTN_OFF_LANGS_DOESNT_SUPPORTED_FOR_OUT_ID);
    if (aBtnOffLangsDoesntSupportedForOut) {
        aBtnOffLangsDoesntSupportedForOut.addEventListener("click", async function() {
            this.className = "";
            this.classList.add(_CSS_MAIN.A_BUTTON_DISABLED_STANDARD_STYLE_ID);

            let JSONResponse = await _LANGS_API.PATCH.offLangsDoesntSupportedForOut();
            if (JSONResponse.status === _HTTP_STATUSES.OK) {
                this.className = "";
                this.classList.add(_CSS_MAIN.A_BUTTON_DENY_STANDARD_STYLE_ID);

                startToFindLangs();
            }
        });
    }
}

function prepareTbFinder() {
    let tbFinder = document.getElementById(_TB_FINDER_ID);
    if (tbFinder) {
        _TEXT_BOX_UTILS.prepareTbFinder(tbFinder, startToFindLangs, _CUSTOM_TIMER_TB_FINDER);
    }
}

function prepareBtnRefreshLangs() {
    let btnRefreshLangs = document.getElementById(_BTN_REFRESH_LANGS);
    if (btnRefreshLangs) {
        btnRefreshLangs.addEventListener("click", async function() {
            startToFindLangs();
        });
    }
}

function prepareBtnRefreshNewLangs() {
    let btnRefreshNewLangs = document.getElementById(_BTN_REFRESH_NEW_LANGS);
    if (btnRefreshNewLangs) {
        btnRefreshNewLangs.addEventListener("click", async function() {
            startToFindNewLangs();
        });
    }
}

// Поиск языков ---
function prepareLangsFinder() {
    _CUSTOM_TIMER_LANGS_FINDER.setTimeout(_TIMEOUT_FOR_FINDERS);
    _CUSTOM_TIMER_LANGS_FINDER.setHandler(async function() {
        await tryToFillLangsTable();
    });
}

function startToFindLangs() {
    if (_CUSTOM_TIMER_LANGS_FINDER) {
        _CUSTOM_TIMER_LANGS_FINDER.stop();
    }

    // Показываем загрузку ---
    let tHead = document.getElementById(_THEAD_LANGS);
    let tBody = document.getElementById(_TBODY_LANGS);
    if (tHead && tBody) {
        let numberOfColumns = _TABLE_UTILS.getNumberOfColumnsByTableHead(tHead);
        let trLoading = _TABLE_UTILS.MESSAGES_INSIDE_TABLE.createTrLoading(numberOfColumns);

        tBody.replaceChildren();
        tBody.appendChild(trLoading);
    }
    //---

    if (_CUSTOM_TIMER_LANGS_FINDER) {
        _CUSTOM_TIMER_LANGS_FINDER.start();
    }
}

async function tryToFillLangsTable() {
    let currentFinder = _CUSTOM_TIMER_LANGS_FINDER;

    let title;
    let tbFinder = document.getElementById(_TB_FINDER_ID);
    if (tbFinder) {
        title = tbFinder.value.trim();
    }

    // Ищем языки Yandex.Dictionary ---
    let JSONResponse = await _LANGS_API.GET.getYandexDictionaryLangs();
    if (JSONResponse.status === _HTTP_STATUSES.OK) {
        let yandexDictionaryLangs = new YandexDictionaryLangs(JSONResponse.json);

        // Пытаемся сгенерировать строки таблицы ---
        JSONResponse = await _LANGS_API.GET.getAllFiltered(title);
        if (JSONResponse.status === _HTTP_STATUSES.OK) {
            let tableRows = await createLangsTableRows(JSONResponse.json, yandexDictionaryLangs);

            let tBody = document.getElementById(_TBODY_LANGS);
            if (tBody && currentFinder.getActive() === true) {
                tBody.replaceChildren();

                for (let i = 0; i < tableRows.length; i++) {
                    if (currentFinder.getActive() !== true) break;
                    tBody.appendChild(tableRows[i]);
                }
            }
        } else {
            showMessageInsideLangsTable(new CustomResponseMessage(JSONResponse.json).text);
        }
        //---
    } else {
        showMessageInsideLangsTable(new CustomResponseMessage(JSONResponse.json).text);
    }
    //---
}

async function createLangsTableRows(langsJson, yandexDictionaryLangs) {
    let tableRows = [];

    for (let i = 0; i < langsJson.length; i++) {
        let lang = new LangResponseDTO(langsJson[i]);

        let langInIndex = yandexDictionaryLangs.langsIn.indexOf(lang.codeForTranslate);
        let doesSupportForIn = langInIndex !== -1;

        let langOutIndex = yandexDictionaryLangs.langsOut.indexOf(lang.codeForTranslate);
        let doesSupportForOut = langOutIndex !== -1;

        let row = createLangsTableRow(lang, doesSupportForIn, doesSupportForOut, i + 1);
        if (row) {
            tableRows.push(row);
        }
    }

    return tableRows;
}

function createLangsTableRow(lang, doesSupportForIn, doesSupportForOut, index) {
    const ROW_HEIGHT = "70px";

    let row = document.createElement("tr");
    row.style.height = ROW_HEIGHT;

    // Номер строки ---
    let td = document.createElement("td");
    td.style.textAlign = "center";
    td.textContent = `${index}.`;
    row.appendChild(td);
    //---

    // Язык ---
    td = document.createElement("td");
    td.appendChild(lang.createSpan());

    row.appendChild(td);
    //---

    // Активен на вход ---
    let cbActiveForIn = document.createElement("select");
    cbActiveForIn.classList.add(_CSS_MAIN.SELECT_STANDARD_STYLE_ID);
    cbActiveForIn.style.height = ROW_HEIGHT;
    cbActiveForIn.style.width = "100%";

    _COMBO_BOX_UTILS.prepareCbBoolean(cbActiveForIn);

    _COMBO_BOX_UTILS.CHANGE_SELECTED_ITEM.byComboBoxAndItemIndex(cbActiveForIn,
        lang.isActiveForIn === true ? 0 : 1, true);

    cbActiveForIn.addEventListener("change", async function() {
        this.disabled = true;

        let isActive = this.selectedIndex === 0;

        let dto = new LangRequestDTO();
        dto.code = lang.code;
        dto.isActiveForIn = isActive;

        let JSONResponse = await _LANGS_API.PATCH.changeActivityForIn(dto);
        if (JSONResponse.status === _HTTP_STATUSES.OK) {
            this.disabled = false;
        }
    });

    td = document.createElement("td");
    td.style.padding = "1px";
    td.appendChild(cbActiveForIn);

    row.appendChild(td);
    //---

    // Активен на выход ---
    let cbActiveForOut = document.createElement("select");
    cbActiveForOut.classList.add(_CSS_MAIN.SELECT_STANDARD_STYLE_ID);
    cbActiveForOut.style.height = ROW_HEIGHT;
    cbActiveForOut.style.width = "100%";

    _COMBO_BOX_UTILS.prepareCbBoolean(cbActiveForOut);

    _COMBO_BOX_UTILS.CHANGE_SELECTED_ITEM.byComboBoxAndItemIndex(cbActiveForOut,
        lang.isActiveForOut === true ? 0 : 1, true);

    cbActiveForOut.addEventListener("change", async function() {
        this.disabled = true;

        let isActive = this.selectedIndex === 0;

        let dto = new LangRequestDTO();
        dto.code = lang.code;
        dto.isActiveForOut = isActive;

        let JSONResponse = await _LANGS_API.PATCH.changeActivityForOut(dto);
        if (JSONResponse.status === _HTTP_STATUSES.OK) {
            this.disabled = false;
        }
    });

    td = document.createElement("td");
    td.style.padding = "1px";
    td.appendChild(cbActiveForOut);

    row.appendChild(td);
    //---

    // Поддержка на вход ---
    let divDoesSupport = document.createElement("div");
    divDoesSupport.classList.add(_CSS_MAIN.DIV_CONTENT_CENTER_STANDARD_STYLE_ID);

    let imgDoesSupport = document.createElement("img");
    imgDoesSupport.style.width = "32px";
    imgDoesSupport.style.height = "32px";
    imgDoesSupport.src = doesSupportForIn === true
        ? imgDoesSupport.src = _IMAGE_SOURCES.OTHER.ACCEPT
        : imgDoesSupport.src = _IMAGE_SOURCES.OTHER.DELETE;
    divDoesSupport.appendChild(imgDoesSupport);

    td = document.createElement("td");
    td.style.background = doesSupportForIn === true
        ? _CSS_ROOT.ACCEPT_FIRST_COLOR
        : _CSS_ROOT.DENY_FIRST_COLOR;
    td.appendChild(divDoesSupport);

    row.appendChild(td);
    //---

    // Поддержка на выход ---
    divDoesSupport = divDoesSupport.cloneNode(false);

    imgDoesSupport = imgDoesSupport.cloneNode(false);
    imgDoesSupport.style.width = "32px";
    imgDoesSupport.style.height = "32px";
    imgDoesSupport.src = doesSupportForOut === true
        ? imgDoesSupport.src = _IMAGE_SOURCES.OTHER.ACCEPT
        : imgDoesSupport.src = _IMAGE_SOURCES.OTHER.DELETE;
    divDoesSupport.appendChild(imgDoesSupport);

    td = document.createElement("td");
    td.style.background = doesSupportForOut === true
        ? _CSS_ROOT.ACCEPT_FIRST_COLOR
        : _CSS_ROOT.DENY_FIRST_COLOR;
    td.appendChild(divDoesSupport);

    row.appendChild(td);
    //---

    return row;
}

function showMessageInsideLangsTable(message) {
    let currentFinder = _CUSTOM_TIMER_LANGS_FINDER;

    let tHead = document.getElementById(_THEAD_LANGS);
    let tBody = document.getElementById(_TBODY_LANGS);
    if (tHead && tBody) {
        let numberOfColumns = _TABLE_UTILS.getNumberOfColumnsByTableHead(tHead);
        let trMessage = _TABLE_UTILS.MESSAGES_INSIDE_TABLE.createTrCommon(numberOfColumns, message);
        if (currentFinder.getActive() === true) {
            tBody.replaceChildren();
            if (currentFinder.getActive() === true) {
                tBody.appendChild(trMessage);
            }
        }
    }
}
//---

// Поиск новых языков ---
function prepareNewLangsFinder() {
    _CUSTOM_TIMER_NEW_LANGS_FINDER.setTimeout(_TIMEOUT_FOR_FINDERS);
    _CUSTOM_TIMER_NEW_LANGS_FINDER.setHandler(async function() {
        await tryToFillNewLangsTable();
    })
}

function startToFindNewLangs() {
    if (_CUSTOM_TIMER_NEW_LANGS_FINDER) {
        _CUSTOM_TIMER_NEW_LANGS_FINDER.stop();
    }

    // Показываем загрузку ---
    let tHead = document.getElementById(_THEAD_NEW_LANGS);
    let tBody = document.getElementById(_TBODY_NEW_LANGS);
    if (tHead && tBody) {
        let numberOfColumns = _TABLE_UTILS.getNumberOfColumnsByTableHead(tHead);
        let trLoading = _TABLE_UTILS.MESSAGES_INSIDE_TABLE.createTrLoading(numberOfColumns);

        tBody.replaceChildren();
        tBody.appendChild(trLoading);
    }
    //---

    if (_CUSTOM_TIMER_NEW_LANGS_FINDER) {
        _CUSTOM_TIMER_NEW_LANGS_FINDER.start();
    }
}

async function tryToFillNewLangsTable() {
    let currentFinder = _CUSTOM_TIMER_NEW_LANGS_FINDER;

    // Ищем языки Yandex.Dictionary ---
    let JSONResponse = await _LANGS_API.GET.getYandexDictionaryLangs();
    if (JSONResponse.status === _HTTP_STATUSES.OK) {
        let yandexDictionaryLangs = new YandexDictionaryLangs(JSONResponse.json);

        // Мы должны оставить только те языки, которые отсутствуют в базе ---
        let newLangCodes = yandexDictionaryLangs.allLangs;
        JSONResponse = await _LANGS_API.GET.getAllFiltered(null);
        if (JSONResponse.status === _HTTP_STATUSES.OK) {
            let json = JSONResponse.json;
            for (let i = 0; i < json.length; i++) {
                let lang = new LangResponseDTO(json[i]);

                let langIndex = newLangCodes.indexOf(lang.codeForTranslate);
                if (langIndex !== -1) {
                    newLangCodes.splice(langIndex, 1);
                }
            }
        }
        //---

        if (newLangCodes.length > 0) {
            // Генерируем строки таблицы ---
            let tableRows = createNewLangsTableRows(yandexDictionaryLangs, newLangCodes);
            let tBody = document.getElementById(_TBODY_NEW_LANGS);
            if (tBody && currentFinder.getActive() === true) {
                tBody.replaceChildren();

                for (let i = 0; i < tableRows.length; i++) {
                    if (currentFinder.getActive() !== true) break;
                    tBody.appendChild(tableRows[i]);
                }
            }
            //---
        } else {
            showMessageInsideNewLangsTable("Отсутствующих языков не найдено.");
        }
    } else {
        showMessageInsideNewLangsTable(new CustomResponseMessage(JSONResponse.json).text);
    }
}

function createNewLangsTableRows(yandexDictionaryLangs, newLangCodes) {
    let tableRows = [];

    for (let i = 0; i < newLangCodes.length; i++) {
        let langCode = newLangCodes[i];

        let langInIndex = yandexDictionaryLangs.langsIn.indexOf(langCode);
        let doesSupportForIn = langInIndex !== -1;

        let langOutIndex = yandexDictionaryLangs.langsOut.indexOf(langCode);
        let doesSupportForOut = langOutIndex !== -1;

        let row = createNewLangsTableRow(langCode, doesSupportForIn, doesSupportForOut, i + 1);
        if (row) {
            tableRows.push(row);
        }
    }

    return tableRows;
}

function createNewLangsTableRow(langCode, doesSupportForIn, doesSupportForOut, index) {
    let row = document.createElement("tr");

    // Номер строки ---
    let td = document.createElement("td");
    td.style.textAlign = "center";
    td.textContent = `${index}.`;
    row.appendChild(td);
    //---

    // Код языка ---
    let spanLangCode = document.createElement("span");
    spanLangCode.textContent = langCode;

    td = document.createElement("td");
    td.appendChild(spanLangCode);

    row.appendChild(td);
    //---

    // Поддержка на вход ---
    let divDoesSupport = document.createElement("div");
    divDoesSupport.classList.add(_CSS_MAIN.DIV_CONTENT_CENTER_STANDARD_STYLE_ID);

    let imgDoesSupport = document.createElement("img");
    imgDoesSupport.style.width = "32px";
    imgDoesSupport.style.height = "32px";
    imgDoesSupport.src = doesSupportForIn === true
        ? imgDoesSupport.src = _IMAGE_SOURCES.OTHER.ACCEPT
        : imgDoesSupport.src = _IMAGE_SOURCES.OTHER.DELETE;
    divDoesSupport.appendChild(imgDoesSupport);

    td = document.createElement("td");
    td.style.background = doesSupportForIn === true
        ? _CSS_ROOT.ACCEPT_FIRST_COLOR
        : _CSS_ROOT.DENY_FIRST_COLOR;
    td.appendChild(divDoesSupport);

    row.appendChild(td);
    //---

    // Поддержка на выход ---
    divDoesSupport = divDoesSupport.cloneNode(false);

    imgDoesSupport = imgDoesSupport.cloneNode(false);
    imgDoesSupport.style.width = "32px";
    imgDoesSupport.style.height = "32px";
    imgDoesSupport.src = doesSupportForOut === true
        ? imgDoesSupport.src = _IMAGE_SOURCES.OTHER.ACCEPT
        : imgDoesSupport.src = _IMAGE_SOURCES.OTHER.DELETE;
    divDoesSupport.appendChild(imgDoesSupport);

    td = document.createElement("td");
    td.style.background = doesSupportForOut === true
        ? _CSS_ROOT.ACCEPT_FIRST_COLOR
        : _CSS_ROOT.DENY_FIRST_COLOR;
    td.appendChild(divDoesSupport);

    row.appendChild(td);
    //---

    return row;
}

function showMessageInsideNewLangsTable(message) {
    let currentFinder = _CUSTOM_TIMER_NEW_LANGS_FINDER;

    let tHead = document.getElementById(_THEAD_NEW_LANGS);
    let tBody = document.getElementById(_TBODY_NEW_LANGS);
    if (tHead && tBody) {
        let numberOfColumns = _TABLE_UTILS.getNumberOfColumnsByTableHead(tHead);
        let trMessage = _TABLE_UTILS.MESSAGES_INSIDE_TABLE.createTrCommon(numberOfColumns, message);
        if (currentFinder.getActive() === true) {
            tBody.replaceChildren();
            if (currentFinder.getActive() === true) {
                tBody.appendChild(trMessage);
            }
        }
    }
}
//---

