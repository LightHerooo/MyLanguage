import {
    BigIntUtils
} from "./bigint_utils.js";

const _BIGINT_UTILS = new BigIntUtils();

export class StringUtils {
    createWordWithNewEnding(word,
                            numberOfItems,
                            endingBetweenFiveAndTwenty,
                            endingBetweenTwoAndFour,
                            endingSingle,
                            endingZero,
                            oldEndingLength) {
        let wordWithNewEnding = word;

        if (word) {
            let numberOfItemsBI = _BIGINT_UTILS.parse(numberOfItems);
            let neededEnding;

            let remainsOfOneHundred = numberOfItemsBI % 100n;
            let remainsOfTen = numberOfItemsBI % 10n;
            if ((remainsOfOneHundred >= 10n
                    && remainsOfOneHundred <= 20n)
                || remainsOfTen >= 5n) {
                neededEnding = endingBetweenFiveAndTwenty;
            } else if (remainsOfTen >= 2n) {
                neededEnding = endingBetweenTwoAndFour;
            } else if (remainsOfTen === 1n) {
                neededEnding = endingSingle;
            } else if (remainsOfTen === 0n) {
                neededEnding = endingZero;
            }

            if (oldEndingLength >= 0
                && oldEndingLength < word.length) {
                wordWithNewEnding = word.substring(0, word.length - oldEndingLength);

                if (neededEnding) {
                    wordWithNewEnding = `${wordWithNewEnding}${neededEnding}`;
                }

            }
        }

        return wordWithNewEnding;
    }
}