import {
    InputImgElement
} from "../../input_img_element.js";

import {
    UrlPaths
} from "../../../../../url/path/url_paths.js";

const _URL_PATHS = new UrlPaths();

export class InputImgElementCustomerCollectionImage extends InputImgElement {
    #customerCollectionResponseDTO;

    constructor(divInputImgContainer, img, divInputFileContainer, labelContainer, inputFile, buttonDropSelectedFiles,
                divMessageContainer) {
        super(divInputImgContainer, img, divInputFileContainer, labelContainer, inputFile, buttonDropSelectedFiles,
            divMessageContainer)
    }

    setCustomerCollectionResponseDTO(customerCollectionResponseDTOObj) {
        this.#customerCollectionResponseDTO = customerCollectionResponseDTOObj;
    }

    getDefaultImgSrc() {
        let src;

        let customerCollectionResponseDTO = this.#customerCollectionResponseDTO;
        if (customerCollectionResponseDTO) {
            src = customerCollectionResponseDTO.getPathToImage();
        }

        if (!src) {
            src = _URL_PATHS.CUSTOMER_COLLECTIONS.IMAGE_DEFAULT.getPath();
        }

        return src;
    }
}