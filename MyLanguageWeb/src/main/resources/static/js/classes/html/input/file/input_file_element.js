import {
    RuleTypes
} from "../../span/elements/rule/rule_types.js";

import {
    MIMEType
} from "./mime_type_with_size/mime_type/mime_type.js";

import {
    CssInputFilesElement
} from "../../../css/input/css_input_files_element.js";

import {
    FileMimeTypes
} from "./mime_type_with_size/mime_type/types/file_mime_types.js";

import {
    ImageMIMETypes
} from "./mime_type_with_size/mime_type/types/image_mime_types.js";

import {
    MIMETypeWithSize
} from "./mime_type_with_size/mime_type_with_size.js";

import {
    FileSize
} from "./mime_type_with_size/file_size/file_size.js";

import {
    FileSizeUnits
} from "./mime_type_with_size/file_size/file_size_units.js";

import {
    SpanRuleElement
} from "../../span/elements/rule/span_rule_element.js";

import {
    EventNames
} from "../../event_names.js";

import {
    ImgSrcs
} from "../../img_srcs.js";

const _CSS_INPUT_FILES_ELEMENT = new CssInputFilesElement();

const _IMAGE_MIME_TYPES = new ImageMIMETypes();
const _FILE_MIME_TYPES = new FileMimeTypes();
const _RULE_TYPES = new RuleTypes();
const _FILE_SIZE_UNITS = new FileSizeUnits();
const _IMG_SRCS = new ImgSrcs();
const _EVENT_NAMES = new EventNames();

export class InputFileElement {
    #divContainer;
    #labelContainer;
    #inputFile;
    #buttonDropSelectedFiles;
    #divMessageContainer;

    #isPrepared = false;
    #MIMETypesWithSizeArr;
    #currentSelectedFiles;

    constructor(divContainer, labelContainer, inputFile, buttonDropSelectedFiles, divMessageContainer) {
        this.#divContainer = divContainer;
        this.#labelContainer = labelContainer;
        this.#inputFile = inputFile;
        this.#buttonDropSelectedFiles = buttonDropSelectedFiles;
        this.#divMessageContainer = divMessageContainer;

        this.#tryToSetDefaultValues();
    }

    getDivContainer() {
        return this.#divContainer;
    }

    getInputFile() {
        return this.#inputFile;
    }

    getButtonDropSelectedFiles() {
        return this.#buttonDropSelectedFiles;
    }

    getIsPrepared() {
        return this.#isPrepared;
    }

    getFiles() {
        let files;

        let inputFile = this.#inputFile;
        if (inputFile) {
            files = inputFile.files;
        }

        return files;
    }


    #tryToSetDefaultValues() {
        let divContainer = this.#divContainer;
        if (!divContainer) {
            divContainer = document.createElement("div");
            divContainer.classList.add(_CSS_INPUT_FILES_ELEMENT.DIV_INPUT_FILE_ELEMENT_CONTAINER_CLASS_ID);
        }

        let labelContainer = this.#labelContainer;
        let inputFile = this.#inputFile;
        if (!labelContainer || !inputFile) {
            // Контейнер для выбора файла (нужно, чтобы кастомизировать кнопку ---
            labelContainer = document.createElement("label");
            labelContainer.classList.add(_CSS_INPUT_FILES_ELEMENT.LABEL_INPUT_FILE_ELEMENT_CONTAINER_CLASS_ID);
            //---

            // Выбор файла ---
            inputFile = document.createElement("input");
            inputFile.type = "file";

            labelContainer.appendChild(inputFile);
            //---

            // Вспомогательный текст (кастомизация кнопки) ---
            let spanText = document.createElement("span");
            spanText.textContent = "Выберите файл";

            labelContainer.appendChild(spanText);
            //---
        }

        let buttonDropSelectedFiles = this.#buttonDropSelectedFiles;
        if (!buttonDropSelectedFiles) {
            buttonDropSelectedFiles = document.createElement("button");
            buttonDropSelectedFiles.classList.add(_CSS_INPUT_FILES_ELEMENT.BUTTON_DROP_SELECTED_FILES_CLASS_ID);

            let img = document.createElement("img");
            img.src = _IMG_SRCS.BUTTONS.DELETE;

            buttonDropSelectedFiles.appendChild(img);
        }

