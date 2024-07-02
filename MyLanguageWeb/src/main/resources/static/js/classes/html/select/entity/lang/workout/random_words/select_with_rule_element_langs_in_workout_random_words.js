import {
    SelectWithRuleElementLangsIn
} from "../../in/select_with_rule_element_langs_in.js";

import {
    SelectElementLangsUtils
} from "../../select_element_langs_utils.js";

import {
    EventNames
} from "../../../../../event_names.js";

const _SELECT_ELEMENT_LANGS_UTILS = new SelectElementLangsUtils();
const _EVENT_NAMES = new EventNames();

export class SelectWithRuleElementLangsInWorkoutRandomWords extends SelectWithRuleElementLangsIn {
    #selectWithRuleElementLangsOutWorkoutRandomWords;

    constructor(selectWithRuleElementLangsInObj) {
        super(selectWithRuleElementLangsInObj.getDivContainer(), selectWithRuleElementLangsInObj.getSelect(),
            selectWithRuleElementLangsInObj.getSpanFlag(), selectWithRuleElementLangsInObj.getDoNeedToCreateFirstOption());
    }

    setSelectWithRuleElementLangsOutWorkoutRandomWords(selectWithRuleElementLangsOutWorkoutRandomWordsObj) {
        this.#selectWithRuleElementLangsOutWorkoutRandomWords =
            selectWithRuleElementLangsOutWorkoutRandomWordsObj;
    }


    async createOptionsArr() {
        let optionsArr = [];

        let selectWithRuleElementLangsOutWorkoutRandomWords = this.#selectWithRuleElementLangsOutWorkoutRandomWords;
        if (selectWithRuleElementLangsOutWorkoutRandomWords) {
            let langOutCode = selectWithRuleElementLangsOutWorkoutRandomWords.getSelectedValue();
            optionsArr = langOutCode
                ? await _SELECT_ELEMENT_LANGS_UTILS.createOptionsArrForInByLangOutCode(langOutCode)
                : await _SELECT_ELEMENT_LANGS_UTILS.createOptionsArrForIn();
        }

        return optionsArr;
    }

    prepare() {
        super.prepare();

        let select = this.getSelect();
        if (select) {
            let self = this;
            select.addEventListener(_EVENT_NAMES.SELECT.CHANGE, async function() {
                let selectWithRuleElementLangsOutWorkoutRandomWords =
                    self.#selectWithRuleElementLangsOutWorkoutRandomWords;
                if (selectWithRuleElementLangsOutWorkoutRandomWords) {
                    selectWithRuleElementLangsOutWorkoutRandomWords.changeDisabledStatus(true);
                    await selectWithRuleElementLangsOutWorkoutRandomWords.refresh(true);
                    selectWithRuleElementLangsOutWorkoutRandomWords.changeDisabledStatus(false);
                }
            })
        }
    }
}