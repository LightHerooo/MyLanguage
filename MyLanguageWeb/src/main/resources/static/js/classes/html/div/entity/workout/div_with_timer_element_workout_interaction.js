import {
    DivWithTimerAbstractElement
} from "../../with_timer/abstracts/div_with_timer_abstract_element.js";

import {
    RuleTypes
} from "../../../span/elements/rule/rule_types.js";

import {
    WorkoutsAPI
} from "../../../../api/entity/workouts_api.js";

import {
    HttpStatuses
} from "../../../../api/classes/http/http_statuses.js";

import {
    UrlPaths
} from "../../../../url/path/url_paths.js";

import {
    UrlPath
} from "../../../../url/path/url_path.js";

import {
    SpanRuleElement
} from "../../../span/elements/rule/span_rule_element.js";

import {
    CssDivElement
} from "../../../../css/div/css_div_element.js";

import {
    ButtonWithTextElement
} from "../../../button/with_text/button_with_text_element.js";

import {
    ValueResponseDTO
} from "../../../../dto/other/response/value/value_response_dto.js";

import {
    CssInfoBlock
} from "../../../../css/info_block/css_info_block.js";

import {
    CssRoot
} from "../../../../css/css_root.js";

import {
    WorkoutItemsAPI
} from "../../../../api/entity/workout_items_api.js";

import {
    ResponseMessageResponseDTO
} from "../../../../dto/other/response/response_message_response_dto.js";

import {
    WorkoutItemResponseDTO
} from "../../../../dto/entity/workout_item/response/workout_item_response_dto.js";

import {
    InputTextWithFlagElement
} from "../../../input/text/input_text_with_flag_element.js";

import {
    InputTextElement
} from "../../../input/text/input_text_element.js";

import {
    WorkoutItemEditAnswerRequestDTO
} from "../../../../dto/entity/workout_item/request/workout_item_edit_answer_request_dto.js";

import {
    AnswerInfoResponseDTO
} from "../../../../dto/entity/workout_item/other/answer_info_response_dto.js";

import {
    SpanLoadingElement
} from "../../../span/elements/span_loading_element.js";

import {
    EntityIdRequestDTO
} from "../../../../dto/other/request/entity/entity_id_request_dto.js";

import {
    SpanFlagElement
} from "../../../span/elements/span_flag_element.js";

import {
    EntityEditValueByIdRequestDTO
} from "../../../../dto/other/request/entity/edit/entity_edit_value_by_id_request_dto.js";

import {
    EventNames
} from "../../../event_names.js";

import {
    KeyCodes
} from "../../../key_codes.js";

const _WORKOUTS_API = new WorkoutsAPI();
const _WORKOUT_ITEMS_API = new WorkoutItemsAPI();

const _CSS_DIV_ELEMENT = new CssDivElement();
const _CSS_INFO_BLOCK = new CssInfoBlock();
const _CSS_ROOT = new CssRoot();

const _RULE_TYPES = new RuleTypes();
const _HTTP_STATUSES = new HttpStatuses();
const _URL_PATHS = new UrlPaths();
const _KEY_CODES = new KeyCodes();
const _EVENT_NAMES = new EventNames();

export class DivWithTimerElementWorkoutInteraction extends DivWithTimerAbstractElement {
    #workoutResponseDTO;

    #divElementTimerWorkout;
    #divWithTimerElementWorkoutRoundStatisticNotOver;

    constructor(div) {
        super(div);
    }

    setWorkoutResponseDTO(workoutResponseDTOObj) {
        this.#workoutResponseDTO = workoutResponseDTOObj;
    }

    setDivElementTimerWorkout(divElementTimerWorkoutObj) {
        this.#divElementTimerWorkout = divElementTimerWorkoutObj;
    }

    setDivWithTimerElementWorkoutRoundStatisticNotOver(divWithTimerElementWorkoutRoundStatisticNotOverObj) {
        this.#divWithTimerElementWorkoutRoundStatisticNotOver = divWithTimerElementWorkoutRoundStatisticNotOverObj;
    }


    async #tryToShowNextRound() {
        this.showLoading();

