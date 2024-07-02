export class CssRoot {
    BIG_FONT_SIZE_STYLE_ID = this.#getValueInRootCssFile("--big-font-size");
    MEDIUM_FONT_SIZE_STYLE_ID = this.#getValueInRootCssFile("--medium-font-size");
    SMALL_FONT_SIZE_STYLE_ID = this.#getValueInRootCssFile("--small-font-size");

    GREEN_LIGHT_COLOR_STYLE_ID = this.#getValueInRootCssFile("--green-light-color");
    GREEN_LIGHT_COLOR_RGB_STYLE_ID = this.#getValueInRootCssFile("--green-light-color-rgb");
    YELLOW_LIGHT_COLOR_STYLE_ID = this.#getValueInRootCssFile("--yellow-light-color");
    YELLOW_LIGHT_COLOR_RGB_STYLE_ID = this.#getValueInRootCssFile("--yellow-light-color-rgb");
    RED_LIGHT_COLOR_STYLE_ID = this.#getValueInRootCssFile("--red-light-color");
    RED_LIGHT_COLOR_RGB_STYLE_ID = this.#getValueInRootCssFile("--red-light-color-rgb");

    OPACITY_STANDARD_STYLE_ID = this.#getValueInRootCssFile("--opacity-standard");

    #getValueInRootCssFile(name) {
        let root = document.querySelector(":root");
        let rootStyles = getComputedStyle(root);
        return rootStyles.getPropertyValue(name);
    }
}