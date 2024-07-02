import {
    CustomersAPI
} from "../../../../api/entity/customers_api.js";

import {
    CssRoot
} from "../../../../css/css_root.js";

import {
    HttpStatuses
} from "../../../../api/classes/http/http_statuses.js";

import {
    BigIntUtils
} from "../../../../utils/bigint_utils.js";

import {
    TableWithTimerAbstractElement
} from "../../abstracts/table_with_timer_abstract_element.js";

import {
    SelectElementCustomerRoles
} from "../../../select/entity/customer_role/select_element_customer_roles.js";

import {
    AElementCustomer
} from "../../../a/entity/customer/a_element_customer.js";

import {
    EntityEditValueByIdRequestDTO
} from "../../../../dto/other/request/entity/edit/entity_edit_value_by_id_request_dto.js";

import {
    CustomerResponseDTO
} from "../../../../dto/entity/customer/response/customer_response_dto.js";

import {
    ResponseMessageResponseDTO
} from "../../../../dto/other/response/response_message_response_dto.js";

import {
    ProjectCookies
} from "../../../project_cookies.js";

import {
    EventNames
} from "../../../event_names.js";

const _CUSTOMERS_API = new CustomersAPI();

const _CSS_ROOT = new CssRoot();

const _HTTP_STATUSES = new HttpStatuses();
const _PROJECT_COOKIES = new ProjectCookies();
const _BIGINT_UTILS = new BigIntUtils();
const _EVENT_NAMES = new EventNames();

export class TableWithTimerElementCustomers extends TableWithTimerAbstractElement {
    #inputTextElementFinder;
    #selectElementCustomerRoles;
    #buttonElementRefresh;

    #maxNumberOfCustomersOnPage = 10;

    constructor(table, colgroup, thead, tbody) {
        super(table, colgroup, thead, tbody);
    }

    setInputTextElementFinder(inputTextElementFinderObj) {
        this.#inputTextElementFinder = inputTextElementFinderObj;
    }

    setSelectElementCustomerRoles(selectElementCustomerRolesObj) {
        this.#selectElementCustomerRoles = selectElementCustomerRolesObj;
    }

    setButtonElementRefresh(buttonElementRefreshObj) {
        this.#buttonElementRefresh = buttonElementRefreshObj;
    }

    async #createTr(customerResponseDTOObj) {
        let tr;
        if (customerResponseDTOObj) {
            const ROW_HEIGHT = "50px";

            tr = document.createElement("tr");
            tr.style.minHeight = ROW_HEIGHT;

            // Порядковый номер строки ---
            let td = document.createElement("td");
            td.style.textAlign = "center";

            this.incrementCurrentRowNumber();
            td.textContent = `${this.getCurrentRowNumber()}.`;

            tr.appendChild(td);
            //---

            // Никнейм ---
            let tdNickname = document.createElement("td");

            let aElementCustomer = new AElementCustomer(null);
            aElementCustomer.setCustomerResponseDTO(customerResponseDTOObj);

            await aElementCustomer.prepare();
            await aElementCustomer.fill();

            let a = aElementCustomer.getA();
            if (a) {
                tdNickname.appendChild(a);
            }

            tr.appendChild(tdNickname);
            //---

            // Роль ---
            td = document.createElement("td");
            td.style.padding = "1px";

            let selectElementCustomerRoles = new SelectElementCustomerRoles(
                null, null, null, false);

            selectElementCustomerRoles.prepare();
            await selectElementCustomerRoles.fill();

            let role = customerResponseDTOObj.getRole();
            if (role) {
                selectElementCustomerRoles.changeSelectedOptionByValue(role.getCode(), true);
            }

            let select = selectElementCustomerRoles.getSelect();
            if (select) {
                select.style.height = ROW_HEIGHT;

                let isCorrect = true;

                // Изменить роль самому себе нельзя ---
                let customerIdStr = _PROJECT_COOKIES.CUSTOMER_ID.getValue();
                let customerId = _BIGINT_UTILS.parse(customerIdStr);
                if (customerId === customerResponseDTOObj.getId()) {
                    isCorrect = false;
                    selectElementCustomerRoles.changeDisabledStatus(true);
                    selectElementCustomerRoles.changeTitle("Нельзя изменить роль самому себе.");
                }
                //---

                if (isCorrect) {
                    select.addEventListener(_EVENT_NAMES.SELECT.CHANGE, async function() {
                        selectElementCustomerRoles.changeDisabledStatus(true);

                        let dto = new EntityEditValueByIdRequestDTO();
                        dto.setId(customerResponseDTOObj.getId());
                        dto.setValue(selectElementCustomerRoles.getSelectedValue());

                        let jsonResponse = await _CUSTOMERS_API.PATCH.editRole(dto);
                        if (jsonResponse.getStatus() === _HTTP_STATUSES.OK) {
                            let customer = new CustomerResponseDTO(jsonResponse.getJson());

                            // Очищаем колонку никнейма, заполняем на основе новых данных ---
                            tdNickname.replaceChildren();

                            aElementCustomer.setCustomerResponseDTO(customer);
                            await aElementCustomer.fill();

                            let a = aElementCustomer.getA();
                            if (a) {
                                tdNickname.appendChild(a);
                            }
                            //---

                            selectElementCustomerRoles.changeDisabledStatus(false);
                        } else {
                            selectElementCustomerRoles.changeDisabledStatus(true);
                            selectElementCustomerRoles.changeTitle(
                                new ResponseMessageResponseDTO(jsonResponse.getJson()).getMessage());
                        }
                    });
                }
            }

            let divContainer = selectElementCustomerRoles.getDivContainer();
            if (divContainer) {
                td.appendChild(divContainer);
            }

            tr.appendChild(td);
            //---
        }

