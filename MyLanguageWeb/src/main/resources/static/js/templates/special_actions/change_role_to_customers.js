import {
    TextBoxUtils
} from "../../classes/utils/text_box_utils.js"

import {
    CustomTimer
} from "../../classes/custom_timer/custom_timer.js";

import {
    CustomerRoleUtils
} from "../../classes/utils/entity/customer_role_utils.js";

import {
    TableUtils
} from "../../classes/utils/table_utils.js";

import {
    ComboBoxUtils
} from "../../classes/utils/combo_box_utils.js";

import {
    CustomersAPI
} from "../../classes/api/customers_api.js";

import {
    HttpStatuses
} from "../../classes/http_statuses.js";

import {
    CustomResponseMessage
} from "../../classes/dto/other/custom_response_message.js";

import {
    CustomerRequestDTO,
    CustomerResponseDTO
} from "../../classes/dto/entity/customer.js";

import {
    CssMain
} from "../../classes/css/css_main.js";

import {
    GlobalCookies
} from "../../classes/global_cookies.js";

const _CUSTOMERS_API = new CustomersAPI();

const _CSS_MAIN = new CssMain();

const _TEXT_BOX_UTILS = new TextBoxUtils();
const _CUSTOMER_ROLE_UTILS = new CustomerRoleUtils();
const _TABLE_UTILS = new TableUtils();
const _COMBO_BOX_UTILS = new ComboBoxUtils();
const _HTTP_STATUSES = new HttpStatuses();
const _GLOBAL_COOKIES = new GlobalCookies();

const _TB_FINDER_ID = "tb_finder";
const _CB_CUSTOMER_ROLES_ID = "cb_customer_roles";
const _BTN_REFRESH_ID = "btn_refresh";

const _THEAD_CUSTOMERS_ID = "thead_customers";
const _TBODY_CUSTOMERS_ID = "tbody_customers";

const _CUSTOMER_TIMER_CUSTOMERS_FINDER = new CustomTimer();
const _CUSTOMER_TIMER_TB_FINDER = new CustomTimer();
const _TIMEOUT_FOR_FINDERS = 1000;

const _NUMBER_OF_ITEMS = 10;
let _lastCustomerNumberInList = 0;
let _lastCustomerIdOnPreviousPage = 0n;

window.onload = async function() {
    // Подготавливаем таймеры ---
    prepareCustomersFinder();
    //---

    prepareTbFinder();
    await prepareCbCustomerRoles();
    prepareBtnRefresh();

    // Запускаем таймеры ---
    startToFindCustomers();
    //---
}

function prepareTbFinder() {
    let tbFinder = document.getElementById(_TB_FINDER_ID);
    if (tbFinder) {
        _TEXT_BOX_UTILS.prepareTbFinder(tbFinder, startToFindCustomers, _CUSTOMER_TIMER_TB_FINDER);
    }
}

async function prepareCbCustomerRoles() {
    let cbCustomerRoles = document.getElementById(_CB_CUSTOMER_ROLES_ID);
    if (cbCustomerRoles) {
        let firstOption = document.createElement("option");
        firstOption.textContent = "Все";

        await _CUSTOMER_ROLE_UTILS.CB_CUSTOMER_ROLES.prepare(cbCustomerRoles, firstOption);

        cbCustomerRoles.addEventListener("change", startToFindCustomers);
    }
}

function prepareBtnRefresh() {
    let btnRefresh = document.getElementById(_BTN_REFRESH_ID);
    if (btnRefresh) {
        btnRefresh.addEventListener("click", startToFindCustomers);
    }
}

// Поиск пользователей ---
function prepareCustomersFinder() {
    _CUSTOMER_TIMER_CUSTOMERS_FINDER.setTimeout(_TIMEOUT_FOR_FINDERS);
    _CUSTOMER_TIMER_CUSTOMERS_FINDER.setHandler(async function() {
        _lastCustomerNumberInList = 0;
        _lastCustomerIdOnPreviousPage = 0n;

        await tryToFillCustomersTable(true, true);
    })
}

function startToFindCustomers() {
    if (_CUSTOMER_TIMER_CUSTOMERS_FINDER) {
        _CUSTOMER_TIMER_CUSTOMERS_FINDER.stop();
    }

    // Отображаем загрузку в таблице ---
    let tHead = document.getElementById(_THEAD_CUSTOMERS_ID);
    let tBody = document.getElementById(_TBODY_CUSTOMERS_ID);
    if (tHead && tBody) {
        let numberOfColumns = _TABLE_UTILS.getNumberOfColumnsByTableHead(tHead);
        let trMessage = _TABLE_UTILS.MESSAGES_INSIDE_TABLE.createTrLoading(numberOfColumns);

        tBody.replaceChildren();
        tBody.appendChild(trMessage);
    }
    //---

    if (_CUSTOMER_TIMER_CUSTOMERS_FINDER) {
        _CUSTOMER_TIMER_CUSTOMERS_FINDER.start();
    }
}

