export class BigIntUtils {
    parse(value) {
        let result;

        if (Number(value)) {
            result = BigInt(value);
        }

        return result;
    }
}