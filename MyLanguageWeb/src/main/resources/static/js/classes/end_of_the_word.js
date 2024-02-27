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
    let numberOfItemsBigInt = BigInt(numberOfItems);
    if (numberOfItemsBigInt < 0) {
        return word;
    }

    let remainsOfOneHundred = numberOfItemsBigInt % 100n;
    let remainsOfTen = numberOfItemsBigInt % 10n;
    if (remainsOfOneHundred >= 10n && remainsOfOneHundred <= 20n
        || remainsOfTen >= 5n) {
        if (endIfBetweenFiveAndTwenty != null) {
            word = word.substring(0, word.length - endIfBetweenFiveAndTwenty.offsetBack);
            return word + endIfBetweenFiveAndTwenty.value;
        } else {
            return word;
        }
    }

    if (remainsOfTen >= 2n) {
        if (endIfBetweenTwoAndFour != null) {
            word = word.substring(0, word.length - endIfBetweenTwoAndFour.offsetBack);
            return word + endIfBetweenTwoAndFour.value;
        } else {
            return word;
        }
    } else if (remainsOfTen === 1n) {
        if (endIfSingle != null) {
            word = word.substring(0, word.length - endIfSingle.offsetBack);
            return word + endIfSingle.value;
        } else {
            return word;
        }
    } else if (remainsOfTen === 0n) {
        if (endIfZero != null) {
            word = word.substring(0, word.length - endIfZero.offsetBack);
            return word + endIfZero.value;
        } else {
            return word;
        }
    }

    return word;
}