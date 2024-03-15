import {
    RuleElement
} from "../../rule/rule_element.js";

import {
    ComboBoxUtils
} from "../combo_box_utils.js";

import {
    RuleTypes
} from "../../rule/rule_types.js";

const _COMBO_BOX_UTILS = new ComboBoxUtils();
const _RULE_TYPES = new RuleTypes();

export class WorkoutUtils {
    CB_NUMBER_OF_WORDS = new CbNumberOfWords();
}

class CbNumberOfWords {
    #NUMBER_OF_WORDS_POSSIBLE_ARR = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
    prepare(cbNumberOfWords) {
        cbNumberOfWords.replaceChildren();

        let firstOption = document.createElement("option");
        firstOption.value = "";
        firstOption.textContent = "Выберите количество слов";
        cbNumberOfWords.appendChild(firstOption);

        let numberOfWordsArr = this.#NUMBER_OF_WORDS_POSSIBLE_ARR;
        for (let i = 0; i < numberOfWordsArr.length; i++) {
            let optionNumberOfWords = document.createElement("option");
            optionNumberOfWords.value = `${numberOfWordsArr[i]}`;
            optionNumberOfWords.textContent = `${numberOfWordsArr[i]}`;

            cbNumberOfWords.appendChild(optionNumberOfWords);
        }

        let thisClass = this;
        cbNumberOfWords.addEventListener("change", function () {
            thisClass.checkCorrectValue(this);
        });
    }

    checkCorrectValue(cbNumberOfWords) {
        const NUMBER_OF_WORDS_REGEXP = /^[0-9]+$/;

        let isCorrect = true;
        let ruleElement = new RuleElement(cbNumberOfWords, cbNumberOfWords.parentElement);

        let numberOfWords = _COMBO_BOX_UTILS.GET_SELECTED_ITEM_VALUE.byComboBox(cbNumberOfWords);
        if (!NUMBER_OF_WORDS_REGEXP.test(numberOfWords)) {
            isCorrect = false;
            ruleElement.message = "Выберите количество слов.";
            ruleElement.ruleType = _RULE_TYPES.ERROR;
        } else {
            let numberOfWordsArePossible = false;
            let numberOfWordsArr = this.#NUMBER_OF_WORDS_POSSIBLE_ARR;
            for (let i = 0; i < numberOfWordsArr.length; i++) {
                if (String(numberOfWords) === String(numberOfWordsArr[i])) {
                    numberOfWordsArePossible = true;
                    break;
                }
            }

            if (numberOfWordsArePossible === false) {
                isCorrect = false;
                ruleElement.message = "Такое количество слов тренировать нельзя.";
                ruleElement.ruleType = _RULE_TYPES.ERROR;
            }
        }

        if (isCorrect === false) {
            ruleElement.showRule();
        } else {
            ruleElement.removeRule();
        }

        return isCorrect;
    }
}