        return tr;
    }


    async prepare() {
        await super.prepare();

        let inputTextElementFinder = this.#inputTextElementFinder;
        if (inputTextElementFinder) {
            if (!inputTextElementFinder.getIsPrepared()) {
                inputTextElementFinder.prepare();
            }

            let self = this;
            inputTextElementFinder.addInputFunction(function() {
                self.startToFill();
            })
        }

        let selectElementCustomerRoles = this.#selectElementCustomerRoles;
        if (selectElementCustomerRoles) {
            if (!selectElementCustomerRoles.getIsPrepared()) {
                selectElementCustomerRoles.prepare();
            }

            let select = selectElementCustomerRoles.getSelect();
            if (select) {
                let self = this;
                select.addEventListener(_EVENT_NAMES.SELECT.CHANGE, function() {
                    self.startToFill();
                })
            }
        }

        let buttonElementRefresh = this.#buttonElementRefresh;
        if (buttonElementRefresh) {
            if (!buttonElementRefresh.getIsPrepared()) {
                buttonElementRefresh.prepare();
            }

            let self = this;
            buttonElementRefresh.setBeforeRefreshFunction(function() {
                self.changeDisabledStatusToTableInstruments(true);

                // Отображаем загрузки на момент перезагрузки ---
                self.showLoading();
                //---
            });
            buttonElementRefresh.setRefreshFunction(async function() {
                let selectElementCustomerRoles = self.#selectElementCustomerRoles;
                if (selectElementCustomerRoles) {
                    await selectElementCustomerRoles.refresh(true);
                }
            });            buttonElementRefresh.setAfterRefreshFunction(function() {
                self.startToFill();
                self.changeDisabledStatusToTableInstruments(false);
            });
        }
    }

    async tryToCreateTrsArr(giveAccessToShowMessage) {
        let trsArr;

        // Получаем данные для поиска ---
        let nickname;
        let inputTextElementFinder = this.#inputTextElementFinder;
        if (inputTextElementFinder) {
            nickname = inputTextElementFinder.getValue();
        }

        let customerRoleCode;
        let selectElementCustomerRoles = this.#selectElementCustomerRoles;
        if (selectElementCustomerRoles) {
            customerRoleCode = selectElementCustomerRoles.getSelectedValue();
        }

        let maxNumberOfCustomersOnPage = this.#maxNumberOfCustomersOnPage;
        let lastCustomerIdOnPreviousPage = this.getValueForNextPage();
        //---

        let jsonResponse = await _CUSTOMERS_API.GET.getAll(
            nickname, customerRoleCode, maxNumberOfCustomersOnPage, lastCustomerIdOnPreviousPage);
        if (jsonResponse.getStatus() === _HTTP_STATUSES.OK) {
            trsArr = [];

            let json = jsonResponse.getJson();
            for (let i = 0; i < json.length; i++) {
                if (!this.getFindStatus()) break;

                let customerResponseDTO = new CustomerResponseDTO(json[i]);
                let tr = await this.#createTr(customerResponseDTO);
                if (tr) {
                    trsArr.push(tr);
                }

                if (i === json.length - 1) {
                    this.setValueForNextPage(customerResponseDTO.getId());
                }
            }

            // Генерируем кнопку "Показать больше" ---
            if (this.getFindStatus() && maxNumberOfCustomersOnPage === json.length) {
                let tr = this.createTrShowMore(`Показать ещё ${maxNumberOfCustomersOnPage} пользователей`);
                if (tr) {
                    trsArr.push(tr);
                }
            }
            //---
        } else if (giveAccessToShowMessage) {
            this.showMessage(new ResponseMessageResponseDTO(jsonResponse.getJson()).getMessage(),
                _CSS_ROOT.SMALL_FONT_SIZE_STYLE_ID);
        }

        return trsArr;
    }

    changeDisabledStatusToTableInstruments(isDisabled) {
        let buttonElementRefresh = this.#buttonElementRefresh;
        if (buttonElementRefresh) {
            buttonElementRefresh.changeDisabledStatus(isDisabled);
        }

        let inputTextElementFinder = this.#inputTextElementFinder;
        if (inputTextElementFinder) {
            inputTextElementFinder.changeDisabledStatus(isDisabled);
        }

        let selectElementCustomerRoles = this.#selectElementCustomerRoles;
        if (selectElementCustomerRoles) {
            selectElementCustomerRoles.changeDisabledStatus(isDisabled);
        }
    }
}