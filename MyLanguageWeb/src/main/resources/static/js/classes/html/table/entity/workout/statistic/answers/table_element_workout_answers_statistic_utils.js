import {
    CssRoot
} from "../../../../../../css/css_root.js";

const _CSS_ROOT = new CssRoot();

export class TableElementWorkoutAnswersStatisticUtils {
    createBackgroundStyleForTh(successRate) {
        let backgroundStyle;

        let percentOfTrueAnswers = Math.floor(successRate);
        if (percentOfTrueAnswers >= 60) {
            backgroundStyle = _CSS_ROOT.GREEN_LIGHT_COLOR_STYLE_ID;
        } else if (percentOfTrueAnswers >= 30) {
            backgroundStyle = _CSS_ROOT.YELLOW_LIGHT_COLOR_STYLE_ID;
        } else {
            backgroundStyle = _CSS_ROOT.RED_LIGHT_COLOR_STYLE_ID;
        }

        return backgroundStyle;
    }

    createBackgroundStyleForTd(successRate) {
        let backgroundStyle;

        let percentOfTrueAnswers = Math.floor(successRate);
        if (percentOfTrueAnswers >= 60) {
            backgroundStyle = `rgba(${_CSS_ROOT.GREEN_LIGHT_COLOR_RGB_STYLE_ID}, ${_CSS_ROOT.OPACITY_STANDARD_STYLE_ID})`;
        } else if (percentOfTrueAnswers >= 30) {
            backgroundStyle = `rgba(${_CSS_ROOT.YELLOW_LIGHT_COLOR_RGB_STYLE_ID}, ${_CSS_ROOT.OPACITY_STANDARD_STYLE_ID})`;
        } else {
            backgroundStyle = `rgba(${_CSS_ROOT.RED_LIGHT_COLOR_RGB_STYLE_ID}, ${_CSS_ROOT.OPACITY_STANDARD_STYLE_ID})`;
        }

        return backgroundStyle;
    }
}