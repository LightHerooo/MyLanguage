import {
    CssRule
} from "../css/other/css_rule.js";

import {
    ImageSources
} from "../image_sources.js";

const _CSS_RULE = new CssRule();
const _IMAGE_SOURCES = new ImageSources();

export class RuleTypes {
    ACCEPT = new RuleType(_CSS_RULE.SPAN_RULE_ACCEPT_TEXT_STYLE_ID,
        _IMAGE_SOURCES.RULES.ACCEPT);
    WARNING = new RuleType(_CSS_RULE.SPAN_RULE_WARNING_TEXT_STYLE_ID,
        _IMAGE_SOURCES.RULES.WARNING);
    ERROR = new RuleType(_CSS_RULE.SPAN_RULE_ERROR_TEXT_STYLE_ID,
        _IMAGE_SOURCES.RULES.ERROR);
}


class RuleType {
    TEXT_STYLE_ID;
    PATH_TO_IMAGE;

    constructor(textStyleId, pathToImage) {
        this.TEXT_STYLE_ID = textStyleId;
        this.PATH_TO_IMAGE = pathToImage;
    }
}