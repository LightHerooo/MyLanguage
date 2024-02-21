export class WordStatusWithCount {
    wordStatus;
    count;

    constructor(wordStatusObj, count) {
        this.wordStatus = wordStatusObj;
        this.count = count
    }

    createDiv() {
        let spanNumberOfWords = document.createElement("span");
        spanNumberOfWords.textContent = `: ${this.count}`;

        let divWordStatusWithCount = document.createElement("div");
        divWordStatusWithCount.appendChild(this.wordStatus.createA());
        divWordStatusWithCount.appendChild(spanNumberOfWords);

        return divWordStatusWithCount;
    }
}

export function compareWordStatusWithCount(firstObj, secondObj) {
    let firstObjCount = firstObj.count;
    let secondObjCount = secondObj.count;

    if(firstObjCount < secondObjCount) {
        return 1;
    } else if (firstObjCount > secondObjCount){
        return -1;
    } else {
        return 0;
    }
}