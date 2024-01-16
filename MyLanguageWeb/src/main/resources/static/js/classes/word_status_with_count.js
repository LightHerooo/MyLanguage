export class WordStatusWithCount {
    wordStatusJson;
    count;

    constructor(wordStatusJson, count) {
        this.wordStatusJson = wordStatusJson;
        this.count = count
    }
}

export function compareWordStatusWithCount(firstWordStatusWithCount, secondWordStatusWithCount) {
    return secondWordStatusWithCount.count - firstWordStatusWithCount.count;
}