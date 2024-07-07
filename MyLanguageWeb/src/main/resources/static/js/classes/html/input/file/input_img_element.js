import {
    InputFileElement
} from "./input_file_element.js";

import {
    CssInputFilesElement
} from "../../../css/elements/input/css_input_files_element.js";

import {
    FileSize
} from "./mime_type_with_size/file_size/file_size.js";

import {
    MIMETypeWithSize
} from "./mime_type_with_size/mime_type_with_size.js";

import {
    ImageMIMETypes
} from "./mime_type_with_size/mime_type/types/image_mime_types.js";

import {
    FileSizeUnits
} from "./mime_type_with_size/file_size/file_size_units.js";

import {
    EventNames
} from "../../event_names.js";

import {
    ImgSrcs
} from "../../img_srcs.js";

const _CSS_INPUT_FILES_ELEMENT = new CssInputFilesElement();

const _IMG_SRCS = new ImgSrcs();
const _IMAGE_MIME_TYPES = new ImageMIMETypes();
const _FILE_SIZE_UNITS = new FileSizeUnits();
const _EVENT_NAMES = new EventNames();

export class InputImgElement extends InputFileElement {
    #divInputImgContainer;
    #img;

    constructor(divInputImgContainer, img, divInputFileContainer, labelContainer, inputFile, buttonDropSelectedFiles,
                divMessageContainer) {
        super(divInputFileContainer, labelContainer, inputFile, buttonDropSelectedFiles, divMessageContainer);
        this.#divInputImgContainer = divInputImgContainer;
        this.#img = img;

        this.#tryToSetDefaultValues();
    }

    getDivInputImgContainer() {
        return this.#divInputImgContainer;
    }


    #tryToSetDefaultValues() {
        let divInputImgContainer = this.#divInputImgContainer;
        if (!divInputImgContainer) {
            divInputImgContainer = document.createElement("div");
            divInputImgContainer.classList.add(_CSS_INPUT_FILES_ELEMENT.DIV_INPUT_IMG_ELEMENT_CONTAINER_CLASS_ID);
        }

        let img = this.#img;
        if (!img) {
            img = document.createElement("img");
        }

        // Добавляем элементы в контейнер, если они не имеют родителя ---
        if (img && !img.parentElement) {
            divInputImgContainer.appendChild(img);
        }
        //---

        // Если изначально основного контейнера не было, мы должны добавить внутрь него контейнер inputFileElement ---
        if (!this.#divInputImgContainer) {
            let div = this.getDivContainer();
            if (div) {
                divInputImgContainer.appendChild(div);
            }
        }
        //---

        this.#divInputImgContainer = divInputImgContainer;
        this.#img = img;
    }


    prepare() {
        super.prepare();

        let inputFile = this.getInputFile();
        if (inputFile) {
            let self = this;
            inputFile.addEventListener(_EVENT_NAMES.INPUT.FILE.CHANGE, function() {
                self.refreshImgSrc();
            });
        }

        let buttonDropSelectedFiles = this.getButtonDropSelectedFiles();
        if (buttonDropSelectedFiles) {
            let self = this;
            buttonDropSelectedFiles.addEventListener(_EVENT_NAMES.BUTTON.CLICK, function() {
                self.refreshImgSrc();
            })
        }

        // Обновляем изображение ---
        this.refreshImgSrc();
        //---

        // Подготавливаем MIME-типы (image), которые будут разрешены ---
        let MIMETypesWithSizeArr = [];

        let imageMIMEType = _IMAGE_MIME_TYPES.PNG;
        let fileSize = new FileSize(5, _FILE_SIZE_UNITS.MB);
        let mimeTypeWithSize = new MIMETypeWithSize(imageMIMEType, fileSize);
        MIMETypesWithSizeArr.push(mimeTypeWithSize);

        imageMIMEType = _IMAGE_MIME_TYPES.JPG;
        fileSize = new FileSize(5, _FILE_SIZE_UNITS.MB);
        mimeTypeWithSize = new MIMETypeWithSize(imageMIMEType, fileSize);
        MIMETypesWithSizeArr.push(mimeTypeWithSize);

        imageMIMEType = _IMAGE_MIME_TYPES.JPEG;
        fileSize = new FileSize(5, _FILE_SIZE_UNITS.MB);
        mimeTypeWithSize = new MIMETypeWithSize(imageMIMEType, fileSize);
        MIMETypesWithSizeArr.push(mimeTypeWithSize);

        imageMIMEType = _IMAGE_MIME_TYPES.GIF;
        fileSize = new FileSize(1, _FILE_SIZE_UNITS.MB);
        mimeTypeWithSize = new MIMETypeWithSize(imageMIMEType, fileSize);
        MIMETypesWithSizeArr.push(mimeTypeWithSize);

        this.changeAccept(MIMETypesWithSizeArr);
        //---
    }


    refreshImgSrc() {
        let inputFile = this.getInputFile();
        let img = this.#img;
        if (inputFile && img) {
            let isCorrect = false;

            let files = inputFile.files;
            if (files) {
                let firstFile = files[0];
                if (firstFile) {
                    isCorrect = true;
                    img.src = URL.createObjectURL(firstFile);
                }
            }

            if (!isCorrect) {
                img.src = this.getDefaultImgSrc();
            }
        }
    }

    getDefaultImgSrc() {
        return _IMG_SRCS.OTHER.EMPTY;
    }
}