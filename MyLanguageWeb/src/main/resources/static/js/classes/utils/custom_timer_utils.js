export class CustomTimerUtils {
    findAfterWait(customTimerWaiterObj, customTimerFinderObj) {
        if (!customTimerWaiterObj.timeout) {
            customTimerWaiterObj.timeout = 250;
        }

        if (!customTimerFinderObj.timeout) {
            customTimerFinderObj.timeout = 1000;
        }

        let oldWaiterHandler = customTimerWaiterObj.handler;
        customTimerWaiterObj.handler = function () {
            oldWaiterHandler();
            customTimerFinderObj.start();
        }

        customTimerWaiterObj.start();
    }
}