export class LangWithCount {
    lang;
    count;

    constructor(langObj, count) {
        this.lang = langObj;
        this.count = count;
    }
}

export function compareLangWithCount(firstObj, secondObj) {
    if (firstObj.count < secondObj.count) {
        return 1;
    } else if (firstObj.count > secondObj.count) {
        return -1;
    } else {
        return 0;
    }
}