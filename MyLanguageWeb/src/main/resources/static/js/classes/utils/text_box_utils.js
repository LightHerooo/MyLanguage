export class TextBoxUtils {
    prepareTbFinder(tbFinder, differentFunction, customTimerTbFinder) {
        customTimerTbFinder.setTimeout(250);
        customTimerTbFinder.setHandler(differentFunction);

        tbFinder.addEventListener("input", function () {
            if (customTimerTbFinder) {
                customTimerTbFinder.stop();
            }

            if (customTimerTbFinder) {
                customTimerTbFinder.start();
            }
        })
    }
}