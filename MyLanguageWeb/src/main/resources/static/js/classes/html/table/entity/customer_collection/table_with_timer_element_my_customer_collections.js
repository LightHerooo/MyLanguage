import {
    CustomerCollectionsAPI
} from "../../../../api/entity/customer_collections_api.js";

import {
    CssRoot
} from "../../../../css/css_root.js";

import {
    CssDivElement
} from "../../../../css/elements/div/css_div_element.js";

import {
    CssTableElement
} from "../../../../css/elements/table/css_table_element.js";

import {
    HttpStatuses
} from "../../../../api/classes/http/http_statuses.js";

import {
    ButtonWithImgElementSizes
} from "../../../button/with_img/button_with_img_element_sizes.js";

import {
    ButtonWithImgElementTypes
} from "../../../button/with_img/button_with_img_element_types.js";

import {
    EventNames
} from "../../../event_names.js";

import {
    TableUtils
} from "../../table_utils.js";

import {
    TableWithTimerAbstractElement
} from "../../abstracts/table_with_timer_abstract_element.js";

import {
    SelectElementBoolean
} from "../../../select/elements/boolean/select_element_boolean.js";

import {
    ButtonWithImgElement
} from "../../../button/with_img/button_with_img_element.js";

import {
    DivElementCustomerCollectionInfo
} from "../../../div/entity/customer_collection/info/div_element_customer_collection_info.js";

import {
    EntityEditValueByIdRequestDTO
} from "../../../../dto/other/request/entity/edit/entity_edit_value_by_id_request_dto.js";

import {
    ResponseMessageResponseDTO
} from "../../../../dto/other/response/response_message_response_dto.js";

import {
    TableWithTimerElementWordsInCollection
} from "../word_in_collection/table_with_timer_element_words_in_collection.js";

import {
    CustomerCollectionResponseDTO
} from "../../../../dto/entity/customer_collection/response/customer_collection_response_dto.js";

import {
    ProjectCookies
} from "../../../project_cookies.js";

import {
    AButtonWithImgElement
} from "../../../a/a_button/with_img/a_button_with_img_element.js";

import {
    AButtonWithImgElementTypes
} from "../../../a/a_button/with_img/a_button_with_img_element_types.js";

import {
    AButtonWithImgElementSizes
} from "../../../a/a_button/with_img/a_button_with_img_element_sizes.js";

import {
    UrlPaths
} from "../../../../url/path/url_paths.js";

import {
    HrefTypes
} from "../../../a/href_types.js";

const _CUSTOMER_COLLECTIONS_API = new CustomerCollectionsAPI();

const _CSS_ROOT = new CssRoot();
const _CSS_DIV_ELEMENT = new CssDivElement();
const _CSS_TABLE_ELEMENT = new CssTableElement();

const _PROJECT_COOKIES = new ProjectCookies();
const _HTTP_STATUSES = new HttpStatuses();
const _BUTTON_WITH_IMG_ELEMENT_SIZES = new ButtonWithImgElementSizes();
const _BUTTON_WITH_IMG_ELEMENT_TYPES = new ButtonWithImgElementTypes();
const _A_BUTTON_WITH_IMG_ELEMENT_TYPES = new AButtonWithImgElementTypes();
const _A_BUTTON_WITH_IMG_ELEMENT_SIZES = new AButtonWithImgElementSizes();
const _EVENT_NAMES = new EventNames();
const _TABLE_UTILS = new TableUtils();
const _URL_PATHS = new UrlPaths();
const _HREF_TYPES = new HrefTypes();

export class TableWithTimerElementMyCustomerCollections extends TableWithTimerAbstractElement {
    #divWithTimerElementCustomerCollectionsStatistic;

    #inputTextElementFinder;
    #selectElementLangsIn;
    #selectElementBooleanIsActive;
    #buttonElementRefresh;

    #maxNumberOfCustomerCollectionsOnPage = 10;
    #myCustomerCollectionRowsMap = new Map();