        // Отображаем загрузку в контейнере статистики раунда ---
        let divWithTimerElementWorkoutRoundStatisticNotOver = this.#divWithTimerElementWorkoutRoundStatisticNotOver;
        if (divWithTimerElementWorkoutRoundStatisticNotOver) {
            divWithTimerElementWorkoutRoundStatisticNotOver.showLoading();
        }
        //---

        let workoutResponseDTO = this.#workoutResponseDTO;
        if (workoutResponseDTO) {
            let workoutId = workoutResponseDTO.getId();
            let jsonResponse = await _WORKOUTS_API.GET.findCurrentRoundNumber(workoutId);
            if (jsonResponse.getStatus() === _HTTP_STATUSES.OK) {
                let roundNumber = new ValueResponseDTO(jsonResponse.getJson()).getValue();

                // Устанавливаем номер раунда для поиска статистики раунда ---
                if (divWithTimerElementWorkoutRoundStatisticNotOver) {
                    divWithTimerElementWorkoutRoundStatisticNotOver.setRoundNumber(roundNumber);
                    divWithTimerElementWorkoutRoundStatisticNotOver.startToFill();
                }
                //---

                await this.#showNextRound(roundNumber);
            } else {
                let responseMessageResponseDTO = new ResponseMessageResponseDTO(
                    jsonResponse.getJson());
                if (responseMessageResponseDTO.getId() === 999) {
                    await this.#close();
                } else {
                    this.showRule(_RULE_TYPES.ERROR, responseMessageResponseDTO.getMessage());
                }
            }
        } else {
            this.showRule(_RULE_TYPES.ERROR, "Тренировка не установлена");
        }
    }

    async #showNextRound(roundNumber) {
        this.showLoading();

        let workoutResponseDTO = this.#workoutResponseDTO;
        if (workoutResponseDTO) {
            let isCorrect = true;

            let interactionContainer = new InteractionContainer();

            let numberOfAnswersInCurrentRound;
            let divContent = interactionContainer.getDivContent();
            if (divContent) {
                let span = document.createElement("span");
                span.style.fontSize = _CSS_ROOT.BIG_FONT_SIZE_STYLE_ID;

                // В зависимости от наличия ответов, сообщение будет различаться ---
                let workoutId = workoutResponseDTO.getId();
                let jsonResponse = await _WORKOUT_ITEMS_API.GET.getCount(workoutId, true, roundNumber);
                if (jsonResponse.getStatus() === _HTTP_STATUSES.OK) {
                    numberOfAnswersInCurrentRound = new ValueResponseDTO(jsonResponse.getJson()).getValue();
                    span.textContent = numberOfAnswersInCurrentRound
                        ? `Нажмите кнопку "Продолжить", чтобы продолжить ${roundNumber}-й раунд`
                        : `Нажмите кнопку "Начать", чтобы начать ${roundNumber}-й раунд`;

                    divContent.appendChild(span);
                } else {
                    isCorrect = false;
                    this.showRule(_RULE_TYPES.ERROR, new ResponseMessageResponseDTO(jsonResponse.getJson()).getMessage());
                }
                //---
            }

            let buttonWithTextElement = interactionContainer.getButtonWithTextElement();
            if (buttonWithTextElement) {
                buttonWithTextElement.changeText(numberOfAnswersInCurrentRound
                    ? "Продолжить"
                    : "Начать");

                let button = buttonWithTextElement.getButton();
                if (button) {
                    let self = this;
                    button.addEventListener(_EVENT_NAMES.BUTTON.CLICK, async function() {
                        await self.#tryToShowNextQuestion(roundNumber);
                    })
                }

                // Вешаем горячую клавишу ---
                buttonWithTextElement.addHotkey(_KEY_CODES.ENTER, true);
                //---
            }

            if (isCorrect) {
                this.clear();
                this.removeInfoBlockContainerClassStyle();
                let divParent = this.getDiv();
                if (divParent) {
                    divParent.appendChild(interactionContainer.getDiv());

                    if (buttonWithTextElement) {
                        let button = buttonWithTextElement.getButton();
                        if (button) {
                            button.focus();
                        }
                    }

                    // Возобновляем таймер ---
                    let divElementTimerWorkout = this.#divElementTimerWorkout;
                    if (divElementTimerWorkout) {
                        divElementTimerWorkout.start();
                    }
                    //---
                }
            }
        } else {
            this.showRule(_RULE_TYPES.ERROR, "Тренировка не установлена");
        }
    }

    async #tryToShowNextQuestion(roundNumber) {
        this.showLoading();

        let workoutResponseDTO = this.#workoutResponseDTO;
        if (workoutResponseDTO) {
            // Находим случайный вопрос ---
            let workoutId = workoutResponseDTO.getId();
            let jsonResponse = await _WORKOUT_ITEMS_API.GET.findRandomWithoutAnswer(workoutId, roundNumber);
            if (jsonResponse.getStatus() === _HTTP_STATUSES.OK) {
                let workoutItemResponseDTO = new WorkoutItemResponseDTO(jsonResponse.getJson());
                await this.#showNextQuestion(workoutItemResponseDTO, roundNumber);
            } else {
                let responseMessageResponseDTO = new ResponseMessageResponseDTO(
                    jsonResponse.getJson());
                if (responseMessageResponseDTO.getId() === 999) {
                    await this.#tryToShowNextRound();
                } else {
                    this.showRule(_RULE_TYPES.ERROR, responseMessageResponseDTO.getMessage());
                }
            }
            //---
        } else {
            this.showRule(_RULE_TYPES.ERROR, "Тренировка не установлена");
        }
    }

    async #showNextQuestion(workoutItemResponseDTOObj, roundNumber) {
        this.showLoading();

        if (workoutItemResponseDTOObj) {
            let div = document.createElement("div");
            div.style.display = "grid";
            div.style.grid = "1fr 50px / 1fr";
            div.style.gap = "10px";

            // Вопрос ---
            let divContent = document.createElement("div");
            divContent.classList.add(_CSS_INFO_BLOCK.DIV_INFO_BLOCK_CONTAINER_CLASS_ID);
            divContent.classList.add(_CSS_DIV_ELEMENT.DIV_ELEMENT_CONTENT_CENTER_CLASS_ID);

            let span = document.createElement("span");
            span.style.fontSize = "60px";
            span.textContent = workoutItemResponseDTOObj.getQuestion();

            divContent.appendChild(span);
            div.appendChild(divContent);
            //---

            // Действия для ввода ответа ---
            let divActions = document.createElement("div");
            divActions.style.display = "grid";
            divActions.style.grid = "1fr / 1fr 200px";
            divActions.style.gap = "5px";

            // Поле ответа
            let inputTextElement = new InputTextElement(null);
            let inputTextWithFlagElement = new InputTextWithFlagElement(
                null, inputTextElement, null);

            let workout = workoutItemResponseDTOObj.getWorkout();
            if (workout) {
                let langOut = workout.getLangOut();
                if (langOut) {
                    let country = langOut.getCountry();
                    if (country) {
                        inputTextWithFlagElement.changeFlag(country.getTitle(), country.getCode());
                    }
                }
            }

            let inputText = inputTextWithFlagElement.getInputText();
            if (inputText) {
                inputText.maxLength = 44;
            }

            let divContainer = inputTextWithFlagElement.getDivContainer();
            if (divContainer) {
                divActions.appendChild(divContainer);
            }

            // Кнопка ответа
            let buttonWithTextElement = new ButtonWithTextElement(null);
            buttonWithTextElement.changeText("Ответить");

            let button = buttonWithTextElement.getButton();
            if (button) {
                let self = this;
                button.addEventListener(_EVENT_NAMES.BUTTON.CLICK, async function() {
                    inputTextWithFlagElement.changeDisabledStatus(true);
                    buttonWithTextElement.changeDisabledStatus(true);

                    // Отображаем загрузку без очистки всего контейнера ---
                    let spanLoadingElement = new SpanLoadingElement(null);
                    divContent.replaceChildren();
                    divContent.appendChild(spanLoadingElement.getSpan());
                    //---

                    let workoutItemEditAnswerRequestDTO = new WorkoutItemEditAnswerRequestDTO();
                    workoutItemEditAnswerRequestDTO.setId(workoutItemResponseDTOObj.getId());
                    workoutItemEditAnswerRequestDTO.setAnswer(inputTextWithFlagElement.getValue());

                    await self.#tryToShowAnswerInfo(workoutItemEditAnswerRequestDTO, roundNumber);
                });

                divActions.appendChild(button);
            }

            div.appendChild(divActions);
            //---

            // Вешаем горячую клавишу ---
            buttonWithTextElement.addHotkey(_KEY_CODES.ENTER, true);
            //---

            this.clear();
            this.removeInfoBlockContainerClassStyle();
            let divParent = this.getDiv();
            if (divParent) {
                divParent.appendChild(div);

                if (inputText) {
                    inputText.focus();
                }

                // Возобновляем таймер ---
                let divElementTimerWorkout = this.#divElementTimerWorkout;
                if (divElementTimerWorkout) {
                    divElementTimerWorkout.start();
                }
                //---
            }
        } else {
            this.showRule(_RULE_TYPES.ERROR, "Не удалось получить следующий вопрос");
        }
    }

    async #tryToShowAnswerInfo(workoutItemEditAnswerRequestDTOObj, roundNumber) {
        // Останавливаем таймер на момент загрузки ---
        let divElementTimerWorkout = this.#divElementTimerWorkout;
        if (divElementTimerWorkout) {
            divElementTimerWorkout.stop(true);
        }
        //---

        if (workoutItemEditAnswerRequestDTOObj) {
            let jsonResponse = await _WORKOUT_ITEMS_API.PATCH.editAnswer(workoutItemEditAnswerRequestDTOObj);
            if (jsonResponse.getStatus() === _HTTP_STATUSES.OK) {
                // Пытаемся сохранить время ответа ---
                let isCorrect = await this.tryToSaveCurrentMilliseconds();
                //---

                if (isCorrect) {
                    let answerInfoResponseDTO = new AnswerInfoResponseDTO(jsonResponse.getJson());

                    // Меняем статистику раунда ---
                    let divWithTimerElementWorkoutRoundStatisticNotOver = this.#divWithTimerElementWorkoutRoundStatisticNotOver;
                    if (divWithTimerElementWorkoutRoundStatisticNotOver) {
                        divWithTimerElementWorkoutRoundStatisticNotOver.changeStatistic(answerInfoResponseDTO.getIsCorrect());
                    }
                    //---

                    await this.#showAnswerInfo(answerInfoResponseDTO, roundNumber);
                }
            } else {
                this.showRule(_RULE_TYPES.ERROR, new ResponseMessageResponseDTO(jsonResponse.getJson()).getMessage());
            }
        } else {
            this.showRule(_RULE_TYPES.ERROR, "Не удалось подготовить ответ к отправке");
        }
    }

    async #showAnswerInfo(answerInfoResponseDTOObj, roundNumber) {
        this.showLoading();

        if (answerInfoResponseDTOObj) {
            let isCorrect = true;

            let interactionContainer = new InteractionContainer();

            // Контейнер с сообщением ---
            let workoutItem = answerInfoResponseDTOObj.getWorkoutItem();
            let workout = workoutItem.getWorkout();

            let divContent = interactionContainer.getDivContent();
            if (divContent) {
                let divMessage = document.createElement("div");
                divMessage.classList.add(_CSS_DIV_ELEMENT.DIV_ELEMENT_VERTICAL_FLEX_CONTAINER_CLASS_ID);
                divMessage.style.gap = "10px";

                // Сообщение о корректности ---
                let message = answerInfoResponseDTOObj.getMessage();
                if (message) {
                    let span = document.createElement("span");
                    span.style.fontSize = "50px";
                    span.style.fontWeight = "bold";
                    span.textContent = message;

                    divMessage.appendChild(span);
                }
                //---

                // Вопрос ---
                if (workout && workoutItem) {
                    let langIn = workout.getLangIn();
                    if (langIn) {
                        let country = langIn.getCountry();
                        if (country) {
                            let spanContainer = document.createElement("span");
                            spanContainer.style.fontSize = _CSS_ROOT.BIG_FONT_SIZE_STYLE_ID;

                            // Флаг ---
                            let spanFlagElement = new SpanFlagElement(null);
                            spanFlagElement.changeFlag(country.getTitle(), country.getCode(), false);

                            spanContainer.appendChild(spanFlagElement.getSpan());
                            //---

                            // Пробел ---
                            let span = document.createElement("span");
                            span.textContent = " ";

                            spanContainer.appendChild(span);
                            //---

                            // Текст вопроса ---
                            let question = workoutItem.getQuestion();
                            if (!question) {
                                question = "Нет вопроса";
                            }

                            span = document.createElement("span");
                            span.textContent = `${question}`;

                            spanContainer.appendChild(span);
                            //---

                            divMessage.appendChild(spanContainer);
                        }
                    }
                }
                //---

                // Ответ ---
                if (workout && workoutItem) {
                    let langOut = workout.getLangOut();
                    if (langOut) {
                        let country = langOut.getCountry();
                        if (country) {
                            let spanContainer = document.createElement("span");
                            spanContainer.style.fontSize = _CSS_ROOT.BIG_FONT_SIZE_STYLE_ID;

                            // Флаг ---
                            let spanFlagElement = new SpanFlagElement(null);
                            spanFlagElement.changeFlag(country.getTitle(), country.getCode(), false);

                            spanContainer.appendChild(spanFlagElement.getSpan());
                            //---

                            // Пробел ---
                            let span = document.createElement("span");
                            span.textContent = " ";

                            spanContainer.appendChild(span);
                            //---

                            // Текст ответа ---
                            let answer = workoutItem.getAnswer();
                            if (!answer) {
                                answer = "Нет ответа";
                            }

                            span = document.createElement("span");
                            span.textContent = `${answer}`;

                            spanContainer.appendChild(span);
                            //---

                            divMessage.appendChild(spanContainer);
                        }
                    }
                }
                //---

                // Другие возможные ответы ---
                let isCorrect = answerInfoResponseDTOObj.getIsCorrect();
                let strPossibleAnswers = answerInfoResponseDTOObj.getPossibleAnswersStr();
                if (strPossibleAnswers) {
                    let spanContainer = document.createElement("span");
                    spanContainer.style.fontSize = _CSS_ROOT.MEDIUM_FONT_SIZE_STYLE_ID;

                    // Пояснение, какие ответы перед пользователем ---
                    let span = document.createElement("span");
                    span.style.fontWeight = "bold";

                    span.textContent = isCorrect
                        ? "Другие ответы:"
                        : "Правильные ответы:";

                    spanContainer.appendChild(span);
                    //---

                    // Пробел ---
                    span = document.createElement("span");
                    span.textContent = " ";

                    spanContainer.appendChild(span);
                    //---

                    // Ответы ---
                    span = document.createElement("span");
                    span.textContent = strPossibleAnswers;

                    spanContainer.appendChild(span);
                    //---

                    divMessage.appendChild(spanContainer);
                }
                //---

                // В зависимости от корректности мы должны изменить цвет фона ---
                divContent.style.background = isCorrect
                    ? _CSS_ROOT.GREEN_LIGHT_COLOR_STYLE_ID
                    : _CSS_ROOT.RED_LIGHT_COLOR_STYLE_ID;
                //---

                divContent.appendChild(divMessage);
            }
            //---

            // Кнопка продолжения ---
            let buttonWithTextElement = interactionContainer.getButtonWithTextElement();
            if (buttonWithTextElement) {
                let self = this;
                let button = buttonWithTextElement.getButton();
                if (button) {
                    let jsonResponse = await _WORKOUT_ITEMS_API.GET.getCount(workout.getId(), false, roundNumber);
                    if (jsonResponse.getStatus() === _HTTP_STATUSES.OK) {
                        let valueResponseDTO = new ValueResponseDTO(jsonResponse.getJson()).getValue();
                        if (valueResponseDTO) {
                            // Если количество слов в текущем раунде > 0, то мы готовимся к показу следующего вопроса ---
                            buttonWithTextElement.changeText("Следующий вопрос");

                            button.addEventListener(_EVENT_NAMES.BUTTON.CLICK, async function() {
                                await self.#tryToShowNextQuestion(roundNumber);
                            })
                            //---
                        } else {
                            jsonResponse = await _WORKOUTS_API.GET.findCurrentRoundNumber(workout.getId());
                            if (jsonResponse.getStatus() === _HTTP_STATUSES.OK) {
                                // Если текущий раунд найден, готовимся к его началу ---
                                buttonWithTextElement.changeText("Следующий раунд");
                                button.addEventListener(_EVENT_NAMES.BUTTON.CLICK, async function() {
                                    await self.#tryToShowNextRound();
                                });
                                //---
                            } else {
                                let message = new ResponseMessageResponseDTO(jsonResponse.getJson());
                                if (message.getId() === 999) {
                                    buttonWithTextElement.changeText("Завершить тренировку");
                                    button.addEventListener(_EVENT_NAMES.BUTTON.CLICK, async function() {
                                        await self.#close();
                                    })
                                } else {
                                    isCorrect = false;
                                    this.showRule(_RULE_TYPES.ERROR, message.getMessage());
                                }
                            }
                        }
                    } else {
                        isCorrect = false;
                        this.showRule(_RULE_TYPES.ERROR, new ResponseMessageResponseDTO(jsonResponse.getJson()).getMessage());
                    }
                }

                // Вешаем горячую клавишу ---
                buttonWithTextElement.addHotkey(_KEY_CODES.ENTER, true);
                //---
            }
            //---

            if (isCorrect) {
                this.clear();
                this.removeInfoBlockContainerClassStyle();
                let divParent = this.getDiv();
                if (divParent) {
                    divParent.appendChild(interactionContainer.getDiv());

                    // Возобновляем таймер ---
                    let divElementTimerWorkout = this.#divElementTimerWorkout;
                    if (divElementTimerWorkout) {
                        divElementTimerWorkout.start();
                    }
                    //---
                }
            }
        } else {
            this.showRule(_RULE_TYPES.ERROR, "Не удалось получить результат ответа на вопрос");
        }
    }

    async #close() {
        this.showLoading();

        let workoutResponseDTO = this.#workoutResponseDTO;
        if (workoutResponseDTO) {
            let workoutId = workoutResponseDTO.getId();

            // Завершаем тренировку ---
            let entityIdRequestDTO = new EntityIdRequestDTO();
            entityIdRequestDTO.setId(workoutId);

            await _WORKOUTS_API.PATCH.close(entityIdRequestDTO);
            //---

            window.onbeforeunload = null;

            let path = _URL_PATHS.WORKOUTS.INFO.getPath();
            let urlPath = new UrlPath(`${path}/${workoutId}`);
            urlPath.replace(false);
        } else {
            this.showRule(_RULE_TYPES.ERROR, "Тренировка не установлена");
        }
    }


    showLoading() {
        super.showLoading();

        this.addInfoBlockContainerClassStyle();

        // Останавливаем таймер на момент загрузки ---
        let divElementTimerWorkout = this.#divElementTimerWorkout;
        if (divElementTimerWorkout) {
            divElementTimerWorkout.stop(true);
        }
        //---
    }

    showRule(ruleTypeObj, message) {
        let isPrepared = this.getIsPrepared();
        if (isPrepared) {
            // Останавливаем таймер на момент ошибки ---
            let divElementTimerWorkout = this.#divElementTimerWorkout;
            if (divElementTimerWorkout) {
                divElementTimerWorkout.stop(true);
            }
            //---

            let interactionContainer = new InteractionContainer();

            // Предупреждение ---
            let divContent = interactionContainer.getDivContent();
            if (divContent) {
                let divRule = document.createElement("div");
                divRule.classList.add(_CSS_DIV_ELEMENT.DIV_ELEMENT_CONTENT_CENTER_CLASS_ID);
                divRule.appendChild(new SpanRuleElement(ruleTypeObj, message).getSpan());

                divContent.appendChild(divRule);
            }
            //---

            // Кнопка возвращения на страницу настройки тренировки ---
            let buttonWithTextElement = interactionContainer.getButtonWithTextElement();
            if (buttonWithTextElement) {
                let workoutResponseDTO = this.#workoutResponseDTO;
                if (workoutResponseDTO) {
                    let workoutType = workoutResponseDTO.getWorkoutType();
                    if (workoutType) {
                        buttonWithTextElement.changeText(
                            `Вернуться на страницу настройки режима тренировки "${workoutType.getTitle()}"`);
                    }
                } else {
                    buttonWithTextElement.changeText("Вернуться на страницу режимов тренировок");
                }

                let button = buttonWithTextElement.getButton();
                if (button) {
                    let self = this;
                    button.addEventListener(_EVENT_NAMES.BUTTON.CLICK, function() {
                        let path = _URL_PATHS.WORKOUTS.MAIN.getPath();

                        let workoutResponseDTO = self.#workoutResponseDTO;
                        if (workoutResponseDTO) {
                            let workoutType = workoutResponseDTO.getWorkoutType();
                            if (workoutType) {
                                path = `${path}/${workoutType.getCode()}`;
                            }
                        }

                        let urlPath = new UrlPath(path);
                        urlPath.replace(false);
                    });
                }

                // Вешаем горячую клавишу ---
                buttonWithTextElement.addHotkey(_KEY_CODES.ENTER, true);
                //---
            }
            //---

            this.clear();
            let divParent = this.getDiv();
            if (divParent) {
                divParent.appendChild(interactionContainer.getDiv());
            }

            this.removeInfoBlockContainerClassStyle();
        } else {
            throw new Error("Object \'DivWithTimerElementWorkoutInteraction\' is not prepared.");
        }
    }

    async tryToSaveCurrentMilliseconds() {
        let isCorrect = true;

        let workoutResponseDTO = this.#workoutResponseDTO;
        if (!workoutResponseDTO) {
            isCorrect = false;
            this.showRule(_RULE_TYPES.ERROR, "Тренировка не установлена");
        }

        let divElementTimerWorkout = this.#divElementTimerWorkout;
        if (isCorrect && !divElementTimerWorkout) {
            isCorrect = false;
            this.showRule(_RULE_TYPES.ERROR, "Таймер не установлен");
        }

        if (isCorrect) {
            let entityEditValueByIdRequestDTO = new EntityEditValueByIdRequestDTO();
            entityEditValueByIdRequestDTO.setId(workoutResponseDTO.getId());
            entityEditValueByIdRequestDTO.setValue(divElementTimerWorkout.getCurrentMilliseconds());

            let jsonResponse = await _WORKOUTS_API.PATCH.editCurrentMilliseconds(entityEditValueByIdRequestDTO);
            if (jsonResponse.getStatus() !== _HTTP_STATUSES.OK) {
                isCorrect = false;
                this.showRule(_RULE_TYPES.ERROR, new ResponseMessageResponseDTO(jsonResponse.getJson()).getMessage());
            }
        }

        return isCorrect;
    }


    async tryToCreateContent() {
        await this.#tryToShowNextRound();

        return null;
    }
}

