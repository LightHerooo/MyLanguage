export class BigIntUtils {
    parse(value) {
        let result;

        if (typeof value === "bigint") {
            result = value;
        }

        if (!result && Number(value)) {
            result = BigInt(value);
        }

        return result;
    }
}