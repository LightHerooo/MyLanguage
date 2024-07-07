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

export class SelectWithRuleElementLangsInPrepareWorkoutRandomWords extends SelectWithRuleElementLangsIn {
    #selectWithRuleElementLangsOutPrepareWorkoutRandomWords;

    constructor(selectWithRuleElementLangsInObj) {
        super(selectWithRuleElementLangsInObj.getDivContainer(), selectWithRuleElementLangsInObj.getSelect(),
            selectWithRuleElementLangsInObj.getSpanFlag(), selectWithRuleElementLangsInObj.getDoNeedToCreateFirstOption(),
            selectWithRuleElementLangsInObj.getIsRequired());
    }

    setSelectWithRuleElementLangsOutPrepareWorkoutRandomWords(selectWithRuleElementLangsOutPrepareWorkoutRandomWordsObj) {
        this.#selectWithRuleElementLangsOutPrepareWorkoutRandomWords =
            selectWithRuleElementLangsOutPrepareWorkoutRandomWordsObj;
    }


    async createOptionsArr() {
        let optionsArr = [];

        let selectWithRuleElementLangsOutPrepareWorkoutRandomWords = this.#selectWithRuleElementLangsOutPrepareWorkoutRandomWords;
        if (selectWithRuleElementLangsOutPrepareWorkoutRandomWords) {
            let langOutCode = selectWithRuleElementLangsOutPrepareWorkoutRandomWords.getSelectedValue();
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
                let selectWithRuleElementLangsOutPrepareWorkoutRandomWords =
                    self.#selectWithRuleElementLangsOutPrepareWorkoutRandomWords;
                if (selectWithRuleElementLangsOutPrepareWorkoutRandomWords) {
                    selectWithRuleElementLangsOutPrepareWorkoutRandomWords.changeDisabledStatus(true);
                    await selectWithRuleElementLangsOutPrepareWorkoutRandomWords.refresh(true);
                    selectWithRuleElementLangsOutPrepareWorkoutRandomWords.changeDisabledStatus(false);
                }
            })
        }
    }
}