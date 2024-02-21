export class CssRoot {
    FIRST_FONT_SIZE = this.#getValueInRootCssFile("--first-font-size");
    SECOND_FONT_SIZE = this.#getValueInRootCssFile("--second-font-size");
    THIRD_FONT_SIZE = this.#getValueInRootCssFile("--third-font-size");

    ACCEPT_FIRST_COLOR = this.#getValueInRootCssFile("--accept-first-color");
    ACCEPT_FIRST_COLOR_RGB = this.#getValueInRootCssFile("--accept-first-color-rgb");
    DENY_FIRST_COLOR = this.#getValueInRootCssFile("--deny-first-color");
    DENY_FIRST_COLOR_RGB = this.#getValueInRootCssFile("--deny-first-color-rgb");

    OPACITY_STANDARD = this.#getValueInRootCssFile("--opacity-standard");

    #getValueInRootCssFile(name) {
        let root = document.querySelector(":root");
        let rootStyles = getComputedStyle(root);
        return rootStyles.getPropertyValue(name);
    }
}