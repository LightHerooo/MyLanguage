import {
    RuleElement
} from "../../rule/rule_element.js";

import {
    RuleTypes
} from "../../rule/rule_types.js";

import {
    CustomResponseMessage
} from "../../dto/other/custom_response_message.js";

import {
    HttpStatuses
} from "../../http_statuses.js";

import {
    CustomersAPI
} from "../../api/customers_api.js";

const _CUSTOMERS_API = new CustomersAPI();

const _RULE_TYPES = new RuleTypes();
const _HTTP_STATUSES = new HttpStatuses();

export class CustomerUtils {
    async checkCorrectValueInTbLogin(tbLogin, parentElement, customTimerObj) {
        let isCorrect = true;

        if (tbLogin && parentElement) {
            const LOGIN_MIN_SIZE = 3;
            const LOGIN_MAX_SIZE = 15;
            const LOGIN_REGEXP = /^[A-Za-z0-9_]+$/;

            let ruleElement = new RuleElement(tbLogin, parentElement);

            customTimerObj.stop();
            let inputText = tbLogin.value.trim();
            if (!inputText) {
                isCorrect = false;
                ruleElement.message = "Логин не может быть пустым.";
                ruleElement.ruleType = _RULE_TYPES.ERROR;
            } else if (!LOGIN_REGEXP.test(inputText)) {
                isCorrect = false;
                ruleElement.message = "Логин должен содержать только английские буквы, цифры и знаки подчеркивания [_].";
                ruleElement.ruleType = _RULE_TYPES.ERROR;
            } else if (inputText.length < LOGIN_MIN_SIZE || inputText.length > LOGIN_MAX_SIZE) {
                isCorrect = false;
                ruleElement.message = `Логин должен быть от ${LOGIN_MIN_SIZE} до ${LOGIN_MAX_SIZE} символов.`;
                ruleElement.ruleType = _RULE_TYPES.ERROR;
            } else {
                // Убираем предыдущие возможные ошибки
                ruleElement.removeRule();

                // Запускаем таймер и обращаемся в API (чтобы избежать спама от пользователей)
                let JSONResponsePromise = new Promise(resolve => {
                    customTimerObj.setHandler(async function () {
                        resolve(await _CUSTOMERS_API.GET.findExistsByLogin(inputText));
                    });

                    customTimerObj.setTimeout(250);
                    customTimerObj.start();
                });

                let JSONResponse = await JSONResponsePromise;
                if (JSONResponse.status === _HTTP_STATUSES.OK) {
                    isCorrect = false;
                    ruleElement.message = new CustomResponseMessage(JSONResponse.json).text;
                    ruleElement.ruleType = _RULE_TYPES.ERROR;
                }
            }

            // Отображаем предупреждение (правило), если это необходимо ---
            if (isCorrect === false) {
                ruleElement.showRule();
            } else {
                ruleElement.removeRule();
            }
            //---
        } else {
            isCorrect = false;
        }

        return isCorrect;
    }

    async checkCorrectValueInTbEmail(tbEmail, parentElement, customTimerObj) {
        let isCorrect = true;
        if (tbEmail && parentElement) {
            const EMAIL_REGEXP = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;

            let ruleElement = new RuleElement(tbEmail, parentElement);

            customTimerObj.stop();
            let inputText = tbEmail.value.trim();
            // Чистим таймер, чтобы снова проверить через API
            if (!inputText) {
                isCorrect = false;
                ruleElement.message = "Электронная почта не может быть пустой.";
                ruleElement.ruleType = _RULE_TYPES.ERROR;
            } else if (!EMAIL_REGEXP.test(inputText)) {
                isCorrect = false;
                ruleElement.message = "Некорректная электронная почта.";
                ruleElement.ruleType = _RULE_TYPES.ERROR;
            } else {
                // Убираем предыдущие возможные ошибки
                ruleElement.removeRule();

                // Запускаем таймер и обращаемся в API (чтобы избежать спама от пользователей)
                let JSONResponsePromise = new Promise(resolve => {
                    customTimerObj.setHandler(async function () {
                        resolve(await _CUSTOMERS_API.GET.findExistsByEmail(inputText));
                    });

                    customTimerObj.setTimeout(250);
                    customTimerObj.start();
                });

                let JSONResponse = await JSONResponsePromise;
                if (JSONResponse.status === _HTTP_STATUSES.OK) {
                    isCorrect = false;
                    ruleElement.message = new CustomResponseMessage(JSONResponse.json).text;
                    ruleElement.ruleType = _RULE_TYPES.ERROR;
                }
            }

            // Отображаем предупреждение (правило), если это необходимо ---
            if (isCorrect === false) {
                ruleElement.showRule();
            } else {
                ruleElement.removeRule();
            }
            //---
        } else {
            isCorrect = false;
        }

        return isCorrect;
    }

