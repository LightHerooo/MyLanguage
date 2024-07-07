import {
    CssSpanRuleElement
} from "../../../../css/elements/span/css_span_rule_element.js";

const _CSS_SPAN_RULE_ELEMENT = new CssSpanRuleElement();

export class RuleTypes {
    ACCEPT = _CSS_SPAN_RULE_ELEMENT.SPAN_RULE_ELEMENT_ACCEPT_CLASS_ID;
    WARNING = _CSS_SPAN_RULE_ELEMENT.SPAN_RULE_ELEMENT_WARNING_CLASS_ID;
    ERROR = _CSS_SPAN_RULE_ELEMENT.SPAN_RULE_ELEMENT_ERROR_CLASS_ID;
}