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
        firstOption.textContent = "Выберите количество слов";
        cbNumberOfWords.appendChild(firstOption);

        for (let i = 0; i < this.#NUMBER_OF_WORDS_POSSIBLE_ARR.length; i++) {
            let optionNumberOfWords = document.createElement("option");
            optionNumberOfWords.textContent = `${this.#NUMBER_OF_WORDS_POSSIBLE_ARR[i]}`;

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

        let numberOfWords = _COMBO_BOX_UTILS.GET_SELECTED_ITEM.byComboBox(cbNumberOfWords).value;
        if (!NUMBER_OF_WORDS_REGEXP.test(numberOfWords)) {
            isCorrect = false;
            ruleElement.message = "Выберите количество слов.";
            ruleElement.ruleType = _RULE_TYPES.ERROR;
        } else {
            let numberOfWordsArePossible = false;
            for (let i = 0; i < this.#NUMBER_OF_WORDS_POSSIBLE_ARR.length; i++) {
                if (numberOfWords === this.#NUMBER_OF_WORDS_POSSIBLE_ARR[i].toString()) {
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