    async checkCorrectValueInTbNickname(tbNickname, parentElement, customTimerObj) {
        let isCorrect = true;
        if (tbNickname && parentElement) {
            const NICKNAME_MIN_SIZE = 3;
            const NICKNAME_MAX_SIZE = 15;
            const NICKNAME_REGEXP = /^[^ ]+$/;

            let ruleElement = new RuleElement(tbNickname, parentElement);

            customTimerObj.stop();
                let inputText = tbNickname.value.trim();
            if (!inputText) {
                isCorrect = false;
                ruleElement.message = "Никнейм не может быть пустым.";
                ruleElement.ruleType = _RULE_TYPES.ERROR;
            } else if (!NICKNAME_REGEXP.test(inputText)) {
                isCorrect = false;
                ruleElement.message = "Никнейм не должен содержать пробелов.";
                ruleElement.ruleType = _RULE_TYPES.ERROR;
            } else if (inputText.length < NICKNAME_MIN_SIZE || inputText.length > NICKNAME_MAX_SIZE) {
                isCorrect = false;
                ruleElement.message = `Никнейм должен быть от ${NICKNAME_MIN_SIZE} до ${NICKNAME_MAX_SIZE} символов.`;
                ruleElement.ruleType = _RULE_TYPES.ERROR;
            } else {
                // Убираем предыдущие возможные ошибки
                ruleElement.removeRule();

                // Запускаем таймер и обращаемся в API (чтобы избежать спама от пользователей)
                let JSONResponsePromise = new Promise(resolve => {
                    customTimerObj.setHandler(async function () {
                        resolve(await _CUSTOMERS_API.GET.findExistsByNickname(inputText));
                    });

                    customTimerObj.setTimeout(250);
                    customTimerObj.start();
                });

                let JSONResponse = await JSONResponsePromise;
                if (JSONResponse.status === _HTTP_STATUSES.OK) {
                    isCorrect = false;
                    ruleElement.message = new CustomResponseMessage(JSONResponse.json).text;
                    ruleElement.ruleType = _RULE_TYPES.ERROR;
                }
            }

            // Отображаем предупреждение (правило), если это необходимо ---
            if (isCorrect === false) {
                ruleElement.showRule();
            } else {
                ruleElement.removeRule();
            }
            //---
        } else {
            isCorrect = false;
        }

        return isCorrect;
    }

    checkCorrectValueInPbPassword(pbPassword, parentElement) {
        let isCorrect = true;
        if (pbPassword && parentElement) {
            const PASSWORD_MIN_SIZE = 8;
            const PASSWORD_REGEXP_DIGITS = /^.*[0-9]+.*$/;
            const PASSWORD_REGEXP_SPECIAL_SYMBOLS = /^.*[%@?~#-]+.*$/;
            const PASSWORD_SPECIAL_SYMBOLS = "%, @, ?, ~, #, -";

            let ruleElement = new RuleElement(pbPassword, parentElement);

            let inputText = pbPassword.value;
            if (!inputText) {
                isCorrect = false;
                ruleElement.message = "Пароль не может быть пустым.";
                ruleElement.ruleType = _RULE_TYPES.ERROR;
            } else if (inputText.length < PASSWORD_MIN_SIZE) {
                isCorrect = false;
                ruleElement.message = `Пароль должен быть не менее ${PASSWORD_MIN_SIZE} символов.`;
                ruleElement.ruleType = _RULE_TYPES.ERROR;
            } else if (!PASSWORD_REGEXP_DIGITS.test(inputText)) {
                isCorrect = false;
                ruleElement.message = "Пароль должен содержать минимум одну цифру [0-9].";
                ruleElement.ruleType = _RULE_TYPES.ERROR;
            } else if (!PASSWORD_REGEXP_SPECIAL_SYMBOLS.test(inputText)) {
                isCorrect = false;
                ruleElement.message =
                    `Пароль должен содержать минимум один специальный символ ${PASSWORD_SPECIAL_SYMBOLS}.`;
                ruleElement.ruleType = _RULE_TYPES.ERROR;
            }

            // Отображаем предупреждение (правило), если это необходимо ---
            if (isCorrect === false) {
                ruleElement.showRule();
            } else {
                ruleElement.removeRule();
            }
            //---
        } else {
            isCorrect = false;
        }

        return isCorrect;
    }

    checkCorrectValueInPbPasswordRepeat(pbPasswordRepeat, pbPassword, parentElement) {
        let isCorrect = true;

        if (pbPasswordRepeat && pbPassword && parentElement) {
            let ruleElement = new RuleElement(pbPasswordRepeat, parentElement);

            let passwordValue = pbPassword.value;
            let passwordRepeatValue = pbPasswordRepeat.value;
            if (passwordValue !== passwordRepeatValue) {
                isCorrect = false;
                ruleElement.message = "Пароли не совпадают.";
                ruleElement.ruleType = _RULE_TYPES.ERROR;
            }

            // Отображаем предупреждение (правило), если это необходимо ---
            if (isCorrect === false) {
                ruleElement.showRule();
            } else {
                ruleElement.removeRule();
            }
            //---
        } else {
            isCorrect = false;
        }

        return isCorrect;
    }
}