export function setFlag(spanElement, langCode) {
    if (spanElement != null) {
        spanElement.classList.add("fi");
        if (langCode) {
            spanElement.classList.add(`fi-${langCode}`);
        } else {
            spanElement.style.backgroundImage = "url(/images/empty_flag.png)";
        }
    }
}

function createElementWithFlag(htmlElement, langJSON) {
    let langCode = null;
    let langTitle = "Без языка";
    if (langJSON) {
        langCode = langJSON["code"];
        langTitle = langJSON["title"];
    }

    let spanLangFlag = document.createElement("span");
    setFlag(spanLangFlag, langCode);

    let spanLangTitle = document.createElement("span");
    spanLangTitle.textContent = " " + langTitle;

    htmlElement.appendChild(spanLangFlag);
    htmlElement.appendChild(spanLangTitle);

    return htmlElement;
}

export function createDivLangWithFlag(langJSON) {
    let divLang = document.createElement("div");
    return createElementWithFlag(divLang, langJSON);
}

export function createSpanLangWithFlag(langJSON) {
    let spanLang = document.createElement("span");
    return createElementWithFlag(spanLang, langJSON);
}