    constructor(table, colgroup, thead, tbody) {
        super(table, colgroup, thead, tbody);
    }

    setDivWithTimerElementCustomerCollectionsStatistic(divWithTimerElementCustomerCollectionsStatisticObj) {
        this.#divWithTimerElementCustomerCollectionsStatistic = divWithTimerElementCustomerCollectionsStatisticObj;
    }

    setInputTextElementFinder(inputTextElementFinderObj) {
        this.#inputTextElementFinder = inputTextElementFinderObj;
    }

    setSelectElementLangsIn(selectElementLangsInObj) {
        this.#selectElementLangsIn = selectElementLangsInObj;
    }

    setSelectElementBooleanIsActive(selectElementBooleanObj) {
        this.#selectElementBooleanIsActive = selectElementBooleanObj;
    }

    setButtonElementRefresh(buttonElementRefreshObj) {
        this.#buttonElementRefresh = buttonElementRefreshObj;
    }


    #startToFillAll() {
        this.startToFill();

        let divWithTimerElementCustomerCollectionsStatistic = this.#divWithTimerElementCustomerCollectionsStatistic;
        if (divWithTimerElementCustomerCollectionsStatistic) {
            divWithTimerElementCustomerCollectionsStatistic.startToFill();
        }
    }

    async #createTr(customerCollectionResponseDTOObj) {
        let tr;
        if (customerCollectionResponseDTOObj) {
            let tableCurrentCustomerCollection =
                await this.#createTableForCurrentCustomerCollection(customerCollectionResponseDTOObj);

            let divContainer;
            if (tableCurrentCustomerCollection) {
                divContainer = document.createElement("div");
                divContainer.appendChild(tableCurrentCustomerCollection);

                let myCustomerCollectionRow = new MyCustomerCollectionRow();
                myCustomerCollectionRow.setDivContainer(divContainer);

                let myCustomerCollectionRowsMap = this.#myCustomerCollectionRowsMap;
                if (myCustomerCollectionRowsMap) {
                    myCustomerCollectionRowsMap.set(customerCollectionResponseDTOObj.getId(), myCustomerCollectionRow);
                }
            }

            // Создаём строку на основе сгенерированного контейнера ---
            if (divContainer) {
                tr = _TABLE_UTILS.createTrWithAnyElement(divContainer, this.getNumberOfColumns(), true);
            }
            //---
        }

        return tr;
    }

    async #createTableForCurrentCustomerCollection(customerCollectionResponseDTOObj){
        let table;

        let tr = await this.#createTrForCurrentCustomerCollection(customerCollectionResponseDTOObj);
        if (tr) {
            table = document.createElement("table");
            table.classList.add(_CSS_TABLE_ELEMENT.TABLE_ELEMENT_CLASS_ID);

            let currentRowNumber = this.getCurrentRowNumber();
            if (currentRowNumber % 2n === 0n) {
                table.style.margin = "-10px -5px -5px -5px";
            }

            let selfColgroup = this.getColgroup();
            if (selfColgroup) {
                let colgroup = selfColgroup.cloneNode(true);
                table.appendChild(colgroup);
            }

            let tbody = document.createElement("tbody");
            if (currentRowNumber % 2n === 0n) {
                let invisibleRow = document.createElement("tr");
                tbody.appendChild(invisibleRow);
            }
            tbody.appendChild(tr);

            table.appendChild(tbody);
        }

        return table;
    }

    async #createTrForCurrentCustomerCollection(customerCollectionResponseDTOObj) {
        let tr;
        if (customerCollectionResponseDTOObj) {
            tr = document.createElement("tr");

            // Номер строки ---
            let td = document.createElement("td");
            td.style.textAlign = "center";

            this.incrementCurrentRowNumber();
            td.textContent = `${this.getCurrentRowNumber()}.`;

            tr.appendChild(td);
            //---

            // Коллекция ---
            td = document.createElement("td");

            let divElementCustomerCollectionInfo = new DivElementCustomerCollectionInfo(null);
            divElementCustomerCollectionInfo.setCustomerCollectionResponseDTO(customerCollectionResponseDTOObj);
            await divElementCustomerCollectionInfo.prepare();
            await divElementCustomerCollectionInfo.fill();

            td.appendChild(divElementCustomerCollectionInfo.getDiv());
            tr.appendChild(td);
            //---

            // Активность ---
            td = document.createElement("td");
            td.style.padding = "1px";

            let selectElementBooleanIsActive = new SelectElementBoolean();
            selectElementBooleanIsActive.prepare();
            await selectElementBooleanIsActive.refresh(false);

            selectElementBooleanIsActive.changeSelectedOptionByValue(
                customerCollectionResponseDTOObj.getIsActiveForAuthor(), true);

            let select = selectElementBooleanIsActive.getSelect();
            if (select) {
                select.style.minHeight = "200px";
                select.style.width = "100%";

                let self = this;
                select.addEventListener(_EVENT_NAMES.SELECT.CHANGE, async function() {
                    selectElementBooleanIsActive.changeDisabledStatus(true);

                    let entityEditValueByIdRequestDTO = new EntityEditValueByIdRequestDTO();
                    entityEditValueByIdRequestDTO.setId(customerCollectionResponseDTOObj.getId());
                    entityEditValueByIdRequestDTO.setValue(selectElementBooleanIsActive.getSelectedValue());

                    let jsonResponse = await _CUSTOMER_COLLECTIONS_API.PATCH.editIsActiveForAuthor(
                        entityEditValueByIdRequestDTO);
                    if (jsonResponse.getStatus() === _HTTP_STATUSES.OK) {
                        selectElementBooleanIsActive.changeDisabledStatus(false);
                    } else {
                        selectElementBooleanIsActive.changeTitle(
                            new ResponseMessageResponseDTO(jsonResponse.getJson()).getMessage());
                    }

                    let divWithTimerElementCustomerCollectionsStatistic =
                        self.#divWithTimerElementCustomerCollectionsStatistic;
                    if (divWithTimerElementCustomerCollectionsStatistic) {
                        divWithTimerElementCustomerCollectionsStatistic.startToFill();
                    }
                });

                td.appendChild(select);
            }

            tr.appendChild(td);
            //---

            // Действия ---
            td = document.createElement("td");

            let divActions = document.createElement("div");
            divActions.classList.add(_CSS_DIV_ELEMENT.DIV_ELEMENT_CONTENT_CENTER_CLASS_ID);
            divActions.style.grid = "1fr 1fr / 1fr";
            divActions.style.gap = "5px";

            // Изменение коллекции
            let aButtonWithImgElement = new AButtonWithImgElement(null, null);
            aButtonWithImgElement.changeTo(_A_BUTTON_WITH_IMG_ELEMENT_TYPES.EDIT);
            aButtonWithImgElement.changeAButtonWithImgElementSize(_A_BUTTON_WITH_IMG_ELEMENT_SIZES.SIZE_32);
            aButtonWithImgElement.changeTitle("Изменить коллекцию");

            let path = _URL_PATHS.CUSTOMER_COLLECTIONS.EDIT.createFullPath();
            aButtonWithImgElement.changeHref(`${path}/${customerCollectionResponseDTOObj.getId()}`);
            aButtonWithImgElement.changeHrefType(_HREF_TYPES.OPEN_IN_THIS_PAGE);

            let a = aButtonWithImgElement.getA();
            if (a) {
                divActions.appendChild(a);
            }

            // Список слов в коллекции
            let buttonWithImgElementShowWordsInCollection = new ButtonWithImgElement(null, null);
            buttonWithImgElementShowWordsInCollection.changeButtonWithImgElementSize(
                _BUTTON_WITH_IMG_ELEMENT_SIZES.SIZE_32);

            if (customerCollectionResponseDTOObj.getNumberOfWords()) {
                this.#changeToShowWordsInCollectionAction(buttonWithImgElementShowWordsInCollection,
                    customerCollectionResponseDTOObj.getId());
            } else {
                buttonWithImgElementShowWordsInCollection.changeDisabledStatus(true);
                buttonWithImgElementShowWordsInCollection.changeTo(_BUTTON_WITH_IMG_ELEMENT_TYPES.ARROW_DOWN);
                buttonWithImgElementShowWordsInCollection.changeTitle("Коллекция пуста");
            }

            let button = buttonWithImgElementShowWordsInCollection.getButton();
            if (button) {
                divActions.appendChild(button);
            }

            td.appendChild(divActions);
            tr.appendChild(td);
            //---
        }

        return tr;
    }

    #changeToShowWordsInCollectionAction(buttonWithImgElementObj, customerCollectionId) {
        if (buttonWithImgElementObj) {
            buttonWithImgElementObj.changeDisabledStatus(true);
            buttonWithImgElementObj.changeTo(_BUTTON_WITH_IMG_ELEMENT_TYPES.ARROW_DOWN);
            buttonWithImgElementObj.changeTitle("Показать слова в коллекции");

            let button = buttonWithImgElementObj.getButton();
            if (button) {
                let self = this;
                button.onclick = async function() {
                    buttonWithImgElementObj.changeDisabledStatus(true);

                    let myCustomerCollectionRowsMap = self.#myCustomerCollectionRowsMap;
                    if (myCustomerCollectionRowsMap) {
                        let myCustomerCollectionRow = myCustomerCollectionRowsMap.get(customerCollectionId);
                        if (myCustomerCollectionRow) {
                            // Создаём таблицу ---
                            let tableWithTimerElementWordsInCollection =
                                new TableWithTimerElementWordsInCollection(
                                    null, null, null, null, false);
                            tableWithTimerElementWordsInCollection.setCustomerCollectionId(customerCollectionId);
                            tableWithTimerElementWordsInCollection.buildNewTable();
                            await tableWithTimerElementWordsInCollection.prepare();

                            // Сохраняем экземпляр в строке ---
                            myCustomerCollectionRow.setTableWithTimerElementWordsInCollection(
                                tableWithTimerElementWordsInCollection);
                            //---

                            myCustomerCollectionRow.showWordsInCollection();
                            self.#changeToHideWordsInCollectionAction(buttonWithImgElementObj, customerCollectionId);
                            //---
                        }
                    }
                }

                buttonWithImgElementObj.changeDisabledStatus(false);
            }
        }
    }

    #changeToHideWordsInCollectionAction(buttonWithImgElementObj, customerCollectionId) {
        if (buttonWithImgElementObj) {
            buttonWithImgElementObj.changeDisabledStatus(true);
            buttonWithImgElementObj.changeTo(_BUTTON_WITH_IMG_ELEMENT_TYPES.ARROW_UP);
            buttonWithImgElementObj.changeTitle("Скрыть слова в коллекции");

            let button = buttonWithImgElementObj.getButton();
            if (button) {
                let self = this;
                button.onclick = function() {
                    let myCustomerCollectionRowsMap = self.#myCustomerCollectionRowsMap;
                    if (myCustomerCollectionRowsMap) {
                        let myCustomerCollectionRow = myCustomerCollectionRowsMap.get(customerCollectionId);
                        if (myCustomerCollectionRow) {
                            myCustomerCollectionRow.hideWordsInCollection();
                            self.#changeToShowWordsInCollectionAction(buttonWithImgElementObj, customerCollectionId);
                        }
                    }
                }

                buttonWithImgElementObj.changeDisabledStatus(false);
            }
        }
    }


    async prepare() {
        await super.prepare();

        let inputTextElementFinder = this.#inputTextElementFinder;
        if (inputTextElementFinder) {
            if (!inputTextElementFinder.getIsPrepared()) {
                inputTextElementFinder.prepare();
            }

            let self = this;
            inputTextElementFinder.addInputFunction(function () {
                self.#startToFillAll();
            });
        }

        let selectElementLangsIn = this.#selectElementLangsIn;
        if (selectElementLangsIn) {
            if (!selectElementLangsIn.getIsPrepared()) {
                selectElementLangsIn.prepare();
                await selectElementLangsIn.fill();
            }

            let select = selectElementLangsIn.getSelect();
            if (select) {
                let self = this;
                select.addEventListener(_EVENT_NAMES.SELECT.CHANGE, function() {
                    self.#startToFillAll();
                })
            }
        }

        let selectElementBooleanIsActive = this.#selectElementBooleanIsActive;
        if (selectElementBooleanIsActive) {
            if (!selectElementBooleanIsActive.getIsPrepared()) {
                selectElementBooleanIsActive.prepare();
                await selectElementBooleanIsActive.fill();
            }

            let select = selectElementBooleanIsActive.getSelect();
            if (select) {
                let self = this;
                select.addEventListener(_EVENT_NAMES.SELECT.CHANGE, function() {
                    self.#startToFillAll();
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

                let divWithTimerElementCustomerCollectionsStatistic = self.#divWithTimerElementCustomerCollectionsStatistic;
                if (divWithTimerElementCustomerCollectionsStatistic) {
                    divWithTimerElementCustomerCollectionsStatistic.showLoading();
                }
                //---
            });
            buttonElementRefresh.setRefreshFunction(async function() {
                let selectElementLangsIn = self.#selectElementLangsIn;
                if (selectElementLangsIn) {
                    await selectElementLangsIn.refresh(true);
                }

                let selectElementBooleanIsActive = self.#selectElementBooleanIsActive;
                if (selectElementBooleanIsActive) {
                    await selectElementBooleanIsActive.refresh(true);
                }
            });
            buttonElementRefresh.setAfterRefreshFunction(function() {
                self.#startToFillAll();
                self.changeDisabledStatusToTableInstruments(false);
            })
        }
    }


    stopToFill() {
        super.stopToFill();

        // Останавливаем все таймеры в строках, очищаем мапу ---
        let myCustomerCollectionRowsMap = this.#myCustomerCollectionRowsMap;
        if (myCustomerCollectionRowsMap) {
            for (let key of myCustomerCollectionRowsMap.keys()) {
                let myCustomerCollectionRow = myCustomerCollectionRowsMap.get(key);
                if (myCustomerCollectionRow) {
                    let tableWithTimerElementWordsInCollection =
                        myCustomerCollectionRow.getTableWithTimerElementWordsInCollection();
                    if (tableWithTimerElementWordsInCollection) {
                        tableWithTimerElementWordsInCollection.stopToFill();
                    }
                }
            }

            myCustomerCollectionRowsMap.clear();
        }
        //---
    }


    async tryToCreateTrsArr(giveAccessToShowMessage) {
        let trsArr;

        // Получаем значения для поиска ---
        let title;
        let inputTextElementFinder = this.#inputTextElementFinder;
        if (inputTextElementFinder) {
            title = inputTextElementFinder.getValue();
        }

        let langCode;
        let selectElementLangsIn = this.#selectElementLangsIn;
        if (selectElementLangsIn) {
            langCode = selectElementLangsIn.getSelectedValue();
        }

        let isActive;
        let selectElementBooleanIsActive = this.#selectElementBooleanIsActive;
        if (selectElementBooleanIsActive) {
            isActive = selectElementBooleanIsActive.getSelectedValue();
        }

        let customerId = _PROJECT_COOKIES.CUSTOMER_ID.getValue();
        let maxNumberOfCollectionsOnPage = this.#maxNumberOfCustomerCollectionsOnPage;
        let lastCollectionIdOnPreviousPage = this.getValueForNextPage();
        //---

        let jsonResponse = await _CUSTOMER_COLLECTIONS_API.GET.getAll(
            title, langCode, isActive, customerId, maxNumberOfCollectionsOnPage, lastCollectionIdOnPreviousPage);
        if (jsonResponse.getStatus() === _HTTP_STATUSES.OK) {
            trsArr = [];

            let json = jsonResponse.getJson();
            for (let i = 0; i < json.length; i++) {
                if (!this.getFindStatus()) break;

                let customerCollectionResponseDTO = new CustomerCollectionResponseDTO(json[i]);
                let tr = await this.#createTr(customerCollectionResponseDTO);
                if (tr) {
                    trsArr.push(tr);
                }

                if (i === json.length - 1) {
                    this.setValueForNextPage(customerCollectionResponseDTO.getId());
                }
            }

            let maxNumberOfCollectionsOnPage = this.#maxNumberOfCustomerCollectionsOnPage;
            if (this.getFindStatus() && json.length === maxNumberOfCollectionsOnPage) {
                let tr = this.createTrShowMore(`Показать ещё ${maxNumberOfCollectionsOnPage} коллекций...`);
                if (tr) {
                    trsArr.push(tr);
                }
            }
        } else if (giveAccessToShowMessage) {
            let message = new ResponseMessageResponseDTO(jsonResponse.getJson()).getMessage();
            this.showMessage(message, _CSS_ROOT.SMALL_FONT_SIZE_STYLE_ID);
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

        let selectElementLangsIn = this.#selectElementLangsIn;
        if (selectElementLangsIn) {
            selectElementLangsIn.changeDisabledStatus(isDisabled);
        }

        let selectElementBooleanIsActive = this.#selectElementBooleanIsActive;
        if (selectElementBooleanIsActive) {
            selectElementBooleanIsActive.changeDisabledStatus(isDisabled);
        }
    }
}

class MyCustomerCollectionRow {
    #divContainer;
    #tableWithTimerElementWordsInCollection;

    #divWithTableBetweenTwoHorizontalDelimiters;

    getDivContainer() {
        return this.#divContainer;
    }

    setDivContainer(divContainer) {
        this.#divContainer = divContainer;
    }

    getTableWithTimerElementWordsInCollection() {
        return this.#tableWithTimerElementWordsInCollection;
    }

    setTableWithTimerElementWordsInCollection(tableWithTimerElementWordsInCollectionObj) {
        this.#tableWithTimerElementWordsInCollection = tableWithTimerElementWordsInCollectionObj;
    }

    getDivWithTableBetweenTwoHorizontalDelimiters() {
        return this.#divWithTableBetweenTwoHorizontalDelimiters;
    }

    setDivWithTableBetweenTwoHorizontalDelimiters(divWithTableBetweenTwoHorizontalDelimiters) {
        this.#divWithTableBetweenTwoHorizontalDelimiters = divWithTableBetweenTwoHorizontalDelimiters;
    }

    showWordsInCollection() {
        let divContainer = this.#divContainer;
        let tableWithTimerElementWordsInCollection = this.#tableWithTimerElementWordsInCollection;
        if (divContainer && tableWithTimerElementWordsInCollection) {
            let table = tableWithTimerElementWordsInCollection.getTable();
            if (table) {
                let divWithTableBetweenTwoHorizontalDelimiters =
                    _TABLE_UTILS.createDivWithTableBetweenTwoHorizontalDelimiters(table);

                if (divWithTableBetweenTwoHorizontalDelimiters) {
                    divContainer.appendChild(divWithTableBetweenTwoHorizontalDelimiters);

                    this.#divWithTableBetweenTwoHorizontalDelimiters = divWithTableBetweenTwoHorizontalDelimiters;
                }
            }

            tableWithTimerElementWordsInCollection.startToFill();
        }
    }

    hideWordsInCollection() {
        let divContainer = this.#divContainer;
        let tableWithTimerElementWordsInCollection = this.#tableWithTimerElementWordsInCollection;
        let divWithTableBetweenTwoHorizontalDelimiters = this.#divWithTableBetweenTwoHorizontalDelimiters;
        if (divContainer
            && tableWithTimerElementWordsInCollection
            && divWithTableBetweenTwoHorizontalDelimiters) {
            tableWithTimerElementWordsInCollection.stopToFill();
            divContainer.removeChild(divWithTableBetweenTwoHorizontalDelimiters);
        }
    }
}