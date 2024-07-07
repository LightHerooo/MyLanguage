import {
    SelectWithRuleElementCustomerCollections
} from "../../select_with_rule_element_customer_collections.js";

import {
    SelectElementCustomerCollectionsUtils
} from "../../select_element_customer_collections_utils.js";

import {
    EventNames
} from "../../../../../event_names.js";

const _SELECT_ELEMENT_CUSTOMER_COLLECTIONS_UTILS = new SelectElementCustomerCollectionsUtils();
const _EVENT_NAMES = new EventNames();

export class SelectWithRuleElementCustomerCollectionsPrepareWorkoutCollectionWorkout extends SelectWithRuleElementCustomerCollections {
    #selectWithRuleElementLangsOutPrepareWorkoutCollectionWorkout;

    constructor(selectWithRuleElementCustomerCollectionsObj) {
        super(selectWithRuleElementCustomerCollectionsObj.getDivContainer(),
            selectWithRuleElementCustomerCollectionsObj.getSelect(),
            selectWithRuleElementCustomerCollectionsObj.getSpanFlag(),
            selectWithRuleElementCustomerCollectionsObj.getDoNeedToCreateFirstOption(),
            selectWithRuleElementCustomerCollectionsObj.getIsRequired());
    }

    setSelectWithRuleElementLangsOutPrepareWorkoutCollectionWorkout(
        selectWithRuleElementLangsOutPrepareWorkoutCollectionWorkoutObj) {
        this.#selectWithRuleElementLangsOutPrepareWorkoutCollectionWorkout =
            selectWithRuleElementLangsOutPrepareWorkoutCollectionWorkoutObj;
    }


    async createOptionsArr() {
        let optionsArr = [];

        let selectWithRuleElementLangsOutPrepareWorkoutCollectionWorkout =
            this.#selectWithRuleElementLangsOutPrepareWorkoutCollectionWorkout;
        if (selectWithRuleElementLangsOutPrepareWorkoutCollectionWorkout) {
            let langOutCode = selectWithRuleElementLangsOutPrepareWorkoutCollectionWorkout.getSelectedValue();
            optionsArr = langOutCode
                ? _SELECT_ELEMENT_CUSTOMER_COLLECTIONS_UTILS.createOptionArrByLangOutCode(langOutCode)
                : _SELECT_ELEMENT_CUSTOMER_COLLECTIONS_UTILS.createOptionsArr();
        }

        return optionsArr;
    }

    prepare() {
        super.prepare();

        let select = this.getSelect();
        if (select) {
            let self = this;
            select.addEventListener(_EVENT_NAMES.SELECT.CHANGE, async function() {
                let selectWithRuleElementLangsOutPrepareWorkoutCollectionWorkout =
                    self.#selectWithRuleElementLangsOutPrepareWorkoutCollectionWorkout;
                if (selectWithRuleElementLangsOutPrepareWorkoutCollectionWorkout) {
                    selectWithRuleElementLangsOutPrepareWorkoutCollectionWorkout.changeDisabledStatus(true);
                    await selectWithRuleElementLangsOutPrepareWorkoutCollectionWorkout.refresh(true);
                    selectWithRuleElementLangsOutPrepareWorkoutCollectionWorkout.changeDisabledStatus(false);
                }
            })
        }
    }
}