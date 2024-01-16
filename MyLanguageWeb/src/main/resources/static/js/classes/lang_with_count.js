export class LangWithCount {
    langJson;
    count;

    constructor(langJson, count) {
        this.langJson = langJson;
        this.count = count;
    }
}

export function compareLangWithCount(firstLangWithCount, secondLangWithCount) {
    return secondLangWithCount.count - firstLangWithCount.count;
}