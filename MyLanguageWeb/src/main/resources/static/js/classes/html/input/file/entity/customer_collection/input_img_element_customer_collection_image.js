import {
    InputImgElement
} from "../../input_img_element.js";

import {
    UrlPath
} from "../../../../../url/path/url_path.js";

import {
    ImgSrcs
} from "../../../../img_srcs.js";

const _IMG_SRCS = new ImgSrcs();

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
            let pathToImage = customerCollectionResponseDTO.getPathToImage();
            if (pathToImage) {
                src = new UrlPath(pathToImage).createFullPath();
            }
        }

        if (!src) {
            src = _IMG_SRCS.ENTITY.CUSTOMER_COLLECTION.DEFAULT;
        }

        return src;
    }
}