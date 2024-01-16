export class EndOfTheWord {
    value;
    offsetBack;

    constructor(value, offsetBack) {
        this.value = value;
        this.offsetBack = offsetBack;
    }
}

export function changeEndOfTheWordByNumberOfItems(word,
                                                  numberOfItems,
                                                  endIfBetweenFiveAndTwenty,
                                                  endIfBetweenTwoAndFour,
                                                  endIfSingle,
                                                  endIfZero) {
    numberOfItems = Math.abs(numberOfItems);
    let remainsOfOneHundred = numberOfItems % 100;
    let remainsOfTen = numberOfItems % 10;
    if (remainsOfOneHundred >= 10 && remainsOfOneHundred <= 20
        || remainsOfTen >= 5) {
        if (endIfBetweenFiveAndTwenty != null) {
            word = word.substring(0, word.length - endIfBetweenFiveAndTwenty.offsetBack);
            return word + endIfBetweenFiveAndTwenty.value;
        } else {
            return word;
        }
    }

    if (remainsOfTen >= 2) {
        if (endIfBetweenTwoAndFour != null) {
            word = word.substring(0, word.length - endIfBetweenTwoAndFour.offsetBack);
            return word + endIfBetweenTwoAndFour.value;
        } else {
            return word;
        }
    } else if (remainsOfTen === 1) {
        if (endIfSingle != null) {
            word = word.substring(0, word.length - endIfSingle.offsetBack);
            return word + endIfSingle.value;
        } else {
            return word;
        }
    } else if (remainsOfTen === 0) {
        if (endIfZero != null) {
            word = word.substring(0, word.length - endIfZero.offsetBack);
            return word + endIfZero.value;
        } else {
            return word;
        }
    }

    return word;
}