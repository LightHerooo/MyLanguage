import {
    DivAbstractElement
} from "../../../abstracts/div_abstract_element.js";

import {
    DivElementCustomerCollectionUtils
} from "../div_element_customer_collection_utils.js";

import {
    CssRoot
} from "../../../../../css/css_root.js";

const _CSS_ROOT = new CssRoot();

const _DIV_ELEMENT_CUSTOMER_COLLECTION_UTILS = new DivElementCustomerCollectionUtils();

export class DivElementCustomerCollectionInfo extends DivAbstractElement {
    #customerCollectionId;
    #customerCollectionResponseDTO;

    constructor(div) {
        super(div);
    }

    setCustomerCollectionId(customerCollectionId) {
        this.#customerCollectionId = customerCollectionId;
    }

    setCustomerCollectionResponseDTO(customerCollectionResponseDTOObj) {
        this.#customerCollectionResponseDTO = customerCollectionResponseDTOObj;
    }

    async tryToCreateContent() {
        let div;

        let customerCollectionResponseDTO = this.#customerCollectionResponseDTO;
        let customerCollectionId = this.#customerCollectionId;
        if (customerCollectionResponseDTO) {
            div = _DIV_ELEMENT_CUSTOMER_COLLECTION_UTILS.createDivInfoByDTO(customerCollectionResponseDTO);
        } else if (customerCollectionId) {
            div = _DIV_ELEMENT_CUSTOMER_COLLECTION_UTILS.createDivInfoById(customerCollectionId);
        }

        if (!div) {
            this.showMessage("Не удалось отобразить информацию о коллекции", _CSS_ROOT.MEDIUM_FONT_SIZE_STYLE_ID);
        }

        return div;
    }
}