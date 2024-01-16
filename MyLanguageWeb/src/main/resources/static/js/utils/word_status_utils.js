export function createAWordStatus(wordStatusJson) {
    let aWordStatus = document.createElement("a");
    aWordStatus.textContent = wordStatusJson["title"];
    aWordStatus.style.cursor = "pointer";
    aWordStatus.style.textDecoration = "underline dotted";
    aWordStatus.style.color = "#" + wordStatusJson["color_hex_code"];
    aWordStatus.style.fontWeight = "bold";
    aWordStatus.title = wordStatusJson["message"];

    return aWordStatus;
}

export function createDivWordStatusWithCount(wordStatusJson, countOfWords) {
    let aWordStatus = createAWordStatus(wordStatusJson);

    let spanNumberOfWords = document.createElement("span");
    spanNumberOfWords.textContent = `: ${countOfWords}`;

    let divWordStatusWithCount = document.createElement("div");
    divWordStatusWithCount.appendChild(aWordStatus);
    divWordStatusWithCount.appendChild(spanNumberOfWords);

    return divWordStatusWithCount;
}