class InteractionContainer {
    #div;
    #divContent;
    #buttonWithTextElement;

    constructor() {
        this.#tryToSetDefaultValues();
    }

    getDiv() {
        return this.#div;
    }

    getDivContent() {
        return this.#divContent;
    }

    getButtonWithTextElement() {
        return this.#buttonWithTextElement;
    }


    #tryToSetDefaultValues() {
        let div = this.#div;
        if (!div) {
            div = document.createElement("div");
            div.style.display = "grid";
            div.style.grid = "1fr 50px / 1fr";
            div.style.gap = "10px";
        }

        let divContent = this.#divContent;
        if (!divContent) {
            divContent = document.createElement("div");
            divContent.classList.add(_CSS_INFO_BLOCK.DIV_INFO_BLOCK_CONTAINER_CLASS_ID);
            divContent.classList.add(_CSS_DIV_ELEMENT.DIV_ELEMENT_CONTENT_CENTER_CLASS_ID);
        }

        let buttonWithTextElement = this.#buttonWithTextElement;
        if (!buttonWithTextElement) {
            buttonWithTextElement = new ButtonWithTextElement(null);
        }

        // Добавляем элементы в контейнер, если они не имеют родителя ---
        if (divContent && !divContent.parentElement) {
            div.appendChild(divContent);
        }

        let button = buttonWithTextElement.getButton();
        if (button && !button.parentElement) {
            div.appendChild(button);
        }
        //---

        this.#div = div;
        this.#divContent = divContent;
        this.#buttonWithTextElement = buttonWithTextElement;
    }
}