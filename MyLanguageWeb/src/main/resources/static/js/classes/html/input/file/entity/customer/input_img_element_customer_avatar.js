import {
    InputImgElement
} from "../../input_img_element.js";

import {
    ImgSrcs
} from "../../../../img_srcs.js";

import {
    UrlPath
} from "../../../../../url/path/url_path.js";

const _IMG_SRCS = new ImgSrcs();

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
            let pathToAvatar = customerResponseDTO.getPathToAvatar();
            if (pathToAvatar) {
                src = new UrlPath(pathToAvatar).createFullPath();
            }
        }

        if (!src) {
            src = _IMG_SRCS.ENTITY.CUSTOMER.DEFAULT;
        }

        return src;
    }
}