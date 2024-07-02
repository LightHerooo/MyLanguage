export class FormDataUtils {
    createBlobByJsonStr(jsonStr) {
        return new Blob([jsonStr],
            {
                type: "application/json"
            });
    }
}