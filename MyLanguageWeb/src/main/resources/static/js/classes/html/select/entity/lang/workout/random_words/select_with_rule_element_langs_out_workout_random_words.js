import {
    SelectElementLangsUtils
} from "../../select_element_langs_utils.js";

import {
    SelectWithRuleElementLangsOut
} from "../../out/select_with_rule_element_langs_out.js";

import {
    EventNames
} from "../../../../../event_names.js";

const _SELECT_ELEMENT_LANGS_UTILS = new SelectElementLangsUtils();
const _EVENT_NAMES = new EventNames();

export class SelectWithRuleElementLangsOutWorkoutRandomWords extends SelectWithRuleElementLangsOut {
    #selectWithRuleElementLangsInWorkoutRandomWords;

    constructor(selectWithRuleElementLangsOutObj) {
        super(selectWithRuleElementLangsOutObj.getDivContainer(), selectWithRuleElementLangsOutObj.getSelect(),
            selectWithRuleElementLangsOutObj.getSpanFlag(), selectWithRuleElementLangsOutObj.getDoNeedToCreateFirstOption(),
            selectWithRuleElementLangsOutObj.getIsRequired());
    }

    setSelectWithRuleElementLangsInWorkoutRandomWords(selectWithRuleElementLangsInWorkoutRandomWordsObj) {
        this.#selectWithRuleElementLangsInWorkoutRandomWords =
            selectWithRuleElementLangsInWorkoutRandomWordsObj;
    }


    async createOptionsArr() {
        let optionsArr = [];

        let selectWithRuleElementLangsInWorkoutRandomWords = this.#selectWithRuleElementLangsInWorkoutRandomWords;
        if (selectWithRuleElementLangsInWorkoutRandomWords) {
            let langInCode = selectWithRuleElementLangsInWorkoutRandomWords.getSelectedValue();
            optionsArr = langInCode
                ? await _SELECT_ELEMENT_LANGS_UTILS.createOptionsArrForOutByLangInCode(langInCode)
                : await _SELECT_ELEMENT_LANGS_UTILS.createOptionsArrForOut();
        }

        return optionsArr;
    }

    prepare() {
        super.prepare();

        let select = this.getSelect();
        if (select) {
            let self = this;
            select.addEventListener(_EVENT_NAMES.SELECT.CHANGE, async function() {
                let selectWithRuleElementLangsInWorkoutRandomWords =
                    self.#selectWithRuleElementLangsInWorkoutRandomWords;
                if (selectWithRuleElementLangsInWorkoutRandomWords) {
                    selectWithRuleElementLangsInWorkoutRandomWords.changeDisabledStatus(true);
                    await selectWithRuleElementLangsInWorkoutRandomWords.refresh(true);
                    selectWithRuleElementLangsInWorkoutRandomWords.changeDisabledStatus(false);
                }
            })
        }
    }
}