        let divMessageContainer = this.#divMessageContainer;
        if (!divMessageContainer) {
            divMessageContainer = document.createElement("div");
            divMessageContainer.classList.add(_CSS_INPUT_FILES_ELEMENT.DIV_INPUT_FILE_ELEMENT_MESSAGE_CONTAINER_CLASS_ID);
        }

        // Добавляем элементы в контейнер, если у них нет родителя ---
        if ((labelContainer && !labelContainer.parentElement)
            && buttonDropSelectedFiles && !buttonDropSelectedFiles.parentElement) {
            let div = document.createElement("div");
            div.classList.add(_CSS_INPUT_FILES_ELEMENT.DIV_INPUT_FILE_ELEMENT_ACTIONS_CONTAINER_CLASS_ID);
            div.appendChild(labelContainer);
            div.appendChild(buttonDropSelectedFiles);

            divContainer.appendChild(div);
        }

        if (divMessageContainer && !divMessageContainer.parentElement) {
            divContainer.appendChild(divMessageContainer);
        }
        //---

        this.#divContainer = divContainer;
        this.#labelContainer = labelContainer;
        this.#inputFile = inputFile;
        this.#buttonDropSelectedFiles = buttonDropSelectedFiles;
        this.#divMessageContainer = divMessageContainer;
    }

    #findMIMETypeWithSizeByMIMEType(MIMETypeObj) {
        let MIMETypeWithSizeResult;

        if (MIMETypeObj) {
            let MIMETypesWithSizeArr = this.#MIMETypesWithSizeArr;
            if (MIMETypesWithSizeArr) {
                for (let MIMETypeWithSize of MIMETypesWithSizeArr) {
                    let MIMEType = MIMETypeWithSize.getMIMEType();
                    if (MIMEType && MIMEType.getMIMEHeader() === MIMETypeObj.getMIMEHeader()) {
                        MIMETypeWithSizeResult = MIMETypeWithSize;
                        break;
                    }
                }
            }
        }

        return MIMETypeWithSizeResult;
    }

    #createAcceptAttributeByMIMETypeALL(MIMETypeObjALL) {
        let acceptAttribute;

        if (MIMETypeObjALL) {
            let MIMETypesWithSizeArr = this.#MIMETypesWithSizeArr;
            if (MIMETypesWithSizeArr) {
                let formats = [];

                // Добавляем все разрешенные форматы файлов ---
                for (let MIMETypeWithSize of MIMETypesWithSizeArr) {
                    let MIMEType = MIMETypeWithSize.getMIMEType();
                    if (MIMEType && MIMEType.getType() === MIMETypeObjALL.getType()) {
                        formats.push(MIMEType.getFormat());
                    }
                }
                //---

                acceptAttribute = formats.join(",");
            }
        }

        return acceptAttribute;
    }

    #tryToCreateAcceptAttribute() {
        let acceptAttributeResult;
        let isCorrect = true;

        // Проверяем наличие общего MIME-типа всех файлов (если он есть, мы не должны генерировать accept атрибут) ---
        let currentMIMETypeALL = _FILE_MIME_TYPES.ALL;
        let MIMETypeWithSizeALL = this.#findMIMETypeWithSizeByMIMEType(currentMIMETypeALL);
        if (MIMETypeWithSizeALL) {
            isCorrect = false;
        }
        //---

        if (isCorrect) {
            let acceptAttributes = [];

            // Общий тип файлов ---
            currentMIMETypeALL = _FILE_MIME_TYPES.ALL;
            MIMETypeWithSizeALL = this.#findMIMETypeWithSizeByMIMEType(currentMIMETypeALL);
            if (!MIMETypeWithSizeALL) {
                let acceptAttribute = this.#createAcceptAttributeByMIMETypeALL(currentMIMETypeALL);
                if (acceptAttribute) {
                    acceptAttributes.push(acceptAttribute);
                }
            }
            //---

            // Общий тип изображений ---
            currentMIMETypeALL = _IMAGE_MIME_TYPES.ALL;
            MIMETypeWithSizeALL = this.#findMIMETypeWithSizeByMIMEType(currentMIMETypeALL);
            if (MIMETypeWithSizeALL) {
                let title = currentMIMETypeALL.getMIMEHeader();
                if (title) {
                    acceptAttributes.push(title);
                }
            } else {
                let acceptAttribute = this.#createAcceptAttributeByMIMETypeALL(currentMIMETypeALL);
                if (acceptAttribute) {
                    acceptAttributes.push(acceptAttribute);
                }
            }
            //---

            // Генерируем итоговый accept атрибут ---
            acceptAttributeResult = acceptAttributes.join(",");
            //---
        }

        return acceptAttributeResult;
    }

    #createFormatsWithSizeStrByMIMETypeALL(MIMETypeObjALL) {
        let formatsWithSizeStrResult;

        // Получаем все MIME-типы на основе пришедшего общего MIME-типа ---
        let MIMETypesWithSizeByMIMETypeALLArr;

        let MIMETypesWithSizeArr = this.#MIMETypesWithSizeArr;
        if (MIMETypesWithSizeArr) {
            MIMETypesWithSizeByMIMETypeALLArr = [];

            for (let MIMETypeWithSize of MIMETypesWithSizeArr) {
                let MIMEType = MIMETypeWithSize.getMIMEType();
                if (MIMEType && MIMEType.getType()=== MIMETypeObjALL.getType()) {
                    MIMETypesWithSizeByMIMETypeALLArr.push(MIMETypeWithSize);
                }
            }
        }
        //---

        if (MIMETypesWithSizeByMIMETypeALLArr
            && MIMETypesWithSizeByMIMETypeALLArr.length > 0) {
            // Получаем все размеры в байтах ---
            let fileSizeBytesSet = new Set();
            for (let MIMETypeWithSize of MIMETypesWithSizeByMIMETypeALLArr) {
                let fileSize = MIMETypeWithSize.getFileSize();
                if (fileSize) {
                    fileSizeBytesSet.add(fileSize.getNumberOfBytes());
                }
            }
            //---

            // Сортируем размеры по убыванию ---
            let fileSizeBytesArr = Array.from(fileSizeBytesSet).sort(function(a, b) {
                if (a < b) return 1;
                if (a === b) return 0;
                if (a > b) return -1;
            });
            //---

            // Генерируем массив строк разрешённых MIME-форматов с размерами ---
            let formatsWithSizeStrs = [];
            for (let fileSizeBytes of fileSizeBytesArr) {
                let formatsWithCurrentFileSizeBytes = [];
                let currentFileSize;
                let MIMETypesWithSizeArr = this.#MIMETypesWithSizeArr;
                if (MIMETypesWithSizeArr) {
                    for (let MIMETypeWithSize of MIMETypesWithSizeArr) {
                        let fileSize = MIMETypeWithSize.getFileSize();
                        if (fileSize && fileSizeBytes === fileSize.getNumberOfBytes()) {
                            currentFileSize = fileSize;

                            let MIMEType = MIMETypeWithSize.getMIMEType();
                            if (MIMEType) {
                                formatsWithCurrentFileSizeBytes.push(MIMEType.getFormat());
                            }

                        }
                    }
                }

                if (formatsWithCurrentFileSizeBytes && currentFileSize) {
                    let formatsWithSizeStr = formatsWithCurrentFileSizeBytes.join(", ");
                    if (formatsWithSizeStr) {
                        formatsWithSizeStr = `${formatsWithSizeStr} (${currentFileSize.createStr()})`;
                        formatsWithSizeStrs.push(formatsWithSizeStr);
                    }
                }
            }
            //---

            // Генерируем итоговую строку ---
            formatsWithSizeStrResult = formatsWithSizeStrs.join(", ");
            //---

        }

        return formatsWithSizeStrResult;
    }

    #createFormatsWithSizeStr() {
        let formatsWithSizeStrResult;

        // Проверяем наличие общего MIME-типа всех файлов (если он есть, мы не должны генерировать строки остальных MIME-типов) ---
        let currentMIMETypeALL = _FILE_MIME_TYPES.ALL;
        let MIMETypeWithSizeALL = this.#findMIMETypeWithSizeByMIMEType(currentMIMETypeALL);
        if (MIMETypeWithSizeALL) {
            let fileSize = MIMETypeWithSizeALL.getFileSize();
            if (fileSize) {
                formatsWithSizeStrResult = `файлы (${fileSize.createStr()})`;
            }
        }

        if (!formatsWithSizeStrResult) {
            let formatsWithSizeStrs = [];

            // Проверяем наличие общего MIME-типа всех файлов ---
            currentMIMETypeALL = _FILE_MIME_TYPES.ALL;
            MIMETypeWithSizeALL = this.#findMIMETypeWithSizeByMIMEType(currentMIMETypeALL);
            if (!MIMETypeWithSizeALL) {
                let formatsWithSizeStr = this.#createFormatsWithSizeStrByMIMETypeALL(currentMIMETypeALL);
                if (formatsWithSizeStr) {
                    formatsWithSizeStrs.push(`файлы ${formatsWithSizeStr}`);
                }
            }
            //---


            // Проверяем наличие общего MIME-типа всех изображений ---
            currentMIMETypeALL = _IMAGE_MIME_TYPES.ALL;
            MIMETypeWithSizeALL = this.#findMIMETypeWithSizeByMIMEType(currentMIMETypeALL);
            if (MIMETypeWithSizeALL) {
                let fileSize = MIMETypeWithSizeALL.getFileSize();
                if (fileSize) {
                    formatsWithSizeStrs.push(`изображения (${fileSize.createStr()})`);
                }
            } else {
                let formatsWithSizeStr = this.#createFormatsWithSizeStrByMIMETypeALL(currentMIMETypeALL);
                if (formatsWithSizeStr) {
                    formatsWithSizeStrs.push(`изображения ${formatsWithSizeStr}`);
                }
            }
            //---

            formatsWithSizeStrResult = formatsWithSizeStrs.join(", ");
        }

        return `Разрешено загружать ${formatsWithSizeStrResult}`;
    }

    #dropSelectedFiles() {
        let isPrepared = this.#isPrepared;
        if (isPrepared) {
            this.changeDisabledStatus(true);

            let inputFile = this.#inputFile;
            if (inputFile) {
                // Сбрасываем файлы ---
                inputFile.value = "";
                this.#currentSelectedFiles = inputFile.files;
                //---

                // Отображаем сообщение о допустимых файлах ---
                let formatsWithSizeStr = this.#createFormatsWithSizeStr();
                if (!formatsWithSizeStr) {
                    formatsWithSizeStr = "Выберите файлы";
                }

                this.showRule(_RULE_TYPES.WARNING, formatsWithSizeStr);
                //---
            }

            this.changeDisabledStatus(false);
        } else {
            throw new Error("Object \'InputFileElement\' is not prepared.");
        }
    }

    #checkFile(file) {
        let isCorrect = false;
        let isPrepared = this.#isPrepared;
        if (isPrepared) {
            isCorrect = true;
            let ruleType;
            let message;


            // Проверка файла ---
            if (!file) {
                isCorrect = false;
                ruleType = _RULE_TYPES.ERROR;
                message = "Не удалось прочитать файл";
            }
            //---

            // Проверка поддержки MIME-типа ---
            if (isCorrect) {
                let isMIMETypeALL = false;

                // Проверяем файл на общий MIME-тип файлов ---
                let currentMIMETypeALL = _FILE_MIME_TYPES.ALL;
                let MIMETypeWithSizeALL = this.#findMIMETypeWithSizeByMIMEType(currentMIMETypeALL);
                if (MIMETypeWithSizeALL) {
                    isMIMETypeALL = true;

                    let fileSize = MIMETypeWithSizeALL.getFileSize();
                    if (fileSize && file.size > fileSize.getNumberOfBytes()) {
                        isCorrect = false;
                        ruleType = _RULE_TYPES.ERROR;
                        message = `Размер файла не должен превышать ${fileSize.createStr()} (${file.name})`;
                    }
                }
                //---

                // Проверяем файл на общий MIME-тип изображений ---
                if (isCorrect) {
                    currentMIMETypeALL = _IMAGE_MIME_TYPES.ALL;
                    MIMETypeWithSizeALL = this.#findMIMETypeWithSizeByMIMEType(currentMIMETypeALL);
                    if (MIMETypeWithSizeALL) {
                        isMIMETypeALL = true;

                        let fileSize = MIMETypeWithSizeALL.getFileSize();
                        if (fileSize && file.size > fileSize.getNumberOfBytes()) {
                            isCorrect = false;
                            ruleType = _RULE_TYPES.ERROR;
                            message = `Размер изображения не должен превышать ${fileSize.createStr()} (${file.name})`;
                        }
                    }
                }
                //---

                // Если MIME-тип не общий, мы должны проверить, поддерживается ли указанный MIME-тип ---
                if (isCorrect && !isMIMETypeALL) {
                    let MIMETypesWithSizeArr = this.#MIMETypesWithSizeArr;
                    if (MIMETypesWithSizeArr) {
                        let isFormatSupport = false;

                        let fileExtension = `.${file.name.split(".").pop().toUpperCase()}`;
                        let currentMIMEType = new MIMEType(file.type, fileExtension);

                        for (let MIMETypeWithSize of MIMETypesWithSizeArr) {
                            let MIMEType = MIMETypeWithSize.getMIMEType();
                            if (MIMEType && MIMEType.getFormat() === currentMIMEType.getFormat()) {
                                isFormatSupport = true;

                                let fileSize = MIMETypeWithSize.getFileSize();
                                if (fileSize && file.size > fileSize.getNumberOfBytes()) {
                                    isCorrect = false;
                                    ruleType = _RULE_TYPES.ERROR;
                                    message = `Размер файла формата ${fileExtension} 
                                        не должен превышать ${fileSize.createStr()} (${file.name})`;
                                }

                                break;
                            }
                        }

                        if (!isFormatSupport) {
                            isCorrect = false;
                            ruleType = _RULE_TYPES.ERROR;

                            message = `Файл формата ${fileExtension} не поддерживается (${file.name})`;
                        }
                    }
                }
                //---
            }
            //---

            if (!isCorrect) {
                this.showRule(ruleType, message);
            }
        } else {
            throw new Error("Object \'InputFileElement\' is not prepared.");
        }

        return isCorrect;
    }


    prepare() {
        let isPrepared = this.#isPrepared;
        if (!isPrepared) {
            // Вешаем событие при открытии диалогового окна (чтобы не сбрасывались файлы при пустом выборе) ---
            let inputFile = this.#inputFile;
            if (inputFile) {
                let self = this;
                inputFile.addEventListener(_EVENT_NAMES.INPUT.FILE.CHANGE, function() {
                    if (!this.files || this.files.length === 0) {
                        this.files = self.#currentSelectedFiles;
                    } else {
                        let isCorrect = self.checkFiles(true);
                        if (isCorrect) {
                            self.#currentSelectedFiles = this.files;
                        } else {
                            this.files = self.#currentSelectedFiles;
                        }
                    }
                });
            }
            //---

            // Вешаем событие на кнопку сброса выбранных файлов ---
            let buttonDropSelectedFiles = this.#buttonDropSelectedFiles;
            if (buttonDropSelectedFiles) {
                buttonDropSelectedFiles.title = "Сбросить выбранные файлы";

                let self = this;
                buttonDropSelectedFiles.addEventListener(_EVENT_NAMES.BUTTON.CLICK, function() {
                    self.#dropSelectedFiles();
                });
            }
            //---

            this.#isPrepared = true;
        } else {
            throw new Error("Object \'InputFileElement\' has already been prepared.");
        }
    }


    changeMultiple(isMultiple) {
        let isPrepared = this.#isPrepared;
        if (isPrepared) {
            let inputFile = this.#inputFile;
            if (inputFile) {
                inputFile.multiple = isMultiple;
            }
        } else {
            throw new Error("Object \'InputFileElement\' is not prepared.");
        }
    }

    changeAccept(MIMETypesWithSizeArr) {
        let isPrepared = this.#isPrepared;
        if (isPrepared) {
            // Сохраняем массив ---
            if (MIMETypesWithSizeArr) {
                this.#MIMETypesWithSizeArr = MIMETypesWithSizeArr;
            } else {
                this.#MIMETypesWithSizeArr = [
                    new MIMETypeWithSize(_FILE_MIME_TYPES.ALL, new FileSize(5, _FILE_SIZE_UNITS.MB))
                ];
            }
            //---

            // Пытаемся сгенерировать атрибут допустимых для выбора файлов ---
            let acceptAttribute = this.#tryToCreateAcceptAttribute();
            let inputFile = this.#inputFile;
            if (acceptAttribute && inputFile) {
                inputFile.accept = acceptAttribute;
            }
            //---

            // Сбрасываем ранее выбранные файлы ---
            this.#dropSelectedFiles();
            //---
        } else {
            throw new Error("Object \'InputFileElement\' is not prepared.");
        }
    }


    showRule(ruleTypeObj, message) {
        let isPrepared = this.#isPrepared;
        if (isPrepared) {
            let divMessageContainer = this.#divMessageContainer;
            if (divMessageContainer) {
                divMessageContainer.replaceChildren();
                divMessageContainer.appendChild(new SpanRuleElement(ruleTypeObj, message).getSpan());
            }
        } else {
            throw new Error("Object \'InputFileElement\' is not prepared.");
        }
    }

    checkFiles(doNeedToShowAcceptMessage) {
        let isCorrect = false;
        let isPrepared = this.#isPrepared;
        if (isPrepared) {
            isCorrect = true;

            let inputFile = this.#inputFile;
            if (inputFile) {
                let correctFileNames = [];
                for (let file of inputFile.files) {
                    isCorrect = this.#checkFile(file);
                    if (isCorrect) {
                        correctFileNames.push(file.name);
                    } else break;
                }

                // Если проверка файлов прошла успешно, мы должны об этом сообщить ---
                if (isCorrect && doNeedToShowAcceptMessage) {
                    let ruleType = _RULE_TYPES.ACCEPT;
                    let message = correctFileNames.length < 5
                        ? `Файлы успешно загружены (${correctFileNames.join(", ")})`
                        : `Файлы успешно загружены (${correctFileNames.length} файлов)`;

                    this.showRule(ruleType, message);
                }
                //---
            }
        } else {
            throw new Error("Object \'InputFileElement\' is not prepared.");
        }

        return isCorrect;
    }

    changeDisabledStatus(isDisabled) {
        let isPrepared = this.#isPrepared;
        if (isPrepared) {
            let labelContainer = this.#labelContainer;
            if (labelContainer) {
                if (isDisabled) {
                    labelContainer.classList.add(_CSS_INPUT_FILES_ELEMENT.LABEL_INPUT_FILE_ELEMENT_CONTAINER_DISABLED_CLASS_ID);
                    labelContainer.classList.remove(_CSS_INPUT_FILES_ELEMENT.LABEL_INPUT_FILE_ELEMENT_CONTAINER_CLASS_ID);
                } else {
                    labelContainer.classList.add(_CSS_INPUT_FILES_ELEMENT.LABEL_INPUT_FILE_ELEMENT_CONTAINER_CLASS_ID);
                    labelContainer.classList.remove(_CSS_INPUT_FILES_ELEMENT.LABEL_INPUT_FILE_ELEMENT_CONTAINER_DISABLED_CLASS_ID);
                }
            }

            let inputFile = this.#inputFile;
            if (inputFile) {
                inputFile.disabled = isDisabled;
            }

            let buttonDropSelectedFiles = this.#buttonDropSelectedFiles;
            if (buttonDropSelectedFiles) {
                buttonDropSelectedFiles.disabled = isDisabled;
            }
        } else {
            throw new Error("Object \'InputFileElement\' is not prepared.");
        }
    }
}