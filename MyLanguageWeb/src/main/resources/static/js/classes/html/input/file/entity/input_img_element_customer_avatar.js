import {
    InputImgElement
} from "../input_img_element.js";

import {
    UrlPaths
} from "../../../../url/path/url_paths.js";

const _URL_PATHS = new UrlPaths();

export class InputImgElementCustomerAvatar extends InputImgElement {
    #customerResponseDTO;

    constructor(divInputImgContainer, img, divInputFileContainer, labelContainer, inputFile, buttonDropSelectedFiles,
                divMessageContainer) {
        super(divInputImgContainer, img, divInputFileContainer, labelContainer, inputFile, buttonDropSelectedFiles,
            divMessageContainer)
    }

    setCustomerResponseDTO(customerResponseDTOObj) {
        this.#customerResponseDTO = customerResponseDTOObj;
    }

    getDefaultImgSrc() {
        let src;

        let customerResponseDTO = this.#customerResponseDTO;
        if (customerResponseDTO) {
            src = customerResponseDTO.getPathToAvatar();
        }

        if (!src) {
            src = _URL_PATHS.CUSTOMERS.AVATAR_DEFAULT.getPath();
        }

        return src;
    }
}