import {
    SelectWithRuleElementLangsOut
} from "../../out/select_with_rule_element_langs_out.js";

import {
    SelectElementLangsUtils
} from "../../select_element_langs_utils.js";

import {
    EventNames
} from "../../../../../event_names.js";

const _SELECT_ELEMENT_LANGS_UTILS = new SelectElementLangsUtils();
const _EVENT_NAMES = new EventNames();

export class SelectWithRuleElementLangsOutWorkoutCollectionWorkout extends SelectWithRuleElementLangsOut {
    #selectWithRuleElementCustomerCollectionsWorkoutCollectionWorkout;

    constructor(selectWithRuleElementLangsOutObj) {
        super(selectWithRuleElementLangsOutObj.getDivContainer(), selectWithRuleElementLangsOutObj.getSelect(),
            selectWithRuleElementLangsOutObj.getSpanFlag(), selectWithRuleElementLangsOutObj.getDoNeedToCreateFirstOption());
    }

    setSelectWithRuleElementCustomerCollectionsWorkoutCollectionWorkout(selectWithRuleElementCustomerCollectionsWorkoutCollectionWorkoutObj) {
        this.#selectWithRuleElementCustomerCollectionsWorkoutCollectionWorkout =
            selectWithRuleElementCustomerCollectionsWorkoutCollectionWorkoutObj;
    }

    async createOptionsArr() {
        let optionsArr = [];

        let selectWithRuleElementCustomerCollectionsWorkoutCollectionWorkout =
            this.#selectWithRuleElementCustomerCollectionsWorkoutCollectionWorkout;
        if (selectWithRuleElementCustomerCollectionsWorkoutCollectionWorkout) {
            let customerCollectionId = selectWithRuleElementCustomerCollectionsWorkoutCollectionWorkout.getSelectedValue();
            optionsArr = customerCollectionId
                ? _SELECT_ELEMENT_LANGS_UTILS.createOptionsArrForOutByCustomerCollectionId(customerCollectionId)
                : _SELECT_ELEMENT_LANGS_UTILS.createOptionsArrForOut();
        }

        return optionsArr;
    }

    prepare() {
        super.prepare();

        let select = this.getSelect();
        if (select) {
            let self = this;
            select.addEventListener(_EVENT_NAMES.SELECT.CHANGE, async function() {
                let selectWithRuleElementCustomerCollectionsWorkoutCollectionWorkout =
                    self.#selectWithRuleElementCustomerCollectionsWorkoutCollectionWorkout;
                if (selectWithRuleElementCustomerCollectionsWorkoutCollectionWorkout) {
                    selectWithRuleElementCustomerCollectionsWorkoutCollectionWorkout.changeDisabledStatus(true);
                    await selectWithRuleElementCustomerCollectionsWorkoutCollectionWorkout.refresh(true);
                    selectWithRuleElementCustomerCollectionsWorkoutCollectionWorkout.changeDisabledStatus(false);
                }
            });
        }
    }
}