import {
    ButtonWithImgElement
} from "../../../classes/html/button/with_img/button_with_img_element.js";

import {
    ButtonElementRefresh
} from "../../../classes/html/button/elements/button_element_refresh.js";

import {
    TableWithTimerElementNewLangs
} from "../../../classes/html/table/entity/lang/table_with_timer_element_new_langs.js";

const _GENERAL_TIMEOUT = 1000;

// Элементы для поиска в таблице + таблица "Новые языки" ---
let _buttonElementRefreshNewLangs;

let _tableWithTimerElementNewLangs;
//---

window.onload = async function() {
    // Элементы для поиска в таблице + таблица "Новые языки" ---
    prepareButtonElementRefreshNewLangs();

    await prepareTableWithTimerElementNewLangs();
    //---

    if (_tableWithTimerElementNewLangs) {
        _tableWithTimerElementNewLangs.startToFill();
        _tableWithTimerElementNewLangs.changeDisabledStatusToTableInstruments(false);
    }
}


// Элементы для поиска в таблице + таблица "Новые языки" ---
function prepareButtonElementRefreshNewLangs() {
    let button = document.getElementById("button_refresh_new_langs");
    let img = document.getElementById("img_button_refresh_new_langs");
    if (button && img) {
        let buttonWithImgElement = new ButtonWithImgElement(button, img);
        _buttonElementRefreshNewLangs = new ButtonElementRefresh(buttonWithImgElement);
        _buttonElementRefreshNewLangs.prepare();
    }
}

async function prepareTableWithTimerElementNewLangs() {
    let table = document.getElementById("table_new_langs");
    let colgroup = document.getElementById("colgroup_new_langs");
    let thead = document.getElementById("thead_new_langs");
    let tbody = document.getElementById("tbody_new_langs");
    if (table && colgroup && thead && tbody) {
        _tableWithTimerElementNewLangs = new TableWithTimerElementNewLangs(table, colgroup, thead, tbody);
        _tableWithTimerElementNewLangs.setButtonElementRefresh(_buttonElementRefreshNewLangs);
        _tableWithTimerElementNewLangs.setTimeout(_GENERAL_TIMEOUT);

        await _tableWithTimerElementNewLangs.prepare();
    }
}
//---