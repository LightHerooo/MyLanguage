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

export class SelectWithRuleElementCustomerCollectionsWorkoutCollectionWorkout extends SelectWithRuleElementCustomerCollections {
    #selectWithRuleElementLangsOutWorkoutCollectionWorkout;

    constructor(selectWithRuleElementCustomerCollectionsObj) {
        super(selectWithRuleElementCustomerCollectionsObj.getDivContainer(),
            selectWithRuleElementCustomerCollectionsObj.getSelect(),
            selectWithRuleElementCustomerCollectionsObj.getSpanFlag(),
            selectWithRuleElementCustomerCollectionsObj.getDoNeedToCreateFirstOption(),
            selectWithRuleElementCustomerCollectionsObj.getIsRequired());
    }

    setSelectWithRuleElementLangsOutWorkoutCollectionWorkout(selectWithRuleElementLangsOutWorkoutCollectionWorkoutObj) {
        this.#selectWithRuleElementLangsOutWorkoutCollectionWorkout =
            selectWithRuleElementLangsOutWorkoutCollectionWorkoutObj;
    }


    async createOptionsArr() {
        let optionsArr = [];

        let selectWithRuleElementLangsOutWorkoutCollectionWorkout =
            this.#selectWithRuleElementLangsOutWorkoutCollectionWorkout;
        if (selectWithRuleElementLangsOutWorkoutCollectionWorkout) {
            let langOutCode = selectWithRuleElementLangsOutWorkoutCollectionWorkout.getSelectedValue();
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
                let selectWithRuleElementLangsOutWorkoutCollectionWorkout =
                    self.#selectWithRuleElementLangsOutWorkoutCollectionWorkout;
                if (selectWithRuleElementLangsOutWorkoutCollectionWorkout) {
                    selectWithRuleElementLangsOutWorkoutCollectionWorkout.changeDisabledStatus(true);
                    await selectWithRuleElementLangsOutWorkoutCollectionWorkout.refresh(true);
                    selectWithRuleElementLangsOutWorkoutCollectionWorkout.changeDisabledStatus(false);
                }
            })
        }
    }
}