async function tryToFillCustomersTable(doNeedToClearTable, doNeedToShowTableMessage) {
    let currentFinder = _CUSTOMER_TIMER_CUSTOMERS_FINDER;

    // Получаем никнейм из поля ввода ---
    let nickname;
    let tbFinder = document.getElementById(_TB_FINDER_ID);
    if (tbFinder) {
        nickname = tbFinder.value.trim();
    }
    //---

    // Получаем код роли ---
    let roleCode;
    let cbRoles = document.getElementById(_CB_CUSTOMER_ROLES_ID);
    if (cbRoles) {
        roleCode = _COMBO_BOX_UTILS.GET_SELECTED_ITEM_ID.byComboBox(cbRoles);
    }
    //---

    let JSONResponse = await _CUSTOMERS_API.GET.getAllFilteredPagination(
        nickname, roleCode, _NUMBER_OF_ITEMS, _lastCustomerIdOnPreviousPage);
    if (JSONResponse.status === _HTTP_STATUSES.OK) {
        let tableRows = await createCustomersTableRows(JSONResponse.json);

        let tBody = document.getElementById(_TBODY_CUSTOMERS_ID);
        if (tableRows && tBody && currentFinder.getActive() === true) {
            if (doNeedToClearTable === true) {
                tBody.replaceChildren();
            }

            for (let i = 0; i < tableRows.length; i++) {
                if (currentFinder.getActive() !== true) break;
                tBody.appendChild(tableRows[i]);
            }
        }
    } else {
        if (doNeedToShowTableMessage === true) {
            let message = new CustomResponseMessage(JSONResponse.json).text;

            let tHead = document.getElementById(_THEAD_CUSTOMERS_ID);
            let tBody = document.getElementById(_TBODY_CUSTOMERS_ID);
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
    }
}

async function createCustomersTableRows(customersJson) {
    let currentFinder = _CUSTOMER_TIMER_CUSTOMERS_FINDER;
    let tableRows = [];

    for (let i = 0; i < customersJson.length; i++) {
        if (currentFinder.getActive() !== true) break;
        let customer = new CustomerResponseDTO(customersJson[i]);

        let row = await createCustomersTableRow(customer);
        if (row) {
            tableRows.push(row);
        }

        if (i === customersJson.length - 1) {
            _lastCustomerIdOnPreviousPage = customer.id;
        }
    }

    if (currentFinder.getActive() === true
        && customersJson.length === _NUMBER_OF_ITEMS) {
        let tHead = document.getElementById(_THEAD_CUSTOMERS_ID);
        let numberOfColumns = _TABLE_UTILS.getNumberOfColumnsByTableHead(tHead);

        let message =  `Показать ещё ${_NUMBER_OF_ITEMS} элементов...`;
        let trShowMore = _TABLE_UTILS.createTrShowMore(numberOfColumns,
            message, async function() {
                await tryToFillCustomersTable(false, false);
            });

        tableRows.push(trShowMore);
    }

    return tableRows;
}

async function createCustomersTableRow(customer) {
    const ROW_HEIGHT = "50px";
    let row = document.createElement("tr");

    // Порядковый номер строки ---
    let td = document.createElement("td");
    td.style.textAlign = "center";
    td.textContent = `${++_lastCustomerNumberInList}.`;

    row.appendChild(td);
    //---

    // Никнейм ---
    let tdNickname = document.createElement("td");
    tdNickname.textContent = customer.nickname;

    let color = customer.role.color;
    if (color) {
        tdNickname.style.color = "#" + color.hexCode;
        tdNickname.style.fontWeight = "bold";
    }

    row.appendChild(tdNickname);
    //---

    // Роль ---
    let cbCustomerRoles = document.createElement("select");
    cbCustomerRoles.classList.add(_CSS_MAIN.SELECT_STANDARD_STYLE_ID);
    cbCustomerRoles.style.height = ROW_HEIGHT;
    cbCustomerRoles.style.width = "100%";

    await _CUSTOMER_ROLE_UTILS.CB_CUSTOMER_ROLES.prepare(cbCustomerRoles, null);

    _COMBO_BOX_UTILS.CHANGE_SELECTED_ITEM.byComboBoxAndItemId(
        cbCustomerRoles, customer.role.code, true);

    let authId = BigInt(_GLOBAL_COOKIES.AUTH_ID.getValue());
    if (authId === customer.id) {
        cbCustomerRoles.disabled = true;
    }

    cbCustomerRoles.addEventListener("change", async function() {
        this.disabled = true;

        let dto = new CustomerRequestDTO();
        dto.id = customer.id;
        dto.roleCode = _COMBO_BOX_UTILS.GET_SELECTED_ITEM_ID.byComboBox(this);

        let JSONResponse = await _CUSTOMERS_API.PATCH.changeRole(dto);
        if (JSONResponse.status === _HTTP_STATUSES.OK) {
            this.disabled = false;

            let selectedOption = _COMBO_BOX_UTILS.GET_SELECTED_ITEM.byComboBox(this);
            if (selectedOption) {
                let color = selectedOption.style.color;
                if (color) {
                    tdNickname.style.color = color;
                    tdNickname.style.fontWeight = "bold";
                } else {
                    tdNickname.style.cssText = "";
                }
            }
        }
    })

    td = document.createElement("td");
    td.style.padding = "1px";
    td.appendChild(cbCustomerRoles);

    row.appendChild(td);
    //---

    return row;
}
//---